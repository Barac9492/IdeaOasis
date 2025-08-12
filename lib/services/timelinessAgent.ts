/**
 * Timeliness Detection Agent for Newsletter Content
 * Analyzes news relevance based on current date and determines content priority
 */

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  publishDate: Date;
  effectiveDate?: Date;
  deadlineDate?: Date;
  source: string;
  category: 'regulatory' | 'policy' | 'announcement' | 'deadline' | 'market';
  urgency: 'critical' | 'high' | 'medium' | 'low';
}

export interface TimelinessScore {
  score: number; // 0-100
  relevance: 'immediate' | 'urgent' | 'relevant' | 'background' | 'stale';
  reasoning: string[];
  actionRequired: boolean;
  daysUntilRelevant?: number;
  daysUntilStale?: number;
}

export interface TimelinessAnalysis {
  currentDate: Date;
  totalItems: number;
  prioritizedItems: {
    item: NewsItem;
    timelinessScore: TimelinessScore;
  }[];
  recommendations: {
    include: NewsItem[];
    defer: NewsItem[];
    archive: NewsItem[];
  };
  summary: string;
}

export class TimelinessAgent {
  private readonly TODAY: Date;
  
  constructor() {
    this.TODAY = new Date();
    // Normalize to start of day for consistent comparisons
    this.TODAY.setHours(0, 0, 0, 0);
  }

  /**
   * Main analysis method - determines which news items are timely and relevant
   */
  async analyzeTimeliness(newsItems: NewsItem[]): Promise<TimelinessAnalysis> {
    console.log(`🕐 TIMELINESS AGENT: Analyzing ${newsItems.length} news items for ${this.TODAY.toLocaleDateString('ko-KR')}`);

    const prioritizedItems = await Promise.all(
      newsItems.map(async (item) => ({
        item,
        timelinessScore: await this.calculateTimelinessScore(item)
      }))
    );

    // Sort by timeliness score (highest first)
    prioritizedItems.sort((a, b) => b.timelinessScore.score - a.timelinessScore.score);

    const recommendations = this.generateRecommendations(prioritizedItems);
    const summary = this.generateSummary(prioritizedItems, recommendations);

    return {
      currentDate: this.TODAY,
      totalItems: newsItems.length,
      prioritizedItems,
      recommendations,
      summary
    };
  }

  /**
   * Calculate timeliness score for a news item based on multiple factors
   */
  private async calculateTimelinessScore(item: NewsItem): Promise<TimelinessScore> {
    const reasoning: string[] = [];
    let score = 50; // Base score
    let relevance: TimelinessScore['relevance'] = 'relevant';
    let actionRequired = false;
    let daysUntilRelevant: number | undefined;
    let daysUntilStale: number | undefined;

    // 1. Check publication freshness
    const daysSincePublished = this.daysDifference(item.publishDate, this.TODAY);
    if (daysSincePublished <= 1) {
      score += 30;
      reasoning.push(`매우 최신 정보 (${daysSincePublished}일 전 발표)`);
    } else if (daysSincePublished <= 7) {
      score += 20;
      reasoning.push(`최근 정보 (${daysSincePublished}일 전 발표)`);
    } else if (daysSincePublished <= 30) {
      score += 10;
      reasoning.push(`관련 정보 (${daysSincePublished}일 전 발표)`);
    } else if (daysSincePublished <= 90) {
      score -= 10;
      reasoning.push(`다소 오래된 정보 (${daysSincePublished}일 전 발표)`);
      daysUntilStale = Math.max(0, 120 - daysSincePublished);
    } else {
      score -= 30;
      reasoning.push(`매우 오래된 정보 (${daysSincePublished}일 전 발표)`);
      daysUntilStale = 0;
    }

    // 2. Check effective date relevance
    if (item.effectiveDate) {
      const daysUntilEffective = this.daysDifference(this.TODAY, item.effectiveDate);
      
      if (daysUntilEffective === 0) {
        score += 40;
        reasoning.push('오늘 시행되는 규제');
        actionRequired = true;
      } else if (daysUntilEffective > 0 && daysUntilEffective <= 7) {
        score += 35;
        reasoning.push(`${daysUntilEffective}일 후 시행 - 즉시 준비 필요`);
        actionRequired = true;
        daysUntilRelevant = daysUntilEffective;
      } else if (daysUntilEffective > 7 && daysUntilEffective <= 30) {
        score += 25;
        reasoning.push(`${daysUntilEffective}일 후 시행 - 준비 시간 여유 있음`);
        daysUntilRelevant = daysUntilEffective;
      } else if (daysUntilEffective > 30 && daysUntilEffective <= 180) {
        score += 15;
        reasoning.push(`${daysUntilEffective}일 후 시행 - 장기 계획 필요`);
        daysUntilRelevant = daysUntilEffective;
      } else if (daysUntilEffective < 0) {
        score -= 20;
        reasoning.push(`${Math.abs(daysUntilEffective)}일 전 시행된 규제 - 이미 적용됨`);
      }
    }

    // 3. Check deadline urgency
    if (item.deadlineDate) {
      const daysUntilDeadline = this.daysDifference(this.TODAY, item.deadlineDate);
      
      if (daysUntilDeadline === 0) {
        score += 50;
        reasoning.push('오늘이 마감일 - 긴급 조치 필요');
        actionRequired = true;
        relevance = 'urgent';
      } else if (daysUntilDeadline > 0 && daysUntilDeadline <= 3) {
        score += 45;
        reasoning.push(`${daysUntilDeadline}일 후 마감 - 매우 긴급`);
        actionRequired = true;
        relevance = 'urgent';
      } else if (daysUntilDeadline > 3 && daysUntilDeadline <= 7) {
        score += 35;
        reasoning.push(`${daysUntilDeadline}일 후 마감 - 신속 대응 필요`);
        actionRequired = true;
        relevance = 'urgent';
      } else if (daysUntilDeadline > 7 && daysUntilDeadline <= 30) {
        score += 25;
        reasoning.push(`${daysUntilDeadline}일 후 마감 - 계획적 대응 가능`);
        daysUntilRelevant = daysUntilDeadline;
      } else if (daysUntilDeadline < 0) {
        score -= 40;
        reasoning.push(`${Math.abs(daysUntilDeadline)}일 전 마감됨 - 놓친 기한`);
        daysUntilStale = 0;
      }
    }

    // 4. Category-based adjustments
    switch (item.category) {
      case 'regulatory':
        score += 15;
        reasoning.push('규제 정보 - 높은 중요도');
        break;
      case 'deadline':
        score += 20;
        reasoning.push('마감 정보 - 행동 필요');
        actionRequired = true;
        break;
      case 'announcement':
        score += 10;
        reasoning.push('정부 발표 - 정책 변화');
        break;
      case 'policy':
        score += 12;
        reasoning.push('정책 정보 - 사업 영향');
        break;
      case 'market':
        score += 8;
        reasoning.push('시장 정보 - 참고사항');
        break;
    }

    // 5. Urgency level adjustments
    switch (item.urgency) {
      case 'critical':
        score += 25;
        reasoning.push('최고 우선순위');
        actionRequired = true;
        break;
      case 'high':
        score += 15;
        reasoning.push('높은 우선순위');
        break;
      case 'medium':
        score += 5;
        reasoning.push('중간 우선순위');
        break;
      case 'low':
        score -= 5;
        reasoning.push('낮은 우선순위');
        break;
    }

    // 6. Source credibility
    if (this.isOfficialGovernmentSource(item.source)) {
      score += 15;
      reasoning.push('정부 공식 출처 - 높은 신뢰도');
    } else if (this.isReliableNewsSource(item.source)) {
      score += 8;
      reasoning.push('신뢰할 수 있는 언론 출처');
    } else {
      score -= 5;
      reasoning.push('출처 신뢰도 검증 필요');
    }

    // Normalize score and determine relevance
    score = Math.max(0, Math.min(100, score));

    if (score >= 85) {
      relevance = 'immediate';
    } else if (score >= 70) {
      relevance = 'urgent';
    } else if (score >= 50) {
      relevance = 'relevant';
    } else if (score >= 30) {
      relevance = 'background';
    } else {
      relevance = 'stale';
    }

    return {
      score,
      relevance,
      reasoning,
      actionRequired,
      daysUntilRelevant,
      daysUntilStale
    };
  }

  /**
   * Generate recommendations for newsletter inclusion
   */
  private generateRecommendations(prioritizedItems: { item: NewsItem; timelinessScore: TimelinessScore }[]) {
    const include: NewsItem[] = [];
    const defer: NewsItem[] = [];
    const archive: NewsItem[] = [];

    for (const { item, timelinessScore } of prioritizedItems) {
      if (timelinessScore.relevance === 'immediate' || timelinessScore.relevance === 'urgent') {
        include.push(item);
      } else if (timelinessScore.relevance === 'relevant') {
        if (timelinessScore.score >= 60) {
          include.push(item);
        } else {
          defer.push(item);
        }
      } else if (timelinessScore.relevance === 'background') {
        defer.push(item);
      } else {
        archive.push(item);
      }
    }

    return { include, defer, archive };
  }

  /**
   * Generate analysis summary
   */
  private generateSummary(
    prioritizedItems: { item: NewsItem; timelinessScore: TimelinessScore }[],
    recommendations: { include: NewsItem[]; defer: NewsItem[]; archive: NewsItem[] }
  ): string {
    const immediateCount = prioritizedItems.filter(p => p.timelinessScore.relevance === 'immediate').length;
    const urgentCount = prioritizedItems.filter(p => p.timelinessScore.relevance === 'urgent').length;
    const actionRequiredCount = prioritizedItems.filter(p => p.timelinessScore.actionRequired).length;
    
    let summary = `📊 TIMELINESS ANALYSIS (${this.TODAY.toLocaleDateString('ko-KR')})\n\n`;
    
    summary += `🎯 총 ${prioritizedItems.length}개 뉴스 항목 분석\n`;
    summary += `⚡ 즉시 관련: ${immediateCount}개\n`;
    summary += `🚨 긴급: ${urgentCount}개\n`;
    summary += `🎯 행동 필요: ${actionRequiredCount}개\n\n`;
    
    summary += `📝 뉴스레터 포함 권장: ${recommendations.include.length}개\n`;
    summary += `⏳ 다음 이슈로 연기: ${recommendations.defer.length}개\n`;
    summary += `📁 아카이브: ${recommendations.archive.length}개\n\n`;
    
    if (immediateCount > 0) {
      summary += `🔥 즉시 주목: ${immediateCount}개 항목이 오늘 독자들에게 즉시 필요한 정보입니다.\n`;
    }
    
    if (actionRequiredCount > 0) {
      summary += `⚠️ 행동 필요: ${actionRequiredCount}개 항목이 독자들의 즉시 대응을 요구합니다.\n`;
    }

    return summary;
  }

  /**
   * Utility methods
   */
  private daysDifference(startDate: Date, endDate: Date): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    return Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }

  private isOfficialGovernmentSource(source: string): boolean {
    const govDomains = [
      'fsc.go.kr', 'msit.go.kr', 'pipc.go.kr', 'mohw.go.kr', 
      'smes.go.kr', 'assembly.go.kr', 'law.go.kr', 'moef.go.kr'
    ];
    return govDomains.some(domain => source.includes(domain));
  }

  private isReliableNewsSource(source: string): boolean {
    const reliableSources = [
      'yna.co.kr', 'hankyung.com', 'etnews.com', 'mk.co.kr',
      'yonhapnews.co.kr', 'newsis.com', 'edaily.co.kr'
    ];
    return reliableSources.some(domain => source.includes(domain));
  }

  /**
   * Create a news item from raw content (helper method)
   */
  static createNewsItem(
    title: string,
    content: string,
    publishDate: Date,
    source: string,
    options: {
      effectiveDate?: Date;
      deadlineDate?: Date;
      category?: NewsItem['category'];
      urgency?: NewsItem['urgency'];
    } = {}
  ): NewsItem {
    return {
      id: `news_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      content,
      publishDate,
      effectiveDate: options.effectiveDate,
      deadlineDate: options.deadlineDate,
      source,
      category: options.category || 'announcement',
      urgency: options.urgency || 'medium'
    };
  }

  /**
   * Get current date information for debugging
   */
  getCurrentDateInfo(): {
    currentDate: Date;
    dateString: string;
    weekday: string;
    quarter: string;
  } {
    const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const quarter = Math.ceil((this.TODAY.getMonth() + 1) / 3);
    
    return {
      currentDate: this.TODAY,
      dateString: this.TODAY.toLocaleDateString('ko-KR'),
      weekday: weekdays[this.TODAY.getDay()],
      quarter: `${this.TODAY.getFullYear()}년 ${quarter}분기`
    };
  }
}