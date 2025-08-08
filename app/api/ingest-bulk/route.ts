// app/api/ingest-bulk/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebaseAdmin';
import crypto from 'node:crypto';

// 클라이언트 SDK 폴백용
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

    let ok = 0, fail = 0;
    const results: any[] = [];

    // Admin SDK 시도
    try {
      const db = getAdminDb();
      
      for (const raw of items) {
        try {
          const data = { ...raw };
          data.sourceURL = normalizeUrl(data.sourceURL || data.url || '');
          if (!data.sourceURL) throw new Error('Missing sourceURL');

          // docId: URL hash로 안정적 업서트
          const docId = crypto.createHash('sha1').update(data.sourceURL).digest('hex');

          data.uploadedAt = data.uploadedAt || new Date().toISOString();
          data.sourcePlatform = data.sourcePlatform || 'apify';
          data.status = data.status || 'Pending';

          await db.collection('ideas').doc(docId).set(data, { merge: true });
          ok++;
          results.push({ sourceURL: data.sourceURL, status: 'ok' });
        } catch (e: any) {
          fail++;
          results.push({ error: e?.message || String(e), item: raw });
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
      } catch (clientError: any) {
        console.error('Client SDK also failed:', clientError.message);
        return NextResponse.json({ error: "Both Admin and Client SDK failed" }, { status: 500 });
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
