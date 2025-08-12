import { NextRequest, NextResponse } from 'next/server';
import { contentAgent } from '@/lib/services/contentAgent';
import { regulatoryMonitor } from '@/lib/services/regulatoryMonitor';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('[NEWSLETTER] Starting automated newsletter generation...');
    
    // Get latest data
    const [regulatoryUpdates, ideasResponse] = await Promise.all([
      regulatoryMonitor.monitorAllTargets(),
      fetch(`${req.nextUrl.origin}/api/ideas`)
    ]);

    const ideas = await ideasResponse.json();
    
    // Check if we have enough new content to warrant a newsletter
    const newRegulatoryUpdates = regulatoryUpdates.filter(u => u.changeDetected || !u.previousVersion);
    const shouldSend = newRegulatoryUpdates.length > 0 || isScheduledDay();
    
    if (!shouldSend) {
      return NextResponse.json({
        success: true,
        message: 'No significant updates, newsletter skipped',
        stats: {
          regulatoryUpdates: regulatoryUpdates.length,
          newUpdates: newRegulatoryUpdates.length
        }
      });
    }

    // Generate newsletter
    const newsletter = await contentAgent.generateNewsletter(
      newRegulatoryUpdates,
      ideas,
      {
        targetAudience: ['startup_founders', 'enterprise_executives'],
        includeExpertContent: true,
        urgentOnly: false
      }
    );

    // Convert to HTML
    const htmlContent = await contentAgent.renderToHTML(newsletter);

    // Send via Plunk
    const emailResult = await sendNewsletterEmail(newsletter, htmlContent);
    
    // Store newsletter record
    await storeNewsletterRecord(newsletter, emailResult);

    // Generate social media posts
    const socialPosts = await generateSocialPosts(newRegulatoryUpdates.slice(0, 2));
    
    console.log(`[NEWSLETTER] Successfully sent newsletter #${newsletter.issueNumber}`);
    
    return NextResponse.json({
      success: true,
      newsletter: {
        id: newsletter.id,
        issueNumber: newsletter.issueNumber,
        subject: newsletter.subject,
        sectionsCount: newsletter.sections.length,
        estimatedReadTime: newsletter.metrics?.estimatedReadTime
      },
      email: {
        sent: emailResult.success,
        recipientCount: emailResult.recipientCount
      },
      socialPosts: socialPosts.length,
      stats: {
        regulatoryUpdates: regulatoryUpdates.length,
        newUpdates: newRegulatoryUpdates.length,
        ideasIncluded: newsletter.metrics?.keyTopics?.length || 0
      }
    });

  } catch (error) {
    console.error('[NEWSLETTER] Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send newsletter', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

async function sendNewsletterEmail(newsletter: any, htmlContent: string) {
  if (!process.env.PLUNK_API_KEY) {
    console.warn('[NEWSLETTER] Plunk API key not configured, simulating send');
    return { success: true, recipientCount: 0, messageId: 'simulated' };
  }

  try {
    const response = await fetch('https://api.useplunk.com/v1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PLUNK_API_KEY}`
      },
      body: JSON.stringify({
        to: process.env.NEWSLETTER_TEST_EMAIL || 'ethancho12@gmail.com',
        subject: newsletter.subject,
        body: htmlContent,
        type: 'html',
        headers: {
          'List-Unsubscribe': '<mailto:unsubscribe@ideaoasis.co.kr>',
          'X-Newsletter': 'IdeaOasis-Intelligence'
        }
      })
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(`Plunk API error: ${result.message || 'Unknown error'}`);
    }

    return {
      success: true,
      messageId: result.id,
      recipientCount: 1
    };

  } catch (error) {
    console.error('[NEWSLETTER] Email send error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Email send failed'
    };
  }
}

async function storeNewsletterRecord(newsletter: any, emailResult: any) {
  try {
    const response = await fetch('/api/newsletter/store', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-internal-api': 'true'
      },
      body: JSON.stringify({
        newsletter: {
          ...newsletter,
          status: emailResult.success ? 'sent' : 'failed',
          publishedAt: new Date().toISOString(),
          emailResult
        }
      })
    });

    if (!response.ok) {
      console.error('[NEWSLETTER] Failed to store newsletter record');
    }
  } catch (error) {
    console.error('[NEWSLETTER] Storage error:', error);
  }
}

async function generateSocialPosts(updates: any[]): Promise<any[]> {
  const posts = [];
  
  for (const update of updates) {
    posts.push({
      platform: 'linkedin',
      content: `🚨 새로운 규제 발표: ${update.title}

${update.ministry}에서 발표한 이번 규제는 ${update.industries.join(', ')} 업계에 ${update.businessImpact} 영향을 미칠 예정입니다.

창업자분들은 반드시 확인하세요!

#한국스타트업 #규제 #IdeaOasis`,
      scheduledFor: new Date(Date.now() + 60 * 60 * 1000)
    });
  }
  
  return posts;
}

function isScheduledDay(): boolean {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Send newsletter on Tuesdays (2) and Fridays (5)
  return dayOfWeek === 2 || dayOfWeek === 5;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const preview = searchParams.get('preview') === 'true';

    if (preview) {
      // Generate preview without sending
      const [regulatoryUpdates, ideasResponse] = await Promise.all([
        regulatoryMonitor.monitorAllTargets(),
        fetch(`${req.nextUrl.origin}/api/ideas`)
      ]);

      const ideas = await ideasResponse.json();
      
      const newsletter = await contentAgent.generateNewsletter(
        regulatoryUpdates.slice(0, 3),
        ideas.slice(0, 5),
        {
          targetAudience: ['startup_founders'],
          includeExpertContent: true,
          urgentOnly: false
        }
      );

      const htmlContent = await contentAgent.renderToHTML(newsletter);

      return new NextResponse(htmlContent, {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Newsletter service ready',
      scheduledDays: ['Tuesday', 'Friday'],
      nextScheduled: getNextScheduledDate()
    });

  } catch (error) {
    console.error('[NEWSLETTER] Preview error:', error);
    return NextResponse.json(
      { error: 'Failed to generate preview' },
      { status: 500 }
    );
  }
}

function getNextScheduledDate(): string {
  const today = new Date();
  const currentDay = today.getDay();
  
  // Find next Tuesday (2) or Friday (5)
  let daysUntilNext;
  if (currentDay < 2) {
    daysUntilNext = 2 - currentDay;
  } else if (currentDay < 5) {
    daysUntilNext = 5 - currentDay;
  } else {
    daysUntilNext = 7 - currentDay + 2; // Next Tuesday
  }
  
  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + daysUntilNext);
  
  return nextDate.toLocaleDateString();
}