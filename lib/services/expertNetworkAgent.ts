export interface Expert {
  id: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  expertise: ExpertiseArea[];
  industries: string[];
  languages: string[];
  location: {
    city: string;
    country: string;
    timezone: string;
  };
  credentials: Credential[];
  experience: {
    totalYears: number;
    seniorRoles: string[];
    notableAchievements: string[];
  };
  availability: {
    hourlyRate: number;
    currency: string;
    minEngagement: number; // hours
    maxEngagement: number; // hours per month
    responseTime: string; // e.g., "24 hours"
    workingHours: string; // e.g., "9AM-6PM KST"
  };
  rating: {
    overall: number;
    communication: number;
    expertise: number;
    timeliness: number;
    totalReviews: number;
  };
  specializations: {
    regulatoryCompliance: boolean;
    marketEntry: boolean;
    dueDigligence: boolean;
    strategyConsulting: boolean;
    technicalReview: boolean;
    riskAssessment: boolean;
  };
  engagements: Engagement[];
  content: ExpertContent[];
  verified: boolean;
  featured: boolean;
  joinedAt: Date;
  lastActive: Date;
  status: 'active' | 'busy' | 'unavailable' | 'vacation';
}

export interface ExpertiseArea {
  domain: string;
  level: 'beginner' | 'intermediate' | 'expert' | 'thought_leader';
  yearsExperience: number;
  keywords: string[];
}

export interface Credential {
  type: 'education' | 'certification' | 'award' | 'publication' | 'patent';
  title: string;
  institution: string;
  year: number;
  verified: boolean;
}

export interface Engagement {
  id: string;
  clientId: string;
  clientCompany: string;
  type: 'consultation' | 'due_diligence' | 'market_research' | 'compliance_review' | 'strategic_advice';
  title: string;
  description: string;
  duration: number; // hours
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  startDate: Date;
  endDate?: Date;
  rate: number;
  totalValue: number;
  deliverables: string[];
  feedback?: {
    rating: number;
    comment: string;
    wouldRecommend: boolean;
  };
  tags: string[];
  confidential: boolean;
}

export interface ExpertContent {
  id: string;
  type: 'article' | 'video' | 'webinar' | 'research' | 'case_study' | 'regulatory_brief';
  title: string;
  summary: string;
  content?: string;
  url?: string;
  publishedAt: Date;
  views: number;
  likes: number;
  topics: string[];
  targetAudience: string[];
}

export interface ExpertMatchCriteria {
  industry?: string[];
  expertise?: string[];
  location?: string;
  budget?: {
    min: number;
    max: number;
    currency: string;
  };
  urgency?: 'low' | 'medium' | 'high' | 'urgent';
  engagementType?: string;
  languages?: string[];
  minRating?: number;
  availability?: 'immediate' | 'this_week' | 'this_month' | 'flexible';
}

export class ExpertNetworkAgent {
  private experts: Map<string, Expert> = new Map();
  private engagements: Map<string, Engagement> = new Map();
  private expertQueue: Map<string, Expert[]> = new Map(); // Topic -> experts queue

  constructor() {
    this.initializeExpertNetwork();
  }

  private initializeExpertNetwork() {
    const mockExperts: Expert[] = [
      {
        id: 'expert_001',
        name: '김준호',
        title: 'Senior Partner',
        company: 'Kim & Chang Law Firm',
        bio: '한국의 AI 및 데이터 보호 법규 전문가로 15년 경력. 삼성, LG 등 대기업 법무 자문 경험.',
        expertise: [
          {
            domain: 'AI Regulation',
            level: 'thought_leader',
            yearsExperience: 8,
            keywords: ['AI Basic Law', 'Algorithm Accountability', 'AI Ethics', 'Automated Decision Making']
          },
          {
            domain: 'Data Protection',
            level: 'expert',
            yearsExperience: 12,
            keywords: ['PIPA', 'GDPR', 'Cross-border Data Transfer', 'Privacy Impact Assessment']
          }
        ],
        industries: ['technology', 'fintech', 'healthcare', 'automotive'],
        languages: ['Korean', 'English'],
        location: { city: 'Seoul', country: 'South Korea', timezone: 'Asia/Seoul' },
        credentials: [
          {
            type: 'education',
            title: 'J.D. Seoul National University',
            institution: 'Seoul National University',
            year: 2008,
            verified: true
          },
          {
            type: 'certification',
            title: 'CIPP/A Certified Information Privacy Professional',
            institution: 'IAPP',
            year: 2019,
            verified: true
          }
        ],
        experience: {
          totalYears: 15,
          seniorRoles: ['Senior Partner at Kim & Chang', 'Legal Director at Samsung Electronics'],
          notableAchievements: [
            'Led Korea\'s first AI governance framework for chaebol',
            'Advised on 50+ cross-border data transfer agreements',
            'Speaker at World Economic Forum on AI Regulation'
          ]
        },
        availability: {
          hourlyRate: 800000,
          currency: 'KRW',
          minEngagement: 2,
          maxEngagement: 40,
          responseTime: '4 hours',
          workingHours: '9AM-6PM KST'
        },
        rating: {
          overall: 4.9,
          communication: 4.8,
          expertise: 5.0,
          timeliness: 4.9,
          totalReviews: 47
        },
        specializations: {
          regulatoryCompliance: true,
          marketEntry: false,
          dueDigligence: true,
          strategyConsulting: false,
          technicalReview: false,
          riskAssessment: true
        },
        engagements: [],
        content: [],
        verified: true,
        featured: true,
        joinedAt: new Date('2023-01-15'),
        lastActive: new Date(),
        status: 'active'
      },
      {
        id: 'expert_002',
        name: '이서연',
        title: 'Managing Director',
        company: 'McKinsey & Company Korea',
        bio: '한국 핀테크 시장 진출 전문가. 30+ 글로벌 기업의 한국 시장 진출 전략 수립.',
        expertise: [
          {
            domain: 'Market Entry Strategy',
            level: 'thought_leader',
            yearsExperience: 12,
            keywords: ['Korea Market Entry', 'Regulatory Navigation', 'Partnership Strategy', 'Chaebol Relations']
          },
          {
            domain: 'Fintech Strategy',
            level: 'expert',
            yearsExperience: 8,
            keywords: ['Digital Banking', 'Payment Systems', 'RegTech', 'Cryptocurrency']
          }
        ],
        industries: ['fintech', 'banking', 'payments', 'cryptocurrency'],
        languages: ['Korean', 'English', 'Japanese'],
        location: { city: 'Seoul', country: 'South Korea', timezone: 'Asia/Seoul' },
        credentials: [
          {
            type: 'education',
            title: 'MBA Harvard Business School',
            institution: 'Harvard Business School',
            year: 2011,
            verified: true
          }
        ],
        experience: {
          totalYears: 12,
          seniorRoles: ['Managing Director at McKinsey', 'VP Strategy at Kakao Pay'],
          notableAchievements: [
            'Led market entry for 15+ fintech unicorns into Korea',
            'Designed Korea\'s first open banking framework',
            'Authored "Korea Fintech Playbook" (bestseller)'
          ]
        },
        availability: {
          hourlyRate: 1200000,
          currency: 'KRW',
          minEngagement: 4,
          maxEngagement: 60,
          responseTime: '2 hours',
          workingHours: '8AM-8PM KST'
        },
        rating: {
          overall: 4.8,
          communication: 4.9,
          expertise: 4.8,
          timeliness: 4.7,
          totalReviews: 34
        },
        specializations: {
          regulatoryCompliance: false,
          marketEntry: true,
          dueDigligence: true,
          strategyConsulting: true,
          technicalReview: false,
          riskAssessment: false
        },
        engagements: [],
        content: [],
        verified: true,
        featured: true,
        joinedAt: new Date('2023-03-20'),
        lastActive: new Date(),
        status: 'active'
      },
      {
        id: 'expert_003',
        name: '박민수',
        title: 'CTO',
        company: 'Naver Cloud Platform',
        bio: '클라우드 인프라 및 AI 기술 전문가. 네이버의 하이퍼스케일 AI 서비스 아키텍처 설계.',
        expertise: [
          {
            domain: 'Cloud Architecture',
            level: 'expert',
            yearsExperience: 10,
            keywords: ['Kubernetes', 'Microservices', 'Serverless', 'Multi-cloud']
          },
          {
            domain: 'AI/ML Engineering',
            level: 'expert',
            yearsExperience: 8,
            keywords: ['Large Language Models', 'Computer Vision', 'MLOps', 'AI Infrastructure']
          }
        ],
        industries: ['technology', 'cloud', 'ai', 'enterprise_software'],
        languages: ['Korean', 'English'],
        location: { city: 'Bundang', country: 'South Korea', timezone: 'Asia/Seoul' },
        credentials: [
          {
            type: 'education',
            title: 'Ph.D. Computer Science KAIST',
            institution: 'KAIST',
            year: 2013,
            verified: true
          }
        ],
        experience: {
          totalYears: 10,
          seniorRoles: ['CTO at Naver Cloud', 'Principal Engineer at Google Cloud'],
          notableAchievements: [
            'Built Korea\'s largest public cloud infrastructure',
            'Led development of HyperCLOVA (Korean LLM)',
            '20+ patents in distributed systems'
          ]
        },
        availability: {
          hourlyRate: 600000,
          currency: 'KRW',
          minEngagement: 3,
          maxEngagement: 20,
          responseTime: '12 hours',
          workingHours: '6PM-10PM KST'
        },
        rating: {
          overall: 4.7,
          communication: 4.5,
          expertise: 5.0,
          timeliness: 4.6,
          totalReviews: 23
        },
        specializations: {
          regulatoryCompliance: false,
          marketEntry: false,
          dueDigligence: false,
          strategyConsulting: false,
          technicalReview: true,
          riskAssessment: true
        },
        engagements: [],
        content: [],
        verified: true,
        featured: false,
        joinedAt: new Date('2023-06-10'),
        lastActive: new Date(),
        status: 'busy'
      }
    ];

    mockExperts.forEach(expert => {
      this.experts.set(expert.id, expert);
    });
  }

  async findExperts(criteria: ExpertMatchCriteria): Promise<Expert[]> {
    let candidates = Array.from(this.experts.values());

    // Filter by industry
    if (criteria.industry && criteria.industry.length > 0) {
      candidates = candidates.filter(expert =>
        criteria.industry!.some(industry =>
          expert.industries.includes(industry)
        )
      );
    }

    // Filter by expertise
    if (criteria.expertise && criteria.expertise.length > 0) {
      candidates = candidates.filter(expert =>
        criteria.expertise!.some(skill =>
          expert.expertise.some(exp =>
            exp.domain.toLowerCase().includes(skill.toLowerCase()) ||
            exp.keywords.some(keyword =>
              keyword.toLowerCase().includes(skill.toLowerCase())
            )
          )
        )
      );
    }

    // Filter by budget
    if (criteria.budget) {
      candidates = candidates.filter(expert =>
        expert.availability.hourlyRate >= criteria.budget!.min &&
        expert.availability.hourlyRate <= criteria.budget!.max
      );
    }

    // Filter by rating
    if (criteria.minRating) {
      candidates = candidates.filter(expert =>
        expert.rating.overall >= criteria.minRating!
      );
    }

    // Filter by languages
    if (criteria.languages && criteria.languages.length > 0) {
      candidates = candidates.filter(expert =>
        criteria.languages!.some(lang =>
          expert.languages.includes(lang)
        )
      );
    }

    // Filter by availability status
    if (criteria.availability === 'immediate') {
      candidates = candidates.filter(expert => expert.status === 'active');
    }

    // Sort by relevance score
    candidates = this.rankExpertsByRelevance(candidates, criteria);

    return candidates.slice(0, 10); // Return top 10 matches
  }

  private rankExpertsByRelevance(experts: Expert[], criteria: ExpertMatchCriteria): Expert[] {
    return experts.map(expert => ({
      expert,
      score: this.calculateRelevanceScore(expert, criteria)
    }))
    .sort((a, b) => b.score - a.score)
    .map(item => item.expert);
  }

  private calculateRelevanceScore(expert: Expert, criteria: ExpertMatchCriteria): number {
    let score = 0;

    // Base score from rating
    score += expert.rating.overall * 20;

    // Featured experts get bonus
    if (expert.featured) score += 10;

    // Verified experts get bonus
    if (expert.verified) score += 5;

    // Industry match bonus
    if (criteria.industry) {
      const matches = criteria.industry.filter(industry => 
        expert.industries.includes(industry)
      ).length;
      score += matches * 15;
    }

    // Expertise level bonus
    if (criteria.expertise) {
      criteria.expertise.forEach(skill => {
        const expertiseMatch = expert.expertise.find(exp =>
          exp.domain.toLowerCase().includes(skill.toLowerCase())
        );
        if (expertiseMatch) {
          const levelBonus = {
            'thought_leader': 25,
            'expert': 20,
            'intermediate': 10,
            'beginner': 5
          };
          score += levelBonus[expertiseMatch.level];
        }
      });
    }

    // Response time bonus (faster = better)
    const responseHours = parseInt(expert.availability.responseTime);
    if (responseHours <= 4) score += 10;
    else if (responseHours <= 24) score += 5;

    // Active status bonus
    if (expert.status === 'active') score += 10;

    // Recent activity bonus
    const daysSinceActive = Math.floor(
      (Date.now() - expert.lastActive.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceActive <= 7) score += 5;

    return score;
  }

  async createEngagement(
    expertId: string,
    clientData: {
      clientId: string;
      clientCompany: string;
      type: string;
      title: string;
      description: string;
      estimatedHours: number;
      urgency: string;
      budget: number;
      deliverables: string[];
      startDate: Date;
    }
  ): Promise<Engagement> {
    const expert = this.experts.get(expertId);
    if (!expert) {
      throw new Error('Expert not found');
    }

    if (expert.status !== 'active') {
      throw new Error('Expert is not available');
    }

    const engagement: Engagement = {
      id: `engagement_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      clientId: clientData.clientId,
      clientCompany: clientData.clientCompany,
      type: clientData.type as any,
      title: clientData.title,
      description: clientData.description,
      duration: clientData.estimatedHours,
      status: 'pending',
      startDate: clientData.startDate,
      rate: expert.availability.hourlyRate,
      totalValue: expert.availability.hourlyRate * clientData.estimatedHours,
      deliverables: clientData.deliverables,
      tags: this.generateEngagementTags(clientData),
      confidential: true
    };

    this.engagements.set(engagement.id, engagement);
    expert.engagements.push(engagement);

    // Send notification to expert (in production, this would be email/SMS)
    await this.notifyExpert(expert, engagement);

    return engagement;
  }

  private generateEngagementTags(clientData: any): string[] {
    const tags = [];
    
    if (clientData.urgency === 'urgent') tags.push('urgent');
    if (clientData.budget > 10000000) tags.push('high_value'); // 10M KRW+
    if (clientData.estimatedHours > 40) tags.push('long_term');
    if (clientData.type.includes('compliance')) tags.push('regulatory');
    
    return tags;
  }

  private async notifyExpert(expert: Expert, engagement: Engagement): Promise<void> {
    // In production, integrate with email/SMS service
    console.log(`[EXPERT NOTIFICATION] New engagement request for ${expert.name}:`);
    console.log(`  Title: ${engagement.title}`);
    console.log(`  Client: ${engagement.clientCompany}`);
    console.log(`  Value: ${this.formatCurrency(engagement.totalValue)}`);
    console.log(`  Duration: ${engagement.duration} hours`);
  }

  async generateExpertContent(
    expertId: string,
    topic: string,
    contentType: 'article' | 'video' | 'webinar' | 'research' | 'regulatory_brief',
    targetAudience: string[]
  ): Promise<ExpertContent> {
    const expert = this.experts.get(expertId);
    if (!expert) {
      throw new Error('Expert not found');
    }

    // Generate content based on expert's expertise
    const content = await this.generateContentByType(expert, topic, contentType, targetAudience);

    const expertContent: ExpertContent = {
      id: `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: contentType,
      title: content.title,
      summary: content.summary,
      content: content.content,
      publishedAt: new Date(),
      views: 0,
      likes: 0,
      topics: [topic],
      targetAudience
    };

    expert.content.push(expertContent);
    return expertContent;
  }

  private async generateContentByType(
    expert: Expert,
    topic: string,
    contentType: string,
    targetAudience: string[]
  ): Promise<{ title: string; summary: string; content: string }> {
    const templates = {
      'regulatory_brief': {
        title: `${topic} 규제 분석: ${expert.name}의 전문가 해석`,
        summary: `${expert.company}의 ${expert.title} ${expert.name}이 분석하는 ${topic} 규제의 핵심 포인트와 비즈니스 영향.`,
        content: `# ${topic} 규제 분석

## 전문가 소개
${expert.name} (${expert.title}, ${expert.company})
- ${expert.experience.totalYears}년 경력
- 전문 분야: ${expert.expertise.map(e => e.domain).join(', ')}

## 규제 개요
${topic}와 관련된 최신 규제 변화를 분석하겠습니다.

## 핵심 변경사항
1. **주요 규제 포인트**: 기업이 반드시 알아야 할 핵심 사항
2. **시행 일정**: 단계별 준수 요구사항
3. **영향 분석**: 비즈니스에 미칠 실질적 영향

## 업계별 대응 전략
${targetAudience.map(audience => `### ${audience}
- 핵심 이슈와 대응 방안
- 권장 액션 아이템`).join('\n\n')}

## 전문가 조언
"${topic} 규제는 ${this.generateExpertInsight(expert, topic)}"

## 문의 및 상담
더 자세한 상담이 필요하시면 ${expert.name} 전문가와 직접 상담 가능합니다.
- 응답 시간: ${expert.availability.responseTime}
- 상담료: ${this.formatCurrency(expert.availability.hourlyRate)}/시간`
      },
      'article': {
        title: `${topic}: ${expert.name}이 제시하는 해결책`,
        summary: `업계 전문가 ${expert.name}이 ${topic}에 대한 실무적 관점과 해결 방안을 제시합니다.`,
        content: `실무 중심의 ${topic} 가이드를 제공합니다...`
      }
    };

    return templates[contentType as keyof typeof templates] || templates['article'];
  }

  private generateExpertInsight(expert: Expert, topic: string): string {
    const insights = [
      `기업들이 선제적으로 대응해야 할 중요한 규제입니다`,
      `한국 시장의 특수성을 고려한 맞춤형 전략이 필요합니다`,
      `글로벌 트렌드와 한국 실정을 균형있게 고려해야 합니다`,
      `이번 규제는 오히려 혁신 기업들에게 기회가 될 수 있습니다`
    ];
    
    return insights[Math.floor(Math.random() * insights.length)];
  }

  async getExpertAnalytics(): Promise<any> {
    const experts = Array.from(this.experts.values());
    const engagements = Array.from(this.engagements.values());

    return {
      totalExperts: experts.length,
      activeExperts: experts.filter(e => e.status === 'active').length,
      featuredExperts: experts.filter(e => e.featured).length,
      verifiedExperts: experts.filter(e => e.verified).length,
      avgRating: experts.reduce((sum, e) => sum + e.rating.overall, 0) / experts.length,
      totalEngagements: engagements.length,
      activeEngagements: engagements.filter(e => e.status === 'active').length,
      totalValue: engagements.reduce((sum, e) => sum + e.totalValue, 0),
      topIndustries: this.getTopIndustries(experts),
      topExpertise: this.getTopExpertise(experts),
      monthlyGrowth: this.calculateMonthlyGrowth(experts, engagements)
    };
  }

  private getTopIndustries(experts: Expert[]): Array<{industry: string, count: number}> {
    const industryCount = new Map<string, number>();
    
    experts.forEach(expert => {
      expert.industries.forEach(industry => {
        industryCount.set(industry, (industryCount.get(industry) || 0) + 1);
      });
    });
    
    return Array.from(industryCount.entries())
      .map(([industry, count]) => ({ industry, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  private getTopExpertise(experts: Expert[]): Array<{domain: string, count: number}> {
    const expertiseCount = new Map<string, number>();
    
    experts.forEach(expert => {
      expert.expertise.forEach(exp => {
        expertiseCount.set(exp.domain, (expertiseCount.get(exp.domain) || 0) + 1);
      });
    });
    
    return Array.from(expertiseCount.entries())
      .map(([domain, count]) => ({ domain, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  private calculateMonthlyGrowth(experts: Expert[], engagements: Engagement[]): any {
    // Mock monthly growth data
    return {
      expertsJoined: [
        { month: 'Jan', count: 8 },
        { month: 'Feb', count: 12 },
        { month: 'Mar', count: 15 },
        { month: 'Apr', count: 18 }
      ],
      engagementsCompleted: [
        { month: 'Jan', count: 5 },
        { month: 'Feb', count: 8 },
        { month: 'Mar', count: 12 },
        { month: 'Apr', count: 16 }
      ],
      revenue: [
        { month: 'Jan', amount: 45000000 },
        { month: 'Feb', amount: 67000000 },
        { month: 'Mar', amount: 89000000 },
        { month: 'Apr', amount: 112000000 }
      ]
    };
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0
    }).format(amount);
  }

  getExperts(): Expert[] {
    return Array.from(this.experts.values());
  }

  getExpert(id: string): Expert | undefined {
    return this.experts.get(id);
  }

  getEngagements(): Engagement[] {
    return Array.from(this.engagements.values());
  }

  updateEngagementStatus(engagementId: string, status: Engagement['status']): void {
    const engagement = this.engagements.get(engagementId);
    if (engagement) {
      engagement.status = status;
      this.engagements.set(engagementId, engagement);
    }
  }
}

export const expertNetworkAgent = new ExpertNetworkAgent();