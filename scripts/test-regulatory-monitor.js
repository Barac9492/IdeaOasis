#!/usr/bin/env node

async function testRegulatoryMonitor() {
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000';

  console.log('🔍 Testing Regulatory Monitor...');
  console.log(`📍 Using base URL: ${baseUrl}`);
  
  try {
    console.log('\n1️⃣ Testing Monitor Endpoint...');
    const monitorResponse = await fetch(`${baseUrl}/api/regulatory/monitor`);
    
    if (!monitorResponse.ok) {
      throw new Error(`Monitor failed: ${monitorResponse.status}`);
    }
    
    const monitorData = await monitorResponse.json();
    console.log('✅ Monitor Response:', {
      stats: monitorData.stats,
      alertCount: monitorData.alerts?.length || 0
    });
    
    if (monitorData.updates && monitorData.updates.length > 0) {
      console.log('\n📋 Sample Updates:');
      monitorData.updates.slice(0, 3).forEach((update, i) => {
        console.log(`\n${i + 1}. ${update.title}`);
        console.log(`   Ministry: ${update.ministry}`);
        console.log(`   Impact: ${update.businessImpact}`);
        console.log(`   Industries: ${update.industries.join(', ')}`);
      });
    }
    
    console.log('\n2️⃣ Testing Newsletter Generation...');
    const newsletterResponse = await fetch(`${baseUrl}/api/regulatory/monitor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ generateNewsletter: true })
    });
    
    if (!newsletterResponse.ok) {
      throw new Error(`Newsletter generation failed: ${newsletterResponse.status}`);
    }
    
    const newsletterData = await newsletterResponse.json();
    console.log('✅ Newsletter Generated:', {
      success: newsletterData.success,
      updateCount: newsletterData.updateCount,
      contentLength: newsletterData.newsletterContent?.length || 0
    });
    
    if (newsletterData.newsletterContent) {
      console.log('\n📧 Newsletter Preview:');
      console.log(newsletterData.newsletterContent.substring(0, 500) + '...');
    }
    
    console.log('\n3️⃣ Testing Scraper (KFTC)...');
    const scrapeResponse = await fetch(`${baseUrl}/api/regulatory/scrape`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        target: {
          name: 'KFTC Test',
          url: 'https://www.ftc.go.kr/www/selectReportUserList.do?key=10',
          ministry: 'Korea Fair Trade Commission',
          selectors: {
            listContainer: '.board_list',
            listItem: 'tbody tr',
            title: '.tit a',
            date: '.date',
            link: '.tit a'
          }
        }
      })
    });
    
    if (!scrapeResponse.ok) {
      console.log('⚠️ Scraping may require server-side execution');
    } else {
      const scrapeData = await scrapeResponse.json();
      console.log('✅ Scraper Response:', {
        source: scrapeData.source,
        itemCount: scrapeData.items?.length || 0
      });
    }
    
    console.log('\n✨ Regulatory Monitor Test Complete!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

testRegulatoryMonitor();