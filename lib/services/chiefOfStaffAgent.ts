import { regulatoryMonitor } from './regulatoryMonitor';
import { contentAgent } from './contentAgent';
import { businessDevAgent } from './businessDevAgent';
import { expertNetworkAgent } from './expertNetworkAgent';
import { activePlatformAgent } from './activePlatformAgent';

export interface Goal {
  id: string;
  title: string;
  description: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  deadline: Date;
  progress: number; // 0-100
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  dependencies: string[];
  relatedProspects?: string[];
  relatedRegulations?: string[];
  nextActions: string[];
  owner: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Context {
  id: string;
  type: 'conversation' | 'project' | 'prospect' | 'regulation' | 'goal';
  title: string;
  summary: string;
  keyPoints: string[];
  relatedEntities: {
    prospects?: string[];
    regulations?: string[];
    experts?: string[];
    goals?: string[];
  };
  lastUpdated: Date;
  importance: number; // 1-10
  tags: string[];
}

export interface ProactiveInsight {
  id: string;
  type: 'opportunity' | 'risk' | 'suggestion' | 'reminder' | 'update';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  data: any;
  actionRequired: boolean;
  suggestedActions: string[];
  deadline?: Date;
  relatedGoals: string[];
  createdAt: Date;
  acknowledged: boolean;
}

export interface BriefingSection {
  title: string;
  priority: number;
  content: string;
  actionItems: string[];
  relatedData: any;
}

export interface DailyBriefing {
  date: Date;
  sections: BriefingSection[];
  topPriorities: string[];
  keyInsights: ProactiveInsight[];
  scheduledActivities: any[];
  followUps: any[];
  metrics: {
    goalsProgress: number;
    pipelineValue: number;
    regulatoryAlerts: number;
    contentGenerated: number;
  };
}

export class ChiefOfStaffAgent {
  private goals: Map<string, Goal> = new Map();
  private contexts: Map<string, Context> = new Map();
  private insights: ProactiveInsight[] = [];
  private lastBriefing: DailyBriefing | null = null;
  private userPreferences = {
    briefingTime: '08:00',
    timezone: 'Asia/Seoul',
    notificationMethods: ['email', 'dashboard'],
    priorityFocus: ['regulatory', 'business_dev', 'content'],
    weeklyGoals: 3,
    dailyFollowUps: 5
  };

  async generateDailyBriefing(): Promise<DailyBriefing> {
    console.log('[CHIEF OF STAFF] Generating daily briefing...');
    
    const sections: BriefingSection[] = [];
    
    // 1. Regulatory Intelligence Section
    const regulatorySection = await this.generateRegulatorySection();
    if (regulatorySection) sections.push(regulatorySection);
    
    // 2. Business Development Section  
    const businessSection = await this.generateBusinessSection();
    if (businessSection) sections.push(businessSection);
    
    // 3. Content Performance Section
    const contentSection = await this.generateContentSection();
    if (contentSection) sections.push(contentSection);
    
    // 4. Goals Progress Section
    const goalsSection = await this.generateGoalsSection();
    if (goalsSection) sections.push(goalsSection);
    
    // Generate proactive insights
    const insights = await this.generateProactiveInsights();
    
    // Calculate key metrics
    const metrics = await this.calculateMetrics();
    
    const briefing: DailyBriefing = {
      date: new Date(),
      sections: sections.sort((a, b) => a.priority - b.priority),
      topPriorities: this.extractTopPriorities(sections),
      keyInsights: insights.filter(i => i.priority === 'urgent' || i.priority === 'high'),
      scheduledActivities: await this.getScheduledActivities(),
      followUps: await this.getRequiredFollowUps(),
      metrics
    };
    
    this.lastBriefing = briefing;
    return briefing;
  }

  private async generateRegulatorySection(): Promise<BriefingSection | null> {
    const updates = await regulatoryMonitor.monitorAllTargets();
    const newUpdates = updates.filter(u => u.changeDetected || !u.previousVersion);
    const highImpact = newUpdates.filter(u => u.businessImpact === 'high');
    
    if (newUpdates.length === 0) return null;
    
    let content = `📊 **규제 인텔리전스 업데이트**\n\n`;
    
    if (highImpact.length > 0) {
      content += `⚡ **긴급 대응 필요** (${highImpact.length}건)\n`;
      for (const update of highImpact.slice(0, 3)) {
        content += `• ${update.title} (${update.ministry})\n`;
        content += `  → 영향: ${update.industries.join(', ')} 업계\n`;
      }
      content += `\n`;
    }
    
    content += `📈 **비즈니스 기회**\n`;
    const affectedProspects = await this.findAffectedProspects(newUpdates);
    content += `• ${affectedProspects.length}개 잠재 고객이 영향을 받을 것으로 예상\n`;
    content += `• 예상 매출 기회: ${this.formatCurrency(affectedProspects.length * 50000000)}\n\n`;
    
    const actionItems = [
      `${highImpact.length}개 긴급 규제에 대한 고객 알림 발송`,
      '영향받는 잠재 고객들에게 맞춤형 제안서 준비',
      '다음 주 뉴스레터에 규제 분석 포함'
    ];
    
    return {
      title: '규제 인텔리전스',
      priority: 1,
      content,
      actionItems,
      relatedData: { updates: newUpdates, prospects: affectedProspects }
    };
  }

  private async generateBusinessSection(): Promise<BriefingSection | null> {
    const analytics = await businessDevAgent.getPipelineAnalytics();
    const prospects = await businessDevAgent.getProspects({ status: 'meeting' });
    const proposalsNeeded = await businessDevAgent.getProspects({ status: 'interested' });
    
    let content = `💼 **영업 파이프라인 현황**\n\n`;
    content += `📊 **핵심 지표**\n`;
    content += `• 총 파이프라인 가치: ${this.formatCurrency(analytics.totalPipelineValue)}\n`;
    content += `• 이번 주 미팅: ${prospects.length}건\n`;
    content += `• 제안서 필요: ${proposalsNeeded.length}건\n\n`;
    
    if (prospects.length > 0) {
      content += `📅 **이번 주 주요 미팅**\n`;
      for (const prospect of prospects.slice(0, 3)) {
        content += `• ${prospect.company} (${this.formatCurrency(prospect.estimatedValue)})\n`;
        content += `  → 다음 액션: ${prospect.nextAction}\n`;
      }
      content += `\n`;
    }
    
    const actionItems = [
      `${prospects.length}개 미팅 준비 자료 검토`,
      `${proposalsNeeded.length}개 맞춤형 제안서 작성`,
      '고가치 잠재 고객 3곳에 후속 연락'
    ];
    
    return {
      title: '비즈니스 개발',
      priority: 2,
      content,
      actionItems,
      relatedData: analytics
    };
  }

  private async generateContentSection(): Promise<BriefingSection | null> {
    // Mock content performance data
    const performance = {
      newsletterOpenRate: 24.3,
      lastWeekGrowth: 15.2,
      contentGenerated: 3,
      socialEngagement: 156
    };
    
    let content = `📝 **콘텐츠 성과 및 계획**\n\n`;
    content += `📈 **성과 하이라이트**\n`;
    content += `• 뉴스레터 오픈율: ${performance.newsletterOpenRate}% (↑${performance.lastWeekGrowth}%)\n`;
    content += `• 이번 주 콘텐츠 생성: ${performance.contentGenerated}건\n`;
    content += `• 소셜 미디어 참여: ${performance.socialEngagement}회\n\n`;
    
    content += `📋 **예정된 콘텐츠**\n`;
    content += `• 화요일: 주간 규제 인텔리전스 뉴스레터\n`;
    content += `• 목요일: 전문가 인터뷰 (AI 규제 전문가)\n`;
    content += `• 금요일: 월간 시장 동향 리포트\n\n`;
    
    const actionItems = [
      '화요일 뉴스레터 최종 검토 및 발송',
      '전문가 인터뷰 질문지 준비',
      'LinkedIn 게시글 3개 사전 작성'
    ];
    
    return {
      title: '콘텐츠 & 마케팅',
      priority: 3,
      content,
      actionItems,
      relatedData: performance
    };
  }

  private async generateGoalsSection(): Promise<BriefingSection | null> {
    const activeGoals = Array.from(this.goals.values()).filter(g => g.status === 'active');
    const urgentGoals = activeGoals.filter(g => g.priority === 'urgent');
    const overdue = activeGoals.filter(g => g.deadline < new Date());
    
    if (activeGoals.length === 0) return null;
    
    let content = `🎯 **목표 진행 현황**\n\n`;
    
    if (urgentGoals.length > 0) {
      content += `⚡ **긴급 목표** (${urgentGoals.length}개)\n`;
      for (const goal of urgentGoals.slice(0, 3)) {
        content += `• ${goal.title} (${goal.progress}% 완료)\n`;
        content += `  → 마감: ${goal.deadline.toLocaleDateString()}\n`;
      }
      content += `\n`;
    }
    
    if (overdue.length > 0) {
      content += `🔴 **지연된 목표** (${overdue.length}개)\n`;
      content += `재검토와 우선순위 조정이 필요합니다.\n\n`;
    }
    
    const avgProgress = activeGoals.reduce((sum, g) => sum + g.progress, 0) / activeGoals.length;
    content += `📊 **전체 진행률**: ${Math.round(avgProgress)}%\n`;
    
    const actionItems = [
      `${urgentGoals.length}개 긴급 목표 진행 상황 점검`,
      '지연된 목표들에 대한 액션플랜 수정',
      '이번 주 목표 달성을 위한 리소스 재배분'
    ];
    
    return {
      title: '목표 관리',
      priority: 4,
      content,
      actionItems,
      relatedData: { activeGoals: activeGoals.length, avgProgress, overdue: overdue.length }
    };
  }

  private async generateProactiveInsights(): Promise<ProactiveInsight[]> {
    const insights: ProactiveInsight[] = [];
    
    // Check for regulatory opportunities
    const updates = await regulatoryMonitor.monitorAllTargets();
    const highImpactUpdates = updates.filter(u => u.businessImpact === 'high');
    
    if (highImpactUpdates.length > 0) {
      insights.push({
        id: `insight_${Date.now()}_1`,
        type: 'opportunity',
        priority: 'high',
        title: `${highImpactUpdates.length}개 신규 고가치 영업 기회 발견`,
        description: `새로운 규제 변화로 인해 ${highImpactUpdates.length}개 분야에서 기업들이 컴플라이언스 솔루션을 찾고 있습니다.`,
        data: { regulations: highImpactUpdates },
        actionRequired: true,
        suggestedActions: [
          '영향받는 기업들에게 긴급 규제 알림 발송',
          '맞춤형 컴플라이언스 패키지 제안서 준비',
          '규제 전문가와 클라이언트 매칭'
        ],
        deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
        relatedGoals: [],
        createdAt: new Date(),
        acknowledged: false
      });
    }
    
    // Check pipeline health
    const analytics = await businessDevAgent.getPipelineAnalytics();
    if (analytics.totalPipelineValue > 500000000) { // 500M KRW
      insights.push({
        id: `insight_${Date.now()}_2`,
        type: 'update',
        priority: 'medium',
        title: '파이프라인 가치 5억 원 돌파!',
        description: `현재 파이프라인 총 가치가 ${this.formatCurrency(analytics.totalPipelineValue)}에 도달했습니다. 이번 분기 목표 달성률 120%입니다.`,
        data: analytics,
        actionRequired: false,
        suggestedActions: [
          '성공 스토리를 마케팅 콘텐츠로 활용',
          '투자자들에게 성과 공유',
          '팀 인센티브 검토'
        ],
        relatedGoals: [],
        createdAt: new Date(),
        acknowledged: false
      });
    }
    
    // Check content performance
    insights.push({
      id: `insight_${Date.now()}_3`,
      type: 'suggestion',
      priority: 'medium',
      title: '콘텐츠 전략 최적화 제안',
      description: '규제 관련 콘텐츠의 참여율이 일반 콘텐츠보다 40% 높습니다. 규제 인텔리전스 콘텐츠 비중을 늘리는 것을 권장합니다.',
      data: { performanceGap: 40 },
      actionRequired: false,
      suggestedActions: [
        '주간 규제 분석 시리즈 런칭',
        '전문가 인터뷰 빈도 증가',
        '규제별 맞춤형 가이드 제작'
      ],
      relatedGoals: [],
      createdAt: new Date(),
      acknowledged: false
    });
    
    return insights;
  }

  private async findAffectedProspects(updates: any[]): Promise<any[]> {
    const prospects = await businessDevAgent.getProspects();
    const affected: any[] = [];
    
    for (const update of updates) {
      for (const prospect of prospects) {
        const hasIndustryMatch = update.industries.some((industry: string) =>
          prospect.industry.includes(industry) ||
          prospect.painPoints.some((pain: string) => pain.includes(industry))
        );
        
        if (hasIndustryMatch && !affected.find(p => p.id === prospect.id)) {
          affected.push(prospect);
        }
      }
    }
    
    return affected;
  }

  private extractTopPriorities(sections: BriefingSection[]): string[] {
    const priorities: string[] = [];
    
    sections.forEach(section => {
      if (section.actionItems.length > 0) {
        priorities.push(`${section.title}: ${section.actionItems[0]}`);
      }
    });
    
    return priorities.slice(0, 3);
  }

  private async getScheduledActivities(): Promise<any[]> {
    // Mock scheduled activities
    return [
      {
        time: '10:00',
        activity: 'Samsung Ventures 미팅',
        type: 'meeting',
        priority: 'high'
      },
      {
        time: '14:00',
        activity: '주간 뉴스레터 발송',
        type: 'content',
        priority: 'medium'
      },
      {
        time: '16:00',
        activity: 'Kakao Investment 후속 연락',
        type: 'follow_up',
        priority: 'high'
      }
    ];
  }

  private async getRequiredFollowUps(): Promise<any[]> {
    const prospects = await businessDevAgent.getProspects();
    const followUps = [];
    
    for (const prospect of prospects) {
      const daysSinceLastContact = Math.floor(
        (Date.now() - prospect.updatedAt.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysSinceLastContact >= 7 && prospect.status !== 'closed_lost') {
        followUps.push({
          company: prospect.company,
          daysSince: daysSinceLastContact,
          nextAction: prospect.nextAction,
          priority: prospect.estimatedValue > 100000000 ? 'high' : 'medium'
        });
      }
    }
    
    return followUps.slice(0, 5);
  }

  private async calculateMetrics(): Promise<any> {
    const goals = Array.from(this.goals.values()).filter(g => g.status === 'active');
    const analytics = await businessDevAgent.getPipelineAnalytics();
    const updates = await regulatoryMonitor.monitorAllTargets();
    
    return {
      goalsProgress: goals.length > 0 ? 
        Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length) : 0,
      pipelineValue: analytics.totalPipelineValue,
      regulatoryAlerts: updates.filter(u => u.businessImpact === 'high').length,
      contentGenerated: 3 // Mock
    };
  }

  async executeAutomatedWorkflow(): Promise<void> {
    console.log('[CHIEF OF STAFF] Executing automated workflow...');
    
    // 1. Check for new regulatory updates
    const updates = await regulatoryMonitor.monitorAllTargets();
    const newHighImpact = updates.filter(u => 
      u.changeDetected && u.businessImpact === 'high'
    );
    
    // 2. If high-impact updates found, trigger business actions
    if (newHighImpact.length > 0) {
      console.log(`[WORKFLOW] Found ${newHighImpact.length} high-impact regulatory updates`);
      
      // Identify affected prospects
      const affectedProspects = await this.findAffectedProspects(newHighImpact);
      
      // Generate outreach content for top prospects
      for (const prospect of affectedProspects.slice(0, 5)) {
        try {
          await businessDevAgent.generateOutreach(
            prospect.id, 
            'Regulatory Alert Cold Email',
            {
              REGULATION_TITLE: newHighImpact[0].title,
              EFFECTIVE_DATE: newHighImpact[0].effectiveDate?.toLocaleDateString() || '즉시',
              IMPACT_LEVEL: newHighImpact[0].businessImpact
            }
          );
          console.log(`[WORKFLOW] Generated outreach for ${prospect.company}`);
        } catch (error) {
          console.error(`[WORKFLOW] Failed to generate outreach for ${prospect.company}:`, error);
        }
      }
      
      // Create newsletter content
      try {
        const newsletter = await contentAgent.generateNewsletter(
          newHighImpact,
          [],
          { targetAudience: ['enterprise_executives'], urgentOnly: true }
        );
        console.log(`[WORKFLOW] Generated emergency newsletter: ${newsletter.subject}`);
      } catch (error) {
        console.error('[WORKFLOW] Failed to generate newsletter:', error);
      }
    }
    
    // 3. Check for overdue follow-ups
    const followUps = await this.getRequiredFollowUps();
    const urgentFollowUps = followUps.filter(f => f.daysSince >= 14);
    
    if (urgentFollowUps.length > 0) {
      console.log(`[WORKFLOW] ${urgentFollowUps.length} urgent follow-ups required`);
      // Create reminders/tasks for urgent follow-ups
    }
    
    // 4. Update goals progress
    await this.updateGoalsProgress();
    
    console.log('[WORKFLOW] Automated workflow completed');
  }

  private async updateGoalsProgress(): Promise<void> {
    // Update goals based on current metrics
    const analytics = await businessDevAgent.getPipelineAnalytics();
    
    // Find revenue-related goals and update progress
    for (const [id, goal] of this.goals.entries()) {
      if (goal.title.includes('매출') || goal.title.includes('파이프라인')) {
        // Mock progress calculation based on pipeline value
        const targetValue = 1000000000; // 1B KRW target
        const newProgress = Math.min(100, (analytics.totalPipelineValue / targetValue) * 100);
        
        if (newProgress !== goal.progress) {
          goal.progress = Math.round(newProgress);
          goal.updatedAt = new Date();
          this.goals.set(id, goal);
          console.log(`[GOALS] Updated ${goal.title}: ${goal.progress}% complete`);
        }
      }
    }
  }

  async addGoal(goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Goal> {
    const newGoal: Goal = {
      ...goal,
      id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.goals.set(newGoal.id, newGoal);
    return newGoal;
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0
    }).format(amount);
  }

  getGoals(): Goal[] {
    return Array.from(this.goals.values());
  }

  getInsights(): ProactiveInsight[] {
    return this.insights.filter(i => !i.acknowledged);
  }

  acknowledgeInsight(insightId: string): void {
    const insight = this.insights.find(i => i.id === insightId);
    if (insight) {
      insight.acknowledged = true;
    }
  }

  getLastBriefing(): DailyBriefing | null {
    return this.lastBriefing;
  }
}

export const chiefOfStaffAgent = new ChiefOfStaffAgent();