// app/api/demo/route.ts
import { NextResponse } from 'next/server';
import { seedDatabase, sampleIdeas } from '@/lib/seedData';
import { KoreaFitAnalyzer } from '@/lib/services/koreaFitAnalyzer';
import { TrendAnalyzer } from '@/lib/services/trendAnalyzer';
import { RoadmapGenerator } from '@/lib/services/roadmapGenerator';
import { upsertIdeas } from '@/lib/db';
import type { Idea } from '@/lib/types';

export async function GET() {
  try {
    // Seed database with sample ideas
    await seedDatabase();
    
    // Take the first idea and demonstrate all services
    const sampleIdea = sampleIdeas[0];
    
    // 1. Korea Fit Analysis
    const koreaFitResult = KoreaFitAnalyzer.calculateKoreaFit(sampleIdea);
    
    // 2. Trend Analysis
    const trendAnalysis = await TrendAnalyzer.analyzeTrends(sampleIdea);
    const trendScore = TrendAnalyzer.calculateTrendScore(trendAnalysis);
    
    // 3. Execution Roadmap
    const roadmap = RoadmapGenerator.generateRoadmap(sampleIdea);
    
    // 4. Enhanced idea with all data
    const enhancedIdea: Idea = {
      ...sampleIdea,
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
      executionRoadmap: roadmap.slice(0, 5), // Show first 5 steps
      updatedAt: new Date().toISOString()
    };
    
    // Update the idea in database
    await upsertIdeas([enhancedIdea]);
    
    return NextResponse.json({
      success: true,
      demo: {
        originalIdea: {
          id: sampleIdea.id,
          title: sampleIdea.title,
          sector: sampleIdea.sector,
          summary: sampleIdea.summary3?.substring(0, 100) + '...'
        },
        koreaFitAnalysis: {
          score: koreaFitResult.score,
          factors: koreaFitResult.factors,
          topRecommendations: koreaFitResult.recommendations.slice(0, 2)
        },
        trendAnalysis: {
          keyword: trendAnalysis.keyword,
          searchVolume: trendAnalysis.searchVolume,
          growthRate: trendAnalysis.growthRate,
          competitionLevel: trendAnalysis.competitionLevel,
          trendScore,
          relatedKeywords: trendAnalysis.relatedKeywords.slice(0, 3)
        },
        executionRoadmap: {
          totalSteps: roadmap.length,
          phases: ['Validation', 'Legal', 'Partnership', 'Technical', 'Marketing', 'Funding'],
          sampleSteps: roadmap.slice(0, 3).map(step => ({
            title: step.title,
            category: step.category,
            timeframe: step.timeframe,
            priority: step.priority
          })),
          estimatedTimeframe: '16-24주',
          estimatedCost: '1,000-3,000만원'
        },
        enhancedMetrics: enhancedIdea.metrics
      },
      message: '모든 백엔드 서비스가 성공적으로 동작합니다! 한국 시장 맞춤 분석, 트렌드 분석, 실행 로드맵이 완성되었습니다.',
      seededIdeas: sampleIdeas.length,
      apiEndpoints: {
        vote: '/api/vote',
        bookmark: '/api/bookmark', 
        enhance: '/api/ideas/enhance',
        seed: '/api/seed'
      }
    });
    
  } catch (error) {
    console.error('Demo error:', error);
    return NextResponse.json(
      { error: 'Demo failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}