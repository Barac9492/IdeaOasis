'use client';
import { useState } from 'react';
import { TrendingUp, ArrowRight, Filter, Bookmark, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuthGuard from '@/components/AuthGuard';

export default function TrendsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const categories = ['all', 'fintech', 'ai', 'ecommerce', 'social', 'saas', 'marketplace'];
  const categoryLabels: Record<string, string> = {
    'all': '전체',
    'fintech': '핀테크',
    'ai': 'AI/ML',
    'ecommerce': '이커머스',
    'social': '소셜',
    'saas': 'SaaS',
    'marketplace': '마켓플레이스'
  };

  const trendingModels = [
    {
      id: '1',
      name: 'Cursor AI',
      description: 'AI 코딩 어시스턴트 IDE',
      category: 'ai',
      trend: 'hot',
      riskScore: 25,
      growth: '+450%',
      reason: '개발자 생산성 도구 시장 급성장',
      koreanPotential: '네이버, 카카오 등이 주목하는 분야',
      estimatedMarket: '₩50B',
      timeframe: '6개월'
    },
    {
      id: '2',
      name: 'Perplexity Pro',
      description: 'AI 검색 엔진 구독 모델',
      category: 'ai',
      trend: 'rising',
      riskScore: 55,
      growth: '+280%',
      reason: '구글 검색 대안으로 주목받음',
      koreanPotential: '네이버 검색 독점 시장에 도전 가능',
      estimatedMarket: '₩200B',
      timeframe: '12개월'
    },
    {
      id: '3',
      name: 'Midjourney Subscription',
      description: 'AI 이미지 생성 구독 서비스',
      category: 'ai',
      trend: 'hot',
      riskScore: 40,
      growth: '+320%',
      reason: '창작자 시장 급성장',
      koreanPotential: '웹툰, 게임 업계 관심 높음',
      estimatedMarket: '₩80B',
      timeframe: '9개월'
    },
    {
      id: '4',
      name: 'Stripe Atlas',
      description: '원클릭 미국 법인 설립',
      category: 'fintech',
      trend: 'rising',
      riskScore: 75,
      growth: '+180%',
      reason: '글로벌 창업 트렌드',
      koreanPotential: '한국 법인 설립 시스템 복잡성으로 기회',
      estimatedMarket: '₩30B',
      timeframe: '18개월'
    },
    {
      id: '5',
      name: 'Substack Pro',
      description: '창작자 뉴스레터 플랫폼',
      category: 'social',
      trend: 'rising',
      riskScore: 45,
      growth: '+210%',
      reason: '개인 브랜딩 트렌드',
      koreanPotential: '개인 창작자 수익화 니즈 증가',
      estimatedMarket: '₩40B',
      timeframe: '8개월'
    },
    {
      id: '6',
      name: 'Cal.com',
      description: '오픈소스 스케줄링 플랫폼',
      category: 'saas',
      trend: 'rising',
      riskScore: 30,
      growth: '+160%',
      reason: '원격근무 도구 필수화',
      koreanPotential: '기업 스케줄링 시장 미개척',
      estimatedMarket: '₩25B',
      timeframe: '6개월'
    }
  ];

  const filteredModels = selectedCategory === 'all' 
    ? trendingModels 
    : trendingModels.filter(model => model.category === selectedCategory);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3 mb-2">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              해외 트렌드 모델 탐색
            </h1>
            <p className="text-slate-600">
              실시간으로 추적하는 해외 비즈니스 모델과 한국 진출 가능성
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg p-4 mb-6 border border-slate-200">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">카테고리:</span>
              </div>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {categoryLabels[category]}
                </button>
              ))}
            </div>
          </div>

          {/* Trending Models Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredModels.map((model) => (
              <div key={model.id} className="bg-white rounded-lg p-6 border border-slate-200 hover:shadow-md transition-shadow">
                
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      model.trend === 'hot' ? 'bg-red-100 text-red-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {model.trend === 'hot' ? '🔥 HOT' : '📈 급상승'}
                    </div>
                    <div className="text-lg font-semibold text-green-600">
                      {model.growth}
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    model.riskScore > 60 ? 'bg-red-100 text-red-700' :
                    model.riskScore > 40 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    한국 리스크 {model.riskScore}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-slate-900 mb-2">{model.name}</h3>
                <p className="text-slate-600 mb-4">{model.description}</p>
                
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <div className="text-slate-500">예상 시장 규모</div>
                    <div className="font-semibold text-slate-900">{model.estimatedMarket}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">진출 준비 기간</div>
                    <div className="font-semibold text-slate-900">{model.timeframe}</div>
                  </div>
                </div>

                {/* Korean Potential */}
                <div className="bg-blue-50 p-3 rounded-lg mb-4">
                  <div className="text-sm text-blue-800">
                    <strong>한국 기회:</strong> {model.koreanPotential}
                  </div>
                </div>

                {/* Why Trending */}
                <div className="text-sm text-slate-600 mb-4">
                  <strong>트렌드 이유:</strong> {model.reason}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button className="flex-1" size="sm">
                    <span>상세 분석하기</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Bookmark className="w-4 h-4" />
                  </Button>
                </div>

                {/* Warning for high risk */}
                {model.riskScore > 60 && (
                  <div className="mt-3 p-2 bg-red-50 rounded text-xs text-red-700 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    높은 규제 리스크 - 신중한 접근 필요
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              더 많은 트렌드 모델 보기
            </Button>
          </div>

        </div>
      </div>
    </AuthGuard>
  );
}