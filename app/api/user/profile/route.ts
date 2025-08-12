import { NextRequest, NextResponse } from 'next/server';

// In production, this would integrate with database
const userProfiles = new Map();

export async function POST(req: NextRequest) {
  try {
    const { userId, profile } = await req.json();
    
    if (!userId || !profile) {
      return NextResponse.json(
        { error: 'User ID and profile are required' },
        { status: 400 }
      );
    }

    // Generate personalized insights based on profile
    const insights = generatePersonalizedInsights(profile);
    
    // Save profile with insights
    const enrichedProfile = {
      ...profile,
      createdAt: new Date().toISOString(),
      insights,
      complianceScore: calculateComplianceScore(profile),
      riskLevel: calculateRiskLevel(profile),
      recommendations: generateRecommendations(profile)
    };

    userProfiles.set(userId, enrichedProfile);

    return NextResponse.json({
      success: true,
      message: 'Profile saved successfully',
      insights,
      complianceScore: enrichedProfile.complianceScore,
      riskLevel: enrichedProfile.riskLevel
    });

  } catch (error) {
    console.error('Profile save error:', error);
    return NextResponse.json(
      { error: 'Failed to save profile' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const profile = userProfiles.get(userId);
    
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      profile
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

function generatePersonalizedInsights(profile: any): any[] {
  const insights = [];
  
  // Industry-specific insights
  const industryInsights: Record<string, string[]> = {
    fintech: [
      '개인정보보호법 강화로 KYC 프로세스 재검토가 필요합니다',
      '전자금융거래법 개정으로 새로운 보안 요구사항이 적용됩니다',
      '마이데이터 사업 확대로 데이터 활용 기회가 증가하고 있습니다'
    ],
    healthtech: [
      '원격의료 규제 완화로 새로운 서비스 기회가 생겼습니다',
      '의료기기법 개정으로 AI 진단 도구 허가가 간소화됩니다',
      '환자 데이터 보호 강화로 보안 시스템 업그레이드가 필요합니다'
    ],
    ecommerce: [
      '전자상거래법 광고 규제 강화로 마케팅 전략 재검토가 필요합니다',
      '소비자 보호법 강화로 환불/교환 정책 업데이트가 필요합니다',
      '개인정보 처리 방침 개정이 시급합니다'
    ]
  };

  if (profile.industry && industryInsights[profile.industry]) {
    insights.push(...industryInsights[profile.industry].map(insight => ({
      type: 'industry',
      message: insight,
      priority: 'high'
    })));
  }

  // Urgency-based insights
  if (profile.urgencyLevel === 'urgent') {
    insights.push({
      type: 'urgent',
      message: '긴급 대응이 필요한 규제 변화가 감지되었습니다. 즉시 법무팀과 상담을 권장합니다.',
      priority: 'critical'
    });
  }

  // Data type specific insights
  if (profile.dataTypes.includes('개인정보')) {
    insights.push({
      type: 'compliance',
      message: '개인정보 처리량 증가 시 개인정보보호 담당자 지정이 의무화됩니다.',
      priority: 'medium'
    });
  }

  // Challenge-based insights
  if (profile.currentChallenges.includes('규제 변화 모니터링')) {
    insights.push({
      type: 'solution',
      message: '실시간 규제 모니터링 시스템을 통해 변화를 24시간 추적할 수 있습니다.',
      priority: 'high'
    });
  }

  return insights;
}

function calculateComplianceScore(profile: any): number {
  let score = 50; // Base score

  // Positive factors
  if (profile.currentCompliance.length > 3) score += 20;
  if (profile.businessType === 'enterprise') score += 10;
  if (profile.dataTypes.length <= 3) score += 10;
  if (profile.currentChallenges.includes('컴플라이언스 비용 관리')) score += 5;

  // Negative factors
  if (profile.urgencyLevel === 'urgent') score -= 15;
  if (profile.currentCompliance.length === 0) score -= 20;
  if (profile.dataTypes.includes('민감정보')) score -= 10;

  return Math.max(0, Math.min(100, score));
}

function calculateRiskLevel(profile: any): string {
  const score = calculateComplianceScore(profile);
  
  if (score >= 80) return 'low';
  if (score >= 60) return 'medium';
  if (score >= 40) return 'high';
  return 'critical';
}

function generateRecommendations(profile: any): string[] {
  const recommendations = [];
  const riskLevel = calculateRiskLevel(profile);
  
  if (riskLevel === 'critical') {
    recommendations.push('즉시 법무 전문가와 상담하여 컴플라이언스 현황을 점검하세요');
    recommendations.push('핵심 규제 요구사항 체크리스트를 작성하고 우선순위를 정하세요');
  }
  
  if (riskLevel === 'high') {
    recommendations.push('규제 대응 계획을 수립하고 단계적으로 실행하세요');
    recommendations.push('직원 대상 컴플라이언스 교육을 실시하세요');
  }

  // Industry specific recommendations
  const industryRecs: Record<string, string[]> = {
    fintech: [
      'PCI DSS 인증 취득을 검토하세요',
      '금융위원회 가이드라인을 정기적으로 모니터링하세요'
    ],
    healthtech: [
      '의료기기 허가 절차를 미리 준비하세요',
      'HIPAA 상당 수준의 데이터 보호 체계를 구축하세요'
    ],
    ecommerce: [
      '소비자 분쟁 대응 프로세스를 정비하세요',
      '개인정보 처리 동의 절차를 강화하세요'
    ]
  };

  if (profile.industry && industryRecs[profile.industry]) {
    recommendations.push(...industryRecs[profile.industry]);
  }

  return recommendations.slice(0, 5); // Top 5 recommendations
}