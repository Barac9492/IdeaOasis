// app/api/ingest-bulk/route.ts
import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";

// 클라이언트 SDK 폴백용
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, setDoc, doc, query, where, getDocs } from "firebase/firestore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Item = Record<string, any> & { sourceURL: string };

function normalizeUrl(u: string) {
  try {
    const url = new URL(u.trim());
    url.hash = "";
    ["utm_source","utm_medium","utm_campaign","utm_term","utm_content","ref","fbclid","gclid"].forEach((k) => url.searchParams.delete(k));
    let pathname = url.pathname;
    if (pathname !== "/" && pathname.endsWith("/")) pathname = pathname.slice(0, -1);
    url.pathname = pathname;
    return url.toString().toLowerCase();
  } catch {
    return u.trim().toLowerCase();
  }
}

function requireToken(req: Request) {
  const token = req.headers.get("x-ingest-token");
  if (!token || token !== process.env.INGEST_TOKEN) return false;
  return true;
}

export async function POST(req: Request) {
  if (!requireToken(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  
  // Defensive checks
  if (!Array.isArray(body)) {
    return NextResponse.json({ error: "items (array) required" }, { status: 400 });
  }
  
  const items = body;
  if (items.length === 0) {
    return NextResponse.json({ summary: { total: 0, ok: 0, fail: 0 }, results: [] });
  }

  const now = new Date().toISOString();
  const results: Array<{ ok: boolean; id?: string; error?: string; action?: "created"|"updated"; url?: string }> = [];

  // Admin SDK 시도
  try {
    const db = getAdminDb();
    const ideas = db.collection("ideas");

    for (const raw of items.slice(0, 100)) {
      try {
        if (!raw?.sourceURL) {
          results.push({ ok: false, error: "missing sourceURL" });
          continue;
        }
        const normalizedURL = normalizeUrl(raw.sourceURL);

        const payload: Item = {
          ...raw,
          sourceURL: normalizedURL,
          updatedAt: now,
        };

        const snap = await ideas.where("sourceURL", "==", normalizedURL).limit(1).get();
        if (snap.empty) {
          payload.uploadedAt ||= now;
          const ref = await ideas.add(payload);
          results.push({ ok: true, id: ref.id, action: "created", url: normalizedURL });
        } else {
          const ref = snap.docs[0].ref;
          await ref.set(payload, { merge: true });
          results.push({ ok: true, id: ref.id, action: "updated", url: normalizedURL });
        }
      } catch (e: any) {
        results.push({ ok: false, error: String(e?.message || e) });
      }
    }
  } catch (adminError: any) {
    console.error('Admin SDK failed, trying client SDK:', adminError.message);
    
    // 클라이언트 SDK로 폴백
    try {
      const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      };
      
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      const ideasRef = collection(db, "ideas");
      
      for (const raw of items.slice(0, 100)) {
        try {
          if (!raw?.sourceURL) {
            results.push({ ok: false, error: "missing sourceURL" });
            continue;
          }
          const normalizedURL = normalizeUrl(raw.sourceURL);

          const payload: Item = {
            ...raw,
            sourceURL: normalizedURL,
            updatedAt: now,
          };

          // sourceURL 기준 검색
          const q = query(ideasRef, where("sourceURL", "==", normalizedURL));
          const querySnapshot = await getDocs(q);
          
          if (querySnapshot.empty) {
            payload.uploadedAt ||= now;
            const docRef = await addDoc(ideasRef, payload);
            results.push({ ok: true, id: docRef.id, action: "created", url: normalizedURL });
          } else {
            const docRef = doc(db, "ideas", querySnapshot.docs[0].id);
            await setDoc(docRef, payload, { merge: true });
            results.push({ ok: true, id: querySnapshot.docs[0].id, action: "updated", url: normalizedURL });
          }
        } catch (e: any) {
          results.push({ ok: false, error: String(e?.message || e) });
        }
      }
    } catch (clientError: any) {
      console.error('Client SDK also failed:', clientError.message);
      return NextResponse.json({ error: "Both Admin and Client SDK failed" }, { status: 500 });
    }
  }

  const okCount = results.filter(r => r.ok).length;
  const failCount = results.length - okCount;

  // Development 로그
  if (process.env.NODE_ENV !== 'production') {
    console.info(`Bulk ingest: ${okCount} success, ${failCount} failed`);
  }

  return NextResponse.json({ 
    summary: { total: results.length, ok: okCount, fail: failCount }, 
    results 
  });
}

export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
