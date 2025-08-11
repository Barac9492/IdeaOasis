// app/page.tsx - Landing Page (Server Component)
import { listIdeas } from '@/lib/db';
import IdeaCard from '@/components/IdeaCard'; // Use the main IdeaCard component
import { ArrowRight, TrendingUp, Target, Zap, Star } from 'lucide-react'; // Icons
import { Button } from '@/components/ui/button'; // shadcn
import { Card } from '@/components/ui/card';

export default async function HomePage({ searchParams }: { searchParams: { category?: string } }) {
  // Import required services
  const { seedDatabase } = await import('@/lib/seedData');
  const { KoreaFitAnalyzer } = await import('@/lib/services/koreaFitAnalyzer');
  const { TrendAnalyzer } = await import('@/lib/services/trendAnalyzer');
  const { upsertIdeas } = await import('@/lib/db');
  
  let ideas = await listIdeas();
  
  // If no ideas exist, seed the database with sample data
  if (ideas.length === 0) {
    console.log('No ideas found, seeding database...');
    await seedDatabase();
    ideas = await listIdeas();
  }
  
  // Enhance ideas with Korea Fit and trend data if not already enhanced
  const enhancedIdeas = await Promise.all(
    ideas.map(async (idea) => {
      // Skip if already enhanced (has koreaFit score)
      if (idea.koreaFit !== undefined && idea.trendData?.trendScore) {
        return idea;
      }
      
      try {
        // Korea Fit Analysis
        const koreaFitResult = KoreaFitAnalyzer.calculateKoreaFit(idea);
        
        // Trend Analysis
        const trendAnalysis = await TrendAnalyzer.analyzeTrends(idea);
        const trendScore = TrendAnalyzer.calculateTrendScore(trendAnalysis);
        
        // Enhanced idea with all data
        const enhanced = {
          ...idea,
          koreaFit: koreaFitResult.score,
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
        return idea; // Return original if enhancement fails
      }
    })
  );
  
  // Update database with enhanced ideas (only the ones that were actually enhanced)
  const toUpdate = enhancedIdeas.filter(idea => idea.koreaFit !== undefined);
  if (toUpdate.length > 0) {
    await upsertIdeas(toUpdate);
  }

  // Simple server-side filtering example (expand as needed)
  const category = searchParams.category || '';
  const filteredIdeas = category ? enhancedIdeas.filter(i => i.sector === category) : enhancedIdeas;

  // Featured: highest koreaFit or similar
  const todaysIdea = filteredIdeas.reduce((prev, curr) => 
    (prev.koreaFit || 0) > (curr.koreaFit || 0) ? prev : curr, filteredIdeas[0] || null
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Apple-inspired clean design */}
      <section className="relative py-24 lg:py-32 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="space-y-8">
            {/* Clean, bold headline */}
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-semibold text-slate-900 tracking-tight leading-tight">
                글로벌 아이디어를
              </h1>
              <h1 className="text-5xl lg:text-7xl font-semibold text-blue-600 tracking-tight leading-tight">
                한국 시장에 맞게
              </h1>
            </div>
            
            {/* Simplified, cleaner subtitle */}
            <p className="text-xl lg:text-2xl text-slate-600 max-w-3xl mx-auto font-light leading-relaxed">
              검증된 해외 비즈니스 아이디어를 한국 문화와 시장에 맞춰 분석하고,<br />
              데이터 기반 실행 가이드를 제공합니다.
            </p>
            
            {/* Clean CTA */}
            <div className="pt-8">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-medium rounded-full">
                아이디어 탐색하기
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
            
            {/* Simplified badges */}
            <div className="pt-12 flex items-center justify-center gap-8 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span>검색 트렌드 분석</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-600" />
                <span>시장 기회 평가</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-600" />
                <span>실행 로드맵</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Idea - Minimalist approach */}
      {todaysIdea && (
        <section className="py-20 bg-slate-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-semibold text-slate-900 mb-4">
                오늘의 추천 아이디어
              </h2>
              <p className="text-lg text-slate-600">
                한국 시장 적합도가 높은 검증된 비즈니스 아이디어
              </p>
            </div>
            
            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-slate-200">
              <IdeaCard idea={todaysIdea} />
            </div>
          </div>
        </section>
      )}

      {/* Market Insights - Clean feature cards */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-semibold text-slate-900 mb-4">
              데이터 기반 시장 분석
            </h2>
            <p className="text-lg text-slate-600">
              정확한 데이터로 검증된 비즈니스 기회를 발견하세요
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">트렌드 분석</h3>
              <p className="text-slate-600">검색 트렌드와 소셜 미디어 데이터로 시장 관심도를 실시간 측정합니다</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-emerald-200 transition-colors">
                <Target className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">시장 적합성</h3>
              <p className="text-slate-600">한국의 규제 환경, 소비 문화, 비즈니스 관습을 고려한 현지화 분석을 제공합니다</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-amber-200 transition-colors">
                <Zap className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">실행 가이드</h3>
              <p className="text-slate-600">파트너십 전략부터 정부 지원 프로그램까지 단계별 실행 로드맵을 제시합니다</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ideas Grid - Modern card layout */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-semibold text-slate-900 mb-4">
              엄선된 비즈니스 아이디어
            </h2>
            <p className="text-lg text-slate-600">
              해외에서 검증되고 한국 시장에 최적화된 아이디어 모음
            </p>
          </div>
          
          {filteredIdeas.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🔍</span>
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-3">아이디어를 준비 중입니다</h3>
              <p className="text-slate-600 text-lg">곧 흥미로운 비즈니스 아이디어들을 만나보실 수 있습니다</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 idea-card-grid">
              {filteredIdeas.slice(0, 6).map((idea) => (
                <div key={idea.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-shadow h-full">
                  <IdeaCard idea={idea} />
                </div>
              ))}
            </div>
          )}
          
          {filteredIdeas.length > 6 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" className="px-8 py-3 text-slate-700 border-slate-300 hover:bg-slate-100">
                더 많은 아이디어 보기
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Premium CTA - Apple-inspired clean section */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-semibold text-white mb-6">
            더 깊은 인사이트가<br />필요하신가요?
          </h2>
          <p className="text-xl text-slate-300 mb-12 leading-relaxed">
            프리미엄으로 독점 분석, 실시간 트렌드, 실행 가이드를<br />모두 이용하세요
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-white mb-2">심층 데이터</h3>
              <p className="text-slate-400">검색 트렌드, 시장 기회 점수</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-lg font-semibold text-white mb-2">실행 로드맵</h3>
              <p className="text-slate-400">파트너십, 정부 지원 가이드</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-lg font-semibold text-white mb-2">독점 콘텐츠</h3>
              <p className="text-slate-400">AI 분석, 업계 인사이트</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 text-lg font-medium rounded-full">
              프리미엄 시작하기
            </Button>
            <p className="text-slate-400">월 ₩9,900 • 언제든 취소 가능</p>
          </div>
        </div>
      </section>
    </div>
  );
}