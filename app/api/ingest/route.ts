import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import crypto from 'crypto';

function docIdFromUrl(url: string) {
  return crypto.createHash('sha256').update(url).digest('hex').slice(0, 40);
}

export async function POST(req: Request) {
  try {
    // Check if Firebase Admin is initialized
    if (!db) {
      return NextResponse.json({ error: 'Firebase Admin not initialized' }, { status: 500 });
    }

    const token = new URL(req.url).searchParams.get('token');
    if (token !== process.env.INGEST_TOKEN) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    if (!body.title || !body.url || !body.platform) {
      return NextResponse.json({ error: 'missing required field' }, { status: 400 });
    }

    const id = docIdFromUrl(body.url);
    const now = new Date();

    await db.collection('ideas').doc(id).set(
      {
        title: body.title.trim(),
        summary: (body.summary || '').trim(),
        category: body.category || null,
        targetUser: body.targetUser || null,
        businessModel: body.businessModel || null,
        koreaFitScore: body.koreaFitScore ?? null,
        sourceURL: body.url,
        sourcePlatform: body.platform,
        coverImage: body.coverImage || null,
        tags: Array.isArray(body.tags) ? body.tags.slice(0, 20) : [],
        author: body.author || null,
        postedAt: body.postedAt || null,
        uploadedAt: now,
        adminReview: null,
        status: 'Pending',
      },
      { merge: true }
    );

    return NextResponse.json({ ok: true, id });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
