// app/api/ingest-bulk/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebaseAdmin';
import crypto from 'node:crypto';

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

    const db = getAdminDb();
    let ok = 0, fail = 0;
    const results: any[] = [];

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

    return NextResponse.json({ ok, fail, results }, { status: fail ? 207 : 200 });
  } catch (e: any) {
    // 프로덕션에서도 최소한의 오류 사인만 남김
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
