// app/ideas/page.tsx
import { listIdeas } from '@/lib/db';
import IdeaCard from '@/components/IdeaCard';
import IdeasFilters from '@/components/IdeasFilters';
import { seedDatabase } from '@/lib/seedData';
import { KoreaFitAnalyzer } from '@/lib/services/koreaFitAnalyzer';
import { TrendAnalyzer } from '@/lib/services/trendAnalyzer';
import { upsertIdeas } from '@/lib/db';
import { TrendingUp, Target, Search } from 'lucide-react';

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
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredIdeas.map((idea) => (
            <div key={idea.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-shadow h-full">
              <IdeaCard idea={idea} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
