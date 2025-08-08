// app/api/ingest-bulk/route.ts
import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";

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
  const items = Array.isArray(body) ? body : body?.items;
  if (!Array.isArray(items)) {
    return NextResponse.json({ error: "items (array) required" }, { status: 400 });
  }

  const now = new Date().toISOString();
  const db = getAdminDb();
  const ideas = db.collection("ideas");

  const results: Array<{ ok: boolean; id?: string; error?: string; action?: "created"|"updated"; url?: string }> = [];

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

  const ok = results.filter(r => r.ok).length;
  const fail = results.length - ok;

  return NextResponse.json({ summary: { total: results.length, ok, fail }, results });
}

export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
