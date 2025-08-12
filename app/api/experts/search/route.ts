import { NextRequest, NextResponse } from 'next/server';
import { expertNetworkAgent } from '@/lib/services/expertNetworkAgent';

export async function POST(req: NextRequest) {
  try {
    const criteria = await req.json();
    
    // Validate criteria
    if (!criteria || typeof criteria !== 'object') {
      return NextResponse.json(
        { error: 'Invalid search criteria' },
        { status: 400 }
      );
    }

    const experts = await expertNetworkAgent.findExperts(criteria);

    // Add match score and reasoning for each expert
    const enrichedExperts = experts.map(expert => ({
      ...expert,
      matchReasons: generateMatchReasons(expert, criteria),
      estimatedCost: calculateEstimatedCost(expert, criteria),
      nextAvailable: calculateNextAvailability(expert)
    }));

    return NextResponse.json({
      success: true,
      experts: enrichedExperts,
      count: enrichedExperts.length,
      searchCriteria: criteria,
      suggestions: generateSearchSuggestions(criteria, enrichedExperts)
    });

  } catch (error) {
    console.error('Expert search error:', error);
    return NextResponse.json(
      { error: 'Failed to search experts', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get('featured') === 'true';
    const industry = searchParams.get('industry');
    const expertise = searchParams.get('expertise');
    const limit = parseInt(searchParams.get('limit') || '10');

    let experts = expertNetworkAgent.getExperts();

    // Apply filters
    if (featured) {
      experts = experts.filter(expert => expert.featured);
    }

    if (industry) {
      experts = experts.filter(expert => 
        expert.industries.includes(industry)
      );
    }

    if (expertise) {
      experts = experts.filter(expert =>
        expert.expertise.some(exp => 
          exp.domain.toLowerCase().includes(expertise.toLowerCase())
        )
      );
    }

    // Sort by rating and featured status
    experts = experts
      .sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return b.rating.overall - a.rating.overall;
      })
      .slice(0, limit);

    return NextResponse.json({
      success: true,
      experts,
      count: experts.length,
      filters: { featured, industry, expertise, limit }
    });

  } catch (error) {
    console.error('Expert listing error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch experts' },
      { status: 500 }
    );
  }
}

function generateMatchReasons(expert: any, criteria: any): string[] {
  const reasons = [];

  if (criteria.industry) {
    const matchingIndustries = expert.industries.filter((ind: string) =>
      criteria.industry.includes(ind)
    );
    if (matchingIndustries.length > 0) {
      reasons.push(`${matchingIndustries.join(', ')} 업계 전문성`);
    }
  }

  if (criteria.expertise) {
    const matchingExpertise = expert.expertise.filter((exp: any) =>
      criteria.expertise.some((skill: string) =>
        exp.domain.toLowerCase().includes(skill.toLowerCase())
      )
    );
    if (matchingExpertise.length > 0) {
      reasons.push(`${matchingExpertise.map((e: any) => e.domain).join(', ')} 전문가`);
    }
  }

  if (expert.rating.overall >= 4.8) {
    reasons.push('최고 평점 전문가');
  }

  if (expert.featured) {
    reasons.push('추천 전문가');
  }

  if (expert.availability.responseTime.includes('hours') && 
      parseInt(expert.availability.responseTime) <= 4) {
    reasons.push('빠른 응답 시간');
  }

  return reasons;
}

function calculateEstimatedCost(expert: any, criteria: any): any {
  const hourlyRate = expert.availability.hourlyRate;
  const minHours = expert.availability.minEngagement;
  
  let estimatedHours = minHours;
  
  // Adjust based on engagement type
  if (criteria.engagementType) {
    const typeHours = {
      'consultation': 2,
      'due_diligence': 20,
      'market_research': 40,
      'compliance_review': 15,
      'strategic_advice': 8
    };
    estimatedHours = typeHours[criteria.engagementType as keyof typeof typeHours] || estimatedHours;
  }

  return {
    hourlyRate,
    estimatedHours,
    minimumCost: hourlyRate * minHours,
    estimatedCost: hourlyRate * estimatedHours,
    currency: expert.availability.currency
  };
}

function calculateNextAvailability(expert: any): string {
  // Mock availability calculation
  if (expert.status === 'active') {
    return 'This week';
  } else if (expert.status === 'busy') {
    return 'Next month';
  } else {
    return 'To be confirmed';
  }
}

function generateSearchSuggestions(criteria: any, experts: any[]): string[] {
  const suggestions = [];

  if (experts.length === 0) {
    suggestions.push('확장된 지역에서 검색해보세요');
    suggestions.push('예산 범위를 조정해보세요');
    suggestions.push('요구 전문성을 더 넓게 설정해보세요');
  } else if (experts.length < 3) {
    suggestions.push('더 많은 전문가를 위해 필터를 조정해보세요');
    suggestions.push('유사한 전문성을 가진 전문가들도 확인해보세요');
  }

  if (criteria.budget && criteria.budget.max < 500000) {
    suggestions.push('주니어 전문가들도 고려해보세요');
  }

  return suggestions;
}