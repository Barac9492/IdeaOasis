// app/page.tsx - Landing Page (Server Component)
import { listIdeas } from '@/lib/db';
import IdeaCard from '@/components/IdeaCard'; // Use the main IdeaCard component
// import IdeaFilters from '@/features/ideas/ui/IdeaFilters'; // TODO: Fix component compatibility
import { Star, TrendingUp, Target, Zap } from 'lucide-react'; // Icons
import { Button } from '@/components/ui/button'; // shadcn
import { Card, CardContent } from '@/components/ui/card';

export default async function HomePage({ searchParams }: { searchParams: { category?: string } }) {
  const ideas = await listIdeas(); // Server-side fetch

  // Simple server-side filtering example (expand as needed)
  const category = searchParams.category || '';
  const filteredIdeas = category ? ideas.filter(i => i.sector === category) : ideas;

  // Featured: highest koreaFit or similar
  const todaysIdea = filteredIdeas.reduce((prev, curr) => 
    (prev.koreaFit || 0) > (curr.koreaFit || 0) ? prev : curr, filteredIdeas[0] || null
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight">
              글로벌 아이디어를<br />
              <span className="text-primary">한국 시장에 맞게</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              전 세계에서 검증된 혁신적인 비즈니스 아이디어를 한국 시장 관점에서 분석하고 데이터 기반 인사이트를 제공합니다
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>검색 트렌드 분석</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-secondary rounded-full" />
                  <span>시장 기회 분석</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-chart-3 rounded-full" />
                  <span>실행 전략 가이드</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-secondary/5 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Today's Featured Idea */}
      <section className="pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Star className="text-chart-3" size={24} />
                <h2 className="text-3xl font-bold text-foreground">오늘의 아이디어</h2>
                <Star className="text-chart-3" size={24} />
              </div>
              <p className="text-muted-foreground">
                시장 기회와 타이밍 점수를 기반으로 선정된 주목할 만한 아이디어
              </p>
            </div>
            {todaysIdea ? (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 rounded-3xl" />
                <Card className="relative rounded-3xl p-8 shadow-lg border-2 border-primary/10">
                  <IdeaCard idea={todaysIdea} />
                </Card>
              </div>
            ) : (
              <p>No featured idea available.</p>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Filters - TODO: Fix component compatibility */}
            {/* <IdeaFilters initialFilters={{ category: '', difficulty: '', access: '', source: '', sortBy: '' }} /> */}

            {/* Market Insights Banner */}
            <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 text-center">
                <TrendingUp className="text-primary mx-auto mb-3" size={32} />
                <h4 className="font-semibold mb-2">키워드 트렌드 분석</h4>
                <p className="text-sm text-muted-foreground">실시간 검색 데이터로 시장 관심도 측정</p>
              </Card>
              <Card className="p-6 text-center">
                <Target className="text-secondary mx-auto mb-3" size={32} />
                <h4 className="font-semibold mb-2">한국 시장 특화</h4>
                <p className="text-sm text-muted-foreground">규제환경과 문화적 맥락 고려한 현지화 분석</p>
              </Card>
              <Card className="p-6 text-center">
                <Zap className="text-chart-3 mx-auto mb-3" size={32} />
                <h4 className="font-semibold mb-2">실행 전략</h4>
                <p className="text-sm text-muted-foreground">파트너십부터 정부지원까지 단계별 가이드</p>
              </Card>
            </div>

            {/* Ideas Grid */}
            <div className="space-y-8">
              {filteredIdeas.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">아이디어를 찾을 수 없습니다</h3>
                  <p className="text-muted-foreground">다른 필터를 시도해보거나 모든 필터를 초기화해보세요</p>
                </div>
              ) : (
                <div className="grid gap-8 lg:gap-12 md:grid-cols-2 lg:grid-cols-3">
                  {filteredIdeas.map((idea) => (
                    <IdeaCard key={idea.id} idea={idea} />
                  ))}
                </div>
              )}
            </div>

            {/* Premium CTA */}
            <div className="mt-20">
              <Card className="rounded-2xl p-8 lg:p-12 shadow-lg border-2 border-primary/10">
                <div className="text-center max-w-3xl mx-auto">
                  <h2 className="text-3xl font-bold text-foreground mb-4">더 깊은 인사이트가 필요하신가요?</h2>
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                    프리미엄 구독으로 독점 아이디어 분석, 검색 트렌드 데이터, 실행 체크리스트, 파트너십 전략에 액세스하세요
                  </p>
                  <div className="space-y-4 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <Card className="p-4">
                        <h4 className="font-medium mb-2">📊 데이터 분석</h4>
                        <p className="text-muted-foreground">검색 트렌드, 시장 기회 점수</p>
                      </Card>
                      <Card className="p-4">
                        <h4 className="font-medium mb-2">🚀 실행 가이드</h4>
                        <p className="text-muted-foreground">파트너십 전략, 정부 지원 정보</p>
                      </Card>
                      <Card className="p-4">
                        <h4 className="font-medium mb-2">💡 독점 콘텐츠</h4>
                        <p className="text-muted-foreground">심층 분석, AI 인사이트</p>
                      </Card>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button className="px-8 py-3 rounded-full font-medium">프리미엄 시작하기</Button>
                    <span className="text-sm text-muted-foreground">월 $9 • 언제든 취소 가능</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}