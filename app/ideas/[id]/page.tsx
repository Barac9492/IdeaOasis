// app/ideas/[id]/page.tsx
import { getIdea } from '@/lib/db';
import { notFound } from 'next/navigation';
import { KoreaFitAnalyzer } from '@/lib/services/koreaFitAnalyzer';
import { TrendAnalyzer } from '@/lib/services/trendAnalyzer';
import { RoadmapGenerator } from '@/lib/services/roadmapGenerator';
import { updateIdea } from '@/lib/db';
import { TrendingUp, Target, AlertTriangle, ExternalLink, Heart, Bookmark, ArrowLeft, CheckCircle, Clock, Users, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default async function IdeaDetail({ params }: { params: { id: string } }) {
  let idea = await getIdea(params.id);
  
  // If idea not found, try seeding the database first
  if (!idea) {
    const { seedDatabase } = await import('@/lib/seedData');
    const { listIdeas } = await import('@/lib/db');
    
    console.log(`Idea ${params.id} not found, checking if database needs seeding...`);
    const allIdeas = await listIdeas();
    
    if (allIdeas.length === 0) {
      console.log('No ideas found, seeding database...');
      await seedDatabase();
    }
    
    // Try to get the idea again after seeding
    idea = await getIdea(params.id);
    if (!idea) return notFound();
  }

  // Enhance idea with full analytics if not already done
  if (!idea.koreaFit || !idea.trendData || !idea.executionRoadmap) {
    try {
      // Korea Fit Analysis
      const koreaFitResult = KoreaFitAnalyzer.calculateKoreaFit(idea);
      
      // Trend Analysis
      const trendAnalysis = await TrendAnalyzer.analyzeTrends(idea);
      const trendScore = TrendAnalyzer.calculateTrendScore(trendAnalysis);
      
      // Generate Roadmap
      const roadmap = await RoadmapGenerator.generateRoadmap(idea);
      
      // Enhanced idea with comprehensive data
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
        executionRoadmap: roadmap,
        updatedAt: new Date().toISOString()
      };
      
      // Update the database with enhanced data
      await updateIdea(params.id, enhanced);
      idea = enhanced;
    } catch (error) {
      console.error(`Failed to enhance idea ${params.id}:`, error);
      // Continue with original idea if enhancement fails
    }
  }

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-8">
      {/* Navigation */}
      <div className="flex items-center gap-4">
        <Link href="/ideas" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>모든 아이디어</span>
        </Link>
      </div>

      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-slate-900 leading-tight">{idea.title}</h1>
            <div className="mt-3 flex items-center gap-4 text-sm text-slate-600">
              <span>{idea.sourceName}</span>
              <span>•</span>
              <a 
                className="flex items-center gap-1 hover:text-blue-600 transition-colors" 
                href={idea.sourceUrl} 
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>원문 보기</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
              <Heart className="w-4 h-4" />
              <span className="text-sm">찜하기</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
              <Bookmark className="w-4 h-4" />
              <span className="text-sm">북마크</span>
            </button>
          </div>
        </div>

        {/* Summary */}
        {idea.summary3 && (
          <div className="bg-slate-50 rounded-2xl p-6">
            <p className="text-lg text-slate-800 leading-relaxed">{idea.summary3}</p>
          </div>
        )}

        {/* Tags */}
        {idea.tags && idea.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {idea.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Key Metrics Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <Target className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-900">{idea.koreaFit ? Math.round(idea.koreaFit) : '-'}/10</span>
          </div>
          <h3 className="font-semibold text-blue-900">한국 적합도</h3>
          <p className="text-sm text-blue-700 mt-1">현지 시장 진출 가능성</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <TrendingUp className="w-8 h-8 text-emerald-600" />
            <span className="text-2xl font-bold text-emerald-900">{idea.trendData?.trendScore ?? '-'}/10</span>
          </div>
          <h3 className="font-semibold text-emerald-900">트렌드 점수</h3>
          <p className="text-sm text-emerald-700 mt-1">{idea.trendData?.growth ?? '성장률 분석 중'}</p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <DollarSign className="w-8 h-8 text-amber-600" />
            <span className="text-2xl font-bold text-amber-900">{idea.metrics?.revenuePotential ? Math.round(idea.metrics.revenuePotential) : '-'}/10</span>
          </div>
          <h3 className="font-semibold text-amber-900">수익 잠재력</h3>
          <p className="text-sm text-amber-700 mt-1">예상 시장 매력도</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <Users className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-purple-900">
              {idea.trendData?.monthlySearches ? 
                `${TrendAnalyzer.normalizeSearchVolume(parseInt(idea.trendData.monthlySearches.replace(/,/g, '')))}/10` : 
                '-'}
            </span>
          </div>
          <h3 className="font-semibold text-purple-900">검색 관심도</h3>
          <p className="text-sm text-purple-700 mt-1">{idea.trendData?.monthlySearches ?? '-'}/월</p>
        </div>
      </section>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Korea Fit Analysis */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-slate-900">한국 시장 적합성 분석</h2>
          
          {idea.koreaFitFactors && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h3 className="font-semibold text-slate-900 mb-4">주요 평가 요소</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700">규제 친화성</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 transition-all duration-500"
                          style={{ width: `${(Math.round(idea.koreaFitFactors.regulatoryFriendliness) / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-900">{Math.round(idea.koreaFitFactors.regulatoryFriendliness)}/10</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700">문화적 일치도</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 transition-all duration-500"
                          style={{ width: `${(Math.round(idea.koreaFitFactors.culturalAlignment) / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-900">{Math.round(idea.koreaFitFactors.culturalAlignment)}/10</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700">시장 준비도</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-500 transition-all duration-500"
                          style={{ width: `${(Math.round(idea.koreaFitFactors.marketReadiness) / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-900">{Math.round(idea.koreaFitFactors.marketReadiness)}/10</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700">경쟁 환경</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-red-500 transition-all duration-500"
                          style={{ width: `${(Math.round(idea.koreaFitFactors.competitiveLandscape) / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-900">{Math.round(idea.koreaFitFactors.competitiveLandscape)}/10</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700">인프라 지원</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-purple-500 transition-all duration-500"
                          style={{ width: `${(idea.koreaFitFactors.businessInfrastructure / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-900">{Math.round(idea.koreaFitFactors.businessInfrastructure)}/10</span>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          )}
        </section>

        {/* Trend Analysis */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-slate-900">트렌드 및 시장 분석</h2>
          
          {idea.trendData && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h3 className="font-semibold text-slate-900 mb-4">시장 동향</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">키워드</span>
                    <p className="font-medium text-slate-900">{idea.trendData.keyword}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">성장률</span>
                    <p className={`font-medium ${idea.trendData.growth.startsWith('+') ? 'text-emerald-600' : 'text-red-500'}`}>
                      {idea.trendData.growth}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-600">검색량</span>
                    <p className="font-medium text-slate-900">{idea.trendData.monthlySearches}/월</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Why Now & Risks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Why Now</h2>
          <p className="text-slate-700 leading-relaxed">{idea.whyNow ?? '시장 진입 시기에 대한 분석이 필요합니다.'}</p>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            주요 리스크
          </h2>
          <ul className="space-y-2">
            {idea.risks?.length ? (
              idea.risks.map((risk, index) => (
                <li key={index} className="flex items-start gap-3 text-slate-700">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm">{risk}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-500 text-sm">리스크 분석 정보가 없습니다.</li>
            )}
          </ul>
        </section>
      </div>

      {/* Execution Roadmap */}
      {idea.executionRoadmap && idea.executionRoadmap.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-slate-900">실행 로드맵</h2>
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="grid gap-6">
              {idea.executionRoadmap.map((step, index) => (
                <div key={step.id} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-slate-700 text-sm mb-3">{step.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{step.timeframe}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        <span>예산: {step.estimatedCost || '미정'}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        step.priority === 'high' ? 'bg-red-100 text-red-700' :
                        step.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {step.priority === 'high' ? '높음' : 
                         step.priority === 'medium' ? '중간' : '낮음'}
                      </span>
                    </div>
                    {step.resources && step.resources.length > 0 && (
                      <ul className="mt-3 space-y-1">
                        {step.resources.slice(0, 3).map((resource, resourceIndex) => (
                          <li key={resourceIndex} className="text-xs text-slate-600 flex items-center gap-2">
                            <span className="w-1 h-1 bg-slate-400 rounded-full" />
                            {resource}
                          </li>
                        ))}
                        {step.resources.length > 3 && (
                          <li className="text-xs text-slate-500">+{step.resources.length - 3}개 추가 리소스</li>
                        )}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
