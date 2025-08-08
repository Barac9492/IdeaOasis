// app/api/ingest-bulk/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import crypto from 'node:crypto';

// 클라이언트 SDK만 사용 (Admin SDK 문제 해결 전까지)
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, setDoc, doc, query, where, getDocs } from "firebase/firestore";

function normalizeUrl(raw?: string) {
  try {
    if (!raw) return '';
    const u = new URL(raw);
    u.hash = '';
    // UTM 제거
    ['utm_source','utm_medium','utm_campaign','utm_term','utm_content'].forEach(k => u.searchParams.delete(k));
    const q = u.searchParams.toString();
    return `${u.origin}${u.pathname.replace(/\/+$/,'')}${q ? `?${q}` : ''}`;
  } catch { return raw || ''; }
}

export async function POST(req: Request) {
  try {
    const token = req.headers.get('x-ingest-token') || '';
    if (!token || token !== process.env.INGEST_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bodyText = await req.text();
    let items: any[] = [];
    try {
      items = JSON.parse(bodyText);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'Expected JSON array' }, { status: 400 });
    }

    // 클라이언트 SDK만 사용
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
    
    let ok = 0, fail = 0;
    const results: any[] = [];
    
    for (const raw of items) {
      try {
        const data = { ...raw };
        data.sourceURL = normalizeUrl(data.sourceURL || data.url || '');
        if (!data.sourceURL) throw new Error('Missing sourceURL');

        data.uploadedAt = data.uploadedAt || new Date().toISOString();
        data.sourcePlatform = data.sourcePlatform || 'apify';
        data.status = data.status || 'Pending';

        // sourceURL 기준 검색
        const q = query(ideasRef, where("sourceURL", "==", data.sourceURL));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          const docRef = await addDoc(ideasRef, data);
          ok++;
          results.push({ sourceURL: data.sourceURL, status: 'ok', id: docRef.id });
        } else {
          const docRef = doc(db, "ideas", querySnapshot.docs[0].id);
          await setDoc(docRef, data, { merge: true });
          ok++;
          results.push({ sourceURL: data.sourceURL, status: 'ok', id: querySnapshot.docs[0].id });
        }
      } catch (e: any) {
        fail++;
        results.push({ error: e?.message || String(e), item: raw });
      }
    }

    return NextResponse.json({ ok, fail, results }, { status: fail ? 207 : 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
