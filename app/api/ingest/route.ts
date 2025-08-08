// app/api/ingest/route.ts
import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";

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

  const db = getAdminDb();
  const ideas = db.collection("ideas");

  // sourceURL 기준 업서트
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
}

// GET은 존재 확인용 → 405
export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
