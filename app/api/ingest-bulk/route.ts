// app/api/ingest-bulk/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { upsertIdeas } from '@/lib/db';
import type { Idea } from '@/lib/types';

export async function POST(req: NextRequest) {
  const token = req.headers.get('x-ingest-token') || '';
  const expected = process.env.INGEST_TOKEN || process.env.NEXT_PUBLIC_INGEST_TOKEN || '';
  if (!expected || token !== expected) {
    return NextResponse.json({ ok: false, error: 'invalid token' }, { status: 401 });
  }
  let data: any;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 });
  }
  const arr = Array.isArray(data) ? data : [data];
  // id 없는 경우 원문 URL+제목 기반 해시로 생성(간단 버전)
  const normalized: Idea[] = arr.map((it: any) => ({
    id: it.id || crypto.randomUUID(),
    title: String(it.title || 'Untitled'),
    sourceUrl: String(it.sourceURL || it.sourceUrl || ''),
    sourceName: it.sourcePlatform || it.sourceName || '',
    publishedAt: it.publishedAt || it.uploadedAt || new Date().toISOString(),
    summary3: it.summary || it.summary3 || '',
    tags: it.tags || [],
    koreaFit: typeof it.koreaFit === 'number' ? it.koreaFit : undefined,
    whyNow: it.whyNow ? it.whyNow.join('\n') : '', // If array in payload
    risks: Array.isArray(it.risks) ? it.risks : (it.risks ? it.risks.split('\n').map(r => r.trim()) : []),
    // New fields from Figma mock
    metrics: it.metrics || { marketOpportunity: 0, executionDifficulty: 0, revenuePotential: 0, timingScore: 0, regulatoryRisk: 0 },
    partnershipStrategy: Array.isArray(it.partnershipStrategy) ? it.partnershipStrategy : [],
    trendData: it.trendData || { keyword: '', growth: '', monthlySearches: '' },
    effort: it.effort,
    visible: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    votesUp: 0,
    votesDown: 0,
  }));
  const count = await upsertIdeas(normalized);
  return NextResponse.json({ ok: true, count });
}

export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
