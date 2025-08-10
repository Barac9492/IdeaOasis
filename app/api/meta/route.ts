// app/api/meta/route.ts
import { NextRequest, NextResponse } from 'next/server';

function absolute(base: string, path: string) {
  try { return new URL(path, new URL(base)).toString(); } catch { return path; }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sourceUrl = searchParams.get('url');
  if (!sourceUrl) return NextResponse.json({ error: 'Missing url' }, { status: 400 });
  try {
    const res = await fetch(sourceUrl, { headers: { 'User-Agent': 'IdeaOasisBot/1.0' }, next: { revalidate: 3600 } });
    const html = await res.text();
    const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim();
    const desc = html.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i)?.[1]
      || html.match(/<meta[^>]+property=["']og:description["'][^>]*content=["']([^"']+)["'][^>]*>/i)?.[1];
    const ogImage = html.match(/<meta[^>]+property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i)?.[1];
    const keywords = html.match(/<meta[^>]+name=["']keywords["'][^>]*content=["']([^"']+)["'][^>]*>/i)?.[1];
    const tags = keywords ? keywords.split(',').map(s => s.trim()).filter(Boolean).slice(0, 8) : [];
    return NextResponse.json({
      ok: true,
      title,
      description: desc,
      ogImage: ogImage ? absolute(sourceUrl, ogImage) : undefined,
      tags,
    }, { headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=3600' } });
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'fetch_failed' }, { status: 500 });
  }
}