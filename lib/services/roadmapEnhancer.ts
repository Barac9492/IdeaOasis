// lib/services/roadmapEnhancer.ts
import type { Idea, ExecutionStep } from '../types';

// Sector-specific roadmap templates with differentiated key actions
const sectorRoadmaps: Record<string, (idea: Idea) => ExecutionStep[]> = {
  '헬스케어': (idea) => [
    {
      id: 'health-1',
      title: '의료 규제 검토 및 인허가 계획',
      description: `식약처 및 보건복지부 규제 검토. ${idea.title.includes('DNA') ? 'DTC 유전자 검사 가이드라인 확인' : idea.title.includes('영양') ? '건강기능식품 판매업 신고' : '디지털 헬스케어 규제 샌드박스 신청'}`,
      category: 'legal',
      timeframe: '2-3주',
      priority: 'high',
      resources: ['의료 전문 변호사', '규제 컨설턴트'],
      estimatedCost: '500-1,000만원'
    },
    {
      id: 'health-2',
      title: '의료진 파트너십 구축',
      description: `${idea.title.includes('영양') ? '영양사 협회와 MOU 체결' : idea.title.includes('AI') ? '대학병원 AI 연구센터와 협력' : '1차 의료기관 네트워크 구축'}. 의료 자문단 구성.`,
      category: 'partnership',
      timeframe: '1-2개월',
      priority: 'high',
      resources: ['의료 네트워크', '병원 협력 담당자']
    },
    {
      id: 'health-3',
      title: '임상 검증 및 효과 측정',
      description: `100명 규모 베타 테스트. ${idea.title.includes('영양') ? '3개월 영양 개선 효과 측정' : '건강 지표 개선율 추적'}. IRB 승인 후 진행.`,
      category: 'validation',
      timeframe: '3-4개월',
      priority: 'medium',
      resources: ['임상시험 전문가', 'IRB 컨설턴트']
    }
  ],

  'FinTech': (idea) => [
    {
      id: 'fin-1',
      title: '금융 라이선스 및 규제 대응',
      description: `${idea.title.includes('투자') ? '투자권유대행업 등록' : idea.title.includes('회계') ? '세무대리 자격 검토' : '전자금융업 등록'}. 금융위원회 혁신금융서비스 지정 신청.`,
      category: 'legal',
      timeframe: '2-3개월',
      priority: 'high',
      resources: ['금융 전문 변호사', '규제 샌드박스 컨설턴트'],
      estimatedCost: '3,000-5,000만원'
    },
    {
      id: 'fin-2',
      title: '금융기관 API 연동',
      description: `${idea.title.includes('회계') ? '은행 오픈뱅킹 API 연동' : idea.title.includes('투자') ? '증권사 트레이딩 API 연결' : '카드사 결제 데이터 연동'}. 보안 인증 획득.`,
      category: 'technical',
      timeframe: '1-2개월',
      priority: 'high',
      resources: ['보안 전문가', 'API 개발자']
    },
    {
      id: 'fin-3',
      title: '초기 고객 확보 전략',
      description: `${idea.title.includes('중소기업') ? '소상공인 연합회 제휴' : idea.title.includes('직장인') ? '대기업 복지몰 입점' : '금융 앱 리뷰 플랫폼 마케팅'}`,
      category: 'marketing',
      timeframe: '1개월',
      priority: 'medium',
      resources: ['B2B 세일즈팀', '디지털 마케터']
    }
  ],

  '에듀테크': (idea) => [
    {
      id: 'edu-1',
      title: '교육 콘텐츠 큐레이션 및 제작',
      description: `${idea.title.includes('AI') ? 'GPT 기반 맞춤형 커리큘럼 생성' : idea.title.includes('영상') ? '인기 크리에이터 10명 확보' : '교육 전문가 콘텐츠 감수'}. 초기 100개 핵심 강의 제작.`,
      category: 'validation',
      timeframe: '2-3개월',
      priority: 'high',
      resources: ['교육 콘텐츠 PD', '현직 강사진'],
      estimatedCost: '2,000-3,000만원'
    },
    {
      id: 'edu-2',
      title: '교육기관 B2B 파트너십',
      description: `${idea.title.includes('직무') ? '고용노동부 HRD-Net 등록' : idea.title.includes('영상') ? '학원 연합회 MOU' : '대학교 비교과 프로그램 연계'}`,
      category: 'partnership',
      timeframe: '2개월',
      priority: 'medium',
      resources: ['교육 B2B 영업팀', '정부 사업 담당자']
    },
    {
      id: 'edu-3',
      title: '학습 효과 검증 시스템',
      description: `${idea.title.includes('AI') ? 'AI 기반 학습 성과 예측 모델' : '자격증 합격률 추적'}. 기업 교육 ROI 측정 대시보드 구축.`,
      category: 'technical',
      timeframe: '1개월',
      priority: 'medium',
      resources: ['데이터 분석가', 'UX 디자이너']
    }
  ],

  '시니어테크': (idea) => [
    {
      id: 'senior-1',
      title: '시니어 UX 최적화 및 접근성',
      description: `${idea.title.includes('AI') ? '음성 인식 정확도 95% 달성' : idea.title.includes('금융') ? '큰 글씨 모드, 음성 안내' : '원버튼 긴급 호출'}. 70대 사용자 10명과 유저빌리티 테스트.`,
      category: 'technical',
      timeframe: '1개월',
      priority: 'high',
      resources: ['시니어 UX 전문가', '접근성 컨설턴트']
    },
    {
      id: 'senior-2',
      title: '복지 기관 연계',
      description: `${idea.title.includes('케어') ? '독거노인종합지원센터 MOU' : '노인복지관 100곳 시범 서비스'}. 정부 바우처 사업 연계.`,
      category: 'partnership',
      timeframe: '2-3개월',
      priority: 'high',
      resources: ['복지 정책 전문가', '지자체 협력 담당자'],
      estimatedCost: '1,000만원'
    },
    {
      id: 'senior-3',
      title: '보호자 연동 시스템',
      description: '자녀용 모니터링 앱 개발. 일일/주간 리포트 자동 전송. 이상 징후 실시간 알림.',
      category: 'technical',
      timeframe: '2개월',
      priority: 'medium',
      resources: ['모바일 개발자', '가족 케어 전문가']
    }
  ],

  '푸드테크': (idea) => [
    {
      id: 'food-1',
      title: '식품 안전 및 위생 인증',
      description: `${idea.title.includes('배달') ? 'HACCP 인증 취득' : idea.title.includes('농산물') ? '친환경 인증 확보' : '식품안전관리인증'}. 콜드체인 시스템 구축.`,
      category: 'legal',
      timeframe: '1-2개월',
      priority: 'high',
      resources: ['식품 위생 전문가', 'HACCP 컨설턴트'],
      estimatedCost: '2,000만원'
    },
    {
      id: 'food-2',
      title: '공급망 및 물류 최적화',
      description: `${idea.title.includes('농산물') ? '산지 직송 농가 20곳 계약' : idea.title.includes('배달') ? '다크키친 3곳 구축' : '새벽배송 물류센터 확보'}`,
      category: 'partnership',
      timeframe: '2개월',
      priority: 'high',
      resources: ['SCM 전문가', '물류 파트너']
    },
    {
      id: 'food-3',
      title: '메뉴 개발 및 품질 관리',
      description: `${idea.title.includes('농산물') ? '제철 레시피 50개 개발' : '시그니처 메뉴 10개 론칭'}. 블라인드 테스트 및 영양 분석.`,
      category: 'validation',
      timeframe: '1개월',
      priority: 'medium',
      resources: ['요리 연구가', '영양사']
    }
  ],

  // Default for other sectors
  'default': (idea) => [
    {
      id: 'default-1',
      title: '시장 검증 및 MVP 개발',
      description: `핵심 기능 3개로 MVP 구축. 타겟 고객 100명 인터뷰 및 프로토타입 테스트.`,
      category: 'validation',
      timeframe: '1-2개월',
      priority: 'high',
      resources: ['개발팀', 'UX 리서처'],
      estimatedCost: '3,000만원'
    },
    {
      id: 'default-2',
      title: '초기 파트너십 확보',
      description: `업계 주요 플레이어 3곳과 전략적 제휴. 초기 고객 확보를 위한 B2B 채널 구축.`,
      category: 'partnership',
      timeframe: '2개월',
      priority: 'medium',
      resources: ['BD 담당자', '업계 네트워크']
    },
    {
      id: 'default-3',
      title: '시드 투자 유치',
      description: `5억원 규모 시드 라운드. 액셀러레이터 프로그램 참여 및 VC 미팅.`,
      category: 'funding',
      timeframe: '3-4개월',
      priority: 'medium',
      resources: ['IR 자료', '재무 어드바이저']
    }
  ]
};

export function generateSpecificRoadmap(idea: Idea): ExecutionStep[] {
  // Get sector-specific roadmap or use default
  const roadmapGenerator = sectorRoadmaps[idea.sector || ''] || sectorRoadmaps.default;
  const baseSteps = roadmapGenerator(idea);
  
  // Add common critical steps that apply to all
  const commonSteps: ExecutionStep[] = [
    {
      id: 'common-1',
      title: '법인 설립 및 팀 구성',
      description: `주식회사 설립. ${idea.sector === 'FinTech' ? 'CTO/CPO/규제 전문가' : idea.sector === '헬스케어' ? 'CTO/의료 고문/임상 전문가' : 'CTO/CPO/마케팅 리드'} 채용.`,
      category: 'legal',
      timeframe: '2주',
      priority: 'high',
      resources: ['법무법인', '헤드헌터'],
      estimatedCost: '1,000만원'
    },
    {
      id: 'common-2',
      title: '지식재산권 확보',
      description: `${idea.title.includes('AI') ? '핵심 알고리즘 특허 출원' : '상표권 및 서비스표 등록'}. 영업비밀 보호 체계 구축.`,
      category: 'legal',
      timeframe: '1개월',
      priority: 'medium',
      resources: ['특허 변리사', 'IP 전문가'],
      estimatedCost: '500-1,000만원'
    }
  ];
  
  // Combine and prioritize steps
  const allSteps = [...commonSteps, ...baseSteps];
  
  // Sort by priority
  return allSteps.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

// Export function to enhance all ideas with specific roadmaps
export function enhanceIdeasWithRoadmaps(ideas: Idea[]): Idea[] {
  return ideas.map(idea => ({
    ...idea,
    executionRoadmap: generateSpecificRoadmap(idea)
  }));
}