import { NextRequest, NextResponse } from 'next/server';
import Plunk from '@plunk/node';

// Initialize Plunk with your API key
const plunk = new Plunk(process.env.PLUNK_API_KEY || '');

// In-memory storage for now (replace with Supabase in production)
const subscribers = new Map<string, any>();

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

    // Check if already subscribed
    if (subscribers.has(email.toLowerCase())) {
      return NextResponse.json(
        { message: '이미 구독 중인 이메일입니다.' },
        { status: 200 }
      );
    }

    // Add to Plunk contacts
    try {
      // TODO: Fix Plunk API types for production build
      // await plunk.contacts.create({
      //   email: email,
      //   subscribed: true,
      //   data: {
      //     source: 'website',
      //     subscribedAt: new Date().toISOString(),
      //     language: 'ko'
      //   }
      // });
      console.log('Plunk integration temporarily disabled for production build');
    } catch (plunkError: any) {
      // If email already exists in Plunk, that's okay
      if (!plunkError.message?.includes('already exists')) {
        throw plunkError;
      }
    }

    // Send welcome email
    await plunk.emails.send({
      to: email,
      subject: '🎉 Korean Business Intelligence Weekly 구독을 환영합니다!',
      body: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
            환영합니다! 🎊
          </h1>
          
          <p style="font-size: 16px; line-height: 1.5; color: #374151;">
            Korean Business Intelligence Weekly 구독을 진심으로 환영합니다.
          </p>
          
          <p style="font-size: 16px; line-height: 1.5; color: #374151;">
            매주 월요일 아침 7시, 다음과 같은 내용을 받아보실 수 있습니다:
          </p>
          
          <ul style="font-size: 15px; line-height: 1.8; color: #4b5563;">
            <li>📍 이번 주 시행되는 주요 규제 변화</li>
            <li>📊 글로벌 아이디어의 Korea Fit 분석</li>
            <li>🎤 업계 전문가의 독점 인사이트</li>
            <li>📈 한국 스타트업 성공/실패 사례 분석</li>
            <li>🔮 향후 예정된 규제 변화 미리보기</li>
          </ul>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #6b7280;">
              <strong>💡 Pro Tip:</strong> 
              newsletter@ideaoasis.kr을 주소록에 추가하시면 
              스팸함으로 가는 것을 방지할 수 있습니다.
            </p>
          </div>
          
          <p style="font-size: 16px; line-height: 1.5; color: #374151;">
            첫 번째 뉴스레터는 다음 월요일에 발송됩니다.
          </p>
          
          <p style="font-size: 16px; line-height: 1.5; color: #374151;">
            궁금한 점이 있으시면 언제든 회신해주세요.
          </p>
          
          <p style="font-size: 16px; line-height: 1.5; color: #374151;">
            감사합니다,<br>
            <strong>IdeaOasis 팀</strong>
          </p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #9ca3af; text-align: center;">
            IdeaOasis | Korean Business Intelligence Platform<br>
            <a href="https://ideaoasis.kr" style="color: #3b82f6;">ideaoasis.kr</a>
          </p>
        </div>
      `,
      from: 'newsletter@ideaoasis.kr' // Configure this in Plunk dashboard
    });

    // Store locally
    subscribers.set(email.toLowerCase(), {
      email,
      subscribedAt: new Date(),
      source: 'website'
    });

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
  try {
    // TODO: Fix Plunk API types for production build
    // const contacts = await plunk.contacts.get();
    
    return NextResponse.json({
      count: subscribers.size,
      source: 'local'
    });
  } catch (error) {
    return NextResponse.json({
      count: subscribers.size,
      source: 'local'
    });
  }
}