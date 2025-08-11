// lib/services/koreaFitAnalyzer.ts
import type { Idea, KoreaFitFactors } from '../types';

export class KoreaFitAnalyzer {
  
  /**
   * Analyzes how well a business idea fits the Korean market
   * Based on multiple factors including regulatory, cultural, and market conditions
   */
  static calculateKoreaFit(idea: Idea): { score: number; factors: KoreaFitFactors; recommendations: string[] } {
    const factors = this.analyzeFactors(idea);
    const score = this.calculateOverallScore(factors);
    const recommendations = this.generateRecommendations(factors, idea);
    
    return { score: Math.round(score), factors, recommendations };
  }
  
  private static analyzeFactors(idea: Idea): KoreaFitFactors {
    return {
      regulatoryFriendliness: this.assessRegulatoryEnvironment(idea),
      culturalAlignment: this.assessCulturalAlignment(idea),
      marketReadiness: this.assessMarketReadiness(idea),
      competitiveLandscape: this.assessCompetitiveLandscape(idea),
      businessInfrastructure: this.assessBusinessInfrastructure(idea)
    };
  }
  
  private static assessRegulatoryEnvironment(idea: Idea): number {
    const { sector, tags = [] } = idea;
    let score = 7; // Base score
    
    // High-regulation sectors
    const highRegSectors = ['fintech', '핀테크', 'healthcare', '헬스케어', 'education', '에듀테크', 'food', '푸드테크'];
    const mediumRegSectors = ['mobility', '모빌리티', 'logistics', '물류', 'real estate', '부동산'];
    
    if (highRegSectors.some(s => sector?.toLowerCase().includes(s) || tags.some(tag => tag.toLowerCase().includes(s)))) {
      score -= 2;
    } else if (mediumRegSectors.some(s => sector?.toLowerCase().includes(s) || tags.some(tag => tag.toLowerCase().includes(s)))) {
      score -= 1;
    }
    
    // Positive indicators for regulation-friendly areas
    const friendlyAreas = ['saas', 'b2b', 'enterprise', '엔터프라이즈', 'productivity', '생산성'];
    if (friendlyAreas.some(s => sector?.toLowerCase().includes(s) || tags.some(tag => tag.toLowerCase().includes(s)))) {
      score += 1;
    }
    
    return Math.round(Math.max(1, Math.min(10, score)));
  }
  
  private static assessCulturalAlignment(idea: Idea): number {
    const { tags = [], businessModel = '', summary3 = '' } = idea;
    let score = 6; // Base score
    
    const content = `${businessModel} ${summary3} ${tags.join(' ')}`.toLowerCase();
    
    // Korean cultural preferences
    const socialFeatures = ['community', '커뮤니티', 'social', '소셜', 'sharing', '공유'];
    const hierarchicalFeatures = ['enterprise', 'b2b', 'workplace', '직장'];
    const mobileFriendly = ['mobile', '모바일', 'app', '앱', 'messaging', '메시징'];
    const privacyConcerns = ['privacy', '개인정보', 'data', '데이터'];
    
    if (socialFeatures.some(f => content.includes(f))) score += 1.5;
    if (hierarchicalFeatures.some(f => content.includes(f))) score += 1;
    if (mobileFriendly.some(f => content.includes(f))) score += 2;
    if (privacyConcerns.some(f => content.includes(f))) score -= 0.5;
    
    // Age-sensitive services get bonus
    if (content.includes('senior') || content.includes('시니어') || content.includes('elderly')) {
      score += 1;
    }
    
    return Math.round(Math.max(1, Math.min(10, score)));
  }
  
  private static assessMarketReadiness(idea: Idea): number {
    const { trendData, metrics } = idea;
    let score = 5; // Base score
    
    // Use trend data if available
    if (trendData?.trendScore) {
      score += (trendData.trendScore / 100) * 3; // Convert trend score to readiness points
    }
    
    // Use timing score from metrics
    if (metrics?.timingScore) {
      score += (metrics.timingScore / 10) * 2;
    }
    
    // Market opportunity factor
    if (metrics?.marketOpportunity) {
      score += (metrics.marketOpportunity / 10) * 1.5;
    }
    
    return Math.round(Math.max(1, Math.min(10, score)));
  }
  
  private static assessCompetitiveLandscape(idea: Idea): number {
    const { sector, tags = [] } = idea;
    let score = 6; // Base score
    
    // Highly competitive sectors in Korea
    const highCompetitionSectors = ['delivery', '배송', 'food delivery', '음식배달', 'ride sharing', '카풀', 'social media', 'SNS'];
    const mediumCompetitionSectors = ['e-commerce', '이커머스', 'marketplace', '마켓플레이스', 'streaming', '스트리밍'];
    const lowCompetitionSectors = ['b2b saas', 'enterprise tools', '기업도구', 'productivity', '생산성'];
    
    const content = `${sector} ${tags.join(' ')}`.toLowerCase();
    
    if (highCompetitionSectors.some(s => content.includes(s))) {
      score -= 2;
    } else if (mediumCompetitionSectors.some(s => content.includes(s))) {
      score -= 1;
    } else if (lowCompetitionSectors.some(s => content.includes(s))) {
      score += 2;
    }
    
    return Math.round(Math.max(1, Math.min(10, score)));
  }
  
  private static assessBusinessInfrastructure(idea: Idea): number {
    const { tags = [], businessModel = '' } = idea;
    let score = 7; // Base score - Korea has good digital infrastructure
    
    const content = `${businessModel} ${tags.join(' ')}`.toLowerCase();
    
    // Infrastructure-dependent features
    const highInfraNeeds = ['iot', 'blockchain', '블록체인', 'ai', 'machine learning', 'autonomous'];
    const mediumInfraNeeds = ['api', 'cloud', '클라우드', 'mobile payments', '모바일결제'];
    const lowInfraNeeds = ['web', '웹', 'mobile app', '모바일앱', 'saas'];
    
    if (highInfraNeeds.some(f => content.includes(f))) {
      score -= 1;
    } else if (lowInfraNeeds.some(f => content.includes(f))) {
      score += 1;
    }
    
    return Math.round(Math.max(1, Math.min(10, score)));
  }
  
  private static calculateOverallScore(factors: KoreaFitFactors): number {
    // Weighted average of all factors
    const weights = {
      regulatoryFriendliness: 0.25,
      culturalAlignment: 0.25,
      marketReadiness: 0.20,
      competitiveLandscape: 0.15,
      businessInfrastructure: 0.15
    };
    
    return (
      factors.regulatoryFriendliness * weights.regulatoryFriendliness +
      factors.culturalAlignment * weights.culturalAlignment +
      factors.marketReadiness * weights.marketReadiness +
      factors.competitiveLandscape * weights.competitiveLandscape +
      factors.businessInfrastructure * weights.businessInfrastructure
    );
  }
  
  private static generateRecommendations(factors: KoreaFitFactors, idea: Idea): string[] {
    const recommendations: string[] = [];
    
    if (factors.regulatoryFriendliness < 5) {
      recommendations.push("규제 환경 분석이 필요합니다. 관련 법규 검토 및 정부 정책 동향을 파악하세요.");
    }
    
    if (factors.culturalAlignment < 5) {
      recommendations.push("한국 문화적 특성을 고려한 서비스 현지화가 필요합니다. 사용자 행동 패턴을 연구하세요.");
    }
    
    if (factors.marketReadiness < 5) {
      recommendations.push("시장 준비도가 낮습니다. 고객 교육이나 시장 조성 활동을 계획하세요.");
    }
    
    if (factors.competitiveLandscape < 5) {
      recommendations.push("경쟁이 치열한 분야입니다. 차별화 전략과 독특한 가치 제안이 중요합니다.");
    }
    
    if (factors.businessInfrastructure < 5) {
      recommendations.push("비즈니스 인프라 구축이 중요합니다. 기술 파트너십이나 플랫폼 활용을 고려하세요.");
    }
    
    // Positive recommendations
    if (factors.regulatoryFriendliness >= 8) {
      recommendations.push("규제 환경이 우호적입니다. 빠른 진입을 고려할 수 있습니다.");
    }
    
    if (factors.culturalAlignment >= 8) {
      recommendations.push("문화적 적합성이 높습니다. 현지 마케팅 전략을 적극 활용하세요.");
    }
    
    return recommendations;
  }
}