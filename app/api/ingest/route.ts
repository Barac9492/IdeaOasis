import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

type Idea = {
  id?: string;                       // 있으면 해당 id로 upsert
  title: string;
  summary?: string;
  category?: string;
  targetUser?: string;
  businessModel?: string;
  koreaFitScore?: number;
  sourceURL?: string;
  sourcePlatform?: string;
  uploadedAt?: string | number;      // ISO or epoch
  adminReview?: string;
  status?: 'Pending' | 'Approved' | 'Rejected';
  // 연결 메타데이터 (선택)
  tags?: string[];
  useCases?: string[];
  techStack?: string[];
};

function authOk(req: Request) {
  const header = req.headers.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  return token && token === process.env.INGEST_TOKEN;
}

function normalizeIdea(raw: any): Idea {
  const now = new Date().toISOString();
  const n: Idea = {
    id: raw.id,
    title: String(raw.title || '').trim(),
    summary: raw.summary ? String(raw.summary) : '',
    category: raw.category ? String(raw.category) : '',
    targetUser: raw.targetUser ? String(raw.targetUser) : '',
    businessModel: raw.businessModel ? String(raw.businessModel) : '',
    koreaFitScore: raw.koreaFitScore != null ? Number(raw.koreaFitScore) : undefined,
    sourceURL: raw.sourceURL ? String(raw.sourceURL) : '',
    sourcePlatform: raw.sourcePlatform ? String(raw.sourcePlatform) : '',
    uploadedAt: raw.uploadedAt || now,
    adminReview: raw.adminReview ? String(raw.adminReview) : '',
    status: (raw.status as Idea['status']) || 'Pending',
    tags: Array.isArray(raw.tags) ? raw.tags.slice(0, 10).map(String) : undefined,
    useCases: Array.isArray(raw.useCases) ? raw.useCases.slice(0, 10).map(String) : undefined,
    techStack: Array.isArray(raw.techStack) ? raw.techStack.slice(0, 10).map(String) : undefined,
  };

  if (!n.title) {
    throw new Error('title is required');
  }
  return n;
}

async function upsertOne(idea: Idea) {
  // 우선순위: 명시 id → sourceURL 중복 검사 → 새 doc
  if (idea.id) {
    await db.collection('ideas').doc(idea.id).set(idea, { merge: true });
    return { id: idea.id, mode: 'byId' as const };
  }

  if (idea.sourceURL) {
    const q = await db.collection('ideas').where('sourceURL', '==', idea.sourceURL).limit(1).get();
    if (!q.empty) {
      const doc = q.docs[0];
      await doc.ref.set(idea, { merge: true });
      return { id: doc.id, mode: 'bySourceURL' as const };
    }
  }

  const docRef = await db.collection('ideas').add(idea);
  return { id: docRef.id, mode: 'new' as const };
}

export async function POST(req: Request) {
  try {
    // Check if Firebase Admin is initialized
    if (!db) {
      return NextResponse.json({ error: 'Firebase Admin not initialized. Check environment variables.' }, { status: 500 });
    }

    if (!authOk(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const items = Array.isArray(body) ? body : [body];

    const results = [];
    for (const raw of items) {
      const idea = normalizeIdea(raw);
      const r = await upsertOne(idea);
      results.push({ ...r, title: idea.title });
    }

    return NextResponse.json({ ok: true, count: results.length, results }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'unknown' }, { status: 400 });
  }
}
