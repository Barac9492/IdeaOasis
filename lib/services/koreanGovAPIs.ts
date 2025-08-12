// Korean Government APIs Integration Service
// Connects to 23,000+ Korean government datasets and regulatory sources

import crypto from 'crypto';

// ===== CORE TYPES FOR GOVERNMENT API INTEGRATION =====

export interface GovDataSource {
  id: string;
  name: string;
  nameKo: string;
  authority: string;
  authorityKo: string;
  apiEndpoint?: string;
  rssUrl?: string;
  websiteUrl: string;
  dataFormat: 'json' | 'xml' | 'rss' | 'html';
  updateFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
  authRequired: boolean;
  apiKey?: string;
  category: GovDataCategory;
  industries: string[];
  priority: 'critical' | 'high' | 'medium' | 'low';
  lastChecked?: Date;
  isActive: boolean;
}

export type GovDataCategory = 
  | 'regulatory_law'
  | 'financial_regulation'
  | 'data_privacy'
  | 'industry_policy'
  | 'tax_policy'
  | 'trade_regulation'
  | 'labor_law'
  | 'environmental_policy'
  | 'healthcare_regulation'
  | 'telecommunications'
  | 'competition_law'
  | 'startup_policy';

export interface RegulatoryDocument {
  id: string;
  sourceId: string;
  title: string;
  titleEn?: string;
  documentType: DocumentType;
  authority: string;
  publishedDate: Date;
  effectiveDate?: Date;
  lastModified?: Date;
  url: string;
  content?: string;
  summary?: string;
  summaryEn?: string;
  status: DocumentStatus;
  industries: string[];
  businessTypes: string[];
  complianceDeadline?: Date;
  penalties?: string;
  keyChanges: string[];
  impactLevel: 'critical' | 'high' | 'medium' | 'low';
  language: 'ko' | 'en';
  changeDetected: boolean;
  previousVersionHash?: string;
  currentVersionHash: string;
  tags: string[];
}

export type DocumentType = 
  | 'law'           // 법률
  | 'decree'        // 대통령령
  | 'regulation'    // 부령
  | 'notice'        // 고시
  | 'guideline'     // 가이드라인
  | 'announcement'  // 공고
  | 'circular'      // 회람
  | 'interpretation' // 유권해석
  | 'faq'          // FAQ
  | 'press_release'; // 보도자료

export type DocumentStatus = 
  | 'draft'         // 초안
  | 'proposed'      // 제안
  | 'enacted'       // 제정
  | 'effective'     // 시행
  | 'amended'       // 개정
  | 'repealed'      // 폐지
  | 'suspended';    // 정지

export interface DataGoKrApiResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items: any[];
      numOfRows: number;
      pageNo: number;
      totalCount: number;
    };
  };
}

export interface RegulatoryAlert {
  id: string;
  documentId: string;
  alertType: AlertType;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  affectedIndustries: string[];
  actionRequired: boolean;
  deadline?: Date;
  recommendations: string[];
  createdAt: Date;
  notificationsSent: boolean;
}

export type AlertType = 
  | 'new_regulation'
  | 'regulation_change'
  | 'deadline_approaching'
  | 'compliance_update'
  | 'industry_impact'
  | 'penalty_change';

// ===== KOREAN GOVERNMENT APIS INTEGRATION SERVICE =====

export class KoreanGovAPIsService {
  private dataSources: GovDataSource[] = [
    // Data.go.kr - Korean Open Data Portal
    {
      id: 'data-go-kr-laws',
      name: 'Korean Open Data Portal - Laws',
      nameKo: '공공데이터포털 - 법령',
      authority: 'Ministry of Government Administration',
      authorityKo: '행정안전부',
      apiEndpoint: 'https://api.data.go.kr/openapi/v1/15000040/service/lawSearch',
      websiteUrl: 'https://www.data.go.kr',
      dataFormat: 'json',
      updateFrequency: 'daily',
      authRequired: true,
      category: 'regulatory_law',
      industries: ['all'],
      priority: 'critical',
      isActive: true
    },
    
    // National Law Information Center
    {
      id: 'law-go-kr',
      name: 'National Law Information Center',
      nameKo: '국가법령정보센터',
      authority: 'Ministry of Government Legislation',
      authorityKo: '법제처',
      apiEndpoint: 'https://open.law.go.kr/LSO/nsmLawordInfoService.do',
      rssUrl: 'https://www.law.go.kr/RSS/newLawsRss.do',
      websiteUrl: 'https://www.law.go.kr',
      dataFormat: 'xml',
      updateFrequency: 'realtime',
      authRequired: true,
      category: 'regulatory_law',
      industries: ['all'],
      priority: 'critical',
      isActive: true
    },

    // Financial Services Commission
    {
      id: 'fsc-regulations',
      name: 'Financial Services Commission APIs',
      nameKo: '금융위원회 API',
      authority: 'Financial Services Commission',
      authorityKo: '금융위원회',
      rssUrl: 'https://www.fsc.go.kr/no010101/rss',
      websiteUrl: 'https://www.fsc.go.kr',
      dataFormat: 'rss',
      updateFrequency: 'daily',
      authRequired: false,
      category: 'financial_regulation',
      industries: ['fintech', 'finance', 'banking', 'insurance'],
      priority: 'critical',
      isActive: true
    },

    // Personal Information Protection Commission
    {
      id: 'pipc-privacy',
      name: 'Personal Information Protection Commission',
      nameKo: '개인정보보호위원회',
      authority: 'Personal Information Protection Commission',
      authorityKo: '개인정보보호위원회',
      rssUrl: 'https://www.pipc.go.kr/rss/rss.xml',
      websiteUrl: 'https://www.pipc.go.kr',
      dataFormat: 'rss',
      updateFrequency: 'daily',
      authRequired: false,
      category: 'data_privacy',
      industries: ['technology', 'ecommerce', 'fintech', 'healthcare'],
      priority: 'critical',
      isActive: true
    },

    // Ministry of Science and ICT
    {
      id: 'msit-digital-policy',
      name: 'Ministry of Science and ICT',
      nameKo: '과학기술정보통신부',
      authority: 'Ministry of Science and ICT',
      authorityKo: '과학기술정보통신부',
      apiEndpoint: 'https://api.data.go.kr/openapi/service/rest/msit',
      rssUrl: 'https://www.msit.go.kr/rss/rss.xml',
      websiteUrl: 'https://www.msit.go.kr',
      dataFormat: 'json',
      updateFrequency: 'daily',
      authRequired: true,
      category: 'industry_policy',
      industries: ['technology', 'ai', 'blockchain', 'telecommunications'],
      priority: 'high',
      isActive: true
    },

    // Ministry of Trade, Industry and Energy
    {
      id: 'motie-industry',
      name: 'Ministry of Trade, Industry and Energy',
      nameKo: '산업통상자원부',
      authority: 'Ministry of Trade, Industry and Energy',
      authorityKo: '산업통상자원부',
      rssUrl: 'https://www.motie.go.kr/rss/rss.xml',
      websiteUrl: 'https://www.motie.go.kr',
      dataFormat: 'rss',
      updateFrequency: 'daily',
      authRequired: false,
      category: 'industry_policy',
      industries: ['manufacturing', 'energy', 'trade', 'startups'],
      priority: 'high',
      isActive: true
    },

    // Korea Fair Trade Commission
    {
      id: 'kftc-competition',
      name: 'Korea Fair Trade Commission',
      nameKo: '공정거래위원회',
      authority: 'Korea Fair Trade Commission',
      authorityKo: '공정거래위원회',
      rssUrl: 'https://www.ftc.go.kr/rss/rss.xml',
      websiteUrl: 'https://www.ftc.go.kr',
      dataFormat: 'rss',
      updateFrequency: 'daily',
      authRequired: false,
      category: 'competition_law',
      industries: ['all'],
      priority: 'high',
      isActive: true
    },

    // Ministry of Health and Welfare
    {
      id: 'mohw-healthcare',
      name: 'Ministry of Health and Welfare',
      nameKo: '보건복지부',
      authority: 'Ministry of Health and Welfare',
      authorityKo: '보건복지부',
      rssUrl: 'https://www.mohw.go.kr/rss/rss.xml',
      websiteUrl: 'https://www.mohw.go.kr',
      dataFormat: 'rss',
      updateFrequency: 'daily',
      authRequired: false,
      category: 'healthcare_regulation',
      industries: ['healthcare', 'pharmaceutical', 'medical_devices'],
      priority: 'high',
      isActive: true
    },

    // National Tax Service
    {
      id: 'nts-tax-policy',
      name: 'National Tax Service',
      nameKo: '국세청',
      authority: 'National Tax Service',
      authorityKo: '국세청',
      apiEndpoint: 'https://api.data.go.kr/openapi/service/rest/nts',
      websiteUrl: 'https://www.nts.go.kr',
      dataFormat: 'json',
      updateFrequency: 'weekly',
      authRequired: true,
      category: 'tax_policy',
      industries: ['all'],
      priority: 'medium',
      isActive: true
    },

    // Ministry of Employment and Labor
    {
      id: 'moel-labor-law',
      name: 'Ministry of Employment and Labor',
      nameKo: '고용노동부',
      authority: 'Ministry of Employment and Labor',
      authorityKo: '고용노동부',
      rssUrl: 'https://www.moel.go.kr/rss/rss.xml',
      websiteUrl: 'https://www.moel.go.kr',
      dataFormat: 'rss',
      updateFrequency: 'daily',
      authRequired: false,
      category: 'labor_law',
      industries: ['all'],
      priority: 'medium',
      isActive: true
    }
  ];

  private apiKeys = {
    'data.go.kr': process.env.DATA_GOV_KR_API_KEY || '',
    'law.go.kr': process.env.LAW_GOV_KR_API_KEY || '',
    'msit': process.env.MSIT_API_KEY || ''
  };

  private documentCache = new Map<string, RegulatoryDocument[]>();
  private lastFetchTimes = new Map<string, Date>();

  // ===== MAIN DATA FETCHING METHODS =====

  async fetchAllSources(): Promise<RegulatoryDocument[]> {
    const allDocuments: RegulatoryDocument[] = [];
    
    for (const source of this.dataSources.filter(s => s.isActive)) {
      try {
        console.log(`Fetching from ${source.nameKo}...`);
        const documents = await this.fetchFromSource(source);
        
        // Process and detect changes
        const processedDocs = await this.processDocuments(documents, source);
        allDocuments.push(...processedDocs);
        
        // Update cache and last fetch time
        this.documentCache.set(source.id, processedDocs);
        this.lastFetchTimes.set(source.id, new Date());
        
        console.log(`✅ Fetched ${processedDocs.length} documents from ${source.nameKo}`);
      } catch (error) {
        console.error(`❌ Failed to fetch from ${source.nameKo}:`, error);
      }
    }

    return allDocuments;
  }

  async fetchFromSource(source: GovDataSource): Promise<any[]> {
    switch (source.dataFormat) {
      case 'json':
        return await this.fetchJsonAPI(source);
      case 'xml':
        return await this.fetchXmlAPI(source);
      case 'rss':
        return await this.fetchRSSFeed(source);
      case 'html':
        return await this.fetchHTMLScraping(source);
      default:
        throw new Error(`Unsupported data format: ${source.dataFormat}`);
    }
  }

  private async fetchJsonAPI(source: GovDataSource): Promise<any[]> {
    if (!source.apiEndpoint) {
      throw new Error(`No API endpoint for ${source.name}`);
    }

    const params = new URLSearchParams({
      serviceKey: this.getApiKey(source),
      pageNo: '1',
      numOfRows: '100',
      type: 'json'
    });

    const response = await fetch(`${source.apiEndpoint}?${params}`);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data: DataGoKrApiResponse = await response.json();
    
    if (data.response.header.resultCode !== '00') {
      throw new Error(`API error: ${data.response.header.resultMsg}`);
    }

    return data.response.body.items || [];
  }

  private async fetchXmlAPI(source: GovDataSource): Promise<any[]> {
    if (!source.apiEndpoint) {
      throw new Error(`No API endpoint for ${source.name}`);
    }

    const params = new URLSearchParams({
      OC: this.getApiKey(source),
      target: 'law',
      type: 'XML'
    });

    const response = await fetch(`${source.apiEndpoint}?${params}`);
    
    if (!response.ok) {
      throw new Error(`XML API request failed: ${response.status}`);
    }

    const xmlText = await response.text();
    return this.parseXMLToDocuments(xmlText);
  }

  private async fetchRSSFeed(source: GovDataSource): Promise<any[]> {
    if (!source.rssUrl) {
      throw new Error(`No RSS URL for ${source.name}`);
    }

    const response = await fetch(source.rssUrl);
    
    if (!response.ok) {
      throw new Error(`RSS fetch failed: ${response.status}`);
    }

    const xmlText = await response.text();
    return this.parseRSSToDocuments(xmlText);
  }

  private async fetchHTMLScraping(source: GovDataSource): Promise<any[]> {
    // Call existing scraping API
    const response = await fetch('/api/regulatory/scrape', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target: source })
    });

    if (!response.ok) {
      throw new Error(`HTML scraping failed: ${response.status}`);
    }

    const data = await response.json();
    return data.items || [];
  }

  // ===== DATA PROCESSING AND CHANGE DETECTION =====

  private async processDocuments(rawDocs: any[], source: GovDataSource): Promise<RegulatoryDocument[]> {
    const processedDocs: RegulatoryDocument[] = [];

    for (const rawDoc of rawDocs) {
      try {
        const document = await this.transformToRegulatoryDocument(rawDoc, source);
        
        // Detect changes from previous version
        const changeDetected = await this.detectChanges(document);
        document.changeDetected = changeDetected;

        processedDocs.push(document);
      } catch (error) {
        console.error(`Failed to process document:`, error);
      }
    }

    return processedDocs;
  }

  private async transformToRegulatoryDocument(rawDoc: any, source: GovDataSource): Promise<RegulatoryDocument> {
    const content = this.extractContent(rawDoc);
    const currentHash = this.generateContentHash(content);

    return {
      id: this.generateDocumentId(rawDoc, source),
      sourceId: source.id,
      title: rawDoc.title || rawDoc.법령명 || rawDoc.공고명 || '',
      documentType: this.determineDocumentType(rawDoc),
      authority: source.authorityKo,
      publishedDate: this.parseDate(rawDoc.publishedDate || rawDoc.제정일자 || rawDoc.공고일자),
      effectiveDate: this.parseDate(rawDoc.effectiveDate || rawDoc.시행일자),
      lastModified: this.parseDate(rawDoc.lastModified || rawDoc.개정일자),
      url: rawDoc.url || rawDoc.link || source.websiteUrl,
      content,
      summary: await this.generateSummary(content),
      status: this.determineDocumentStatus(rawDoc),
      industries: this.extractIndustries(content, source.industries),
      businessTypes: this.extractBusinessTypes(content),
      keyChanges: this.extractKeyChanges(content),
      impactLevel: this.assessImpactLevel(content, rawDoc),
      language: 'ko',
      changeDetected: false,
      currentVersionHash: currentHash,
      tags: this.generateTags(content, source)
    };
  }

  private async detectChanges(document: RegulatoryDocument): Promise<boolean> {
    const cached = this.documentCache.get(document.sourceId);
    if (!cached) return true; // New document

    const existing = cached.find(doc => doc.id === document.id);
    if (!existing) return true; // New document

    // Compare content hashes
    const hasContentChanged = existing.currentVersionHash !== document.currentVersionHash;
    
    if (hasContentChanged) {
      document.previousVersionHash = existing.currentVersionHash;
      console.log(`🔄 Change detected in document: ${document.title}`);
    }

    return hasContentChanged;
  }

  // ===== CONTENT ANALYSIS AND CLASSIFICATION =====

  private extractIndustries(content: string, sourceIndustries: string[]): string[] {
    const industries: string[] = [...sourceIndustries];
    
    const industryKeywords = {
      'fintech': ['핀테크', '금융', '은행', '결제', '디지털자산', 'P2P'],
      'ai': ['인공지능', 'AI', '머신러닝', '딥러닝', '자동화'],
      'blockchain': ['블록체인', '암호화폐', '가상자산', 'NFT', 'DeFi'],
      'ecommerce': ['전자상거래', '온라인쇼핑', '이커머스', '플랫폼'],
      'healthcare': ['의료', '헬스케어', '바이오', '제약', '의료기기'],
      'mobility': ['모빌리티', '자동차', '자율주행', '전기차', '공유경제'],
      'proptech': ['부동산', '프롭테크', '건설', '주택'],
      'edutech': ['교육', '에듀테크', '이러닝', '온라인교육'],
      'food': ['식품', '푸드테크', '음식배달', '외식업'],
      'energy': ['에너지', '신재생에너지', '태양광', '풍력'],
      'manufacturing': ['제조', '스마트팩토리', '산업', 'IoT'],
      'gaming': ['게임', '게이밍', 'e스포츠', '콘텐츠']
    };

    for (const [industry, keywords] of Object.entries(industryKeywords)) {
      if (keywords.some(keyword => content.toLowerCase().includes(keyword))) {
        if (!industries.includes(industry)) {
          industries.push(industry);
        }
      }
    }

    return industries.length > 0 ? industries : ['general'];
  }

  private extractBusinessTypes(content: string): string[] {
    const businessTypes: string[] = [];
    
    const businessKeywords = {
      'startups': ['스타트업', '창업', '벤처기업', '초기기업'],
      'smes': ['중소기업', '소상공인', '중견기업'],
      'enterprises': ['대기업', '대규모기업', '상장기업'],
      'platforms': ['플랫폼', '온라인플랫폼', '디지털플랫폼'],
      'foreign': ['외국인투자기업', '해외기업', '글로벌기업'],
      'financial': ['금융기관', '은행', '보험회사', '증권회사'],
      'public': ['공공기관', '정부기관', '지방자치단체']
    };

    for (const [type, keywords] of Object.entries(businessKeywords)) {
      if (keywords.some(keyword => content.includes(keyword))) {
        businessTypes.push(type);
      }
    }

    return businessTypes.length > 0 ? businessTypes : ['all'];
  }

  private extractKeyChanges(content: string): string[] {
    const changes: string[] = [];
    
    // Korean regulatory change patterns
    const changePatterns = [
      /(.{1,50})\s*(신설|추가|도입)/g,
      /(.{1,50})\s*(개정|변경|수정)/g,
      /(.{1,50})\s*(폐지|삭제|제거)/g,
      /(.{1,50})\s*(강화|확대|확장)/g,
      /(.{1,50})\s*(완화|축소|감소)/g,
      /기존\s*(.{1,50})\s*에서\s*(.{1,50})\s*으로\s*변경/g,
      /(.{1,50})\s*(의무화|필수화)/g,
      /(.{1,50})\s*(금지|제한)/g
    ];

    for (const pattern of changePatterns) {
      const matches = [...content.matchAll(pattern)];
      for (const match of matches) {
        changes.push(match[0].trim());
      }
    }

    return changes.slice(0, 10); // Limit to top 10 changes
  }

  private assessImpactLevel(content: string, rawDoc: any): 'critical' | 'high' | 'medium' | 'low' {
    const criticalKeywords = ['전면금지', '즉시중단', '의무화', '강제', '처벌', '과태료'];
    const highKeywords = ['개정', '변경', '신설', '강화', '확대'];
    const mediumKeywords = ['권고', '지침', '가이드라인', '안내'];

    const text = content.toLowerCase();

    if (criticalKeywords.some(keyword => text.includes(keyword))) {
      return 'critical';
    } else if (highKeywords.some(keyword => text.includes(keyword))) {
      return 'high';
    } else if (mediumKeywords.some(keyword => text.includes(keyword))) {
      return 'medium';
    }

    return 'low';
  }

  // ===== ALERT GENERATION =====

  async generateAlerts(documents: RegulatoryDocument[]): Promise<RegulatoryAlert[]> {
    const alerts: RegulatoryAlert[] = [];

    for (const doc of documents) {
      if (doc.changeDetected || doc.impactLevel === 'critical') {
        const alert = await this.createAlert(doc);
        alerts.push(alert);
      }
    }

    return alerts;
  }

  private async createAlert(document: RegulatoryDocument): Promise<RegulatoryAlert> {
    const alertType = this.determineAlertType(document);
    const severity = this.mapImpactToSeverity(document.impactLevel);
    
    return {
      id: crypto.randomUUID(),
      documentId: document.id,
      alertType,
      severity,
      title: this.generateAlertTitle(document, alertType),
      description: await this.generateAlertDescription(document, alertType),
      affectedIndustries: document.industries,
      actionRequired: this.requiresAction(document),
      deadline: document.complianceDeadline,
      recommendations: await this.generateRecommendations(document),
      createdAt: new Date(),
      notificationsSent: false
    };
  }

  private determineAlertType(document: RegulatoryDocument): AlertType {
    if (document.changeDetected) {
      return 'regulation_change';
    }
    
    if (!document.previousVersionHash) {
      return 'new_regulation';
    }

    if (document.complianceDeadline) {
      const daysUntilDeadline = Math.floor(
        (document.complianceDeadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      if (daysUntilDeadline <= 30) {
        return 'deadline_approaching';
      }
    }

    return 'compliance_update';
  }

  private generateAlertTitle(document: RegulatoryDocument, alertType: AlertType): string {
    const alertTypeNames = {
      'new_regulation': '신규 규제',
      'regulation_change': '규제 변경',
      'deadline_approaching': '마감일 임박',
      'compliance_update': '컴플라이언스 업데이트',
      'industry_impact': '업계 영향',
      'penalty_change': '처벌 변경'
    };

    return `[${alertTypeNames[alertType]}] ${document.title}`;
  }

  private async generateAlertDescription(document: RegulatoryDocument, alertType: AlertType): Promise<string> {
    const baseDescription = document.summary || document.title;
    
    switch (alertType) {
      case 'regulation_change':
        return `${baseDescription}\n\n주요 변경사항:\n${document.keyChanges.slice(0, 3).map(c => `• ${c}`).join('\n')}`;
      
      case 'deadline_approaching':
        const deadline = document.complianceDeadline?.toLocaleDateString('ko-KR') || '미정';
        return `${baseDescription}\n\n⚠️ 준수 마감일: ${deadline}`;
      
      default:
        return baseDescription;
    }
  }

  private async generateRecommendations(document: RegulatoryDocument): Promise<string[]> {
    const recommendations: string[] = [];

    if (document.complianceDeadline) {
      recommendations.push('컴플라이언스 데드라인 준수를 위한 내부 검토 실시');
    }

    if (document.impactLevel === 'critical' || document.impactLevel === 'high') {
      recommendations.push('법무팀 또는 전문가와의 긴급 상담 권장');
      recommendations.push('현재 비즈니스 프로세스에 미치는 영향 분석');
    }

    if (document.keyChanges.length > 0) {
      recommendations.push('변경사항에 따른 내부 정책 업데이트 검토');
    }

    recommendations.push('관련 부서 및 직원에게 변경사항 공유');
    
    return recommendations;
  }

  // ===== UTILITY METHODS =====

  private getApiKey(source: GovDataSource): string {
    if (source.id.includes('data-go-kr')) {
      return this.apiKeys['data.go.kr'];
    } else if (source.id.includes('law-go-kr')) {
      return this.apiKeys['law.go.kr'];
    } else if (source.id.includes('msit')) {
      return this.apiKeys['msit'];
    }
    return '';
  }

  private generateDocumentId(rawDoc: any, source: GovDataSource): string {
    const identifier = rawDoc.id || rawDoc.법령ID || rawDoc.공고번호 || rawDoc.title || rawDoc.link;
    return crypto.createHash('sha256').update(`${source.id}-${identifier}`).digest('hex').substring(0, 16);
  }

  private generateContentHash(content: string): string {
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  private extractContent(rawDoc: any): string {
    return rawDoc.content || rawDoc.description || rawDoc.summary || rawDoc.title || '';
  }

  private parseDate(dateString: string | undefined): Date {
    if (!dateString) return new Date();
    
    // Handle various Korean date formats
    const formats = [
      /(\d{4})[\-\.\/](\d{1,2})[\-\.\/](\d{1,2})/, // YYYY-MM-DD, YYYY.MM.DD, YYYY/MM/DD
      /(\d{4})(\d{2})(\d{2})/, // YYYYMMDD
    ];

    for (const format of formats) {
      const match = dateString.match(format);
      if (match) {
        return new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
      }
    }

    // Fallback to native Date parsing
    const parsed = new Date(dateString);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  }

  private determineDocumentType(rawDoc: any): DocumentType {
    const title = (rawDoc.title || '').toLowerCase();
    
    if (title.includes('법률') || title.includes('법')) return 'law';
    if (title.includes('대통령령') || title.includes('령')) return 'decree';
    if (title.includes('부령') || title.includes('규정')) return 'regulation';
    if (title.includes('고시')) return 'notice';
    if (title.includes('가이드라인') || title.includes('지침')) return 'guideline';
    if (title.includes('공고')) return 'announcement';
    if (title.includes('회람')) return 'circular';
    if (title.includes('해석')) return 'interpretation';
    if (title.includes('faq')) return 'faq';
    if (title.includes('보도자료') || title.includes('보도')) return 'press_release';

    return 'announcement'; // Default
  }

  private determineDocumentStatus(rawDoc: any): DocumentStatus {
    const status = (rawDoc.status || '').toLowerCase();
    const title = (rawDoc.title || '').toLowerCase();

    if (status.includes('시행') || title.includes('시행')) return 'effective';
    if (status.includes('제정') || title.includes('제정')) return 'enacted';
    if (status.includes('개정') || title.includes('개정')) return 'amended';
    if (status.includes('폐지') || title.includes('폐지')) return 'repealed';
    if (status.includes('정지') || title.includes('정지')) return 'suspended';
    if (status.includes('초안') || title.includes('초안')) return 'draft';
    if (status.includes('제안') || title.includes('제안')) return 'proposed';

    return 'effective'; // Default
  }

  private async generateSummary(content: string): Promise<string> {
    // In production, this would use AI for summarization
    // For now, return first 200 characters
    return content.substring(0, 200) + (content.length > 200 ? '...' : '');
  }

  private generateTags(content: string, source: GovDataSource): string[] {
    const tags: string[] = [source.category];
    
    // Extract common regulatory tags
    const tagKeywords = [
      '규제', '법률', '정책', '가이드라인', '컴플라이언스',
      '허가', '신고', '등록', '인증', '승인',
      '금지', '제한', '의무', '권고', '지원'
    ];

    for (const keyword of tagKeywords) {
      if (content.includes(keyword)) {
        tags.push(keyword);
      }
    }

    return [...new Set(tags)]; // Remove duplicates
  }

  private parseXMLToDocuments(xmlText: string): any[] {
    // Basic XML parsing - in production would use proper XML parser
    const items: any[] = [];
    
    try {
      // Extract items between <item> tags
      const itemRegex = /<item[^>]*>(.*?)<\/item>/gs;
      const matches = xmlText.matchAll(itemRegex);
      
      for (const match of matches) {
        const itemXml = match[1];
        const item: any = {};
        
        // Extract basic fields
        const fieldRegex = /<(\w+)>(.*?)<\/\1>/g;
        const fieldMatches = itemXml.matchAll(fieldRegex);
        
        for (const fieldMatch of fieldMatches) {
          item[fieldMatch[1]] = fieldMatch[2];
        }
        
        items.push(item);
      }
    } catch (error) {
      console.error('XML parsing error:', error);
    }

    return items;
  }

  private parseRSSToDocuments(xmlText: string): any[] {
    const items: any[] = [];
    
    try {
      const itemRegex = /<item[^>]*>(.*?)<\/item>/gs;
      const matches = xmlText.matchAll(itemRegex);
      
      for (const match of matches) {
        const itemXml = match[1];
        const item: any = {};
        
        // Extract RSS fields
        const titleMatch = itemXml.match(/<title[^>]*><!\[CDATA\[(.*?)\]\]><\/title>/s) || 
                          itemXml.match(/<title[^>]*>(.*?)<\/title>/s);
        if (titleMatch) item.title = titleMatch[1];
        
        const descMatch = itemXml.match(/<description[^>]*><!\[CDATA\[(.*?)\]\]><\/description>/s) ||
                         itemXml.match(/<description[^>]*>(.*?)<\/description>/s);
        if (descMatch) item.description = descMatch[1];
        
        const linkMatch = itemXml.match(/<link[^>]*>(.*?)<\/link>/s);
        if (linkMatch) item.link = linkMatch[1];
        
        const pubDateMatch = itemXml.match(/<pubDate[^>]*>(.*?)<\/pubDate>/s);
        if (pubDateMatch) item.publishedDate = pubDateMatch[1];
        
        items.push(item);
      }
    } catch (error) {
      console.error('RSS parsing error:', error);
    }

    return items;
  }

  private mapImpactToSeverity(impact: string): 'critical' | 'high' | 'medium' | 'low' {
    return impact as 'critical' | 'high' | 'medium' | 'low';
  }

  private requiresAction(document: RegulatoryDocument): boolean {
    return document.impactLevel === 'critical' || 
           document.impactLevel === 'high' || 
           !!document.complianceDeadline;
  }

  // ===== PUBLIC API METHODS =====

  async getActiveSources(): Promise<GovDataSource[]> {
    return this.dataSources.filter(source => source.isActive);
  }

  async getSourceById(id: string): Promise<GovDataSource | undefined> {
    return this.dataSources.find(source => source.id === id);
  }

  async getDocumentsByIndustry(industry: string): Promise<RegulatoryDocument[]> {
    const allDocs: RegulatoryDocument[] = [];
    
    for (const docs of this.documentCache.values()) {
      allDocs.push(...docs.filter(doc => doc.industries.includes(industry)));
    }
    
    return allDocs;
  }

  async getRecentChanges(days: number = 7): Promise<RegulatoryDocument[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const allDocs: RegulatoryDocument[] = [];
    for (const docs of this.documentCache.values()) {
      allDocs.push(...docs.filter(doc => 
        doc.changeDetected && doc.publishedDate >= cutoffDate
      ));
    }
    
    return allDocs.sort((a, b) => b.publishedDate.getTime() - a.publishedDate.getTime());
  }

  async getCriticalAlerts(): Promise<RegulatoryAlert[]> {
    const recentDocs = await this.getRecentChanges(1);
    const criticalDocs = recentDocs.filter(doc => doc.impactLevel === 'critical');
    return await this.generateAlerts(criticalDocs);
  }
}

export const koreanGovAPIs = new KoreanGovAPIsService();