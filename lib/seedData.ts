// lib/seedData.ts
import { upsertIdeas } from './db';
import type { Idea } from './types';

const sampleIdeas: Idea[] = [
  {
    id: 'idea-001',
    title: 'AI 기반 펫케어 건강 모니터링 서비스',
    sourceUrl: 'https://example.com/pet-health-ai',
    sourceName: 'PetTech Weekly',
    publishedAt: '2024-01-15T09:00:00Z',
    summary3: '반려동물의 일상 활동과 건강 상태를 AI로 분석하여 질병을 조기 발견하고 맞춤형 케어 솔루션을 제공합니다. 웨어러블 디바이스와 모바일 앱을 통해 24시간 모니터링이 가능하며, 수의사와의 원격 상담 서비스도 포함됩니다. 반려동물 보험과 연계하여 예방 의학 중심의 통합 헬스케어 플랫폼을 구축합니다.',
    tags: ['AI', '펫테크', '헬스케어', '웨어러블', '원격의료'],
    sector: '펫테크',
    businessModel: 'SaaS + 하드웨어 판매',
    targetUser: '반려동물을 키우는 밀레니얼 세대',
    visible: true,
    createdAt: '2024-01-16T10:00:00Z',
    votesUp: 0,
    votesDown: 0
  },
  {
    id: 'idea-002', 
    title: 'B2B 클라우드 키친 운영 관리 플랫폼',
    sourceUrl: 'https://example.com/cloud-kitchen-b2b',
    sourceName: 'Restaurant Tech',
    publishedAt: '2024-01-10T14:30:00Z',
    summary3: '배달 전문 클라우드 키친 사업자를 위한 통합 운영 관리 솔루션입니다. 주문 통합 관리, 재고 최적화, 매출 분석, 직원 관리를 하나의 플랫폼에서 제공합니다. AI 기반 수요 예측으로 음식 폐기량을 최소화하고 수익성을 극대화합니다. 배달앱 수수료 절감을 위한 자체 주문 시스템도 포함됩니다.',
    tags: ['B2B', '클라우드키친', '푸드테크', 'SaaS', '운영관리'],
    sector: '푸드테크',
    businessModel: 'B2B SaaS 구독',
    targetUser: '클라우드 키친 운영업체',
    visible: true,
    createdAt: '2024-01-11T15:00:00Z',
    votesUp: 0,
    votesDown: 0
  },
  {
    id: 'idea-003',
    title: '시니어 대상 디지털 금융 교육 플랫폼',
    sourceUrl: 'https://example.com/senior-fintech-education',
    sourceName: 'FinTech Innovation',
    publishedAt: '2024-01-08T11:20:00Z',
    summary3: '디지털 금융 서비스 이용이 어려운 시니어 세대를 위한 맞춤형 교육 플랫폼입니다. 대면 강의와 온라인 콘텐츠를 결합한 하이브리드 교육 방식으로 인터넷뱅킹, 모바일페이, 디지털 투자 등을 체계적으로 학습할 수 있습니다. 금융회사와 파트너십을 통해 실제 서비스 연동 실습도 제공하며, 디지털 금융 포용성 확대에 기여합니다.',
    tags: ['시니어', '핀테크', '교육', '디지털포용', '금융리터러시'],
    sector: '핀테크',
    businessModel: '교육 서비스 + 금융회사 파트너십',
    targetUser: '50대 이상 시니어층',
    visible: true,
    createdAt: '2024-01-09T12:00:00Z',
    votesUp: 0,
    votesDown: 0
  },
  {
    id: 'idea-004',
    title: '친환경 포장재 구독 서비스',
    sourceUrl: 'https://example.com/eco-packaging-subscription',
    sourceName: 'Sustainable Business',
    publishedAt: '2024-01-12T16:45:00Z',
    summary3: '온라인 쇼핑몰과 배송업체를 위한 친환경 포장재 정기 구독 서비스입니다. 생분해 가능한 소재로 제작된 박스, 완충재, 테이프 등을 월 단위로 공급하며, 사용량에 따른 맞춤형 패키지를 제공합니다. ESG 경영을 중시하는 기업들의 환경적 임팩트 개선을 돕고, 탄소 발자국 추적 및 리포팅 서비스도 함께 제공합니다.',
    tags: ['친환경', '포장재', '구독서비스', 'ESG', '지속가능성'],
    sector: '그린테크',
    businessModel: '구독 + B2B 공급',
    targetUser: '온라인 쇼핑몰 운영업체',
    visible: true,
    createdAt: '2024-01-13T09:30:00Z',
    votesUp: 0,
    votesDown: 0
  },
  {
    id: 'idea-005',
    title: '소상공인 대상 AI 마케팅 자동화 도구',
    sourceUrl: 'https://example.com/ai-marketing-sme',
    sourceName: 'Small Business Tech',
    publishedAt: '2024-01-14T13:15:00Z',
    summary3: '마케팅 전문 지식이 부족한 소상공인을 위한 AI 기반 자동화 마케팅 도구입니다. 고객 데이터 분석, 타겟 광고 집행, 소셜미디어 콘텐츠 생성, 리뷰 관리를 자동으로 수행합니다. 간단한 설정만으로 네이버, 카카오, 인스타그램 등 주요 플랫폼에서 통합 마케팅이 가능하며, ROI 추적과 개선 제안도 실시간으로 제공합니다.',
    tags: ['AI', '마케팅자동화', '소상공인', 'SME', '디지털마케팅'],
    sector: '마케팅테크',
    businessModel: 'SaaS 구독 + 광고비 수수료',
    targetUser: '소상공인 및 자영업자',
    visible: true,
    createdAt: '2024-01-15T14:00:00Z',
    votesUp: 0,
    votesDown: 0
  }
];

export async function seedDatabase() {
  try {
    console.log('Seeding database with sample ideas...');
    await upsertIdeas(sampleIdeas);
    console.log(`Successfully seeded ${sampleIdeas.length} ideas`);
    return sampleIdeas;
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

export { sampleIdeas };