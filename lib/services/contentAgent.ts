import { RegulatoryUpdate } from './regulatoryMonitor';
import { Idea } from '@/lib/types';

export interface NewsletterSection {
  title: string;
  content: string;
  priority: number;
  category: 'regulatory' | 'trends' | 'ideas' | 'expert' | 'opportunity';
  metadata?: Record<string, any>;
}

export interface NewsletterEdition {
  id: string;
  issueNumber: number;
  subject: string;
  preheader: string;
  sections: NewsletterSection[];
  targetAudience: string[];
  scheduledFor?: Date;
  status: 'draft' | 'scheduled' | 'sent';
  metrics?: {
    estimatedReadTime: number;
    keyTopics: string[];
    expertQuotes: number;
    regulatoryUpdates: number;
  };
  createdAt: Date;
  publishedAt?: Date;
}

export interface ContentTemplate {
  name: string;
  format: string;
  variables: string[];
  example?: string;
}

export class ContentCreationAgent {
  private templates: Map<string, ContentTemplate> = new Map([
    ['regulatory_alert', {
      name: 'Regulatory Alert',
      format: `🚨 **[MINISTRY] 규제 업데이트**

**변경사항**: [TITLE]
**시행일**: [EFFECTIVE_DATE]
**영향도**: [IMPACT]

**핵심 내용**:
[SUMMARY]

**필요 조치**:
[ACTION_ITEMS]

**영향받는 업종**: [INDUSTRIES]

💡 **전문가 의견**: "[EXPERT_INSIGHT]"

[CTA_BUTTON]`,
      variables: ['MINISTRY', 'TITLE', 'EFFECTIVE_DATE', 'IMPACT', 'SUMMARY', 'ACTION_ITEMS', 'INDUSTRIES', 'EXPERT_INSIGHT', 'CTA_BUTTON']
    }],
    ['trend_analysis', {
      name: 'Trend Analysis',
      format: `📊 **이번 주 주목할 트렌드: [TREND_NAME]**

[TREND_GRAPH]

**성장률**: [GROWTH_RATE]
**검색량 증가**: [SEARCH_VOLUME]

**왜 지금 주목해야 하나?**
[WHY_NOW]

**선도 기업들의 움직임**:
[COMPANY_EXAMPLES]

**당신의 비즈니스에 적용하기**:
[APPLICATION_TIPS]

[RELATED_IDEAS]`,
      variables: ['TREND_NAME', 'TREND_GRAPH', 'GROWTH_RATE', 'SEARCH_VOLUME', 'WHY_NOW', 'COMPANY_EXAMPLES', 'APPLICATION_TIPS', 'RELATED_IDEAS']
    }],
    ['idea_spotlight', {
      name: 'Idea Spotlight',
      format: `💡 **이번 주의 아이디어: [IDEA_TITLE]**

**Korea Fit Score**: [KOREA_FIT]/10
**예상 투자 규모**: [INVESTMENT]
**예상 수익**: [REVENUE]

**문제점**:
[PROBLEM]

**해결책**:
[SOLUTION]

**한국 시장 특별 전략**:
[KOREA_STRATEGY]

**실행 로드맵**:
[ROADMAP]

[EXPERT_VALIDATION]`,
      variables: ['IDEA_TITLE', 'KOREA_FIT', 'INVESTMENT', 'REVENUE', 'PROBLEM', 'SOLUTION', 'KOREA_STRATEGY', 'ROADMAP', 'EXPERT_VALIDATION']
    }],
    ['expert_interview', {
      name: 'Expert Interview',
      format: `🎙️ **전문가 인터뷰: [EXPERT_NAME]**
*[EXPERT_TITLE], [EXPERT_COMPANY]*

[EXPERT_PHOTO]

**Q: [QUESTION_1]**
A: [ANSWER_1]

**Q: [QUESTION_2]**
A: [ANSWER_2]

**Q: [QUESTION_3]**
A: [ANSWER_3]

**핵심 인사이트**:
• [KEY_INSIGHT_1]
• [KEY_INSIGHT_2]
• [KEY_INSIGHT_3]

[EXPERT_CONTACT]`,
      variables: ['EXPERT_NAME', 'EXPERT_TITLE', 'EXPERT_COMPANY', 'EXPERT_PHOTO', 'QUESTION_1', 'ANSWER_1', 'QUESTION_2', 'ANSWER_2', 'QUESTION_3', 'ANSWER_3', 'KEY_INSIGHT_1', 'KEY_INSIGHT_2', 'KEY_INSIGHT_3', 'EXPERT_CONTACT']
    }]
  ]);

  private newsletterHistory: NewsletterEdition[] = [];
  private subscriberSegments = {
    'startup_founders': {
      interests: ['funding', 'mvp', 'growth', 'regulation'],
      tone: 'practical',
      depth: 'detailed'
    },
    'enterprise_executives': {
      interests: ['compliance', 'innovation', 'partnerships', 'trends'],
      tone: 'professional',
      depth: 'executive_summary'
    },
    'investors': {
      interests: ['opportunities', 'market_size', 'trends', 'exits'],
      tone: 'analytical',
      depth: 'data_driven'
    },
    'consultants': {
      interests: ['frameworks', 'case_studies', 'regulation', 'trends'],
      tone: 'educational',
      depth: 'comprehensive'
    }
  };

  async generateNewsletter(
    regulatoryUpdates: RegulatoryUpdate[],
    ideas: Idea[],
    options: {
      targetAudience?: string[];
      includeExpertContent?: boolean;
      urgentOnly?: boolean;
    } = {}
  ): Promise<NewsletterEdition> {
    const sections: NewsletterSection[] = [];
    const issueNumber = this.newsletterHistory.length + 1;
    
    // 1. Regulatory Section (Priority 1)
    if (regulatoryUpdates.length > 0) {
      const regulatorySection = await this.createRegulatorySection(regulatoryUpdates, options.urgentOnly);
      if (regulatorySection) sections.push(regulatorySection);
    }

    // 2. Trending Ideas Section (Priority 2)
    const trendingIdeas = this.selectTrendingIdeas(ideas);
    if (trendingIdeas.length > 0) {
      const ideasSection = await this.createIdeasSection(trendingIdeas);
      sections.push(ideasSection);
    }

    // 3. Expert Insights Section (Priority 3)
    if (options.includeExpertContent) {
      const expertSection = await this.createExpertSection();
      if (expertSection) sections.push(expertSection);
    }

    // 4. Market Opportunities Section (Priority 4)
    const opportunitiesSection = await this.createOpportunitiesSection(ideas, regulatoryUpdates);
    sections.push(opportunitiesSection);

    // Sort sections by priority
    sections.sort((a, b) => a.priority - b.priority);

    const newsletter: NewsletterEdition = {
      id: `newsletter_${Date.now()}`,
      issueNumber,
      subject: this.generateSubjectLine(sections, issueNumber),
      preheader: this.generatePreheader(sections),
      sections,
      targetAudience: options.targetAudience || ['all'],
      status: 'draft',
      metrics: {
        estimatedReadTime: this.calculateReadTime(sections),
        keyTopics: this.extractKeyTopics(sections),
        expertQuotes: sections.filter(s => s.category === 'expert').length,
        regulatoryUpdates: regulatoryUpdates.length
      },
      createdAt: new Date()
    };

    this.newsletterHistory.push(newsletter);
    return newsletter;
  }

  private async createRegulatorySection(
    updates: RegulatoryUpdate[],
    urgentOnly: boolean = false
  ): Promise<NewsletterSection | null> {
    const filteredUpdates = urgentOnly 
      ? updates.filter(u => u.businessImpact === 'high')
      : updates;

    if (filteredUpdates.length === 0) return null;

    const highImpact = filteredUpdates.filter(u => u.businessImpact === 'high');
    const grouped = this.groupUpdatesByIndustry(filteredUpdates);

    let content = `## 📋 이번 주 규제 인텔리전스\n\n`;
    
    if (highImpact.length > 0) {
      content += `### ⚡ 즉시 확인 필요 (High Impact)\n\n`;
      for (const update of highImpact) {
        content += this.formatRegulatoryUpdate(update);
      }
    }

    content += `### 🏢 산업별 규제 동향\n\n`;
    for (const [industry, updates] of grouped) {
      content += `**${this.translateIndustry(industry)}**\n`;
      for (const update of updates.slice(0, 3)) {
        content += `• ${update.title} - ${update.ministry}\n`;
        if (update.actionItems?.length > 0) {
          content += `  → 필요 조치: ${update.actionItems[0]}\n`;
        }
      }
      content += `\n`;
    }

    return {
      title: '규제 업데이트',
      content,
      priority: 1,
      category: 'regulatory',
      metadata: {
        updateCount: filteredUpdates.length,
        highImpactCount: highImpact.length,
        industries: Array.from(grouped.keys())
      }
    };
  }

  private formatRegulatoryUpdate(update: RegulatoryUpdate): string {
    const template = this.templates.get('regulatory_alert');
    let formatted = template?.format || '{TITLE} - {MINISTRY}';

    const replacements = {
      MINISTRY: update.ministry,
      TITLE: update.title,
      EFFECTIVE_DATE: update.effectiveDate?.toLocaleDateString() || '즉시',
      IMPACT: this.translateImpact(update.businessImpact),
      SUMMARY: update.summary || '상세 내용은 원문 참조',
      ACTION_ITEMS: update.actionItems?.map(a => `• ${a}`).join('\n') || '• 내부 검토 필요',
      INDUSTRIES: update.industries.map(i => this.translateIndustry(i)).join(', '),
      EXPERT_INSIGHT: this.generateExpertInsight(update),
      CTA_BUTTON: `[📄 원문 보기](${update.sourceUrl})`
    };

    for (const [key, value] of Object.entries(replacements)) {
      formatted = formatted.replace(`[${key}]`, value);
    }

    return formatted + '\n\n---\n\n';
  }

  private async createIdeasSection(ideas: Idea[]): Promise<NewsletterSection> {
    const topIdeas = ideas.slice(0, 5);
    
    let content = `## 💡 이번 주 주목할 아이디어\n\n`;
    
    for (const [index, idea] of topIdeas.entries()) {
      content += `### ${index + 1}. ${idea.title}\n`;
      content += `**Korea Fit**: ${idea.koreaFit}/10 | `;
      content += `**투자 규모**: ${this.formatEffort(idea.effort || 1)} | `;
      content += `**카테고리**: ${idea.tags?.join(', ') || 'General'}\n\n`;
      content += `${idea.summary3 || idea.title}\n\n`;
      
      if (idea.whyNow) {
        content += `**왜 지금인가?** ${idea.whyNow}\n\n`;
      }
      
      if (idea.risks && idea.risks.length > 0) {
        content += `**주의사항**: ${idea.risks[0]}\n\n`;
      }
      
      content += `[자세히 보기 →](/ideas/${idea.id})\n\n`;
      
      if (index < topIdeas.length - 1) {
        content += `---\n\n`;
      }
    }

    return {
      title: '트렌딩 아이디어',
      content,
      priority: 2,
      category: 'ideas',
      metadata: {
        ideaCount: topIdeas.length,
        avgKoreaFit: topIdeas.reduce((sum, i) => sum + (i.koreaFit || 0), 0) / topIdeas.length
      }
    };
  }

  private async createExpertSection(): Promise<NewsletterSection> {
    // Simulated expert content - in production, this would pull from expert database
    const content = `## 🎙️ 전문가 인사이트\n\n` +
      `### "한국의 AI 규제, 기회의 창이 열렸다"\n` +
      `*김준호 변호사, 테크 스타트업 법률 전문*\n\n` +
      `최근 발표된 AI 기본법 시행령은 스타트업에게 예상외의 기회를 제공합니다. ` +
      `대기업 중심의 규제 프레임워크에서 벗어나, 혁신 샌드박스를 통한 규제 특례가 대폭 확대되었습니다.\n\n` +
      `**핵심 포인트**:\n` +
      `• 소규모 AI 서비스 규제 면제 기준 완화\n` +
      `• 샌드박스 승인 기간 단축 (6개월 → 3개월)\n` +
      `• 데이터 활용 범위 확대\n\n` +
      `[전체 인터뷰 읽기 →](#)\n`;

    return {
      title: '전문가 인사이트',
      content,
      priority: 3,
      category: 'expert',
      metadata: {
        expertName: '김준호',
        expertTitle: '변호사',
        topic: 'AI 규제'
      }
    };
  }

  private async createOpportunitiesSection(
    ideas: Idea[],
    regulations: RegulatoryUpdate[]
  ): Promise<NewsletterSection> {
    const opportunities = this.identifyOpportunities(ideas, regulations);
    
    let content = `## 🎯 이번 주 비즈니스 기회\n\n`;
    
    for (const opp of opportunities.slice(0, 3)) {
      content += `### ${opp.title}\n`;
      content += `${opp.description}\n`;
      content += `**예상 시장 규모**: ${opp.marketSize}\n`;
      content += `**진입 장벽**: ${opp.difficulty}\n`;
      content += `**추천 대상**: ${opp.targetAudience}\n\n`;
    }

    return {
      title: '비즈니스 기회',
      content,
      priority: 4,
      category: 'opportunity',
      metadata: {
        opportunityCount: opportunities.length
      }
    };
  }

  private identifyOpportunities(ideas: Idea[], regulations: RegulatoryUpdate[]): any[] {
    const opportunities = [];

    // Find regulation-driven opportunities
    for (const reg of regulations) {
      if (reg.opportunities && reg.opportunities.length > 0) {
        opportunities.push({
          title: `${reg.category} 규제 변화로 인한 신규 시장`,
          description: reg.opportunities[0],
          marketSize: '평가 중',
          difficulty: reg.businessImpact === 'high' ? '높음' : '중간',
          targetAudience: reg.affectedBusinessTypes.join(', ')
        });
      }
    }

    // Find high Korea Fit ideas as opportunities
    const highFitIdeas = ideas.filter(i => (i.koreaFit || 0) >= 8);
    for (const idea of highFitIdeas.slice(0, 2)) {
      opportunities.push({
        title: idea.title,
        description: idea.summary3 || '',
        marketSize: this.estimateMarketSize(idea),
        difficulty: this.formatEffort(idea.effort || 1),
        targetAudience: 'Startups, SMEs'
      });
    }

    return opportunities;
  }

  private generateSubjectLine(sections: NewsletterSection[], issueNumber: number): string {
    const hasUrgent = sections.some(s => 
      s.metadata?.highImpactCount > 0 || s.title.includes('긴급')
    );
    
    const templates = [
      `🚨 [긴급] 새로운 규제 ${sections[0].metadata?.updateCount}건 외`,
      `📊 IdeaOasis Weekly #${issueNumber}: 이번 주 꼭 알아야 할 ${sections.length}가지`,
      `💡 ${sections.find(s => s.category === 'ideas')?.metadata?.ideaCount || 0}개의 새로운 아이디어 + 규제 업데이트`,
      `🎯 한국 비즈니스 인텔리전스 리포트 #${issueNumber}`
    ];

    if (hasUrgent) return templates[0];
    return templates[Math.floor(Math.random() * (templates.length - 1)) + 1];
  }

  private generatePreheader(sections: NewsletterSection[]): string {
    const topics = this.extractKeyTopics(sections).slice(0, 3);
    return `이번 주 핵심: ${topics.join(', ')} | 읽는 시간: ${this.calculateReadTime(sections)}분`;
  }

  private calculateReadTime(sections: NewsletterSection[]): number {
    const totalWords = sections.reduce((sum, s) => 
      sum + s.content.split(' ').length + s.content.split('').filter(c => c.match(/[\u3131-\uD79D]/)).length / 10
    , 0);
    return Math.ceil(totalWords / 200); // 200 words per minute
  }

  private extractKeyTopics(sections: NewsletterSection[]): string[] {
    const topics = new Set<string>();
    
    for (const section of sections) {
      if (section.metadata?.industries) {
        section.metadata.industries.forEach((i: string) => topics.add(this.translateIndustry(i)));
      }
      if (section.category === 'regulatory') topics.add('규제');
      if (section.category === 'ideas') topics.add('아이디어');
      if (section.category === 'expert') topics.add('전문가 인사이트');
    }
    
    return Array.from(topics);
  }

  private selectTrendingIdeas(ideas: Idea[]): Idea[] {
    return ideas
      .filter(i => (i.koreaFit || 0) >= 7)
      .sort((a, b) => {
        const scoreA = (a.koreaFit || 0) + (a.votesUp || 0) - (a.votesDown || 0);
        const scoreB = (b.koreaFit || 0) + (b.votesUp || 0) - (b.votesDown || 0);
        return scoreB - scoreA;
      })
      .slice(0, 5);
  }

  private groupUpdatesByIndustry(updates: RegulatoryUpdate[]): Map<string, RegulatoryUpdate[]> {
    const grouped = new Map<string, RegulatoryUpdate[]>();
    
    for (const update of updates) {
      for (const industry of update.industries) {
        const existing = grouped.get(industry) || [];
        existing.push(update);
        grouped.set(industry, existing);
      }
    }
    
    return grouped;
  }

  private formatEffort(effort: number): string {
    const levels = ['최소', '소규모', '중간', '대규모', '엔터프라이즈'];
    return levels[effort - 1] || '미정';
  }

  private translateIndustry(industry: string): string {
    const translations: Record<string, string> = {
      'fintech': '핀테크',
      'ai': 'AI/인공지능',
      'blockchain': '블록체인',
      'ecommerce': '이커머스',
      'healthcare': '헬스케어',
      'mobility': '모빌리티',
      'gaming': '게이밍',
      'education': '에듀테크',
      'realestate': '프롭테크',
      'manufacturing': '제조업',
      'general': '일반'
    };
    return translations[industry] || industry;
  }

  private translateImpact(impact: string): string {
    const translations: Record<string, string> = {
      'high': '높음 🔴',
      'medium': '중간 🟡',
      'low': '낮음 🟢'
    };
    return translations[impact] || impact;
  }

  private generateExpertInsight(update: RegulatoryUpdate): string {
    const insights = [
      '이번 규제는 스타트업에게 새로운 기회를 제공합니다',
      '대기업보다 민첩한 스타트업이 유리한 상황입니다',
      '빠른 대응이 경쟁 우위를 만들 수 있습니다',
      '규제 샌드박스 활용을 적극 검토하세요'
    ];
    return insights[Math.floor(Math.random() * insights.length)];
  }

  private estimateMarketSize(idea: Idea): string {
    const revenue = (idea as any).revenuePotential || (idea.koreaFit || 0) / 2;
    if (revenue >= 4) return '1000억원 이상';
    if (revenue >= 3) return '100-1000억원';
    if (revenue >= 2) return '10-100억원';
    return '10억원 미만';
  }

  async renderToHTML(newsletter: NewsletterEdition): Promise<string> {
    let html = `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${newsletter.subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    h1 { color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
    h2 { color: #1f2937; margin-top: 30px; }
    h3 { color: #4b5563; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; }
    .high { background: #fee2e2; color: #dc2626; }
    .medium { background: #fef3c7; color: #d97706; }
    .low { background: #d1fae5; color: #059669; }
    .cta { display: inline-block; padding: 10px 20px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin: 10px 0; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280; }
  </style>
</head>
<body>
  <h1>IdeaOasis Intelligence Report #${newsletter.issueNumber}</h1>
  <p style="color: #6b7280;">${newsletter.preheader}</p>
`;

    for (const section of newsletter.sections) {
      html += `<div class="section">${this.markdownToHTML(section.content)}</div>`;
    }

    html += `
  <div class="footer">
    <p>© 2024 IdeaOasis. 한국 비즈니스 인텔리전스 플랫폼</p>
    <p><a href="#">구독 취소</a> | <a href="#">설정 변경</a></p>
  </div>
</body>
</html>`;

    return html;
  }

  private markdownToHTML(markdown: string): string {
    return markdown
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      .replace(/^• (.*$)/gim, '<li>$1</li>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^/g, '<p>')
      .replace(/$/g, '</p>');
  }
}

export const contentAgent = new ContentCreationAgent();