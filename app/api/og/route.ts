// app/api/og/route.ts
import { NextRequest, NextResponse } from 'next/server';

function getDomain(input: string): string | null {
  try {
    const u = new URL(input);
    return u.hostname;
  } catch {
    return null;
  }
}

function toAbsoluteUrl(baseUrl: string, maybeRelative: string): string {
  try {
    const base = new URL(baseUrl);
    return new URL(maybeRelative, base).toString();
  } catch {
    return maybeRelative;
  }
}

async function fetchText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 60 * 60 }, headers: { 'User-Agent': 'IdeaOasisBot/1.0' } });
    if (!res.ok) return null;
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) {
      // Not HTML, but still return null so we can fallback to favicon API
      return null;
    }
    return await res.text();
  } catch {
    return null;
  }
}

function extractOgImage(html: string): string | null {
  const metaRegex = /<meta[^>]+property=["']og:image["'][^>]*>/i;
  const tag = html.match(metaRegex)?.[0];
  if (!tag) return null;
  const contentMatch = tag.match(/content=["']([^"']+)["']/i);
  return contentMatch ? contentMatch[1] : null;
}

function extractFavicon(html: string): string | null {
  // Common rel values: icon, shortcut icon, apple-touch-icon
  const linkRegex = /<link[^>]+rel=["'](?:icon|shortcut icon|apple-touch-icon)["'][^>]*>/gi;
  const matches = html.match(linkRegex);
  if (!matches || matches.length === 0) return null;
  for (const m of matches) {
    const hrefMatch = m.match(/href=["']([^"']+)["']/i);
    if (hrefMatch) return hrefMatch[1];
  }
  return null;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sourceUrl = searchParams.get('url');
  const format = searchParams.get('format'); // 'json' to return metadata
  if (!sourceUrl) {
    return NextResponse.json({ error: 'Missing url param' }, { status: 400 });
  }
  const domain = getDomain(sourceUrl);

  let html: string | null = null;
  let ogImageUrl: string | null = null;
  let faviconUrl: string | null = null;

  // Try to fetch and parse the page HTML
  html = await fetchText(sourceUrl);
  if (html) {
    const og = extractOgImage(html);
    if (og) ogImageUrl = toAbsoluteUrl(sourceUrl, og);
    const fav = extractFavicon(html);
    if (fav) faviconUrl = toAbsoluteUrl(sourceUrl, fav);
  }

  // Fallbacks
  if (!faviconUrl && domain) {
    faviconUrl = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;
  }

  const bestImage = ogImageUrl || faviconUrl;

  if (format === 'json') {
    return NextResponse.json({
      ok: true,
      domain,
      ogImageUrl,
      faviconUrl,
      imageUrl: bestImage,
    }, { headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=3600' } });
  }

  if (!bestImage) {
    // Transparent 1x1 PNG fallback
    const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAukB9U8S7y0AAAAASUVORK5CYII=';
    const body = Buffer.from(pngBase64, 'base64');
    return new NextResponse(body, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Length': String(body.length),
        'Cache-Control': 'public, max-age=300, s-maxage=300',
      },
    });
  }

  // Proxy the image bytes to avoid mixed content/CORS issues and enable caching
  try {
    const imgRes = await fetch(bestImage, { next: { revalidate: 60 * 60 }, headers: { 'User-Agent': 'IdeaOasisBot/1.0' } });
    if (!imgRes.ok) throw new Error('Image fetch failed');
    const contentType = imgRes.headers.get('content-type') || 'image/jpeg';
    const arrayBuffer = await imgRes.arrayBuffer();
    return new NextResponse(Buffer.from(arrayBuffer), {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch {
    // Final fallback to redirect
    return NextResponse.redirect(bestImage);
  }
}