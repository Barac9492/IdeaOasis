// app/top/page.tsx
import { listIdeas } from '@/lib/db';
import { seedDatabase } from '@/lib/seedData';
import { KoreaFitAnalyzer } from '@/lib/services/koreaFitAnalyzer';
import { TrendAnalyzer } from '@/lib/services/trendAnalyzer';
import { upsertIdeas } from '@/lib/db';
import IdeaCard from '@/components/IdeaCard';
import { Trophy, TrendingUp, Target, Star, Crown } from 'lucide-react';

export default async function TopPage() {
  let ideas = await listIdeas();
  
  // Auto-seed if no ideas exist
  if (ideas.length === 0) {
    await seedDatabase();
    ideas = await listIdeas();
  }
  
  // Enhance ideas if needed
  const enhancedIdeas = await Promise.all(
    ideas.map(async (idea) => {
      if (idea.koreaFit !== undefined && idea.trendData?.trendScore) {
        return idea;
      }
      
      try {
        const koreaFitResult = KoreaFitAnalyzer.calculateKoreaFit(idea);
        const trendAnalysis = await TrendAnalyzer.analyzeTrends(idea);
        const trendScore = TrendAnalyzer.calculateTrendScore(trendAnalysis);
        
        return {
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

  // Sort by different criteria
  const topKoreaFit = [...enhancedIdeas].sort((a, b) => (b.koreaFit || 0) - (a.koreaFit || 0)).slice(0, 3);
  const topTrending = [...enhancedIdeas].sort((a, b) => (b.trendData?.trendScore || 0) - (a.trendData?.trendScore || 0)).slice(0, 3);
  const mostPromising = [...enhancedIdeas].sort((a, b) => {
    const scoreA = ((a.koreaFit || 0) + (a.trendData?.trendScore || 0)) / 2;
    const scoreB = ((b.koreaFit || 0) + (b.trendData?.trendScore || 0)) / 2;
    return scoreB - scoreA;
  }).slice(0, 3);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="space-y-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center">
                <Crown className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 tracking-tight">
                인기 아이디어
              </h1>
              <p className="text-xl lg:text-2xl text-slate-600 max-w-3xl mx-auto font-light leading-relaxed">
                한국 시장에서 가장 유망한 비즈니스 아이디어들을<br />
                데이터 기반으로 선별했습니다
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Korea Fit */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Target className="w-8 h-8 text-blue-600" />
              <h2 className="text-3xl font-bold text-slate-900">한국 적합도 TOP 3</h2>
            </div>
            <p className="text-lg text-slate-600">
              한국 시장 환경에 가장 잘 맞는 아이디어들
            </p>
          </div>
          
          <div className="grid gap-6 lg:grid-cols-3">
            {topKoreaFit.map((idea, index) => (
              <div key={idea.id} className="relative">
                {index === 0 && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                      <Trophy className="w-4 h-4" />
                      <span>1위</span>
                    </div>
                  </div>
                )}
                <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-100 hover:shadow-xl transition-shadow h-full">
                  <IdeaCard idea={idea} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Trending */}
      <section className="py-16 bg-gradient-to-r from-emerald-50 to-green-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <TrendingUp className="w-8 h-8 text-emerald-600" />
              <h2 className="text-3xl font-bold text-slate-900">트렌드 상승세 TOP 3</h2>
            </div>
            <p className="text-lg text-slate-600">
              현재 시장에서 가장 주목받고 있는 분야들
            </p>
          </div>
          
          <div className="grid gap-6 lg:grid-cols-3">
            {topTrending.map((idea, index) => (
              <div key={idea.id} className="relative">
                {index === 0 && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>HOT</span>
                    </div>
                  </div>
                )}
                <div className="bg-white rounded-2xl shadow-lg border-2 border-emerald-100 hover:shadow-xl transition-shadow h-full">
                  <IdeaCard idea={idea} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Most Promising Overall */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Star className="w-8 h-8 text-purple-600" />
              <h2 className="text-3xl font-bold text-slate-900">종합 추천 TOP 3</h2>
            </div>
            <p className="text-lg text-slate-600">
              적합도와 트렌드를 모두 고려한 가장 유망한 아이디어들
            </p>
          </div>
          
          <div className="grid gap-6 lg:grid-cols-3">
            {mostPromising.map((idea, index) => (
              <div key={idea.id} className="relative">
                {index === 0 && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      <span>BEST</span>
                    </div>
                  </div>
                )}
                <div className="bg-white rounded-2xl shadow-lg border-2 border-purple-100 hover:shadow-xl transition-shadow h-full">
                  <IdeaCard idea={idea} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-12">
            데이터로 보는 인사이트
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800 rounded-2xl p-8">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {enhancedIdeas.length}개
              </div>
              <p className="text-slate-300">분석된 아이디어</p>
            </div>
            
            <div className="bg-slate-800 rounded-2xl p-8">
              <div className="text-3xl font-bold text-emerald-400 mb-2">
                {Math.round(enhancedIdeas.reduce((acc, idea) => acc + (idea.koreaFit || 0), 0) / enhancedIdeas.length)}점
              </div>
              <p className="text-slate-300">평균 한국 적합도</p>
            </div>
            
            <div className="bg-slate-800 rounded-2xl p-8">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {(enhancedIdeas.reduce((acc, idea) => acc + (idea.trendData?.trendScore || 0), 0) / enhancedIdeas.length).toFixed(1)}점
              </div>
              <p className="text-slate-300">평균 트렌드 점수</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}