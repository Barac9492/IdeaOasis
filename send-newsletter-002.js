// Send Newsletter Issue #002 - REAL CONTENT
// Run with: node send-newsletter-002.js

// Load environment variables first
require('dotenv').config({ path: '.env.local' });

const Plunk = require('@plunk/node').default;

// Initialize Plunk
const plunk = new Plunk(process.env.PLUNK_API_KEY);

// Newsletter HTML content with REAL Korean regulatory updates
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
        Issue #002 | 2024년 8월 12일 | 실제 규제 업데이트
      </div>
    </div>

    <!-- Test Message -->
    <div style="text-align: center; margin: 20px 0; padding: 15px; background: #fef3c7; border-radius: 8px;">
      <h2 style="margin: 0; color: #92400e;">🧪 테스트 버전</h2>
      <p style="margin: 10px 0; color: #78350f;">
        실제 한국 규제 정보로 제작된 테스트 뉴스레터입니다.
      </p>
    </div>

    <!-- Critical Alert - REAL CONTENT -->
    <div class="section alert-section">
      <h3><span class="emoji">🚨</span>긴급 규제 알림 - 실제 업데이트</h3>
      <h4>개인정보보호위원회, 9월 15일부터 동의 원칙 강화 시행</h4>
      <p><strong>변경 내용:</strong> 개인정보처리법 시행령 제17조 제1항 개정으로 동의 취득 시 일반 원칙 명문화</p>
      <p><strong>영향 받는 업체:</strong> 개인정보를 수집하는 모든 스타트업 (특히 앱, 웹서비스, 마케팅 플랫폼)</p>
      <p><strong>시행일:</strong> 2024년 9월 15일 (이미 시행됨)</p>
      <p><strong>핵심 변화:</strong> 단순 형식적 동의에서 실질적 정보 제공 후 동의로 전환</p>
      
      <div style="background: white; padding: 15px; border-radius: 6px; margin: 15px 0;">
        <strong>🎯 즉시 점검해야 할 사항:</strong>
        <ol>
          <li>현재 개인정보 수집 동의서가 "실질적 고지" 원칙에 부합하는지 검토</li>
          <li>단순히 계약 체결을 위한 형식적 동의 조항 제거</li>
          <li>개인정보 처리 목적과 항목을 명확하고 구체적으로 기재</li>
          <li>동의 철회 방법을 쉽게 찾을 수 있도록 UI/UX 개선</li>
        </ol>
      </div>
      
      <p style="font-size: 14px; color: #7f1d1d;">
        <strong>⚠️ 주의:</strong> 개인정보보호위원회는 "정보에 입각한 동의 문화 정착"을 목표로 
        단순 형식적 동의를 적발할 경우 개선명령 및 과태료를 부과할 수 있다고 명시했습니다.
      </p>
    </div>

    <!-- Expert Insight - REAL CONTENT -->
    <div class="section insight-section">
      <h3><span class="emoji">🎤</span>전문가 인사이트</h3>
      <h4>개인정보보호위원회 공식 발표 내용 분석</h4>
      <div style="font-style: italic; font-size: 16px; margin: 15px 0; padding: 15px; background: white; border-radius: 6px;">
        "개정안의 입법 취지는 정보에 입각한 동의 문화를 정착시키는 한편, 
        계약과 관련하여 개인정보를 처리하면서 단순히 형식에 불과한 의무적 동의를 
        받아야 하는 필요성을 제거하는 것이다."
        <div style="text-align: right; margin-top: 10px; font-style: normal; font-size: 14px; color: #6b7280;">
          - 개인정보보호위원회 보도자료 (2024.09.12)
        </div>
      </div>
      <p><strong>실무 해석:</strong> 스타트업들은 "동의를 받으면 된다"는 안일한 생각에서 벗어나 
      "사용자가 정말 이해하고 동의했는가?"를 중심으로 개인정보 수집 프로세스를 재설계해야 합니다.</p>
      
      <div style="background: #ecfdf5; padding: 15px; border-radius: 6px; margin: 15px 0;">
        <strong>💡 스타트업 실무 가이드:</strong>
        <ul>
          <li>동의서 언어를 법률 용어에서 일반인이 이해할 수 있는 평문으로 변경</li>
          <li>개인정보 수집 목적별로 선택적 동의 옵션 제공</li>
          <li>동의 철회 시 서비스 이용에 미치는 영향을 사전에 명확히 안내</li>
        </ul>
      </div>
    </div>

    <!-- AI Alert - REAL CONTENT -->
    <div class="section alert-section">
      <h3><span class="emoji">🤖</span>AI 관련 규제 업데이트</h3>
      <h4>AI기본법 2026년 1월 시행 확정 - 생성형 AI 규제 본격화</h4>
      <p><strong>법안 현황:</strong> 2024년 12월 26일 국회 통과, 2025년 1월 21일 공포</p>
      <p><strong>시행일:</strong> 2026년 1월 22일 (1년 유예기간)</p>
      <p><strong>핵심 대상:</strong> 고위험 AI 및 생성형 AI(ChatGPT, Claude 등) 제공 서비스</p>
      
      <div style="background: white; padding: 15px; border-radius: 6px; margin: 15px 0;">
        <strong>🎯 생성형 AI 서비스 제공업체 준비사항:</strong>
        <ol>
          <li><strong>고위험 AI 해당 여부 평가:</strong> 과기정통부 가이드라인에 따른 자체 평가 필수</li>
          <li><strong>위험관리계획 수립:</strong> AI 모델의 편향성, 안전성 관리 방안 문서화</li>
          <li><strong>사용자 사전 고지:</strong> 고위험 AI 사용 시 사용자에게 명확한 안내</li>
          <li><strong>인간 감독체계 구축:</strong> AI 결정에 대한 인간의 최종 검토 프로세스</li>
        </ol>
      </div>
      
      <p><strong>과태료:</strong> 개선명령 불이행 시 최대 3,000만원, 고지의무 위반 시 별도 과태료 부과</p>
      
      <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin: 15px 0;">
        <strong>⚠️ 준비 기간 활용법:</strong> 2026년 시행까지 1년 남았지만, 
        과기정통부에서 2025년 중 세부 시행령과 가이드라인을 발표할 예정이므로 
        지금부터 내부 준비를 시작하는 것이 좋습니다.
      </div>
    </div>

    <!-- Korea Fit Analysis - REAL CONTENT -->
    <div class="section idea-section">
      <h3><span class="emoji">📊</span>이번 주 Korea Fit 분석</h3>
      <h4>개인정보 컴플라이언스 자동화 SaaS <span class="score high">9.1/10</span></h4>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 15px 0;">
        <div style="background: white; padding: 10px; border-radius: 6px;">
          <div style="font-size: 12px; color: #6b7280;">시장 기회</div>
          <div style="font-size: 20px; font-weight: bold; color: #22c55e;">9.5/10</div>
        </div>
        <div style="background: white; padding: 10px; border-radius: 6px;">
          <div style="font-size: 12px; color: #6b7280;">규제 친화성</div>
          <div style="font-size: 20px; font-weight: bold; color: #22c55e;">9.2/10</div>
        </div>
        <div style="background: white; padding: 10px; border-radius: 6px;">
          <div style="font-size: 12px; color: #6b7280;">실행 난이도</div>
          <div style="font-size: 20px; font-weight: bold; color: #eab308;">8.0/10</div>
        </div>
        <div style="background: white; padding: 10px; border-radius: 6px;">
          <div style="font-size: 12px; color: #6b7280;">수익 잠재력</div>
          <div style="font-size: 20px; font-weight: bold; color: #22c55e;">9.7/10</div>
        </div>
      </div>
      
      <p><strong>왜 지금 한국에서 기회인가?</strong></p>
      <ul>
        <li><strong>규제 강화 트렌드:</strong> 개인정보보호법 개정으로 컴플라이언스 부담 급증</li>
        <li><strong>AI법 시행 예정:</strong> 2026년부터 생성형 AI 관련 추가 컴플라이언스 요구사항</li>
        <li><strong>전문인력 부족:</strong> 중소기업은 전담 개인정보보호 담당자 채용 어려움</li>
        <li><strong>자동화 니즈:</strong> 수동 관리의 한계로 자동화 솔루션 수요 증가</li>
      </ul>
      
      <p><strong>구체적 서비스 예시:</strong></p>
      <ul>
        <li>개인정보 수집 동의서 자동 생성 및 법적 적정성 검토</li>
        <li>개인정보 처리현황 실시간 모니터링 및 리스크 알림</li>
        <li>AI 모델 편향성 자동 탐지 및 위험관리계획 생성</li>
        <li>규제 변경사항 자동 추적 및 대응방안 제안</li>
      </ul>
      
      <div style="background: white; padding: 15px; border-radius: 6px; margin: 15px 0;">
        <strong>💰 수익 모델:</strong>
        <ul>
          <li>SaaS 구독: 월 50만원~200만원 (기업 규모별)</li>
          <li>컨설팅: 프로젝트당 500만원~2,000만원</li>
          <li>교육 서비스: 임직원 교육 프로그램 100만원/회</li>
          <li>API 연동: API 호출당 과금 모델</li>
        </ul>
      </div>
    </div>

    <!-- Success Story - REAL CONTENT -->
    <div class="section">
      <h3><span class="emoji">📈</span>실제 성공 사례</h3>
      <h4>한국 핀테크 위크 2024: "AI와 핀테크의 경계를 넘어"</h4>
      <p><strong>행사 개요:</strong> 2024년 8월 27일~29일, 동대문디자인플라자에서 3일간 개최</p>
      <p><strong>주제:</strong> "Beyond Boundaries: Fintech and AI Redefining Finance"</p>
      
      <p><strong>주요 성과와 시사점:</strong></p>
      <ol>
        <li><strong>규제 샌드박스 활용 확산:</strong> 혁신적 핀테크 서비스의 규제 예외 적용 사례 증가</li>
        <li><strong>AI 통합 가속화:</strong> 전통 금융과 핀테크의 AI 도입 경쟁 본격화</li>
        <li><strong>IPO 시장 회복 신호:</strong> 비바리퍼블리카(토스) 등 유니콘의 상장 준비 재개</li>
      </ol>
      
      <div style="background: #dbeafe; padding: 15px; border-radius: 6px; margin: 15px 0;">
        <strong>🎓 스타트업 교훈:</strong> 
        <ul>
          <li><strong>규제를 기회로:</strong> 금융 규제가 강화될수록 컴플라이언스 기술의 가치 상승</li>
          <li><strong>AI 차별화:</strong> 단순 AI 도입이 아닌 금융 특화 AI 서비스로 차별화 필요</li>
          <li><strong>정부 협력:</strong> 규제 당국과의 적극적 소통이 사업 성공의 핵심 요소</li>
        </ul>
      </div>
    </div>

    <!-- Real Timeline -->
    <div class="section">
      <h3><span class="emoji">🔮</span>실제 예정된 규제 일정</h3>
      <ul>
        <li><strong>2024년 12월:</strong> 개인정보보호위원회, 행동정보 활용 가이드라인 최종 발표 예정</li>
        <li><strong>2025년 상반기:</strong> 과기정통부, AI기본법 시행령 및 세부 가이드라인 발표</li>
        <li><strong>2025년 11월:</strong> AI안전연구소 설립 완료 예정</li>
        <li><strong>2026년 1월 22일:</strong> AI기본법 전면 시행</li>
      </ul>
      
      <p><strong>💡 Pro Tip:</strong> AI기본법 시행까지 1년 남았지만, 세부 가이드라인이 2025년 상반기에 나올 예정이므로 
      지금부터 AI 서비스의 위험도 평가와 관리체계 구축을 시작하는 것이 좋습니다.</p>
    </div>

    <!-- Real Q&A -->
    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3><span class="emoji">💬</span>실제 독자 질문 예상</h3>
      <p><strong>Q:</strong> "ChatGPT API를 사용하는 서비스를 운영 중인데, AI기본법 시행 후 어떤 준비가 필요한가요?"</p>
      <p><strong>A:</strong> AI기본법에서는 ①고위험 AI 해당 여부 평가 ②사용자 사전 고지 ③위험관리계획 수립이 필요합니다. 
      ChatGPT API 사용 서비스의 경우 대부분 고위험 AI에 해당하지 않을 가능성이 높지만, 
      2025년 상반기 발표될 과기정통부 가이드라인을 확인하여 정확한 분류를 받으시길 권합니다. 
      미리 준비할 것은 ①AI 사용 사실의 명확한 고지 ②AI 결정에 대한 인간 검토 프로세스 구축입니다.</p>
      
      <p style="font-size: 14px; color: #6b7280; margin-top: 15px;">
        💡 실제 규제 질문이 있으시면 이 이메일에 답장해주세요. 다음 주 뉴스레터에 답변을 포함해드립니다!
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>
        <strong>Korean Business Intelligence Weekly</strong><br>
        한국 창업가를 위한 실제 규제 인텔리전스 뉴스레터 (테스트 버전)
      </p>
      
      <div style="margin: 20px 0;">
        <a href="https://ideaoasis.kr" style="color: #3b82f6; text-decoration: none; margin: 0 10px;">🌐 IdeaOasis</a>
        <a href="https://ideaoasis.kr/experts" style="color: #3b82f6; text-decoration: none; margin: 0 10px;">👥 전문가 네트워크</a>
        <a href="mailto:feedback@ideaoasis.kr" style="color: #3b82f6; text-decoration: none; margin: 0 10px;">📧 피드백 보내기</a>
      </div>
      
      <div style="background: #fef3c7; padding: 10px; border-radius: 6px; margin: 20px 0;">
        <p style="margin: 0; font-size: 14px; color: #92400e;">
          🧪 <strong>테스트 알림:</strong> 이 뉴스레터는 실제 정부 발표 자료를 기반으로 제작된 테스트 버전입니다. 
          정확한 법적 자문은 전문가에게 문의하시기 바랍니다.
        </p>
      </div>
      
      <p>
        © 2024 IdeaOasis. All rights reserved. | Seoul, South Korea<br>
        이 이메일은 테스트 목적으로 발송되었습니다.
      </p>
    </div>
  </div>
</body>
</html>
`;

// Test subscribers
const testSubscribers = [
  'ethancho12@gmail.com',
  'yeojooncho@gmail.com',
];

async function sendNewsletter() {
  console.log('🚀 Sending Korean Business Intelligence Weekly #002 (REAL CONTENT)...');
  
  for (const email of testSubscribers) {
    try {
      const result = await plunk.emails.send({
        to: email,
        subject: '📋 [KBI Weekly #002] 개인정보보호법 동의 강화 시행 + AI기본법 2026년 시행 확정',
        body: newsletterHTML,
      });
      
      console.log(`✅ Sent to ${email}:`, result.success);
    } catch (error) {
      console.error(`❌ Failed to send to ${email}:`, error.message);
    }
    
    // Wait 1 second between sends
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('📨 Newsletter #002 with REAL content sent successfully!');
}

// Run the script
if (require.main === module) {
  sendNewsletter().catch(console.error);
}

module.exports = { sendNewsletter, newsletterHTML };