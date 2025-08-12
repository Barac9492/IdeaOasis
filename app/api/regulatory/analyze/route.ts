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
  'fintech': ['Kakao Pay', 'Toss', 'PAYCO'],
  'ecommerce': ['Coupang', '11st', 'Gmarket'],
  'food_delivery': ['Baemin', 'Yogiyo', 'Coupang Eats'],
  'transportation': ['Kakao T', 'Tmap', 'Socar'],
  'accommodation': ['Yanolja', '여기어때', 'Agoda Korea']
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
  const competitors = KOREAN_MARKET_LEADERS[category as keyof typeof KOREAN_MARKET_LEADERS] || [];
  return competitors.map(comp => `${comp} - Leading Korean player`);
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
      timeline,
      verdict,
      failureExamples,
      keyInsights: [
        `Business categorized as ${category} industry`,
        `${regulations.length} major regulations identified`,
        `Estimated ${Math.floor(regulations.length * 2)}-${Math.floor(regulations.length * 4)} months for full compliance`,
        competitors.length > 0 ? `Competing against established players like ${competitors[0]?.split(' - ')[0]}` : 'Local competition analysis required'
      ],
      recommendations: riskScore > 70 ? [
        'Consult with Korean regulatory lawyer immediately',
        'Consider significant business model modifications',
        'Research successful local alternatives and partnerships',
        'Prepare substantial regulatory compliance budget',
        'Plan 12+ month regulatory preparation period'
      ] : riskScore > 40 ? [
        'Engage Korean legal counsel early in process',
        'Set aside ₩10-20M for regulatory compliance',
        'Consider partnership with established Korean company',
        'Plan 6-month regulatory preparation timeline',
        'Conduct detailed competitor analysis'
      ] : [
        'Standard regulatory compliance process expected',
        'Budget ₩5-10M for licensing and legal setup',
        'Target 3-month regulatory timeline',
        'Consider local partnerships for market entry',
        'Monitor regulatory changes during development'
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