import { NextRequest, NextResponse } from 'next/server';
import Plunk from '@plunk/node';

export async function POST(request: NextRequest) {
  const { email } = await request.json();
  
  if (!process.env.PLUNK_API_KEY) {
    return NextResponse.json({ error: 'Plunk API key not configured' }, { status: 500 });
  }
  
  const plunk = new Plunk(process.env.PLUNK_API_KEY);
  
  try {
    // Send the actual Korean welcome email template
    const result = await plunk.emails.send({
      to: email,
      subject: '🎉 Korean Business Intelligence Weekly 구독을 환영합니다!',
      body: getKoreanWelcomeTemplate(email)
    });
    
    return NextResponse.json({
      success: true,
      message: 'Korean welcome email sent successfully',
      result: result
    });
  } catch (error: any) {
    console.error('Korean email send error:', error);
    return NextResponse.json({
      error: error.message || 'Failed to send Korean email',
      details: error
    }, { status: 500 });
  }
}

function getKoreanWelcomeTemplate(email: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { 
          font-family: -apple-system, 'Segoe UI', sans-serif; 
          line-height: 1.6; 
          color: #1f2937;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 40px 20px;
        }
        .header {
          text-align: center;
          padding: 20px 0;
          border-bottom: 3px solid #3b82f6;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #1e40af;
          margin: 0;
          font-size: 28px;
        }
        .welcome-badge {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 8px 20px;
          border-radius: 20px;
          font-weight: bold;
          margin: 20px 0;
        }
        .benefit-list {
          background: #f3f4f6;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .benefit-list li {
          margin: 10px 0;
          color: #4b5563;
        }
        .cta-button {
          display: inline-block;
          background: #3b82f6;
          color: white;
          padding: 12px 30px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: bold;
          margin: 20px 0;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          font-size: 12px;
          color: #6b7280;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Korean Business Intelligence Weekly</h1>
          <span class="welcome-badge">🎉 구독 완료!</span>
        </div>
        
        <p>안녕하세요!</p>
        
        <p><strong>Korean Business Intelligence Weekly</strong> 구독을 진심으로 환영합니다. 
        이제 매주 월요일 아침 7시, 한국 비즈니스 규제 변화를 가장 먼저 알게 되실 거예요.</p>
        
        <div class="benefit-list">
          <p><strong>🎁 구독자 혜택:</strong></p>
          <ul>
            <li>📍 <strong>긴급 규제 알림</strong> - 새로운 규제 시행 전 미리 알림</li>
            <li>📊 <strong>Korea Fit 분석</strong> - 글로벌 아이디어의 한국 적합도</li>
            <li>🎤 <strong>전문가 인사이트</strong> - 전직 정부 관계자 독점 인터뷰</li>
            <li>📈 <strong>성공/실패 사례</strong> - 한국 스타트업의 규제 대응 스토리</li>
            <li>🔮 <strong>미래 예측</strong> - 3개월 후 시행될 규제 미리보기</li>
          </ul>
        </div>
        
        <p><strong>첫 번째 뉴스레터</strong>는 다음 월요일 아침 7시에 도착합니다!</p>
        
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
          <p style="margin: 0;">
            <strong>💡 Pro Tip:</strong> 
            스팸함으로 가는 것을 방지하기 위해 <strong>newsletter@ideaoasis.kr</strong>을 
            주소록에 추가해주세요!
          </p>
        </div>
        
        <center>
          <a href="https://ideaoasis.kr" class="cta-button">
            IdeaOasis 둘러보기 →
          </a>
        </center>
        
        <p>궁금한 점이 있으시면 언제든 회신해주세요. 
        여러분의 피드백으로 더 나은 콘텐츠를 만들어갑니다.</p>
        
        <p>
          감사합니다,<br>
          <strong>IdeaOasis 팀</strong> 드림
        </p>
        
        <div class="footer">
          <p>
            이 이메일은 ${email}님이 구독 신청하셨기 때문에 발송되었습니다.<br>
            <a href="https://ideaoasis.kr/unsubscribe" style="color: #6b7280;">구독 취소</a> | 
            <a href="https://ideaoasis.kr/preferences" style="color: #6b7280;">이메일 설정</a>
          </p>
          <p>
            © 2024 IdeaOasis. All rights reserved.<br>
            Seoul, South Korea
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}