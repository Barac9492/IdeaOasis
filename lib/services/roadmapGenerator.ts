// lib/services/roadmapGenerator.ts
import type { Idea, ExecutionStep } from '../types';

export class RoadmapGenerator {
  
  /**
   * Generates a comprehensive execution roadmap for a Korean market entry
   * Considers regulatory, cultural, and business factors specific to Korea
   */
  static generateRoadmap(idea: Idea): ExecutionStep[] {
    const roadmap: ExecutionStep[] = [];
    
    // Phase 1: Validation & Research (Weeks 1-4)
    roadmap.push(...this.generateValidationSteps(idea));
    
    // Phase 2: Legal & Regulatory (Weeks 2-8)
    roadmap.push(...this.generateLegalSteps(idea));
    
    // Phase 3: Partnership & Network (Weeks 6-12)
    roadmap.push(...this.generatePartnershipSteps(idea));
    
    // Phase 4: Technical Development (Weeks 8-16)
    roadmap.push(...this.generateTechnicalSteps(idea));
    
    // Phase 5: Marketing & Launch (Weeks 12-20)
    roadmap.push(...this.generateMarketingSteps(idea));
    
    // Phase 6: Growth & Funding (Weeks 16-24)
    roadmap.push(...this.generateFundingSteps(idea));
    
    // Sort by priority and timeframe
    return this.optimizeRoadmap(roadmap);
  }
  
  private static generateValidationSteps(idea: Idea): ExecutionStep[] {
    const steps: ExecutionStep[] = [
      {
        id: 'validation-001',
        title: '한국 시장 조사 및 고객 인터뷰',
        description: '타겟 고객층 정의, 심층 인터뷰 실시, 페인 포인트 검증',
        category: 'validation',
        timeframe: '2-3주',
        priority: 'high',
        resources: ['설문조사 플랫폼', '인터뷰 참가자 모집', '시장조사 도구'],
        estimatedCost: '50-100만원'
      },
      {
        id: 'validation-002',
        title: '경쟁사 분석 및 포지셔닝',
        description: '국내외 직간접 경쟁사 분석, 차별화 포인트 도출',
        category: 'validation',
        timeframe: '1-2주',
        priority: 'high',
        resources: ['경쟁사 분석 도구', '업계 리포트'],
        estimatedCost: '30-50만원'
      }
    ];
    
    // Add sector-specific validation
    if (this.isRegulatedSector(idea)) {
      steps.push({
        id: 'validation-003',
        title: '규제 요구사항 사전 검토',
        description: '관련 법규 및 허가 요건 파악, 컴플라이언스 체크리스트 작성',
        category: 'validation',
        timeframe: '2-3주',
        priority: 'high',
        resources: ['법무 자문', '규제 전문가 컨설팅'],
        estimatedCost: '100-200만원'
      });
    }
    
    return steps;
  }
  
  private static generateLegalSteps(idea: Idea): ExecutionStep[] {
    const steps: ExecutionStep[] = [
      {
        id: 'legal-001',
        title: '법인 설립 및 사업자등록',
        description: '주식회사 또는 유한회사 설립, 사업자등록증 발급',
        category: 'legal',
        timeframe: '1-2주',
        priority: 'high',
        resources: ['법무사', '회계사', '등기소'],
        estimatedCost: '50-100만원'
      },
      {
        id: 'legal-002',
        title: '지적재산권 보호',
        description: '상표권, 특허 출원 검토 및 등록',
        category: 'legal',
        timeframe: '4-8주',
        priority: 'medium',
        resources: ['특허 변리사', '상표 검색 도구'],
        estimatedCost: '100-300만원'
      }
    ];
    
    // Sector-specific legal requirements
    const { sector, tags = [] } = idea;
    const content = `${sector} ${tags.join(' ')}`.toLowerCase();
    
    if (content.includes('fintech') || content.includes('핀테크') || content.includes('payment')) {
      steps.push({
        id: 'legal-003',
        title: '금융 관련 인허가 취득',
        description: '전자금융업 등록, PG사 제휴, 금융감독원 신고',
        category: 'legal',
        timeframe: '8-12주',
        priority: 'high',
        resources: ['금융법무 전문가', '금융감독원'],
        estimatedCost: '300-500만원'
      });
    }
    
    if (content.includes('food') || content.includes('음식') || content.includes('restaurant')) {
      steps.push({
        id: 'legal-004',
        title: '식품 관련 인허가 및 위생 관리',
        description: '식품위생법 준수, 영업신고, HACCP 인증 검토',
        category: 'legal',
        timeframe: '3-6주',
        priority: 'high',
        resources: ['식품안전 컨설턴트', '보건소'],
        estimatedCost: '100-200만원'
      });
    }
    
    return steps;
  }
  
  private static generatePartnershipSteps(idea: Idea): ExecutionStep[] {
    const steps: ExecutionStep[] = [
      {
        id: 'partnership-001',
        title: '핵심 파트너십 발굴 및 제휴',
        description: '업계 주요 플레이어와의 전략적 제휴 관계 구축',
        category: 'partnership',
        timeframe: '6-8주',
        priority: 'high',
        resources: ['업계 네트워킹', 'BD 전문가'],
        estimatedCost: '100-200만원'
      },
      {
        id: 'partnership-002',
        title: '기술 파트너 및 벤더 선정',
        description: '개발, 인프라, 마케팅 파트너 선정 및 계약',
        category: 'partnership',
        timeframe: '4-6주',
        priority: 'medium',
        resources: ['기술 평가', '벤더 비교 분석'],
        estimatedCost: '50-100만원'
      },
      {
        id: 'partnership-003',
        title: '스타트업 생태계 진입',
        description: '액셀러레이터, 인큐베이터, 스타트업 커뮤니티 참여',
        category: 'partnership',
        timeframe: '2-4주',
        priority: 'medium',
        resources: ['스타트업 이벤트', '멘토링 프로그램'],
        estimatedCost: '20-50만원'
      }
    ];
    
    // Add chaebol partnership if B2B or enterprise focus
    if (this.isEnterpriseOriented(idea)) {
      steps.push({
        id: 'partnership-004',
        title: '대기업 오픈 이노베이션 프로그램 참여',
        description: '삼성, LG, SK 등 대기업 협력 프로그램 지원 및 참여',
        category: 'partnership',
        timeframe: '8-12주',
        priority: 'medium',
        resources: ['기업 혁신 담당자 네트워킹', '프로그램 지원서 작성'],
        estimatedCost: '30-100만원'
      });
    }
    
    return steps;
  }
  
  private static generateTechnicalSteps(idea: Idea): ExecutionStep[] {
    const steps: ExecutionStep[] = [
      {
        id: 'technical-001',
        title: 'MVP 개발 및 프로토타입 제작',
        description: '핵심 기능 중심의 최소 실행 가능한 제품 개발',
        category: 'technical',
        timeframe: '8-12주',
        priority: 'high',
        resources: ['개발팀', '디자이너', 'QA 테스터'],
        estimatedCost: '500-1000만원'
      },
      {
        id: 'technical-002',
        title: '한국형 UI/UX 최적화',
        description: '한국 사용자 선호도에 맞는 인터페이스 디자인 및 사용성 개선',
        category: 'technical',
        timeframe: '3-4주',
        priority: 'high',
        resources: ['UX/UI 디자이너', '현지화 전문가'],
        estimatedCost: '100-300만원'
      },
      {
        id: 'technical-003',
        title: '보안 및 개인정보보호 대응',
        description: '개인정보보호법 준수, 보안 인증 취득',
        category: 'technical',
        timeframe: '4-6주',
        priority: 'high',
        resources: ['정보보안 전문가', '개인정보보호 컨설턴트'],
        estimatedCost: '200-400만원'
      }
    ];
    
    return steps;
  }
  
  private static generateMarketingSteps(idea: Idea): ExecutionStep[] {
    return [
      {
        id: 'marketing-001',
        title: '브랜딩 및 메시징 현지화',
        description: '한국 시장에 맞는 브랜드 아이덴티티 및 마케팅 메시지 개발',
        category: 'marketing',
        timeframe: '3-4주',
        priority: 'high',
        resources: ['브랜딩 에이전시', '카피라이터', '현지화 전문가'],
        estimatedCost: '200-500만원'
      },
      {
        id: 'marketing-002',
        title: '디지털 마케팅 채널 구축',
        description: '네이버, 카카오, 인스타그램 등 주요 플랫폼 마케팅 준비',
        category: 'marketing',
        timeframe: '2-3주',
        priority: 'high',
        resources: ['디지털 마케팅 에이전시', 'SNS 매니저'],
        estimatedCost: '100-300만원'
      },
      {
        id: 'marketing-003',
        title: '베타 테스터 모집 및 피드백 수집',
        description: '얼리 어답터 대상 베타 테스트 실시 및 개선사항 도출',
        category: 'marketing',
        timeframe: '4-6주',
        priority: 'medium',
        resources: ['커뮤니티 관리', '피드백 분석 도구'],
        estimatedCost: '50-150만원'
      },
      {
        id: 'marketing-004',
        title: '공식 런칭 이벤트 및 PR',
        description: '언론 보도, 인플루언서 협업, 런칭 이벤트 기획',
        category: 'marketing',
        timeframe: '2-3주',
        priority: 'medium',
        resources: ['PR 에이전시', '이벤트 플래너', '미디어 관계자'],
        estimatedCost: '200-500만원'
      }
    ];
  }
  
  private static generateFundingSteps(idea: Idea): ExecutionStep[] {
    return [
      {
        id: 'funding-001',
        title: '정부 지원 프로그램 신청',
        description: 'K-Startup, 중소벤처기업부, 서울시 등 공공 지원사업 신청',
        category: 'funding',
        timeframe: '4-6주',
        priority: 'medium',
        resources: ['사업계획서 작성', '정부지원 컨설턴트'],
        estimatedCost: '100-200만원'
      },
      {
        id: 'funding-002',
        title: '엔젤 투자 및 시드 라운드 준비',
        description: '투자자 피칭, 사업계획서 작성, 투자 유치 활동',
        category: 'funding',
        timeframe: '8-12주',
        priority: 'medium',
        resources: ['IR 컨설턴트', '투자자 네트워크', '법무 자문'],
        estimatedCost: '200-500만원'
      },
      {
        id: 'funding-003',
        title: '액셀러레이터 프로그램 참여',
        description: 'Primer, SparkLabs, Bluepoint 등 액셀러레이터 지원',
        category: 'funding',
        timeframe: '2-4주 (지원)', 
        priority: 'low',
        resources: ['멘토링', '투자금', '네트워킹'],
        estimatedCost: '지분 교환'
      }
    ];
  }
  
  private static optimizeRoadmap(steps: ExecutionStep[]): ExecutionStep[] {
    // Sort by priority (high -> medium -> low) and category dependencies
    const priorityOrder = { 'high': 0, 'medium': 1, 'low': 2 };
    const categoryOrder = { 'validation': 0, 'legal': 1, 'partnership': 2, 'technical': 3, 'marketing': 4, 'funding': 5 };
    
    return steps.sort((a, b) => {
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return categoryOrder[a.category] - categoryOrder[b.category];
    });
  }
  
  // Helper methods
  private static isRegulatedSector(idea: Idea): boolean {
    const { sector, tags = [] } = idea;
    const regulated = ['fintech', '핀테크', 'healthcare', '헬스케어', 'food', '음식', 'education', '교육'];
    const content = `${sector} ${tags.join(' ')}`.toLowerCase();
    return regulated.some(r => content.includes(r));
  }
  
  private static isEnterpriseOriented(idea: Idea): boolean {
    const { businessModel = '', tags = [], targetUser = '' } = idea;
    const enterprise = ['b2b', 'enterprise', '기업', 'saas', 'workplace'];
    const content = `${businessModel} ${tags.join(' ')} ${targetUser}`.toLowerCase();
    return enterprise.some(e => content.includes(e));
  }
}