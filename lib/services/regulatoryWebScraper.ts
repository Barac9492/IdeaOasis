import { NextResponse } from 'next/server';

interface RegulatorySource {
  id: string;
  name: string;
  url: string;
  selector: string; // CSS selector for news/updates
  checkInterval: number; // in minutes
  lastChecked?: Date;
  category: string;
}

interface RegulatoryUpdate {
  id: string;
  sourceId: string;
  sourceName: string;
  title: string;
  url: string;
  publishedDate: string;
  summary: string;
  category: string;
  tags: string[];
  importance: 'low' | 'medium' | 'high' | 'critical';
  businessImpact?: string;
  affectedIndustries?: string[];
  extractedAt: Date;
}

// Korean government regulatory sources to monitor
const REGULATORY_SOURCES: RegulatorySource[] = [
  {
    id: 'kpipa',
    name: '개인정보보호위원회',
    url: 'https://www.pipc.go.kr/np/cop/bbs/selectBoardList.do?bbsId=BS074&mCode=C020010000',
    selector: '.board_list tbody tr',
    checkInterval: 60,
    category: '개인정보보호'
  },
  {
    id: 'ftc',
    name: '공정거래위원회',
    url: 'https://www.ftc.go.kr/www/selectReportUserList.do?key=10',
    selector: '.bd_list tbody tr',
    checkInterval: 60,
    category: '공정거래'
  },
  {
    id: 'mfds',
    name: '식품의약품안전처',
    url: 'https://www.mfds.go.kr/brd/m_74/list.do',
    selector: '.board_list tbody tr',
    checkInterval: 60,
    category: '의료/식품'
  },
  {
    id: 'fsc',
    name: '금융위원회',
    url: 'https://www.fsc.go.kr/no010101',
    selector: '.board_list tbody tr',
    checkInterval: 60,
    category: '금융'
  },
  {
    id: 'msit',
    name: '과학기술정보통신부',
    url: 'https://www.msit.go.kr/bbs/list.do?sCode=user&mId=113&mPid=112',
    selector: '.board_list tbody tr',
    checkInterval: 60,
    category: '과학기술/ICT'
  }
];

// Keywords to identify high-impact regulatory changes
const HIGH_IMPACT_KEYWORDS = [
  '시행령', '개정', '신설', '강화', '의무화', '규제', '과징금', '제재',
  '처벌', '금지', '허가', '등록', '신고', '라이센스', '인증', '심사'
];

const INDUSTRY_KEYWORDS = {
  fintech: ['핀테크', '전자금융', '간편결제', '디지털자산', '가상자산', '블록체인', '마이데이터'],
  ecommerce: ['전자상거래', '온라인', '플랫폼', '마켓플레이스', '배송', '소비자보호'],
  healthtech: ['의료', '헬스케어', '원격의료', '디지털치료', '의료기기', 'AI진단'],
  edutech: ['에듀테크', '온라인교육', '이러닝', '원격교육', '교육플랫폼'],
  mobility: ['모빌리티', '자율주행', '공유경제', '택시', '대여', '운송'],
  proptech: ['프롭테크', '부동산', '중개', '임대', '분양', '건설'],
  foodtech: ['푸드테크', '배달', '음식', '위생', '식품안전', '주류'],
  greentech: ['그린테크', '친환경', '재생에너지', '탄소', 'ESG', '지속가능']
};

export class RegulatoryWebScraper {
  private lastChecked: Map<string, Date> = new Map();
  private cachedUpdates: Map<string, RegulatoryUpdate[]> = new Map();

  async monitorAllSources(): Promise<RegulatoryUpdate[]> {
    console.log('[SCRAPER] Starting regulatory monitoring...');
    const allUpdates: RegulatoryUpdate[] = [];

    for (const source of REGULATORY_SOURCES) {
      try {
        const updates = await this.checkSource(source);
        allUpdates.push(...updates);
        this.lastChecked.set(source.id, new Date());
      } catch (error) {
        console.error(`[SCRAPER] Failed to check ${source.name}:`, error);
      }
    }

    // Sort by importance and date
    allUpdates.sort((a, b) => {
      const importanceOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      const importanceDiff = importanceOrder[a.importance] - importanceOrder[b.importance];
      if (importanceDiff !== 0) return importanceDiff;
      
      return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
    });

    console.log(`[SCRAPER] Found ${allUpdates.length} regulatory updates`);
    return allUpdates;
  }

  private async checkSource(source: RegulatorySource): Promise<RegulatoryUpdate[]> {
    // In production, this would use puppeteer or playwright for actual web scraping
    // For now, we'll simulate with realistic data based on the source
    
    const updates: RegulatoryUpdate[] = [];
    const today = new Date();
    
    // Simulate finding 1-3 updates per source
    const updateCount = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < updateCount; i++) {
      const daysAgo = Math.floor(Math.random() * 7);
      const publishedDate = new Date(today);
      publishedDate.setDate(publishedDate.getDate() - daysAgo);
      
      const update = this.generateRealisticUpdate(source, publishedDate);
      updates.push(update);
    }
    
    return updates;
  }

  private generateRealisticUpdate(source: RegulatorySource, publishedDate: Date): RegulatoryUpdate {
    const templates = this.getSourceTemplates(source.id);
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    const importance = this.calculateImportance(template.title, template.summary);
    const affectedIndustries = this.identifyAffectedIndustries(template.title + ' ' + template.summary);
    
    return {
      id: `${source.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sourceId: source.id,
      sourceName: source.name,
      title: template.title,
      url: `${source.url}#${Date.now()}`,
      publishedDate: publishedDate.toISOString(),
      summary: template.summary,
      category: source.category,
      tags: template.tags,
      importance,
      businessImpact: template.businessImpact,
      affectedIndustries,
      extractedAt: new Date()
    };
  }

  private getSourceTemplates(sourceId: string): any[] {
    const templates: Record<string, any[]> = {
      kpipa: [
        {
          title: '개인정보보호법 시행령 일부개정령안 입법예고',
          summary: '정보주체의 권리 강화 및 개인정보처리자의 책임성 확보를 위한 개인정보보호법 시행령 개정',
          tags: ['개인정보보호법', '시행령', '입법예고'],
          businessImpact: '개인정보 처리 기업 전체 영향'
        },
        {
          title: '민감정보 처리 가이드라인 개정',
          summary: '바이오정보, 건강정보 등 민감정보 처리 시 암호화 의무 강화',
          tags: ['민감정보', '암호화', '가이드라인'],
          businessImpact: '헬스테크, 핀테크 기업 시스템 개선 필요'
        }
      ],
      ftc: [
        {
          title: '온라인 플랫폼 공정화법 시행규칙 제정',
          summary: '온라인 플랫폼 사업자의 불공정행위 금지 및 이용사업자 보호 강화',
          tags: ['플랫폼', '공정거래', '시행규칙'],
          businessImpact: '이커머스, O2O 플랫폼 운영정책 변경 필요'
        },
        {
          title: '표시·광고 심사지침 개정',
          summary: '인플루언서 마케팅 및 리뷰 광고 표시 의무 강화',
          tags: ['광고', '마케팅', '심사지침'],
          businessImpact: '전체 온라인 마케팅 기업 영향'
        }
      ],
      mfds: [
        {
          title: 'AI 의료기기 허가·심사 가이드라인 개정',
          summary: 'AI 기반 의료기기의 임상시험 자료 요구사항 완화 및 신속심사 절차 도입',
          tags: ['AI', '의료기기', '허가', '가이드라인'],
          businessImpact: '디지털헬스케어 스타트업 시장진입 촉진'
        },
        {
          title: '디지털치료기기 보험수가 적용 고시',
          summary: '정신건강, 만성질환 관리 디지털치료기기 건강보험 적용',
          tags: ['디지털치료', '보험수가', '고시'],
          businessImpact: '디지털헬스케어 기업 수익모델 확대'
        }
      ],
      fsc: [
        {
          title: '전자금융거래법 개정안 국회 통과',
          summary: '오픈뱅킹 의무화 및 마이페이먼트 도입으로 금융 혁신 가속화',
          tags: ['전자금융', '오픈뱅킹', '법개정'],
          businessImpact: '핀테크 기업 신규 서비스 기회 확대'
        },
        {
          title: '가상자산 사업자 규제 가이드라인 발표',
          summary: 'VASP 등록요건 강화 및 이용자 보호 장치 의무화',
          tags: ['가상자산', '암호화폐', '규제'],
          businessImpact: '가상자산 거래소 및 관련 서비스 전면 재정비'
        }
      ],
      msit: [
        {
          title: 'AI 윤리 가이드라인 및 신뢰성 검증 체계 도입',
          summary: 'AI 서비스 제공 기업의 윤리적 AI 개발 의무화 및 인증제 시행',
          tags: ['AI', '윤리', '인증제'],
          businessImpact: 'AI 활용 전체 기업 개발 프로세스 재정립'
        },
        {
          title: '데이터 3법 후속 시행령 개정',
          summary: '가명정보 활용 범위 확대 및 데이터 결합 절차 간소화',
          tags: ['데이터3법', '가명정보', '시행령'],
          businessImpact: '데이터 기반 서비스 기업 사업 기회 확대'
        }
      ]
    };
    
    return templates[sourceId] || [{
      title: '새로운 규제 지침 발표',
      summary: '관련 업계 규제 준수 사항 업데이트',
      tags: ['규제', '지침'],
      businessImpact: '관련 업계 검토 필요'
    }];
  }

  private calculateImportance(title: string, summary: string): 'low' | 'medium' | 'high' | 'critical' {
    const text = (title + ' ' + summary).toLowerCase();
    let score = 0;
    
    // Check for high-impact keywords
    HIGH_IMPACT_KEYWORDS.forEach(keyword => {
      if (text.includes(keyword)) score += 2;
    });
    
    // Check for urgent terms
    if (text.includes('즉시') || text.includes('긴급') || text.includes('의무화')) score += 3;
    if (text.includes('시행') || text.includes('발효')) score += 2;
    if (text.includes('개정') || text.includes('신설')) score += 2;
    if (text.includes('처벌') || text.includes('과징금')) score += 3;
    
    if (score >= 8) return 'critical';
    if (score >= 5) return 'high';
    if (score >= 2) return 'medium';
    return 'low';
  }

  private identifyAffectedIndustries(text: string): string[] {
    const affected: string[] = [];
    const lowerText = text.toLowerCase();
    
    Object.entries(INDUSTRY_KEYWORDS).forEach(([industry, keywords]) => {
      const hasMatch = keywords.some(keyword => lowerText.includes(keyword.toLowerCase()));
      if (hasMatch) {
        affected.push(industry);
      }
    });
    
    // If no specific industry identified, check for general terms
    if (affected.length === 0) {
      if (lowerText.includes('플랫폼') || lowerText.includes('온라인')) {
        affected.push('ecommerce');
      }
      if (lowerText.includes('개인정보') || lowerText.includes('데이터')) {
        affected.push('fintech', 'healthtech');
      }
    }
    
    return affected;
  }

  async getLatestUpdates(limit: number = 10): Promise<RegulatoryUpdate[]> {
    const allUpdates = await this.monitorAllSources();
    return allUpdates.slice(0, limit);
  }

  async getUpdatesByIndustry(industry: string): Promise<RegulatoryUpdate[]> {
    const allUpdates = await this.monitorAllSources();
    return allUpdates.filter(update => 
      update.affectedIndustries?.includes(industry)
    );
  }

  async getCriticalUpdates(): Promise<RegulatoryUpdate[]> {
    const allUpdates = await this.monitorAllSources();
    return allUpdates.filter(update => 
      update.importance === 'critical' || update.importance === 'high'
    );
  }
}

export const regulatoryWebScraper = new RegulatoryWebScraper();