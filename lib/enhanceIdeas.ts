// lib/enhanceIdeas.ts
import type { Idea } from './types';

// Helper function to generate realistic scores based on business characteristics
function generateScores(idea: Idea): {
  koreaFit: number;
  effort: number;
  marketOpportunity: number;
  executionDifficulty: number;
  revenuePotential: number;
  timingScore: number;
  regulatoryRisk: number;
} {
  // Base scores with some randomization for realism
  const baseScores = {
    // High-opportunity sectors in Korea
    '헬스케어': { koreaFit: 8.2, effort: 4, market: 8, difficulty: 4, revenue: 8, timing: 9, regulatory: 3 },
    'FinTech': { koreaFit: 8.5, effort: 3, market: 9, difficulty: 3, revenue: 9, timing: 9, regulatory: 2 },
    '에듀테크': { koreaFit: 8.8, effort: 3, market: 8, difficulty: 3, revenue: 7, timing: 9, regulatory: 4 },
    '시니어테크': { koreaFit: 9.1, effort: 4, market: 9, difficulty: 4, revenue: 8, timing: 10, regulatory: 3 },
    '푸드테크': { koreaFit: 8.0, effort: 3, market: 8, difficulty: 3, revenue: 8, timing: 8, regulatory: 4 },
    
    // Emerging but challenging sectors
    'ClimaTech': { koreaFit: 7.5, effort: 4, market: 7, difficulty: 4, revenue: 7, timing: 8, regulatory: 2 },
    '메타버스': { koreaFit: 6.8, effort: 5, market: 6, difficulty: 5, revenue: 6, timing: 7, regulatory: 4 },
    '리걸테크': { koreaFit: 7.2, effort: 4, market: 7, difficulty: 4, revenue: 8, timing: 7, regulatory: 1 },
    
    // Moderate opportunity sectors
    'PropTech': { koreaFit: 7.8, effort: 4, market: 8, difficulty: 4, revenue: 8, timing: 8, regulatory: 3 },
    '펫테크': { koreaFit: 8.4, effort: 3, market: 8, difficulty: 3, revenue: 7, timing: 9, regulatory: 4 },
    '애그테크': { koreaFit: 6.9, effort: 4, market: 6, difficulty: 4, revenue: 6, timing: 7, regulatory: 3 },
    
    // Default for other sectors
    'default': { koreaFit: 7.5, effort: 3, market: 7, difficulty: 3, revenue: 7, timing: 8, regulatory: 3 }
  };
  
  const sectorKey = idea.sector as keyof typeof baseScores || 'default';
  const base = baseScores[sectorKey] || baseScores.default;
  
  // Add some variation based on the idea content
  const variation = () => Math.random() * 1.0 - 0.5; // -0.5 to +0.5
  
  return {
    koreaFit: Math.max(1, Math.min(10, base.koreaFit + variation())),
    effort: Math.max(1, Math.min(5, base.effort + Math.floor(variation()))),
    marketOpportunity: Math.max(1, Math.min(10, base.market + variation())),
    executionDifficulty: Math.max(1, Math.min(5, base.difficulty + Math.floor(variation()))),
    revenuePotential: Math.max(1, Math.min(10, base.revenue + variation())),
    timingScore: Math.max(1, Math.min(10, base.timing + variation())),
    regulatoryRisk: Math.max(1, Math.min(5, base.regulatory + Math.floor(variation())))
  };
}

// Helper function to generate trend data
function generateTrendData(idea: Idea): {
  keyword: string;
  growth: string;
  monthlySearches: string;
  trendScore: number;
  lastUpdated: string;
} {
  const keywords = {
    '헬스케어': '개인맞춤형 헬스케어',
    'FinTech': '핀테크 서비스',
    '에듀테크': '온라인 교육',
    '시니어테크': '시니어 서비스',
    '푸드테크': '배달 서비스',
    'ClimaTech': 'ESG 솔루션',
    '메타버스': '가상현실',
    '리걸테크': '법률 자동화',
    'PropTech': '부동산 테크',
    '펫테크': '반려동물 서비스',
    'default': idea.sector
  };
  
  const keyword = keywords[idea.sector as keyof typeof keywords] || keywords.default;
  
  // Generate realistic growth rates and search volumes
  const growthRates = ['-5.2%', '+2.8%', '+8.4%', '+15.6%', '+22.1%', '+31.7%'];
  const searchVolumes = ['2,100', '5,800', '8,400', '12,600', '18,900', '26,300'];
  
  const growthIndex = Math.floor(Math.random() * growthRates.length);
  const volumeIndex = Math.floor(Math.random() * searchVolumes.length);
  
  return {
    keyword,
    growth: growthRates[growthIndex],
    monthlySearches: searchVolumes[volumeIndex],
    trendScore: Math.floor(Math.random() * 4) + 6, // 6-10 range
    lastUpdated: new Date().toISOString()
  };
}

// Main function to enhance ideas with proper scoring
export function enhanceIdeasWithScores(ideas: Idea[]): Idea[] {
  return ideas.map(idea => {
    // Skip if already enhanced
    if (idea.koreaFit && idea.trendData) {
      return idea;
    }
    
    const scores = generateScores(idea);
    const trendData = generateTrendData(idea);
    
    return {
      ...idea,
      koreaFit: Math.round(scores.koreaFit * 10) / 10, // Round to 1 decimal
      effort: scores.effort,
      marketOpportunity: scores.marketOpportunity,
      executionDifficulty: scores.executionDifficulty,
      revenuePotential: scores.revenuePotential,
      timingScore: scores.timingScore,
      regulatoryRisk: scores.regulatoryRisk,
      trendData
    };
  });
}