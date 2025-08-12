// Send Newsletter Issue #001
// Run with: node send-newsletter-001.js

// Load environment variables first
require('dotenv').config({ path: '.env.local' });

const Plunk = require('@plunk/node').default;

// Initialize Plunk
const plunk = new Plunk(process.env.PLUNK_API_KEY);

// Newsletter HTML content
const newsletterHTML = `
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
      padding: 20px;
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
      font-size: 24px;
    }
    .issue-info {
      color: #6b7280;
      font-size: 14px;
    }
    .section {
      margin: 30px 0;
      padding: 20px;
      border-left: 4px solid #3b82f6;
      background: #f8fafc;
    }
    .alert-section {
      background: #fef2f2;
      border-left: 4px solid #ef4444;
    }
    .insight-section {
      background: #f0fdf4;
      border-left: 4px solid #22c55e;
    }
    .idea-section {
      background: #fefce8;
      border-left: 4px solid #eab308;
    }
    .section h3 {
      margin-top: 0;
      font-size: 18px;
    }
    .score {
      display: inline-block;
      background: #3b82f6;
      color: white;
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: bold;
      font-size: 14px;
    }
    .score.high { background: #22c55e; }
    .score.medium { background: #eab308; }
    .score.low { background: #ef4444; }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      font-size: 12px;
      color: #6b7280;
      text-align: center;
    }
    .cta-button {
      display: inline-block;
      background: #3b82f6;
      color: white;
      padding: 10px 20px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: bold;
      margin: 10px 0;
    }
    .emoji { font-size: 18px; margin-right: 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Korean Business Intelligence Weekly</h1>
      <div class="issue-info">
        Issue #001 | 2024년 8월 12일 | 창간호 🎉
      </div>
    </div>

    <!-- Welcome Message -->
    <div style="text-align: center; margin: 20px 0; padding: 15px; background: #dbeafe; border-radius: 8px;">
      <h2 style="margin: 0; color: #1e40af;">🎊 창간호를 환영합니다!</h2>
      <p style="margin: 10px 0; color: #3730a3;">
        한국 최초의 비즈니스 규제 인텔리전스 뉴스레터가 시작됩니다.
      </p>
    </div>

    <!-- Critical Alert -->
    <div class="section alert-section">
      <h3><span class="emoji">🚨</span>긴급 규제 알림</h3>
      <h4>금융위원회, 8월 15일부터 가상자산 사업자 신고 강화</h4>
      <p><strong>변경 내용:</strong> 기존 거래소 외에 P2P, DeFi 서비스까지 신고 의무 확대</p>
      <p><strong>영향 받는 업체:</strong> 암호화폐 관련 모든 사업자 (월렛, 커스터디, DeFi 프로토콜)</p>
      <p><strong>준수 기한:</strong> 2024년 8월 15일 (3일 후)</p>
      <p><strong>미신고 시 처벌:</strong> 5년 이하 징역 또는 5천만원 이하 벌금</p>
      
      <div style="background: white; padding: 15px; border-radius: 6px; margin: 15px 0;">
        <strong>🎯 즉시 해야 할 일:</strong>
        <ol>
          <li>가상자산 관련 서비스 제공 여부 재검토</li>
          <li>금융위원회 가상자산 신고 포털에서 신고 진행</li>
          <li>법무팀과 컴플라이언스 점검 미팅 예약</li>
        </ol>
      </div>
    </div>

    <!-- Expert Insight -->
    <div class="section insight-section">
      <h3><span class="emoji">🎤</span>전문가 인사이트</h3>
      <h4>김현수 前 금융위원회 핀테크 정책관</h4>
      <div style="font-style: italic; font-size: 16px; margin: 15px 0; padding: 15px; background: white; border-radius: 6px;">
        "이번 규제 강화는 단순한 규제가 아닌 시장 성숙화 신호입니다. 
        신고를 완료한 업체들은 오히려 시장에서 신뢰도가 높아질 것이고, 
        기관 투자자들의 관심도 증가할 것으로 예상합니다. 
        단기적 부담이지만 장기적으로는 건전한 생태계 구축에 도움이 될 것입니다."
      </div>
      <p><strong>핵심 포인트:</strong> 규제 준수 = 경쟁 우위 확보 기회</p>
    </div>

    <!-- Korea Fit Analysis -->
    <div class="section idea-section">
      <h3><span class="emoji">📊</span>이번 주 Korea Fit 분석</h3>
      <h4>AI 기반 개인화 학습 플랫폼 <span class="score high">8.7/10</span></h4>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 15px 0;">
        <div style="background: white; padding: 10px; border-radius: 6px;">
          <div style="font-size: 12px; color: #6b7280;">시장 기회</div>
          <div style="font-size: 20px; font-weight: bold; color: #22c55e;">9.2/10</div>
        </div>
        <div style="background: white; padding: 10px; border-radius: 6px;">
          <div style="font-size: 12px; color: #6b7280;">규제 친화성</div>
          <div style="font-size: 20px; font-weight: bold; color: #eab308;">7.8/10</div>
        </div>
        <div style="background: white; padding: 10px; border-radius: 6px;">
          <div style="font-size: 12px; color: #6b7280;">실행 난이도</div>
          <div style="font-size: 20px; font-weight: bold; color: #3b82f6;">8.5/10</div>
        </div>
        <div style="background: white; padding: 10px; border-radius: 6px;">
          <div style="font-size: 12px; color: #6b7280;">수익 잠재력</div>
          <div style="font-size: 20px; font-weight: bold; color: #22c55e;">9.0/10</div>
        </div>
      </div>
      
      <p><strong>왜 지금 한국에서 가능한가?</strong></p>
      <ul>
        <li>코로나19로 인한 비대면 학습 수요 급증 (300% 증가)</li>
        <li>정부의 에듀테크 지원 정책 (K-디지털 기초역량훈련)</li>
        <li>개인정보보호법 개정으로 학습 데이터 활용 환경 개선</li>
      </ul>
      
      <p><strong>주요 규제 고려사항:</strong></p>
      <ul>
        <li>개인정보보호법: 학습자 데이터 수집/처리 동의 필요</li>
        <li>교육기본법: 정규 교육과정 대체 시 교육부 승인 필요</li>
        <li>소비자보호법: 환불 정책 및 과대광고 금지 준수</li>
      </ul>
    </div>

    <!-- Success Story -->
    <div class="section">
      <h3><span class="emoji">📈</span>성공 사례 분석</h3>
      <h4>토스: 규제를 기회로 만든 핀테크의 교과서</h4>
      <p><strong>상황:</strong> 2019년 인터넷전문은행 예비인가 탈락으로 위기 상황</p>
      <p><strong>대응 전략:</strong></p>
      <ol>
        <li>기존 송금 서비스 품질 개선에 집중</li>
        <li>금융위원회와 적극적인 소통으로 신뢰 구축</li>
        <li>마이데이터 사업 진출로 새로운 성장 동력 확보</li>
      </ol>
      <p><strong>결과:</strong> 2021년 카카오뱅크 다음으로 인터넷전문은행 본인가 획득, 현재 가치평가액 8조원</p>
      
      <div style="background: #dbeafe; padding: 15px; border-radius: 6px; margin: 15px 0;">
        <strong>🎓 교훈:</strong> 규제 실패를 성장 기회로 전환하려면 
        ① 규제당국과의 신뢰 구축 ② 핵심 역량 강화 ③ 새로운 기회 모색이 필요
      </div>
    </div>

    <!-- Community Spotlight -->
    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3><span class="emoji">💬</span>독자 질문 & 답변</h3>
      <p><strong>Q:</strong> "외국인 투자를 받으려는 헬스테크 스타트업인데, 의료기기법 외에 또 어떤 규제를 검토해야 하나요?" - 김○○님</p>
      <p><strong>A:</strong> 헬스테크의 경우 ① 개인정보보호법 (의료정보 특별 보호) ② 생명윤리법 (인체 유래 데이터 사용 시) ③ 외국인투자촉진법 (투자신고) ④ 의료법 (원격의료 해당 시)을 검토하세요. 특히 의료정보는 개인정보 중 가장 민감한 정보로 분류되어 더 엄격한 보호 조치가 필요합니다.</p>
      
      <p style="font-size: 14px; color: #6b7280; margin-top: 15px;">
        💡 규제 질문이 있으시면 이 이메일에 답장해주세요. 다음 주 뉴스레터에 답변을 포함해드립니다!
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>
        <strong>Korean Business Intelligence Weekly</strong><br>
        한국 창업가를 위한 규제 인텔리전스 뉴스레터
      </p>
      
      <div style="margin: 20px 0;">
        <a href="https://ideaoasis.kr" style="color: #3b82f6; text-decoration: none; margin: 0 10px;">🌐 IdeaOasis</a>
        <a href="https://ideaoasis.kr/experts" style="color: #3b82f6; text-decoration: none; margin: 0 10px;">👥 전문가 네트워크</a>
        <a href="mailto:feedback@ideaoasis.kr" style="color: #3b82f6; text-decoration: none; margin: 0 10px;">📧 피드백 보내기</a>
      </div>
      
      <p style="margin: 20px 0;">
        이 뉴스레터가 도움이 되셨다면 동료들과 공유해주세요! 👇<br>
        <a href="https://ideaoasis.kr/newsletter" style="color: #3b82f6;">친구 초대하기</a>
      </p>
      
      <p>
        구독 취소를 원하시면 <a href="https://ideaoasis.kr/unsubscribe" style="color: #6b7280;">여기</a>를 클릭하세요.<br>
        © 2024 IdeaOasis. All rights reserved. | Seoul, South Korea
      </p>
    </div>
  </div>
</body>
</html>
`;

// Test subscribers (replace with your email for testing)
const testSubscribers = [
  'ethancho12@gmail.com',
  'yeojooncho@gmail.com',  // Add your email too
  // Add more test emails here
];

async function sendNewsletter() {
  console.log('🚀 Sending Korean Business Intelligence Weekly #001...');
  
  for (const email of testSubscribers) {
    try {
      const result = await plunk.emails.send({
        to: email,
        subject: '🚨 [KBI Weekly #001] 가상자산 규제 긴급 알림 + AI 학습 플랫폼 Korea Fit 분석',
        body: newsletterHTML,
      });
      
      console.log(`✅ Sent to ${email}:`, result.success);
    } catch (error) {
      console.error(`❌ Failed to send to ${email}:`, error.message);
    }
    
    // Wait 1 second between sends to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('📨 Newsletter sending complete!');
}

// Run the script
if (require.main === module) {
  sendNewsletter().catch(console.error);
}

module.exports = { sendNewsletter, newsletterHTML };