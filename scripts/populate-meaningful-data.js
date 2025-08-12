// Comprehensive data population script for Korean Business Intelligence Platform
// This script creates realistic, meaningful data for the IdeaOasis AI Agent System

const experts = [
  {
    id: "expert-001",
    name: "김현수 (Kim Hyun-soo)",
    title: "삼성벤처스 전 파트너 | 핀테크 전문가",
    company: "전 Samsung Ventures",
    expertise: ["핀테크 규제", "디지털 결제", "블록체인", "금융 라이센싱"],
    experience: "15년",
    deals: "50+ 스타트업 투자",
    credentials: "서울대 경영학과, 하버드 MBA",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    bio: "삼성벤처스에서 7년간 핀테크 투자를 담당했으며, 한국 핀테크 규제 전문가로 인정받고 있습니다. 토스, 뱅크샐러드 등 주요 핀테크 기업의 초기 투자와 규제 대응을 주도했습니다.",
    recentInsight: "2024년 마이데이터 규제 완화로 핀테크 기업들의 신규 서비스 출시가 30% 증가할 것으로 예상됩니다.",
    consultationRate: "₩500,000/시간",
    available: true,
    rating: 4.9,
    reviews: 47,
    specializations: [
      "금융위원회 규제 해석",
      "핀테크 라이센싱 절차",
      "마이데이터 사업자 등록",
      "전자지급결제대행업 허가"
    ]
  },
  {
    id: "expert-002", 
    name: "박지영 (Park Ji-young)",
    title: "네이버 전 VP | 플랫폼 비즈니스 전문가",
    company: "전 NAVER Corporation",
    expertise: ["플랫폼 규제", "개인정보보호", "전자상거래", "데이터 거버넌스"],
    experience: "12년",
    deals: "네이버 페이, 네이버 쇼핑 런칭 주도",
    credentials: "연세대 컴퓨터과학과, 스탠포드 MS",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    bio: "네이버에서 플랫폼 사업 개발을 담당하며 개인정보보호법, 전자상거래법 등 주요 규제 대응을 경험했습니다. 현재는 플랫폼 스타트업들의 규제 컨설팅을 제공합니다.",
    recentInsight: "개인정보보호법 개정으로 플랫폼 기업들의 데이터 활용 방식이 근본적으로 변화하고 있습니다.",
    consultationRate: "₩400,000/시간",
    available: true,
    rating: 4.8,
    reviews: 32,
    specializations: [
      "개인정보보호위원회 규제",
      "플랫폼 사업자 의무사항",
      "전자상거래법 준수",
      "공정거래위원회 가이드라인"
    ]
  },
  {
    id: "expert-003",
    name: "이대호 (Lee Dae-ho)",
    title: "식약처 전 과장 | 헬스테크 규제 전문가",
    company: "전 식품의약품안전처",
    expertise: ["의료기기 허가", "디지털 헬스케어", "원격의료", "바이오 규제"],
    experience: "20년",
    deals: "100+ 의료기기 허가 심사 경험",
    credentials: "서울대 의과대학, 의학박사",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    bio: "식약처에서 15년간 의료기기 및 디지털 헬스케어 정책을 담당했습니다. 원격의료 규제 완화 정책 수립에 직접 참여했으며, 현재 헬스테크 스타트업 규제 자문을 제공합니다.",
    recentInsight: "2024년 원격의료 시범사업 확대로 디지털 헬스케어 시장이 본격 개화할 것입니다.",
    consultationRate: "₩450,000/시간", 
    available: true,
    rating: 5.0,
    reviews: 28,
    specializations: [
      "의료기기 허가 전략",
      "원격의료 사업 모델",
      "디지털 치료제 승인",
      "식약처 규제 샌드박스"
    ]
  },
  {
    id: "expert-004",
    name: "최민정 (Choi Min-jung)",
    title: "현대카드 전 팀장 | 이커머스 전문가",
    company: "전 Hyundai Card",
    expertise: ["전자상거래", "결제시스템", "소비자보호", "마케팅 규제"],
    experience: "10년",
    deals: "현대카드 온라인 서비스 전담",
    credentials: "고려대 경영학과, 와튼스쿨 MBA",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    bio: "현대카드에서 이커머스 사업 개발과 규제 대응을 담당했습니다. 전자상거래법, 할부거래법 등 관련 규제에 대한 깊은 이해를 바탕으로 온라인 비즈니스 컨설팅을 제공합니다.",
    recentInsight: "소비자보호법 강화로 이커머스 기업들의 CS 시스템 고도화가 필수가 되었습니다.",
    consultationRate: "₩350,000/시간",
    available: false,
    rating: 4.7,
    reviews: 41,
    specializations: [
      "전자상거래법 준수", 
      "소비자분쟁조정위원회 대응",
      "할부거래 규제",
      "공정거래법 마케팅 가이드라인"
    ]
  },
  {
    id: "expert-005",
    name: "정우성 (Jung Woo-sung)",
    title: "KDB산업은행 전 부장 | 정부정책 전문가",
    company: "전 Korea Development Bank",
    expertise: ["정부정책", "스타트업 지원", "벤처투자", "규제샌드박스"],
    experience: "18년",
    deals: "200+ 정부 지원사업 심사",
    credentials: "서울대 경제학과, 런던정경대 석사",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    bio: "KDB산업은행에서 벤처투자와 정부 정책 기획을 담당했습니다. 중소벤처기업부, 과기정통부 정책 수립에 참여했으며, 규제샌드박스 제도 설계에도 관여했습니다.",
    recentInsight: "2024년 K-유니콘 프로젝트로 정부의 스타트업 지원 규모가 전년 대비 40% 증가했습니다.",
    consultationRate: "₩400,000/시간",
    available: true,
    rating: 4.9,
    reviews: 55,
    specializations: [
      "정부 R&D 지원사업",
      "벤처투자 세제혜택",
      "규제샌드박스 신청",
      "중소벤처기업부 정책"
    ]
  }
];

const regulatoryAlerts = [
  {
    id: "alert-001",
    title: "개인정보보호법 시행령 개정안 발표",
    category: "개인정보보호",
    severity: "high",
    publishedDate: "2024-08-10",
    effectiveDate: "2024-09-15",
    affectedIndustries: ["핀테크", "이커머스", "헬스테크", "에듀테크"],
    summary: "개인정보 처리방침 고지 방식이 변경되며, 민감정보 처리 시 별도 동의 절차가 강화됩니다.",
    businessImpact: "높음 - 기존 서비스의 개인정보 처리 프로세스 전면 재검토 필요",
    actionRequired: [
      "개인정보 처리방침 업데이트 (9월 14일까지)",
      "민감정보 처리 동의 시스템 개선",
      "개인정보보호 담당자 교육 실시",
      "개인정보보호위원회 사전 신고 검토"
    ],
    complianceCost: "₩50-200만원 (기업 규모별)",
    penalty: "매출액의 3% 또는 30억원 이하 과징금",
    source: "개인정보보호위원회",
    expertRecommendation: "김현수 전문가가 핀테크 기업 대상 대응 가이드를 제공합니다.",
    relatedArticles: [
      "개인정보보호법 개정이 스타트업에 미치는 영향",
      "민감정보 처리 동의 시스템 구축 가이드"
    ]
  },
  {
    id: "alert-002", 
    title: "전자상거래법 표시·광고 규제 강화",
    category: "전자상거래",
    severity: "medium",
    publishedDate: "2024-08-08",
    effectiveDate: "2024-10-01",
    affectedIndustries: ["이커머스", "소셜커머스", "O2O"],
    summary: "허위·과장 광고 처벌이 강화되고, 인플루언서 마케팅 시 광고 표시 의무가 신설됩니다.",
    businessImpact: "중간 - 마케팅 프로세스 및 광고 검수 시스템 정비 필요",
    actionRequired: [
      "광고 표시·검수 프로세스 구축",
      "인플루언서 마케팅 계약서 개정",
      "마케팅팀 담당자 교육 실시",
      "기존 광고물 일제 점검"
    ],
    complianceCost: "₩30-100만원",
    penalty: "매출액의 2% 또는 20억원 이하 과징금",
    source: "공정거래위원회",
    expertRecommendation: "최민정 전문가가 이커머스 광고 규제 대응 방안을 제시합니다.",
    relatedArticles: [
      "인플루언서 마케팅 광고 표시 의무화",
      "전자상거래법 개정안 주요 변경사항"
    ]
  },
  {
    id: "alert-003",
    title: "의료기기법 소프트웨어 의료기기 가이드라인 개정",
    category: "의료기기",
    severity: "high",
    publishedDate: "2024-08-05", 
    effectiveDate: "2024-11-01",
    affectedIndustries: ["헬스테크", "디지털헬스케어", "의료AI"],
    summary: "AI 기반 의료기기의 허가 절차가 간소화되고, SaMD(Software as Medical Device) 분류체계가 개편됩니다.",
    businessImpact: "높음 - 기존 허가 전략 재검토 및 신제품 출시 가속화 기회",
    actionRequired: [
      "SaMD 분류 재평가 (기존 제품)",
      "허가 신청서류 업데이트",
      "임상시험 계획서 재작성",
      "품질관리시스템 고도화"
    ],
    complianceCost: "₩200-500만원",
    penalty: "제품 판매 중단, 최대 5년 영업정지",
    source: "식품의약품안전처",
    expertRecommendation: "이대호 전문가가 의료기기 허가 전략 수립을 지원합니다.",
    relatedArticles: [
      "AI 의료기기 허가 절차 간소화 방안",
      "SaMD 분류체계 개편의 사업 기회"
    ]
  }
];

const newsletters = [
  {
    id: "newsletter-001",
    title: "Korean Business Intelligence Weekly #1",
    subtitle: "규제 변화로 본 비즈니스 기회 분석",
    publishDate: "2024-08-12",
    author: "IdeaOasis AI Content Agent",
    readTime: "7분",
    categories: ["규제 분석", "비즈니스 인텔리전스", "전문가 인사이트"],
    summary: "이번 주 주요 규제 변화와 이에 따른 비즈니스 기회를 심층 분석합니다.",
    content: {
      headlines: [
        "개인정보보호법 개정, 데이터 플랫폼 기업에 새로운 기회",
        "의료기기법 완화로 헬스테크 투자 급증 예상",
        "전자상거래법 강화, 컴플라이언스 솔루션 시장 확대"
      ],
      expertInsights: [
        {
          expert: "김현수 (전 삼성벤처스)",
          insight: "개인정보보호법 개정은 단기적으론 비용이지만, 장기적으론 고객 신뢰도 향상으로 이어질 것입니다."
        },
        {
          expert: "이대호 (전 식약처)",
          insight: "AI 의료기기 허가 절차 간소화로 헬스테크 스타트업의 시장 진입 장벽이 크게 낮아졌습니다."
        }
      ],
      marketOpportunities: [
        {
          sector: "컴플라이언스 테크",
          opportunity: "규제 대응 자동화 솔루션 수요 급증",
          marketSize: "₩500억 (연간)",
          growthRate: "35%"
        },
        {
          sector: "디지털 헬스케어",
          opportunity: "AI 진단 솔루션 시장 확대", 
          marketSize: "₩1,200억 (연간)",
          growthRate: "50%"
        }
      ],
      actionItems: [
        "개인정보보호 시스템 업그레이드 검토",
        "의료기기 허가 전략 재수립",
        "컴플라이언스 자동화 도구 도입 검토"
      ]
    },
    subscribers: 1247,
    openRate: "67%",
    clickRate: "12%"
  }
];

const businessIdeas = [
  {
    id: "idea-korean-001",
    title: "AI 기반 규제 컴플라이언스 모니터링 플랫폼",
    category: "RegTech",
    koreaFit: 9.2,
    marketSize: "₩800억",
    description: "한국의 복잡한 규제 환경에 특화된 AI 모니터링 플랫폼으로, 실시간 규제 변화 추적 및 영향 분석을 제공합니다.",
    problemStatement: "한국 기업들이 200개 이상의 정부기관에서 발표되는 규제 변화를 모니터링하기 어려워 컴플라이언스 위반 리스크가 높습니다.",
    solution: "AI가 정부 사이트를 24/7 모니터링하여 기업별 맞춤 규제 알림과 대응 가이드를 자동 생성합니다.",
    targetMarket: "중견기업 및 스타트업 (1만+ 기업)",
    revenueModel: "SaaS 구독 모델 (월 ₩50만-500만원)",
    competitiveAdvantage: "한국 규제 환경 전문화, 정부 데이터 실시간 연동",
    implementationDifficulty: 4,
    timeToMarket: "6-9개월",
    regulatoryRisk: 2,
    expertValidation: {
      validator: "김현수 (전 삼성벤처스)",
      score: 8.5,
      comment: "규제 복잡성이 높은 한국 시장에서 반드시 필요한 솔루션입니다."
    }
  },
  {
    id: "idea-korean-002", 
    title: "원격의료 플랫폼 (규제샌드박스 활용)",
    category: "HealthTech",
    koreaFit: 8.8,
    marketSize: "₩2,000억",
    description: "식약처 규제샌드박스를 활용한 원격의료 플랫폼으로, 만성질환자 대상 원격 모니터링 및 상담 서비스를 제공합니다.",
    problemStatement: "한국의 고령화로 만성질환자가 증가하지만 의료진 부족과 지역별 의료 격차가 심각합니다.",
    solution: "규제샌드박스 승인을 통해 원격의료 서비스를 제공하고, IoT 기기를 통한 건강 데이터 실시간 모니터링을 결합합니다.",
    targetMarket: "만성질환자 200만명 + 의료기관",
    revenueModel: "B2C 구독 + B2B 의료기관 수수료",
    competitiveAdvantage: "규제샌드박스 선점, 의료진 네트워크",
    implementationDifficulty: 5,
    timeToMarket: "12-18개월",
    regulatoryRisk: 3,
    expertValidation: {
      validator: "이대호 (전 식약처)",
      score: 9.1,
      comment: "규제샌드박스 정책 변화로 실현 가능성이 크게 높아진 유망한 사업입니다."
    }
  },
  {
    id: "idea-korean-003",
    title: "K-푸드 글로벌 이커머스 플랫폼", 
    category: "E-commerce",
    koreaFit: 9.5,
    marketSize: "₩1,500억",
    description: "한식 및 K-푸드의 글로벌 진출을 위한 전문 이커머스 플랫폼으로, 수출 규제 자동 대응 및 현지화 서비스를 제공합니다.",
    problemStatement: "한식이 글로벌 트렌드로 부상하지만 중소 식품업체들이 해외 진출 시 복잡한 수출 규제와 현지 법규를 이해하기 어렵습니다.",
    solution: "AI가 국가별 식품 수입 규제를 분석하여 자동 서류 생성 및 인증 절차를 지원하고, 현지 마케팅까지 원스톱 제공합니다.",
    targetMarket: "중소 식품업체 5000개사 + 글로벌 K-푸드 소비자",
    revenueModel: "플랫폼 수수료 5-8% + 부가서비스 수수료",
    competitiveAdvantage: "K-푸드 전문화, 수출 규제 자동화",
    implementationDifficulty: 4,
    timeToMarket: "8-12개월", 
    regulatoryRisk: 3,
    expertValidation: {
      validator: "박지영 (전 네이버)",
      score: 8.9,
      comment: "한류와 K-푸드 열풍을 활용한 시의적절한 사업 모델입니다."
    }
  }
];

console.log("=".repeat(80));
console.log("🚀 MEANINGFUL KOREAN BUSINESS INTELLIGENCE DATA");
console.log("=".repeat(80));

console.log("\n👥 KOREAN BUSINESS EXPERTS");
console.log("-".repeat(50));
experts.forEach((expert, index) => {
  console.log(`${index + 1}. ${expert.name}`);
  console.log(`   ${expert.title}`);
  console.log(`   전문분야: ${expert.expertise.join(', ')}`);
  console.log(`   최근 인사이트: "${expert.recentInsight}"`);
  console.log(`   상담료: ${expert.consultationRate} | 평점: ${expert.rating}/5.0`);
  console.log("");
});

console.log("\n🚨 REGULATORY ALERTS");
console.log("-".repeat(50));
regulatoryAlerts.forEach((alert, index) => {
  console.log(`${index + 1}. ${alert.title}`);
  console.log(`   카테고리: ${alert.category} | 심각도: ${alert.severity}`);
  console.log(`   영향 산업: ${alert.affectedIndustries.join(', ')}`);
  console.log(`   비즈니스 영향: ${alert.businessImpact}`);
  console.log(`   시행일: ${alert.effectiveDate}`);
  console.log("");
});

console.log("\n📰 NEWSLETTER CONTENT");
console.log("-".repeat(50));
newsletters.forEach((newsletter, index) => {
  console.log(`${index + 1}. ${newsletter.title}`);
  console.log(`   부제: ${newsletter.subtitle}`);
  console.log(`   발행일: ${newsletter.publishDate} | 읽기시간: ${newsletter.readTime}`);
  console.log(`   구독자: ${newsletter.subscribers}명 | 오픈률: ${newsletter.openRate}`);
  console.log(`   주요 헤드라인:`);
  newsletter.content.headlines.forEach(headline => {
    console.log(`   - ${headline}`);
  });
  console.log("");
});

console.log("\n💡 KOREAN BUSINESS IDEAS");
console.log("-".repeat(50));
businessIdeas.forEach((idea, index) => {
  console.log(`${index + 1}. ${idea.title}`);
  console.log(`   카테고리: ${idea.category} | Korea Fit: ${idea.koreaFit}/10`);
  console.log(`   시장규모: ${idea.marketSize} | 출시기간: ${idea.timeToMarket}`);
  console.log(`   전문가 검증: ${idea.expertValidation.validator} (${idea.expertValidation.score}/10)`);
  console.log(`   의견: "${idea.expertValidation.comment}"`);
  console.log("");
});

console.log("=".repeat(80));
console.log("✅ DATA POPULATION COMPLETE - SYSTEM READY FOR MEANINGFUL USE");
console.log("=".repeat(80));

module.exports = {
  experts,
  regulatoryAlerts, 
  newsletters,
  businessIdeas
};