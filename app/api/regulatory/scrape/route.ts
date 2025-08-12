import { NextRequest, NextResponse } from 'next/server';
// TODO: Fix cheerio/undici compatibility issue for production
// import * as cheerio from 'cheerio';

export async function POST(req: NextRequest) {
  try {
    const { target } = await req.json();
    
    if (!target || !target.url) {
      return NextResponse.json({ error: 'Invalid target configuration' }, { status: 400 });
    }

    // Temporary: Return mock data to fix build issue
    // TODO: Implement web scraping with cheerio alternative for production
    const items = [
      {
        title: "AI 규제 개정안 발표",
        url: target.url,
        date: new Date().toISOString(),
        summary: "인공지능 관련 새로운 규제 개정안이 발표되었습니다."
      },
      {
        title: "데이터 보호법 강화",
        url: target.url,
        date: new Date().toISOString(),
        summary: "개인정보보호 관련 법령이 강화됩니다."
      }
    ];

    return NextResponse.json({ 
      items,
      source: target.name,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Regulatory scraping error:', error);
    return NextResponse.json(
      { error: 'Failed to scrape regulatory data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function parseKoreanDate(dateStr: string): string {
  if (!dateStr) return new Date().toISOString();
  
  const cleaned = dateStr.replace(/[\s년월일]/g, '-').replace(/-+$/, '');
  
  const patterns = [
    /(\d{4})-(\d{1,2})-(\d{1,2})/,
    /(\d{2})-(\d{1,2})-(\d{1,2})/,
    /(\d{4})\.(\d{1,2})\.(\d{1,2})/,
    /(\d{2})\.(\d{1,2})\.(\d{1,2})/
  ];
  
  for (const pattern of patterns) {
    const match = cleaned.match(pattern);
    if (match) {
      let [_, year, month, day] = match;
      
      if (year.length === 2) {
        year = '20' + year;
      }
      
      month = month.padStart(2, '0');
      day = day.padStart(2, '0');
      
      try {
        const date = new Date(`${year}-${month}-${day}`);
        if (!isNaN(date.getTime())) {
          return date.toISOString();
        }
      } catch (e) {
        console.error('Date parsing error:', e);
      }
    }
  }
  
  return new Date().toISOString();
}