// lib/services/trendAnalyzer.ts
import type { TrendAnalysis, Idea } from '../types';

export class TrendAnalyzer {
  
  /**
   * Analyzes search trends for a given idea or keyword
   * Simulates real trend data for MVP - can be replaced with actual API calls
   */
  static async analyzeTrends(idea: Idea): Promise<TrendAnalysis> {
    const keyword = this.extractMainKeyword(idea);
    
    // In a real implementation, this would call actual search APIs
    // For now, we simulate realistic trend data
    return this.simulateTrendData(keyword, idea);
  }
  
  /**
   * Extracts the main keyword from an idea for trend analysis
   */
  private static extractMainKeyword(idea: Idea): string {
    const { title, tags = [], sector } = idea;
    
    // Priority: explicit sector > first tag > derived from title
    if (sector) return sector;
    if (tags.length > 0) return tags[0];
    
    // Extract key terms from title
    const titleWords = title.toLowerCase().split(/\s+/)
      .filter(word => word.length > 2)
      .filter(word => !['the', 'and', 'for', 'with', 'app', 'service', 'platform'].includes(word));
    
    return titleWords[0] || title.substring(0, 20);
  }
  
  /**
   * Simulates realistic trend data based on idea characteristics
   * In production, replace with actual API calls to search engines
   */
  private static simulateTrendData(keyword: string, idea: Idea): TrendAnalysis {
    // Base metrics influenced by idea characteristics
    let baseVolume = Math.floor(Math.random() * 50000) + 5000;
    let baseGrowth = (Math.random() - 0.5) * 40; // -20% to +20%
    
    // Adjust based on sector popularity
    const popularSectors = ['ai', '인공지능', 'food', '음식', 'health', '건강', 'delivery', '배송'];
    const emergingSectors = ['web3', 'blockchain', '블록체인', 'metaverse', '메타버스'];
    const nicheSectors = ['b2b', 'enterprise', '기업', 'productivity', '생산성'];
    
    const sectorKeyword = keyword.toLowerCase();
    
    if (popularSectors.some(s => sectorKeyword.includes(s))) {
      baseVolume *= 1.5;
      baseGrowth += 5;
    } else if (emergingSectors.some(s => sectorKeyword.includes(s))) {
      baseVolume *= 0.7;
      baseGrowth += 15; // High growth for emerging sectors
    } else if (nicheSectors.some(s => sectorKeyword.includes(s))) {
      baseVolume *= 0.4;
      baseGrowth += 8; // Steady growth for niche
    }
    
    // Add seasonality simulation
    const currentMonth = new Date().getMonth();
    let seasonalityNote = '';
    
    if (['food', '음식', 'restaurant', '레스토랑'].some(s => sectorKeyword.includes(s))) {
      if ([11, 0, 1].includes(currentMonth)) { // Winter months
        baseVolume *= 1.2;
        seasonalityNote = '겨울철 높은 관심도';
      }
    } else if (['fitness', '피트니스', 'health', '건강'].some(s => sectorKeyword.includes(s))) {
      if ([0, 1].includes(currentMonth)) { // New Year
        baseVolume *= 1.4;
        seasonalityNote = '신년 관심도 증가';
      }
    }
    
    // Competition level based on volume and growth
    let competitionLevel: 'low' | 'medium' | 'high' = 'medium';
    if (baseVolume > 30000 && baseGrowth > 10) {
      competitionLevel = 'high';
    } else if (baseVolume < 10000 || baseGrowth < 0) {
      competitionLevel = 'low';
    }
    
    // Generate related keywords
    const relatedKeywords = this.generateRelatedKeywords(keyword, idea);
    
    return {
      keyword,
      searchVolume: Math.floor(baseVolume),
      growthRate: Math.round(baseGrowth * 10) / 10,
      seasonality: seasonalityNote || '계절성 영향 없음',
      competitionLevel,
      relatedKeywords,
      lastAnalyzed: new Date().toISOString()
    };
  }
  
  /**
   * Generates related keywords based on the main keyword and idea context
   */
  private static generateRelatedKeywords(keyword: string, idea: Idea): string[] {
    const related: string[] = [];
    const { tags = [], sector, businessModel = '' } = idea;
    
    // Add tags as related keywords
    related.push(...tags.slice(0, 3));
    
    // Add sector-specific related terms
    const keywordLower = keyword.toLowerCase();
    
    if (keywordLower.includes('food') || keywordLower.includes('음식')) {
      related.push('배달앱', '레스토랑', '요리', '음식 주문');
    } else if (keywordLower.includes('health') || keywordLower.includes('건강')) {
      related.push('웰니스', '피트니스', '의료', '건강관리');
    } else if (keywordLower.includes('ai') || keywordLower.includes('인공지능')) {
      related.push('머신러닝', '자동화', '챗봇', 'AI 서비스');
    } else if (keywordLower.includes('finance') || keywordLower.includes('금융')) {
      related.push('핀테크', '결제', '투자', '금융서비스');
    }
    
    // Add business model related terms
    if (businessModel.toLowerCase().includes('subscription')) {
      related.push('구독 서비스', '정기 결제');
    } else if (businessModel.toLowerCase().includes('marketplace')) {
      related.push('마켓플레이스', '플랫폼', '중개');
    }
    
    // Generic related terms
    related.push('스타트업', '비즈니스', '서비스');
    
    // Remove duplicates and limit to 5
    return [...new Set(related)].slice(0, 5);
  }
  
  /**
   * Calculates a trend score (0-100) based on various factors
   */
  static calculateTrendScore(analysis: TrendAnalysis): number {
    const { searchVolume, growthRate, competitionLevel } = analysis;
    
    // Volume score (0-40 points)
    const volumeScore = Math.min(40, (searchVolume / 1000) * 2);
    
    // Growth score (0-40 points)
    const growthScore = Math.max(0, Math.min(40, (growthRate + 20) * 1.5));
    
    // Competition score (0-20 points, inverse relationship)
    let competitionScore = 20;
    if (competitionLevel === 'high') competitionScore = 5;
    else if (competitionLevel === 'medium') competitionScore = 12;
    
    const totalScore = volumeScore + growthScore + competitionScore;
    return Math.round(Math.min(100, totalScore));
  }
  
  /**
   * Updates an idea with fresh trend data
   */
  static async updateIdeaTrendData(idea: Idea): Promise<Idea> {
    const analysis = await this.analyzeTrends(idea);
    const trendScore = this.calculateTrendScore(analysis);
    
    return {
      ...idea,
      trendData: {
        keyword: analysis.keyword,
        growth: `${analysis.growthRate > 0 ? '+' : ''}${analysis.growthRate}%`,
        monthlySearches: analysis.searchVolume.toLocaleString(),
        trendScore,
        lastUpdated: analysis.lastAnalyzed
      }
    };
  }
}