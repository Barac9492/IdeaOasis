// app/ideas/page.tsx
import { listIdeas } from '@/lib/db';
import IdeaCard from '@/components/IdeaCard';
import IdeasFilters from '@/components/IdeasFilters';
import { seedDatabase } from '@/lib/seedData';
import { KoreaFitAnalyzer } from '@/lib/services/koreaFitAnalyzer';
import { TrendAnalyzer } from '@/lib/services/trendAnalyzer';
import { upsertIdeas } from '@/lib/db';
import { TrendingUp, Target, Search, Star } from 'lucide-react';

export default async function IdeasPage({
  searchParams
}: {
  searchParams: { 
    category?: string;
    sort?: string;
    search?: string;
  }
}) {
  let ideas = await listIdeas();
  
  // Auto-seed if no ideas exist
  if (ideas.length === 0) {
    await seedDatabase();
    ideas = await listIdeas();
  }
  
  // Enhance ideas with backend services if needed
  const enhancedIdeas = await Promise.all(
    ideas.map(async (idea) => {
      if (idea.koreaFit !== undefined && idea.trendData?.trendScore) {
        return idea;
      }
      
      try {
        const koreaFitResult = KoreaFitAnalyzer.calculateKoreaFit(idea);
        const trendAnalysis = await TrendAnalyzer.analyzeTrends(idea);
        const trendScore = TrendAnalyzer.calculateTrendScore(trendAnalysis);
        
        const enhanced = {
          ...idea,
          koreaFit: koreaFitResult.score,
          koreaFitFactors: koreaFitResult.factors,
          koreaFitRecommendations: koreaFitResult.recommendations,
          trendData: {
            keyword: trendAnalysis.keyword,
            growth: `${trendAnalysis.growthRate > 0 ? '+' : ''}${trendAnalysis.growthRate}%`,
            monthlySearches: trendAnalysis.searchVolume.toLocaleString(),
            trendScore,
            lastUpdated: trendAnalysis.lastAnalyzed
          },
          metrics: {
            marketOpportunity: koreaFitResult.factors.marketReadiness,
            executionDifficulty: 10 - koreaFitResult.factors.businessInfrastructure,
            revenuePotential: koreaFitResult.factors.culturalAlignment,
            timingScore: koreaFitResult.factors.marketReadiness,
            regulatoryRisk: 10 - koreaFitResult.factors.regulatoryFriendliness
          },
          updatedAt: new Date().toISOString()
        };
        
        return enhanced;
      } catch (error) {
        console.error(`Failed to enhance idea ${idea.id}:`, error);
        return idea;
      }
    })
  );
  
  // Update database with enhanced ideas
  const toUpdate = enhancedIdeas.filter(idea => idea.koreaFit !== undefined);
  if (toUpdate.length > 0) {
    await upsertIdeas(toUpdate);
  }

  // Apply filters and sorting
  let filteredIdeas = enhancedIdeas;
  
  // Search filter
  if (searchParams.search) {
    const searchTerm = searchParams.search.toLowerCase();
    filteredIdeas = filteredIdeas.filter(idea =>
      idea.title.toLowerCase().includes(searchTerm) ||
      idea.summary3?.toLowerCase().includes(searchTerm) ||
      idea.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }
  
  // Category filter
  if (searchParams.category && searchParams.category !== 'all') {
    filteredIdeas = filteredIdeas.filter(idea => idea.sector === searchParams.category);
  }
  
  // Sorting
  switch (searchParams.sort) {
    case 'koreafit':
      filteredIdeas.sort((a, b) => (b.koreaFit || 0) - (a.koreaFit || 0));
      break;
    case 'trend':
      filteredIdeas.sort((a, b) => (b.trendData?.trendScore || 0) - (a.trendData?.trendScore || 0));
      break;
    case 'recent':
      filteredIdeas.sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());
      break;
    default:
      // Default: best overall (combination of Korea fit and trends)
      filteredIdeas.sort((a, b) => {
        const scoreA = ((a.koreaFit || 0) + (a.trendData?.trendScore || 0)) / 2;
        const scoreB = ((b.koreaFit || 0) + (b.trendData?.trendScore || 0)) / 2;
        return scoreB - scoreA;
      });
  }

  // Get unique categories for filter
  const categories = [...new Set(enhancedIdeas.map(idea => idea.sector).filter((sector): sector is string => Boolean(sector)))];
  
  return (
    <main className="mx-auto max-w-7xl p-6">
      {/* Header with stats */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">아이디어 탐색</h1>
            <p className="text-slate-600 mt-2">
              {filteredIdeas.length}개의 검증된 비즈니스 아이디어
            </p>
          </div>
          
          {/* Quick stats */}
          <div className="flex items-center gap-6 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>평균 트렌드: {(enhancedIdeas.reduce((acc, idea) => acc + (idea.trendData?.trendScore || 0), 0) / enhancedIdeas.length).toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" />
              <span>평균 적합도: {Math.round(enhancedIdeas.reduce((acc, idea) => acc + (idea.koreaFit || 0), 0) / enhancedIdeas.length)}</span>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <IdeasFilters categories={categories} />
      </div>

      {/* Premium Insights Banner */}
      {filteredIdeas.filter(idea => idea.koreaFit && idea.koreaFit >= 8.5).length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 mb-6 border border-amber-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Star className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">프리미엄 인사이트</h2>
              <p className="text-sm text-slate-600">8.5점 이상 고품질 아이디어를 우선 표시</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-slate-700">{filteredIdeas.filter(idea => idea.koreaFit && idea.koreaFit >= 9.0).length}개 최고 등급</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              <span className="text-slate-700">{filteredIdeas.filter(idea => idea.koreaFit && idea.koreaFit >= 8.5 && idea.koreaFit < 9.0).length}개 프리미엄</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-slate-700">{filteredIdeas.filter(idea => idea.trendData?.trendScore && idea.trendData.trendScore >= 8.0).length}개 트렌딩</span>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {filteredIdeas.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-3">검색 결과가 없습니다</h3>
          <p className="text-slate-600">다른 키워드나 필터를 시도해보세요</p>
        </div>
      ) : (
        <>
          {/* Premium Ideas First */}
          {filteredIdeas.filter(idea => idea.koreaFit && idea.koreaFit >= 8.5).length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" />
                프리미엄 아이디어
              </h3>
              <div className="grid gap-6 lg:grid-cols-2">
                {filteredIdeas.filter(idea => idea.koreaFit && idea.koreaFit >= 8.5).slice(0, 4).map((idea) => (
                  <div key={idea.id} className="bg-white rounded-2xl shadow-sm border-2 border-amber-200 hover:shadow-lg transition-shadow h-full relative">
                    <IdeaCard idea={idea} />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* All Ideas */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">모든 아이디어</h3>
            <div className="grid gap-6 lg:grid-cols-2">
              {filteredIdeas.map((idea) => (
                <div key={idea.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-shadow h-full">
                  <IdeaCard idea={idea} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </main>
  );
}
