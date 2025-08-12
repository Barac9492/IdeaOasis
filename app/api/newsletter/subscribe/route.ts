import { NextRequest, NextResponse } from 'next/server';
import Plunk from '@plunk/node';

// Initialize Plunk - will use SECRET API key from env for backend operations
// Note: PLUNK_API_KEY should be your SECRET key (starts with sk_)
const plunk = new Plunk(process.env.PLUNK_API_KEY || '');

// In-memory storage as backup (replace with database in production)
const subscribers = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: '유효한 이메일 주소를 입력해주세요.' },
        { status: 400 }
      );
    }

    // Check if already subscribed locally
    if (subscribers.has(email.toLowerCase())) {
      return NextResponse.json(
        { message: '이미 구독 중인 이메일입니다.' },
        { status: 200 }
      );
    }

    // Add to local storage first
    subscribers.add(email.toLowerCase());

    // If Plunk API key is configured, use Plunk
    if (process.env.PLUNK_API_KEY) {
      try {
        // Send welcome email via Plunk (this also adds them as a contact)
        await sendWelcomeEmail(email);
        console.log(`Successfully added ${email} to Plunk and sent welcome email`);
      } catch (plunkError: any) {
        console.error('Plunk error:', plunkError);
        // Continue anyway - we have local storage as backup
      }
    } else {
      console.log('Plunk API key not configured - using local storage only');
      // Simulate sending welcome email
      await sendWelcomeEmailLocal(email);
    }

    console.log(`New newsletter subscriber: ${email}`);
    console.log(`Total subscribers: ${subscribers.size}`);

    return NextResponse.json(
      { 
        message: '구독이 완료되었습니다!',
        subscriberCount: subscribers.size 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: '구독 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// Get subscriber count
export async function GET() {
  return NextResponse.json({
    count: subscribers.size,
    // In production, don't expose actual emails
    // subscribers: Array.from(subscribers)
  });
}

// Send welcome email via Plunk
async function sendWelcomeEmail(email: string) {
  if (!process.env.PLUNK_API_KEY) {
    console.log(`Welcome email would be sent to: ${email} (Plunk not configured)`);
    return Promise.resolve();
  }

  try {
    const result = await plunk.emails.send({
      to: email,
      subject: '🎉 Korean Business Intelligence Weekly 구독을 환영합니다!',
      body: getWelcomeEmailTemplate(email)
    });
    console.log(`Welcome email sent to: ${email}`, result);
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    // Don't throw - subscription still succeeded
  }
  
  return Promise.resolve();
}

// Local fallback for development
async function sendWelcomeEmailLocal(email: string) {
  console.log(`Welcome email would be sent to: ${email} (Local development mode)`);
  return Promise.resolve();
}

// Welcome email template (for future use)
function getWelcomeEmailTemplate(email: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>IdeaOasis 뉴스레터 구독을 환영합니다!</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #1e40af;">Korean Business Intelligence Weekly</h1>
        
        <p>안녕하세요!</p>
        
        <p>IdeaOasis의 Korean Business Intelligence Weekly 구독을 환영합니다.</p>
        
        <p>매주 월요일 아침 7시, 다음과 같은 내용을 받아보실 수 있습니다:</p>
        
        <ul>
          <li>✅ 이번 주 시행되는 주요 규제 변화</li>
          <li>📊 글로벌 아이디어의 Korea Fit 분석</li>
          <li>🎤 업계 전문가의 독점 인사이트</li>
          <li>📈 한국 스타트업 성공/실패 사례 분석</li>
          <li>🔮 향후 예정된 규제 변화 미리보기</li>
        </ul>
        
        <p><strong>첫 번째 뉴스레터는 다음 월요일에 발송됩니다.</strong></p>
        
        <p>궁금한 점이 있으시면 언제든 회신해주세요.</p>
        
        <p>감사합니다.<br>
        IdeaOasis 팀</p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #6b7280;">
          이 이메일은 ${email}로 발송되었습니다.<br>
          구독을 원하지 않으시면 <a href="#">여기</a>를 클릭해주세요.
        </p>
      </div>
    </body>
    </html>
  `;
}