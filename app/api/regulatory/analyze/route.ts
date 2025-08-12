import { NextRequest, NextResponse } from 'next/server';

// Korean regulation categories and their typical requirements
const REGULATION_DATABASE = {
  'fintech': [
    'Electronic Financial Transaction Act (전자금융거래법)',
    'Personal Information Protection Act (개인정보보호법)',
    'Credit Information Use and Protection Act (신용정보법)'
  ],
  'ecommerce': [
    'Electronic Commerce Consumer Protection Act (전자상거래소비자보호법)',
    'Personal Information Protection Act (개인정보보호법)',
    'Telecommunications Business Act (전기통신사업법)'
  ],
  'healthcare': [
    'Medical Device Act (의료기기법)',
    'Pharmaceutical Affairs Act (약사법)',
    'Medical Service Act (의료법)'
  ],
  'food': [
    'Food Sanitation Act (식품위생법)',
    'Health Functional Food Act (건강기능식품법)',
    'Food Labeling Standards (식품표시기준)'
  ],
  'transportation': [
    'Transportation Business Act (여객자동차운수사업법)',
    'Road Traffic Act (도로교통법)',
    'Automobile Management Act (자동차관리법)'
  ],
  'accommodation': [
    'Tourism Promotion Act (관광진흥법)',
    'Public Health Control Act (공중위생관리법)',
    'Building Act (건축법)'
  ]
};

const COST_ESTIMATES = {
  licenses: { min: 5000000, max: 15000000 }, // ₩5M-15M
  legal: { min: 2000000, max: 8000000 }, // ₩2M-8M
  compliance: { min: 1000000, max: 3000000 } // ₩1M-3M per month
};

const KOREAN_MARKET_LEADERS = {
  'fintech': ['Kakao Pay - 시장 점유율 85%', 'Toss - 누적 사용자 2,000만명', 'PAYCO - 네이버 생태계'],
  'ecommerce': ['Coupang - 기업가치 60조원, 아마존 압도', '11st - SK 그룹 계열', 'Gmarket - 이베이 코리아'],
  'food_delivery': ['Baemin - 시장 점유율 80%, 딜리버리히어로 매각', 'Yogiyo - 독일 딜리버리히어로 소유', 'Coupang Eats - 쿠팡 생태계'],
  'transportation': ['Kakao T - 시장 점유율 98%, 사용자 2,300만명', 'Tmap - SK텔레콤, 내비게이션+택시', 'Socar - 카셰어링 1위'],
  'accommodation': ['Yanolja - 국내 숙박 1위, 야놀자 그룹', '여기어때 - 위메프 계열', 'Agoda Korea - 부킹홀딩스 계열']
};

function categorizeIdea(ideaText: string): string {
  const text = ideaText.toLowerCase();
  
  if (text.includes('payment') || text.includes('fintech') || text.includes('bank') || text.includes('loan')) {
    return 'fintech';
  }
  if (text.includes('ecommerce') || text.includes('shopping') || text.includes('marketplace') || text.includes('retail')) {
    return 'ecommerce';
  }
  if (text.includes('health') || text.includes('medical') || text.includes('hospital') || text.includes('doctor')) {
    return 'healthcare';
  }
  if (text.includes('food') || text.includes('delivery') || text.includes('restaurant') || text.includes('meal')) {
    return 'food';
  }
  if (text.includes('transport') || text.includes('taxi') || text.includes('ride') || text.includes('car') || text.includes('uber')) {
    return 'transportation';
  }
  if (text.includes('hotel') || text.includes('accommodation') || text.includes('airbnb') || text.includes('stay')) {
    return 'accommodation';
  }
  
  return 'general';
}

function calculateRiskScore(category: string, ideaText: string): number {
  const text = ideaText.toLowerCase();
  let baseRisk = 40;
  
  // High-risk indicators
  if (text.includes('personal data') || text.includes('user data')) baseRisk += 20;
  if (text.includes('payment') || text.includes('money')) baseRisk += 15;
  if (text.includes('medical') || text.includes('health')) baseRisk += 15;
  if (text.includes('children') || text.includes('minors')) baseRisk += 10;
  if (text.includes('international') || text.includes('cross-border')) baseRisk += 10;
  
  // Category-specific risks
  if (category === 'fintech') baseRisk += 25;
  if (category === 'healthcare') baseRisk += 20;
  if (category === 'transportation' && text.includes('ride')) baseRisk += 30; // Uber-like services
  if (category === 'accommodation' && text.includes('share')) baseRisk += 25; // Airbnb-like services
  
  // Cap at 95 to leave room for improvement
  return Math.min(baseRisk, 95);
}

function getRelevantCompetitors(category: string): string[] {
  return KOREAN_MARKET_LEADERS[category as keyof typeof KOREAN_MARKET_LEADERS] || [];
}

function getKoreanSuccessStories(category: string): string[] {
  const successStories = {
    'fintech': [
      'Toss: 간편 송금에서 시작해 종합 금융 플랫폼으로 확장',
      'Kakao Pay: 카카오톡 연동으로 사용자 기반 확보 후 금융 서비스 다변화'
    ],
    'ecommerce': [
      'Coupang: 아마존 모델을 한국에 맞게 조정, 로켓배송으로 차별화',
      '11st: 오픈마켓에서 시작해 라이브 커머스로 진화'
    ],
    'food_delivery': [
      'Baedal Minjok: 한국인 취향에 맞는 UI/UX와 마케팅으로 시장 장악',
      'Yogiyo: 요기요가요~ 브랜딩으로 친근함 어필, 빠른 배달 시스템 구축'
    ],
    'transportation': [
      'Kakao T: 기존 택시 시스템과 협력하며 규제 준수, 카카오 생태계 활용',
      'Socar: 카셰어링이라는 새로운 카테고리 창조, 보험사와 파트너십'
    ],
    'accommodation': [
      'Yanolja: 모텔 예약에서 시작해 종합 여행 플랫폼으로 확장',
      '여기어때: 실시간 예약 시스템과 할인 혜택으로 차별화'
    ]
  };
  
  return successStories[category as keyof typeof successStories] || [
    '해당 분야의 성공한 한국 기업 사례를 추가 분석이 필요합니다'
  ];
}

function getRegulations(category: string): string[] {
  return REGULATION_DATABASE[category as keyof typeof REGULATION_DATABASE] || [
    'Personal Information Protection Act (개인정보보호법)',
    'Electronic Commerce Consumer Protection Act',
    'Telecommunications Business Act'
  ];
}

function generateCostEstimate() {
  const licenses = Math.floor(Math.random() * (COST_ESTIMATES.licenses.max - COST_ESTIMATES.licenses.min) + COST_ESTIMATES.licenses.min);
  const legal = Math.floor(Math.random() * (COST_ESTIMATES.legal.max - COST_ESTIMATES.legal.min) + COST_ESTIMATES.legal.min);
  const compliance = Math.floor(Math.random() * (COST_ESTIMATES.compliance.max - COST_ESTIMATES.compliance.min) + COST_ESTIMATES.compliance.min);

  return {
    licenses: `₩${licenses.toLocaleString()} - ₩${(licenses * 1.5).toLocaleString()}`,
    legal: `₩${legal.toLocaleString()} - ₩${(legal * 1.2).toLocaleString()}`,
    compliance: `₩${compliance.toLocaleString()}/월`
  };
}

function getTimeline(riskScore: number): string {
  if (riskScore > 80) return '12-18 months to regulatory approval';
  if (riskScore > 60) return '6-12 months to regulatory approval';
  if (riskScore > 40) return '3-6 months to regulatory approval';
  return '1-3 months to regulatory approval';
}

function getVerdict(riskScore: number): string {
  if (riskScore > 80) return 'HIGH RISK - CONSIDER MAJOR PIVOT';
  if (riskScore > 60) return 'MODERATE RISK - SIGNIFICANT PREPARATION NEEDED';
  if (riskScore > 40) return 'PROCEED WITH CAUTION';
  return 'LOW RISK - GOOD TO PROCEED';
}

export async function POST(req: NextRequest) {
  try {
    const { idea } = await req.json();
    
    if (!idea || idea.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: 'Idea description must be at least 10 characters long' },
        { status: 400 }
      );
    }

    // Simulate analysis delay for better UX
    await new Promise(resolve => setTimeout(resolve, 2000));

    const category = categorizeIdea(idea);
    const riskScore = calculateRiskScore(category, idea);
    const regulations = getRegulations(category);
    const costs = generateCostEstimate();
    const competitors = getRelevantCompetitors(category);
    const successStories = getKoreanSuccessStories(category);
    const timeline = getTimeline(riskScore);
    const verdict = getVerdict(riskScore);

    // Add some realistic failure examples based on the category
    const failureExamples = [];
    if (category === 'transportation') {
      failureExamples.push('Uber failed due to Transportation Business Act requirements');
    }
    if (category === 'accommodation') {
      failureExamples.push('Airbnb restricted due to Tourism Promotion Act licensing');
    }
    if (category === 'fintech') {
      failureExamples.push('PayPal withdrew due to Electronic Financial Transaction Act complexities');
    }

    const analysis = {
      category,
      riskScore,
      regulations,
      costs,
      competitors: competitors.length > 0 ? competitors : [
        'Multiple Korean incumbents identified',
        'Strong local competition expected',
        'Market dominated by Korean companies'
      ],
      successStories,
      timeline,
      verdict,
      failureExamples,
      keyInsights: [
        `${category} 분야로 분류됨`,
        `${regulations.length}개 주요 규제 확인됨`,
        `전체 컴플라이언스 완료까지 ${Math.floor(regulations.length * 2)}-${Math.floor(regulations.length * 4)}개월 예상`,
        competitors.length > 0 ? `기존 한국 강자들과 경쟁 필요` : '현지 경쟁 환경 추가 분석 필요'
      ],
      recommendations: riskScore > 70 ? [
        '한국 규제 전문 변호사와 즉시 상담',
        '비즈니스 모델 대폭 수정 검토',
        '성공한 현지 기업과의 파트너십 또는 라이선스 모델 고려',
        '규제 준수 비용 ₩20-50M 확보',
        '12개월 이상의 규제 준비 기간 계획'
      ] : riskScore > 40 ? [
        '한국 법무법인과 조기 계약',
        '규제 준수 비용 ₩10-20M 확보',
        '기존 한국 기업과 파트너십 고려',
        '6개월 규제 준비 타임라인 계획',
        '경쟁사 현지화 전략 상세 분석'
      ] : [
        '일반적인 규제 준수 절차 예상',
        '라이선스 및 법무 비용 ₩5-10M 예산',
        '3개월 규제 승인 타임라인 목표',
        '시장 진입을 위한 현지 파트너십 고려',
        '개발 중 규제 변화 지속 모니터링'
      ]
    };

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      analysis
    });

  } catch (error) {
    console.error('Analysis API error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to analyze business idea',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}