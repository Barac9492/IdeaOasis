// app/api/ingest/route.ts
import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";

// 임시로 클라이언트 SDK도 import
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, setDoc, doc, query, where, getDocs } from "firebase/firestore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Idea = {
  title?: string;
  summary?: string;
  category?: string;
  targetUser?: string;
  businessModel?: string;
  koreaFitScore?: number;
  sourceURL: string;
  sourcePlatform?: string;
  uploadedAt?: string;
  adminReview?: string;
  status?: "Pending" | "Approved" | "Rejected";
  offer?: string;
  badges?: string[];
  tags?: string[];
  useCases?: string[];
  techStack?: string[];
  scorecards?: Record<string, any>;
  evidence?: Record<string, any>;
  pricing?: Record<string, any>;
  [key: string]: any;
};

function normalizeUrl(u: string) {
  try {
    const url = new URL(u.trim());
    url.hash = "";
    // UTM & common trackers 제거
    ["utm_source","utm_medium","utm_campaign","utm_term","utm_content","ref","fbclid","gclid"].forEach((k) => url.searchParams.delete(k));
    // 트레일링 슬래시 정규화
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
  if (!token || token !== process.env.INGEST_TOKEN) {
    return false;
  }
  return true;
}

export async function POST(req: Request) {
  if (!requireToken(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 임시 디버깅 로깅
    console.error('INGEST_ENV_CHECK', {
      hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
      hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
      hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
    });

    const body = (await req.json().catch(() => null)) as Partial<Idea> | null;
    if (!body?.sourceURL) {
      return NextResponse.json({ error: "sourceURL required" }, { status: 400 });
    }

    const now = new Date().toISOString();
    const normalizedURL = normalizeUrl(body.sourceURL);
    const payload: Idea = {
      ...body,
      sourceURL: normalizedURL,
      updatedAt: now,
    };

    // Admin SDK 시도
    try {
      const db = getAdminDb();
      const ideas = db.collection("ideas");
      const snap = await ideas.where("sourceURL", "==", normalizedURL).limit(1).get();

      if (snap.empty) {
        payload.uploadedAt ||= now;
        const ref = await ideas.add(payload);
        return NextResponse.json({ ok: true, id: ref.id, action: "created" });
      } else {
        const ref = snap.docs[0].ref;
        await ref.set(payload, { merge: true });
        return NextResponse.json({ ok: true, id: ref.id, action: "updated" });
      }
    } catch (adminError: any) {
      console.error('Admin SDK failed, trying client SDK:', adminError.message);
      
      // 클라이언트 SDK로 폴백
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
      
      // sourceURL 기준 검색
      const q = query(ideasRef, where("sourceURL", "==", normalizedURL));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        payload.uploadedAt ||= now;
        const docRef = await addDoc(ideasRef, payload);
        return NextResponse.json({ ok: true, id: docRef.id, action: "created" });
      } else {
        const docRef = doc(db, "ideas", querySnapshot.docs[0].id);
        await setDoc(docRef, payload, { merge: true });
        return NextResponse.json({ ok: true, id: querySnapshot.docs[0].id, action: "updated" });
      }
    }
  } catch (err: any) {
    console.error('INGEST_ERROR', err?.message);
    return NextResponse.json({ error: err?.message || 'Internal Server Error' }, { status: 500 });
  }
}

// GET은 존재 확인용 → 405
export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
