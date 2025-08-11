import { useState } from 'react';
import IdeaCard from './IdeaCard';
import IdeaFilters from './IdeaFilters';
import { Star, TrendingUp, Target, Zap } from 'lucide-react';

interface HomePageProps {
  isLoggedIn: boolean;
  isPremium: boolean;
  onNavigate: (page: string, ideaId?: string) => void;
  onVote: (ideaId: string) => void;
}

// Enhanced mock data with Korean market insights and evaluation metrics
const mockIdeas = [
  {
    id: '1',
    source: 'Y Combinator W24',
    oneLineSummary: 'AI 기반 개인 맞춤형 영양 관리 플랫폼',
    localizePoint: '한국의 1인 가구 증가(33.4%)와 건강관리 앱 사용률 급증에 최적화된 비즈니스 모델',
    difficulty: 'Medium' as const,
    category: '헬스테크',
    access: 'public' as const,
    moatHypothesis: 'AI 개인화 알고리즘과 한국인 체질·식습관 데이터베이스 구축',
    votes: 42,
    hasVoted: false,
    createdAt: '2024-01-15',
    // New evaluation metrics
    metrics: {
      marketOpportunity: 8.5, // 시장 기회
      executionDifficulty: 6.0, // 실행 난이도
      revenueHidden: 7.5, // 수익 잠재력
      timingScore: 9.0, // 시장 타이밍
      regulatoryRisk: 4.0 // 규제 리스크
    },
    whyNow: [
      '2024년 디지털헬스케어 규제 샌드박스 확대',
      '주요 플랫폼의 헬스케어 진출 가속화',
      '정부의 개인건강정보(PHR) 활용 정책 추진'
    ],
    partnershipStrategy: [
      '초기: 편의점 체인(CU, GS25) 제휴로 간편식 추천',
      '성장: 대형병원 건강검진센터와 데이터 연동',
      'Scale: 보험사와 웰니스 프로그램 공동 개발'
    ],
    trendData: {
      keyword: '개인맞춤영양',
      growth: '+245%',
      monthlySearches: '12,400'
    }
  },
  {
    id: '2',
    source: 'Kickstarter 성공작',
    oneLineSummary: '지속가능한 스마트 패키징 솔루션',
    localizePoint: '배달의민족 시장 규모 10조원 시대, 친환경 포장재 의무화 정책과 완벽한 타이밍',
    difficulty: 'High' as const,
    category: '그린테크',
    access: 'paid' as const,
    moatHypothesis: '생분해 소재 특허와 배달앱 3사(배민, 쿠팡이츠, 요기요) 독점 파트너십',
    votes: 67,
    hasVoted: true,
    createdAt: '2024-01-10',
    metrics: {
      marketOpportunity: 9.2,
      executionDifficulty: 8.5,
      revenueHidden: 8.0,
      timingScore: 9.5,
      regulatoryRisk: 3.0
    },
    whyNow: [
      '2024년 일회용품 사용 제한 강화 정책',
      '주요 배달업체들의 ESG 경영 강화 압박',
      'EU 플라스틱 규제로 글로벌 진출 기회 확대'
    ],
    partnershipStrategy: [
      '1단계: 중소 로컬 배달업체 시범 도입',
      '2단계: 배달앱 본사와 직접 협상',
      '3단계: 제조업체(삼성화학 등)와 대량생산 제휴'
    ],
    trendData: {
      keyword: '친환경포장재',
      growth: '+189%',
      monthlySearches: '8,950'
    }
  },
  {
    id: '3',
    source: 'Product Hunt #1',
    oneLineSummary: '농장직거래 커뮤니티 플랫폼',
    localizePoint: '농촌 고령화 심화와 MZ세대의 로컬푸드 선호 트렌드가 만나는 블루오션',
    difficulty: 'Low' as const,
    category: '푸드테크',
    access: 'public' as const,
    moatHypothesis: '지역별 농가 독점 네트워크와 당일배송 신선도 보장 시스템',
    votes: 28,
    hasVoted: false,
    createdAt: '2024-01-08',
    metrics: {
      marketOpportunity: 7.8,
      executionDifficulty: 4.5,
      revenueHidden: 6.5,
      timingScore: 8.2,
      regulatoryRisk: 2.0
    },
    whyNow: [
      '청년농업인 창업 지원 정책 확대',
      '도시농업 관심 증가와 로컬푸드 인증제 시행',
      '쿠팡 로켓프레시의 성공으로 신선식품 온라인 시장 검증'
    ],
    partnershipStrategy: [
      '초기: 지자체 청년농업인 협회와 MOU',
      '확장: 로컬푸드 직매장과 O2O 연동',
      '글로벌: 농협과 수출 농산물 플랫폼 공동 구축'
    ],
    trendData: {
      keyword: '농장직거래',
      growth: '+156%',
      monthlySearches: '15,200'
    }
  },
  {
    id: '4',
    source: 'AngelList 화제작',
    oneLineSummary: 'AI 기반 반려동물 건강 모니터링',
    localizePoint: '반려동물 가구 1,448만(전체 30%) 시대, 펫 헬스케어 시장 연 20% 성장',
    difficulty: 'Medium' as const,
    category: '펫테크',
    access: 'public' as const,
    moatHypothesis: '한국 반려동물 품종별 질병 패턴 AI 학습과 동물병원 네트워크 구축',
    votes: 34,
    hasVoted: false,
    createdAt: '2024-01-12',
    metrics: {
      marketOpportunity: 8.8,
      executionDifficulty: 6.5,
      revenueHidden: 7.8,
      timingScore: 8.7,
      regulatoryRisk: 3.5
    },
    whyNow: [
      '동물병원 원격진료 시범사업 확대',
      '펫보험 가입률 급증과 정부 정책 지원',
      '대기업의 펫테크 투자 확대 (롯데, CJ 등)'
    ],
    partnershipStrategy: [
      '1차: 대형 동물병원 체인과 데이터 수집 협력',
      '2차: 펫샵·펫카페와 디바이스 보급 제휴',
      '3차: 보험사와 예방케어 프로그램 공동 개발'
    ],
    trendData: {
      keyword: '반려동물건강관리',
      growth: '+312%',
      monthlySearches: '22,100'
    }
  }
];

export default function HomePage({ isLoggedIn, isPremium, onNavigate, onVote }: HomePageProps) {
  const [filteredIdeas, setFilteredIdeas] = useState(mockIdeas);
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    access: '',
    source: '',
    sortBy: 'latest'
  });

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    
    let filtered = mockIdeas.filter(idea => {
      if (newFilters.category && idea.category !== newFilters.category) return false;
      if (newFilters.difficulty && idea.difficulty !== newFilters.difficulty) return false;
      if (newFilters.access && idea.access !== newFilters.access) return false;
      if (newFilters.source && !idea.source.toLowerCase().includes(newFilters.source.toLowerCase())) return false;
      return true;
    });

    // Sort
    if (newFilters.sortBy === 'latest') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (newFilters.sortBy === 'popular') {
      filtered.sort((a, b) => b.votes - a.votes);
    } else if (newFilters.sortBy === 'opportunity') {
      filtered.sort((a, b) => b.metrics.marketOpportunity - a.metrics.marketOpportunity);
    }

    setFilteredIdeas(filtered);
  };

  // Today's featured idea - highest scoring idea
  const todaysIdea = mockIdeas.reduce((prev, current) => 
    (prev.metrics.marketOpportunity + prev.metrics.timingScore) > 
    (current.metrics.marketOpportunity + current.metrics.timingScore) 
    ? prev : current
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-display text-foreground tracking-tight">
              글로벌 아이디어를
              <br />
              <span className="text-primary">한국 시장에 맞게</span>
            </h1>
            
            <p className="text-large text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              전 세계에서 검증된 혁신적인 비즈니스 아이디어를 한국 시장 관점에서 
              분석하고 데이터 기반 인사이트를 제공합니다
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>검색 트렌드 분석</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                  <span>시장 기회 분석</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-chart-3 rounded-full"></div>
                  <span>실행 전략 가이드</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-secondary/5 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Today's Featured Idea */}
      <section className="pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Star className="text-chart-3" size={24} />
                <h2 className="text-hero text-foreground">오늘의 아이디어</h2>
                <Star className="text-chart-3" size={24} />
              </div>
              <p className="text-muted-foreground">
                시장 기회와 타이밍 점수를 기반으로 선정된 주목할 만한 아이디어
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 rounded-3xl"></div>
              <div className="relative glass-light rounded-3xl p-8 shadow-apple-lg border-2 border-primary/10">
                <IdeaCard
                  idea={todaysIdea}
                  isLoggedIn={isLoggedIn}
                  isPremium={isPremium}
                  onNavigate={onNavigate}
                  onVote={onVote}
                  priority={true}
                  featured={true}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Filters */}
            <div className="mb-12">
              <IdeaFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                totalIdeas={filteredIdeas.length}
              />
            </div>

            {/* Market Insights Banner */}
            <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-light rounded-xl p-6 text-center shadow-apple">
                <TrendingUp className="text-primary mx-auto mb-3" size={32} />
                <h4 className="font-semibold mb-2">키워드 트렌드 분석</h4>
                <p className="text-sm text-muted-foreground">
                  실시간 검색 데이터로 시장 관심도 측정
                </p>
              </div>
              <div className="glass-light rounded-xl p-6 text-center shadow-apple">
                <Target className="text-secondary mx-auto mb-3" size={32} />
                <h4 className="font-semibold mb-2">한국 시장 특화</h4>
                <p className="text-sm text-muted-foreground">
                  규제환경과 문화적 맥락 고려한 현지화 분석
                </p>
              </div>
              <div className="glass-light rounded-xl p-6 text-center shadow-apple">
                <Zap className="text-chart-3 mx-auto mb-3" size={32} />
                <h4 className="font-semibold mb-2">실행 전략</h4>
                <p className="text-sm text-muted-foreground">
                  파트너십부터 정부지원까지 단계별 가이드
                </p>
              </div>
            </div>

            {/* Ideas Grid */}
            <div className="space-y-8">
              {filteredIdeas.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">아이디어를 찾을 수 없습니다</h3>
                  <p className="text-muted-foreground">
                    다른 필터를 시도해보거나 모든 필터를 초기화해보세요
                  </p>
                </div>
              ) : (
                <div className="grid gap-8 lg:gap-12">
                  {filteredIdeas.filter(idea => idea.id !== todaysIdea.id).map((idea, index) => (
                    <div key={idea.id} className="transform transition-all duration-500 hover:scale-[1.02]">
                      <IdeaCard
                        idea={idea}
                        isLoggedIn={isLoggedIn}
                        isPremium={isPremium}
                        onNavigate={onNavigate}
                        onVote={onVote}
                        priority={index < 3}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Premium CTA */}
            {!isPremium && (
              <div className="mt-20">
                <div className="relative overflow-hidden glass-light rounded-2xl p-8 lg:p-12 shadow-apple-lg">
                  <div className="relative z-10 text-center max-w-3xl mx-auto">
                    <h2 className="text-hero text-foreground mb-4">
                      더 깊은 인사이트가 필요하신가요?
                    </h2>
                    <p className="text-large text-muted-foreground mb-6 leading-relaxed">
                      프리미엄 구독으로 독점 아이디어 분석, 검색 트렌드 데이터, 
                      실행 체크리스트, 파트너십 전략에 액세스하세요
                    </p>
                    <div className="space-y-4 mb-8">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="bg-primary/5 rounded-lg p-4">
                          <h4 className="font-medium mb-2">📊 데이터 분석</h4>
                          <p className="text-muted-foreground">검색 트렌드, 시장 기회 점수</p>
                        </div>
                        <div className="bg-secondary/5 rounded-lg p-4">
                          <h4 className="font-medium mb-2">🚀 실행 가이드</h4>
                          <p className="text-muted-foreground">파트너십 전략, 정부 지원 정보</p>
                        </div>
                        <div className="bg-chart-3/5 rounded-lg p-4">
                          <h4 className="font-medium mb-2">💡 독점 콘텐츠</h4>
                          <p className="text-muted-foreground">심층 분석, AI 인사이트</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                      <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full font-medium transition-all duration-200 hover:shadow-apple-lg">
                        프리미엄 시작하기
                      </button>
                      <span className="text-sm text-muted-foreground">
                        월 $9 • 언제든 취소 가능
                      </span>
                    </div>
                  </div>
                  
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-l from-primary/10 to-transparent rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-r from-secondary/10 to-transparent rounded-full blur-2xl"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}