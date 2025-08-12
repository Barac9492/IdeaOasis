/**
 * Newsletter Timeliness Checker - Integration with existing newsletter system
 * Uses TimelinessAgent to filter and prioritize content before sending
 */

import { TimelinessAgent, NewsItem, TimelinessAnalysis } from '@/lib/services/timelinessAgent';

export interface NewsletterSection {
  title: string;
  content: string;
  publishDate?: string;
  effectiveDate?: string;
  deadlineDate?: string;
  source?: string;
  priority: 'breaking' | 'alert' | 'insight' | 'analysis' | 'background';
}

export interface TimelinessReport {
  analysis: TimelinessAnalysis;
  recommendations: {
    criticalItems: NewsItem[];
    includeInNewsletter: NewsItem[];
    deferToNext: NewsItem[];
    archive: NewsItem[];
  };
  newsletterStatus: 'ready' | 'needs_content' | 'too_stale' | 'timing_issues';
  actionItems: string[];
  confidenceScore: number;
}

export class NewsletterTimelinessChecker {
  private timelinessAgent: TimelinessAgent;

  constructor() {
    this.timelinessAgent = new TimelinessAgent();
  }

  /**
   * Main method: Check newsletter content for timeliness before sending
   */
  async checkNewsletterTimeliness(
    newsletterHtml: string, 
    subject: string
  ): Promise<TimelinessReport> {
    console.log('🕐 NEWSLETTER TIMELINESS CHECK: Analyzing content relevance...');

    // Extract news items from newsletter HTML
    const newsItems = this.extractNewsItemsFromNewsletter(newsletterHtml);
    console.log(`📰 Extracted ${newsItems.length} news items from newsletter`);

    // Run timeliness analysis
    const analysis = await this.timelinessAgent.analyzeTimeliness(newsItems);

    // Generate detailed recommendations
    const recommendations = this.generateDetailedRecommendations(analysis);

    // Determine newsletter status
    const newsletterStatus = this.determineNewsletterStatus(analysis, recommendations);

    // Generate action items
    const actionItems = this.generateActionItems(analysis, recommendations, newsletterStatus);

    // Calculate confidence score
    const confidenceScore = this.calculateConfidenceScore(analysis, recommendations);

    const report: TimelinessReport = {
      analysis,
      recommendations,
      newsletterStatus,
      actionItems,
      confidenceScore
    };

    this.logTimelinessReport(report);

    return report;
  }

  /**
   * Extract news items from newsletter HTML content
   */
  private extractNewsItemsFromNewsletter(html: string): NewsItem[] {
    const newsItems: NewsItem[] = [];

    // Extract sections with news content
    const sectionRegex = /<div class="section[^"]*"[^>]*>(.*?)<\/div>/gs;
    const matches = html.match(sectionRegex) || [];

    for (let i = 0; i < matches.length; i++) {
      const sectionHtml = matches[i];
      const newsItem = this.parseNewsItemFromSection(sectionHtml, i);
      if (newsItem) {
        newsItems.push(newsItem);
      }
    }

    return newsItems;
  }

  /**
   * Parse individual news section into NewsItem
   */
  private parseNewsItemFromSection(sectionHtml: string, index: number): NewsItem | null {
    try {
      // Extract title
      const titleMatch = sectionHtml.match(/<h[3-4][^>]*>(.*?)<\/h[3-4]>/);
      const title = titleMatch ? this.stripHtml(titleMatch[1]) : `News Item ${index + 1}`;

      // Extract content
      const content = this.stripHtml(sectionHtml);

      // Extract dates from content
      const dates = this.extractDatesFromContent(content);
      
      // Determine publish date (assume recent if not specified)
      const publishDate = dates.publishDate || new Date();

      // Extract source information
      const source = this.extractSourceFromContent(content);

      // Determine category based on section class and content
      const category = this.determineCategory(sectionHtml, content);

      // Determine urgency based on content and styling
      const urgency = this.determineUrgency(sectionHtml, content);

      return TimelinessAgent.createNewsItem(
        title,
        content,
        publishDate,
        source,
        {
          effectiveDate: dates.effectiveDate,
          deadlineDate: dates.deadlineDate,
          category,
          urgency
        }
      );
    } catch (error) {
      console.warn(`Failed to parse news item from section ${index}:`, error);
      return null;
    }
  }

  /**
   * Extract dates from content text
   */
  private extractDatesFromContent(content: string): {
    publishDate?: Date;
    effectiveDate?: Date;
    deadlineDate?: Date;
  } {
    const dates: any = {};

    // Look for Korean date patterns
    const datePattern = /(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/g;
    const dateMatches = Array.from(content.matchAll(datePattern));

    for (const match of dateMatches) {
      const dateStr = match[0];
      const year = parseInt(match[1]);
      const month = parseInt(match[2]) - 1; // JavaScript months are 0-indexed
      const day = parseInt(match[3]);
      const date = new Date(year, month, day);

      // Determine date type based on context
      const context = this.getDateContext(content, dateStr);
      
      if (context.includes('공포') || context.includes('발표')) {
        dates.publishDate = date;
      }
      if (context.includes('시행') || context.includes('적용')) {
        dates.effectiveDate = date;
      }
      if (context.includes('마감') || context.includes('기한') || context.includes('까지')) {
        dates.deadlineDate = date;
      }
    }

    return dates;
  }

  /**
   * Get context around a date mention
   */
  private getDateContext(text: string, dateStr: string, contextLength: number = 50): string {
    const index = text.indexOf(dateStr);
    if (index === -1) return '';

    const start = Math.max(0, index - contextLength);
    const end = Math.min(text.length, index + dateStr.length + contextLength);
    
    return text.substring(start, end);
  }

  /**
   * Extract source information from content
   */
  private extractSourceFromContent(content: string): string {
    // Look for government agencies
    const govAgencies = [
      '금융위원회', '과기정통부', '개인정보보호위원회', '보건복지부', 
      '중소벤처기업부', '국회', '법제처'
    ];

    for (const agency of govAgencies) {
      if (content.includes(agency)) {
        return `${agency} 공식 발표`;
      }
    }

    // Look for news sources
    const newsSources = ['연합뉴스', '한국경제신문', '전자신문', '매일경제'];
    for (const source of newsSources) {
      if (content.includes(source)) {
        return source;
      }
    }

    return '출처 미상';
  }

  /**
   * Determine news category based on content
   */
  private determineCategory(sectionHtml: string, content: string): NewsItem['category'] {
    if (sectionHtml.includes('alert-section') || content.includes('긴급') || content.includes('마감')) {
      return 'deadline';
    }
    if (content.includes('규제') || content.includes('법') || content.includes('규정')) {
      return 'regulatory';
    }
    if (content.includes('정책') || content.includes('계획')) {
      return 'policy';
    }
    if (content.includes('발표') || content.includes('공지')) {
      return 'announcement';
    }
    return 'market';
  }

  /**
   * Determine urgency based on visual cues and content
   */
  private determineUrgency(sectionHtml: string, content: string): NewsItem['urgency'] {
    if (sectionHtml.includes('breaking-badge') || content.includes('긴급') || content.includes('속보')) {
      return 'critical';
    }
    if (sectionHtml.includes('alert-section') || content.includes('주의') || content.includes('마감')) {
      return 'high';
    }
    if (sectionHtml.includes('insight-section') || content.includes('분석')) {
      return 'medium';
    }
    return 'low';
  }

  /**
   * Generate detailed recommendations based on analysis
   */
  private generateDetailedRecommendations(analysis: TimelinessAnalysis) {
    const criticalItems = analysis.prioritizedItems
      .filter(p => p.timelinessScore.relevance === 'immediate' && p.timelinessScore.actionRequired)
      .map(p => p.item);

    const includeInNewsletter = analysis.recommendations.include;
    const deferToNext = analysis.recommendations.defer;
    const archive = analysis.recommendations.archive;

    return {
      criticalItems,
      includeInNewsletter,
      deferToNext,
      archive
    };
  }

  /**
   * Determine overall newsletter status
   */
  private determineNewsletterStatus(
    analysis: TimelinessAnalysis,
    recommendations: any
  ): TimelinessReport['newsletterStatus'] {
    const immediateCount = analysis.prioritizedItems.filter(p => p.timelinessScore.relevance === 'immediate').length;
    const staleCount = analysis.prioritizedItems.filter(p => p.timelinessScore.relevance === 'stale').length;
    const totalItems = analysis.totalItems;

    if (staleCount / totalItems > 0.5) {
      return 'too_stale';
    }
    if (recommendations.includeInNewsletter.length === 0) {
      return 'needs_content';
    }
    if (immediateCount > 0 && recommendations.criticalItems.length > 0) {
      return 'ready';
    }
    if (recommendations.includeInNewsletter.length < 3) {
      return 'needs_content';
    }

    return 'ready';
  }

  /**
   * Generate actionable items based on analysis
   */
  private generateActionItems(
    analysis: TimelinessAnalysis,
    recommendations: any,
    status: TimelinessReport['newsletterStatus']
  ): string[] {
    const actionItems: string[] = [];

    if (status === 'too_stale') {
      actionItems.push('🚨 대부분의 콘텐츠가 오래되었습니다. 최신 뉴스로 교체 필요');
    }

    if (status === 'needs_content') {
      actionItems.push('📰 포함할 적절한 콘텐츠가 부족합니다. 추가 뉴스 조사 필요');
    }

    if (recommendations.criticalItems.length > 0) {
      actionItems.push(`⚡ ${recommendations.criticalItems.length}개 긴급 항목이 있습니다. 즉시 발송 고려`);
    }

    if (recommendations.deferToNext.length > recommendations.includeInNewsletter.length) {
      actionItems.push('⏳ 연기된 항목이 많습니다. 다음 이슈 계획 수립 필요');
    }

    const actionRequiredCount = analysis.prioritizedItems.filter(p => p.timelinessScore.actionRequired).length;
    if (actionRequiredCount > 0) {
      actionItems.push(`🎯 ${actionRequiredCount}개 항목이 독자 행동을 요구합니다. 명확한 가이드 제공 필요`);
    }

    if (actionItems.length === 0) {
      actionItems.push('✅ 뉴스레터 콘텐츠가 적절한 시의성을 가지고 있습니다');
    }

    return actionItems;
  }

  /**
   * Calculate overall confidence score for newsletter timeliness
   */
  private calculateConfidenceScore(analysis: TimelinessAnalysis, recommendations: any): number {
    let score = 70; // Base score

    // Adjust based on content relevance
    const relevantCount = analysis.prioritizedItems.filter(p => 
      p.timelinessScore.relevance === 'immediate' || 
      p.timelinessScore.relevance === 'urgent' || 
      p.timelinessScore.relevance === 'relevant'
    ).length;
    
    const relevanceRatio = relevantCount / analysis.totalItems;
    score += (relevanceRatio * 20); // Up to 20 points for relevance

    // Adjust based on timeliness scores
    const avgScore = analysis.prioritizedItems.reduce((sum, p) => sum + p.timelinessScore.score, 0) / analysis.totalItems;
    score += ((avgScore - 50) / 50) * 10; // Scale average score contribution

    // Bonus for critical items
    if (recommendations.criticalItems.length > 0) {
      score += Math.min(recommendations.criticalItems.length * 3, 10);
    }

    // Penalty for stale content
    const staleCount = analysis.prioritizedItems.filter(p => p.timelinessScore.relevance === 'stale').length;
    score -= (staleCount / analysis.totalItems) * 20;

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Log comprehensive timeliness report
   */
  private logTimelinessReport(report: TimelinessReport): void {
    console.log('\n🕐 NEWSLETTER TIMELINESS REPORT');
    console.log('═══════════════════════════════════');
    console.log(`📅 분석 일자: ${report.analysis.currentDate.toLocaleDateString('ko-KR')}`);
    console.log(`📊 신뢰도 점수: ${report.confidenceScore}%`);
    console.log(`🎯 상태: ${report.newsletterStatus.toUpperCase()}`);
    console.log(`📰 총 뉴스 항목: ${report.analysis.totalItems}개`);
    console.log(`⚡ 긴급 항목: ${report.recommendations.criticalItems.length}개`);
    console.log(`✅ 포함 권장: ${report.recommendations.includeInNewsletter.length}개`);
    console.log(`⏳ 연기 권장: ${report.recommendations.deferToNext.length}개`);
    console.log(`📁 아카이브: ${report.recommendations.archive.length}개`);
    
    console.log('\n📋 액션 아이템:');
    report.actionItems.forEach((item, i) => {
      console.log(`   ${i + 1}. ${item}`);
    });

    console.log('\n' + report.analysis.summary);
  }

  /**
   * Utility method to strip HTML tags
   */
  private stripHtml(html: string): string {
    return html
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Quick check method for immediate use
   */
  async quickTimelinessCheck(newsletterHtml: string): Promise<{
    canSend: boolean;
    urgentIssues: string[];
    confidence: number;
  }> {
    const report = await this.checkNewsletterTimeliness(newsletterHtml, 'Quick Check');
    
    return {
      canSend: report.newsletterStatus === 'ready' && report.confidenceScore >= 70,
      urgentIssues: report.actionItems.filter(item => item.includes('🚨') || item.includes('⚡')),
      confidence: report.confidenceScore
    };
  }
}

/**
 * Convenience function for quick timeliness validation
 */
export async function validateNewsletterTimeliness(html: string, subject: string = 'Newsletter') {
  const checker = new NewsletterTimelinessChecker();
  return await checker.checkNewsletterTimeliness(html, subject);
}