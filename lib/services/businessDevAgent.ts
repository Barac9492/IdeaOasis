export interface Prospect {
  id: string;
  company: string;
  industry: string;
  size: 'startup' | 'sme' | 'enterprise' | 'conglomerate';
  contacts: ContactPerson[];
  status: 'cold' | 'contacted' | 'interested' | 'meeting' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  source: 'inbound' | 'outbound' | 'referral' | 'event' | 'regulatory_alert';
  painPoints: string[];
  solutions: string[];
  estimatedValue: number;
  probability: number;
  nextAction: string;
  nextActionDate: Date;
  tags: string[];
  regulatoryProfile: {
    complianceRisk: 'high' | 'medium' | 'low';
    relevantRegulations: string[];
    lastRegulatoryUpdate?: string;
  };
  interactions: Interaction[];
  documents: Document[];
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
}

export interface ContactPerson {
  id: string;
  name: string;
  title: string;
  email: string;
  phone?: string;
  linkedinUrl?: string;
  decisionMaker: boolean;
  influencer: boolean;
  lastContact?: Date;
  preferredContact: 'email' | 'phone' | 'linkedin' | 'meeting';
}

export interface Interaction {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'proposal' | 'follow_up' | 'regulatory_alert';
  date: Date;
  contactPersonId: string;
  subject: string;
  notes: string;
  outcome: 'positive' | 'neutral' | 'negative';
  nextSteps: string[];
  attachments?: string[];
}

export interface Document {
  id: string;
  name: string;
  type: 'proposal' | 'contract' | 'presentation' | 'regulatory_brief' | 'case_study';
  url: string;
  createdAt: Date;
  sharedWith: string[];
}

export interface SalesTemplate {
  name: string;
  type: 'cold_email' | 'follow_up' | 'proposal' | 'regulatory_alert' | 'meeting_request';
  subject: string;
  content: string;
  variables: string[];
  industry?: string;
  companySize?: string[];
}

export class BusinessDevelopmentAgent {
  private prospects: Map<string, Prospect> = new Map();
  private templates: Map<string, SalesTemplate> = new Map();
  private interactions: Map<string, Interaction[]> = new Map();
  
  constructor() {
    this.initializeTemplates();
  }

  private initializeTemplates() {
    const templates: SalesTemplate[] = [
      {
        name: 'Regulatory Alert Cold Email',
        type: 'cold_email',
        subject: '[COMPANY_NAME] 신규 [REGULATION_TYPE] 규제 영향 분석',
        content: `안녕하세요 [CONTACT_NAME]님,

[COMPANY_NAME]의 [INDUSTRY] 사업에 영향을 미칠 수 있는 중요한 규제 변경사항을 발견하여 연락드립니다.

🚨 **새로운 규제**: [REGULATION_TITLE]
📅 **시행일**: [EFFECTIVE_DATE]  
⚡ **예상 영향도**: [IMPACT_LEVEL]

**귀사에 미칠 수 있는 영향**:
[SPECIFIC_IMPACT]

**권장 대응 방안**:
• [ACTION_1]
• [ACTION_2]
• [ACTION_3]

IdeaOasis는 한국의 규제 환경을 실시간으로 모니터링하여 기업들이 선제적으로 대응할 수 있도록 돕습니다.

📞 **무료 상담 제안**: 
귀사의 구체적인 상황에 대한 맞춤형 분석과 대응 전략을 논의하는 30분 상담을 제안드립니다.

[SCHEDULE_LINK]

감사합니다.

[SENDER_NAME]
IdeaOasis 비즈니스 개발팀
[CONTACT_INFO]`,
        variables: ['COMPANY_NAME', 'CONTACT_NAME', 'INDUSTRY', 'REGULATION_TITLE', 'EFFECTIVE_DATE', 'IMPACT_LEVEL', 'SPECIFIC_IMPACT', 'ACTION_1', 'ACTION_2', 'ACTION_3', 'SCHEDULE_LINK', 'SENDER_NAME', 'CONTACT_INFO'],
        industry: 'all',
        companySize: ['enterprise', 'conglomerate']
      },
      {
        name: 'Follow-up After Regulatory Brief',
        type: 'follow_up',
        subject: '[COMPANY_NAME] 규제 브리핑 후속 - 다음 단계 논의',
        content: `안녕하세요 [CONTACT_NAME]님,

지난 [DATE]에 공유드린 [REGULATION_TOPIC] 관련 규제 브리핑은 잘 검토하셨나요?

**요약**:
- 귀사에 [IMPACT_SUMMARY]
- 권장 기간: [TIMELINE] 내 대응 필요
- 예상 비용: [COST_ESTIMATE]

**다음 단계 제안**:
1. 상세 컴플라이언스 체크리스트 제공
2. 구현 로드맵 수립 지원  
3. 정기 모니터링 서비스 논의

이번 주 중에 20분 정도 통화 가능하실까요?

[AVAILABILITY]

[SENDER_NAME]`,
        variables: ['COMPANY_NAME', 'CONTACT_NAME', 'DATE', 'REGULATION_TOPIC', 'IMPACT_SUMMARY', 'TIMELINE', 'COST_ESTIMATE', 'AVAILABILITY', 'SENDER_NAME']
      },
      {
        name: 'Enterprise Proposal',
        type: 'proposal',
        subject: '[COMPANY_NAME] 맞춤형 규제 인텔리전스 솔루션 제안서',
        content: `# [COMPANY_NAME] 규제 인텔리전스 솔루션

## 현황 분석
[CURRENT_SITUATION]

## 제안 솔루션

### 1. 실시간 규제 모니터링
- [INDUSTRY] 업계 특화 알림
- 영향도 분석 및 우선순위 지정
- 월 [ALERT_COUNT]회 평균 업데이트

### 2. 전문가 자문 서비스  
- 분야별 전문 변호사/컨설턴트 네트워크
- 월 [CONSULTATION_HOURS]시간 자문 포함
- 긴급 이슈 24시간 내 대응

### 3. 맞춤형 리포팅
- 월간 규제 동향 리포트
- 분기별 컴플라이언스 체크
- 연간 규제 로드맵 제공

## 투자 수익률 (ROI)
- 규제 위반 리스크 [RISK_REDUCTION]% 감소
- 컴플라이언스 비용 [COST_SAVING]% 절약
- 시장 기회 조기 발견으로 [REVENUE_OPPORTUNITY] 수익 기회

## 가격안
[PRICING_TABLE]

## 다음 단계
[NEXT_STEPS]

문의: [CONTACT_INFO]`,
        variables: ['COMPANY_NAME', 'CURRENT_SITUATION', 'INDUSTRY', 'ALERT_COUNT', 'CONSULTATION_HOURS', 'RISK_REDUCTION', 'COST_SAVING', 'REVENUE_OPPORTUNITY', 'PRICING_TABLE', 'NEXT_STEPS', 'CONTACT_INFO']
      },
      {
        name: 'Meeting Request',
        type: 'meeting_request',
        subject: '[URGENT] [REGULATION_NAME] 대응 전략 논의 요청',
        content: `안녕하세요 [CONTACT_NAME]님,

[REGULATION_NAME] 관련하여 귀사의 [DEPARTMENT] 팀과 긴급히 논의가 필요한 사안이 있어 연락드립니다.

**긴급성**: [URGENCY_REASON]
**논의 필요 사항**:
- [TOPIC_1]
- [TOPIC_2] 
- [TOPIC_3]

**제안 일정**:
[MEETING_OPTIONS]

약 [DURATION]분 정도 소요될 예정이며, 사전에 준비 자료를 공유드리겠습니다.

확인 부탁드립니다.

[SENDER_NAME]
[CONTACT_INFO]`,
        variables: ['CONTACT_NAME', 'REGULATION_NAME', 'DEPARTMENT', 'URGENCY_REASON', 'TOPIC_1', 'TOPIC_2', 'TOPIC_3', 'MEETING_OPTIONS', 'DURATION', 'SENDER_NAME', 'CONTACT_INFO']
      }
    ];

    templates.forEach(template => {
      this.templates.set(template.name, template);
    });
  }

  async identifyProspects(regulatoryUpdates: any[]): Promise<Prospect[]> {
    const newProspects: Prospect[] = [];
    
    for (const update of regulatoryUpdates) {
      if (update.businessImpact === 'high') {
        const prospects = await this.findAffectedCompanies(update);
        newProspects.push(...prospects);
      }
    }
    
    return this.deduplicateProspects(newProspects);
  }

  private async findAffectedCompanies(regulatoryUpdate: any): Promise<Prospect[]> {
    // In production, this would integrate with company databases, LinkedIn Sales Navigator, etc.
    const mockCompanies = [
      {
        company: 'Samsung Ventures',
        industry: 'venture_capital',
        size: 'conglomerate' as const,
        painPoints: ['regulatory_compliance', 'due_diligence'],
        estimatedValue: 100000000
      },
      {
        company: 'Kakao Investment',
        industry: 'fintech',
        size: 'enterprise' as const,
        painPoints: ['fintech_regulation', 'data_protection'],
        estimatedValue: 50000000
      },
      {
        company: 'Naver Cloud Platform',
        industry: 'cloud_services',
        size: 'enterprise' as const,
        painPoints: ['data_sovereignty', 'ai_regulation'],
        estimatedValue: 75000000
      }
    ];

    const prospects: Prospect[] = [];
    
    for (const company of mockCompanies) {
      if (this.isRelevantToCompany(regulatoryUpdate, company)) {
        const prospect = this.createProspectFromCompany(company, regulatoryUpdate);
        prospects.push(prospect);
      }
    }
    
    return prospects;
  }

  private isRelevantToCompany(update: any, company: any): boolean {
    return update.industries.some((industry: string) => 
      company.industry.includes(industry) || 
      company.painPoints.some((pain: string) => pain.includes(industry))
    );
  }

  private createProspectFromCompany(company: any, trigger: any): Prospect {
    const id = `prospect_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      id,
      company: company.company,
      industry: company.industry,
      size: company.size,
      contacts: this.generateMockContacts(company),
      status: 'cold',
      source: 'regulatory_alert',
      painPoints: company.painPoints,
      solutions: this.suggestSolutions(company.painPoints),
      estimatedValue: company.estimatedValue,
      probability: 15, // Cold prospects start at 15%
      nextAction: `Send regulatory alert about ${trigger.title}`,
      nextActionDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      tags: ['regulatory_triggered', trigger.category],
      regulatoryProfile: {
        complianceRisk: trigger.businessImpact,
        relevantRegulations: [trigger.id],
        lastRegulatoryUpdate: trigger.id
      },
      interactions: [],
      documents: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private generateMockContacts(company: any): ContactPerson[] {
    const contacts: ContactPerson[] = [];
    
    if (company.size === 'conglomerate' || company.size === 'enterprise') {
      contacts.push({
        id: `contact_${Date.now()}_1`,
        name: '김철수',
        title: 'Chief Compliance Officer',
        email: 'compliance@' + company.company.toLowerCase().replace(/\s+/g, '') + '.com',
        decisionMaker: true,
        influencer: true,
        preferredContact: 'email'
      });
      
      contacts.push({
        id: `contact_${Date.now()}_2`,
        name: '이영희',
        title: 'Legal Director',
        email: 'legal@' + company.company.toLowerCase().replace(/\s+/g, '') + '.com',
        decisionMaker: false,
        influencer: true,
        preferredContact: 'meeting'
      });
    } else {
      contacts.push({
        id: `contact_${Date.now()}_1`,
        name: '박민수',
        title: 'CEO',
        email: 'ceo@' + company.company.toLowerCase().replace(/\s+/g, '') + '.com',
        decisionMaker: true,
        influencer: true,
        preferredContact: 'email'
      });
    }
    
    return contacts;
  }

  private suggestSolutions(painPoints: string[]): string[] {
    const solutionMap: Record<string, string> = {
      'regulatory_compliance': 'Real-time regulatory monitoring and compliance alerts',
      'due_diligence': 'Automated regulatory risk assessment for investment targets',
      'fintech_regulation': 'Fintech-specific regulatory guidance and sandbox navigation',
      'data_protection': 'GDPR/PIPA compliance monitoring and breach prevention',
      'ai_regulation': 'AI ethics compliance and regulatory sandbox assistance',
      'data_sovereignty': 'Cross-border data governance and compliance framework'
    };
    
    return painPoints.map(pain => solutionMap[pain] || 'Customized regulatory intelligence solution');
  }

  private deduplicateProspects(prospects: Prospect[]): Prospect[] {
    const seen = new Set<string>();
    return prospects.filter(prospect => {
      if (seen.has(prospect.company)) {
        return false;
      }
      seen.add(prospect.company);
      return true;
    });
  }

  async generateOutreach(prospectId: string, templateName: string, customization?: Record<string, string>): Promise<string> {
    const prospect = this.prospects.get(prospectId);
    const template = this.templates.get(templateName);
    
    if (!prospect || !template) {
      throw new Error('Prospect or template not found');
    }

    let content = template.content;
    let subject = template.subject;
    
    // Auto-populate common variables
    const variables = {
      COMPANY_NAME: prospect.company,
      CONTACT_NAME: prospect.contacts[0]?.name || 'there',
      INDUSTRY: this.translateIndustry(prospect.industry),
      SENDER_NAME: 'Yeo Joon Cho',
      CONTACT_INFO: 'ethancho12@gmail.com | +82-10-XXXX-XXXX',
      SCHEDULE_LINK: 'https://calendly.com/ideaoasis/consultation',
      ...customization
    };

    // Replace variables in content and subject
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`\\[${key}\\]`, 'g');
      content = content.replace(regex, value);
      subject = subject.replace(regex, value);
    }

    return `Subject: ${subject}\n\n${content}`;
  }

  async trackInteraction(prospectId: string, interaction: Omit<Interaction, 'id'>): Promise<void> {
    const prospect = this.prospects.get(prospectId);
    if (!prospect) throw new Error('Prospect not found');

    const newInteraction: Interaction = {
      ...interaction,
      id: `interaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    prospect.interactions.push(newInteraction);
    prospect.updatedAt = new Date();
    
    // Update prospect status based on interaction
    this.updateProspectStatus(prospect, newInteraction);
    
    this.prospects.set(prospectId, prospect);
  }

  private updateProspectStatus(prospect: Prospect, interaction: Interaction): void {
    if (interaction.outcome === 'positive') {
      switch (prospect.status) {
        case 'cold':
          prospect.status = 'contacted';
          prospect.probability = 25;
          break;
        case 'contacted':
          prospect.status = 'interested';
          prospect.probability = 40;
          break;
        case 'interested':
          prospect.status = 'meeting';
          prospect.probability = 60;
          break;
        case 'meeting':
          prospect.status = 'proposal';
          prospect.probability = 75;
          break;
      }
    } else if (interaction.outcome === 'negative') {
      prospect.probability = Math.max(prospect.probability - 20, 5);
    }
  }

  async generateProposalContent(prospectId: string): Promise<string> {
    const prospect = this.prospects.get(prospectId);
    if (!prospect) throw new Error('Prospect not found');

    const template = this.templates.get('Enterprise Proposal');
    if (!template) throw new Error('Proposal template not found');

    const customization = {
      CURRENT_SITUATION: this.analyzeCurrentSituation(prospect),
      INDUSTRY: this.translateIndustry(prospect.industry),
      ALERT_COUNT: this.estimateAlertFrequency(prospect),
      CONSULTATION_HOURS: this.recommendConsultationHours(prospect),
      RISK_REDUCTION: '60-80',
      COST_SAVING: '30-50',
      REVENUE_OPPORTUNITY: this.formatCurrency(prospect.estimatedValue * 0.1),
      PRICING_TABLE: this.generatePricingTable(prospect),
      NEXT_STEPS: this.suggestNextSteps(prospect)
    };

    return await this.generateOutreach(prospectId, 'Enterprise Proposal', customization);
  }

  private analyzeCurrentSituation(prospect: Prospect): string {
    return `${prospect.company}는 ${this.translateIndustry(prospect.industry)} 업계의 선도기업으로서, ` +
           `다음과 같은 규제 리스크에 노출되어 있습니다:\n` +
           prospect.painPoints.map(p => `• ${p}`).join('\n');
  }

  private estimateAlertFrequency(prospect: Prospect): string {
    const baseFrequency = prospect.industry === 'fintech' ? 8 : 
                         prospect.industry === 'healthcare' ? 6 : 4;
    return baseFrequency.toString();
  }

  private recommendConsultationHours(prospect: Prospect): string {
    return prospect.size === 'conglomerate' ? '10' :
           prospect.size === 'enterprise' ? '6' : '3';
  }

  private generatePricingTable(prospect: Prospect): string {
    const basePrice = prospect.size === 'conglomerate' ? 5000000 :
                     prospect.size === 'enterprise' ? 2000000 : 800000;
    
    return `| 서비스 | 월 요금 |
|--------|---------|
| 기본 모니터링 | ${this.formatCurrency(basePrice)} |
| 전문가 자문 | ${this.formatCurrency(basePrice * 0.5)} |
| 맞춤형 리포팅 | ${this.formatCurrency(basePrice * 0.3)} |
| **총 월 요금** | **${this.formatCurrency(basePrice * 1.8)}** |`;
  }

  private suggestNextSteps(prospect: Prospect): string {
    return `1. 파일럿 프로그램 (1개월, 50% 할인)\n` +
           `2. 상세 요구사항 분석 회의\n` +
           `3. 맞춤형 대시보드 구축\n` +
           `4. 정식 서비스 계약 체결`;
  }

  private translateIndustry(industry: string): string {
    const translations: Record<string, string> = {
      'fintech': '핀테크',
      'venture_capital': '벤처캐피털',
      'cloud_services': '클라우드 서비스',
      'healthcare': '헬스케어',
      'manufacturing': '제조업',
      'ecommerce': '이커머스'
    };
    return translations[industry] || industry;
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0
    }).format(amount);
  }

  async getPipelineAnalytics(): Promise<any> {
    const prospects = Array.from(this.prospects.values());
    
    const statusCounts = prospects.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalValue = prospects.reduce((sum, p) => sum + (p.estimatedValue * p.probability / 100), 0);
    
    const avgDealSize = prospects.length > 0 ? 
      prospects.reduce((sum, p) => sum + p.estimatedValue, 0) / prospects.length : 0;

    return {
      totalProspects: prospects.length,
      totalPipelineValue: totalValue,
      avgDealSize,
      statusDistribution: statusCounts,
      conversionRates: this.calculateConversionRates(prospects),
      topProspects: prospects
        .sort((a, b) => b.estimatedValue * b.probability - a.estimatedValue * a.probability)
        .slice(0, 5)
        .map(p => ({
          company: p.company,
          estimatedValue: p.estimatedValue,
          probability: p.probability,
          status: p.status
        }))
    };
  }

  private calculateConversionRates(prospects: Prospect[]): Record<string, number> {
    const statusOrder = ['cold', 'contacted', 'interested', 'meeting', 'proposal', 'negotiation', 'closed_won'];
    const rates: Record<string, number> = {};
    
    for (let i = 0; i < statusOrder.length - 1; i++) {
      const current = prospects.filter(p => p.status === statusOrder[i]).length;
      const next = prospects.filter(p => statusOrder.indexOf(p.status) > i).length;
      rates[`${statusOrder[i]}_to_next`] = current > 0 ? (next / current) * 100 : 0;
    }
    
    return rates;
  }

  async getProspects(filters?: {
    status?: string;
    industry?: string;
    size?: string;
    minValue?: number;
  }): Promise<Prospect[]> {
    let prospects = Array.from(this.prospects.values());
    
    if (filters) {
      if (filters.status) {
        prospects = prospects.filter(p => p.status === filters.status);
      }
      if (filters.industry) {
        prospects = prospects.filter(p => p.industry === filters.industry);
      }
      if (filters.size) {
        prospects = prospects.filter(p => p.size === filters.size);
      }
      if (filters.minValue) {
        prospects = prospects.filter(p => p.estimatedValue >= (filters.minValue || 0));
      }
    }
    
    return prospects.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  addProspect(prospect: Prospect): void {
    this.prospects.set(prospect.id, prospect);
  }

  updateProspect(prospectId: string, updates: Partial<Prospect>): void {
    const prospect = this.prospects.get(prospectId);
    if (prospect) {
      Object.assign(prospect, updates, { updatedAt: new Date() });
      this.prospects.set(prospectId, prospect);
    }
  }
}

export const businessDevAgent = new BusinessDevelopmentAgent();