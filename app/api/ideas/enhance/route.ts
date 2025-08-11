// app/api/ideas/enhance/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { listIdeas, getIdea, upsertIdeas } from '@/lib/db';
import { KoreaFitAnalyzer } from '@/lib/services/koreaFitAnalyzer';
import { TrendAnalyzer } from '@/lib/services/trendAnalyzer';
import { RoadmapGenerator } from '@/lib/services/roadmapGenerator';
import type { Idea } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    // Handle both single idea enhancement and bulk enhancement
    const body = await req.json().catch(() => ({}));
    const { ideaId, features } = body;
    
    // If no ideaId provided, do bulk enhancement (for admin dashboard)
    if (!ideaId) {
      const ideas = await listIdeas();
      let enhanced = 0;
      const total = ideas.length;
      
      const enhancedIdeas = await Promise.all(
        ideas.map(async (idea) => {
          // Skip if already enhanced
          if (idea.koreaFit !== undefined && idea.trendData?.trendScore) {
            return idea;
          }
          
          try {
            const koreaFitResult = KoreaFitAnalyzer.calculateKoreaFit(idea);
            const trendAnalysis = await TrendAnalyzer.analyzeTrends(idea);
            const trendScore = TrendAnalyzer.calculateTrendScore(trendAnalysis);
            
            enhanced++;
            
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
      
      await upsertIdeas(enhancedIdeas);
      
      return NextResponse.json({
        success: true,
        enhanced,
        total
      });
    }
    
    // Single idea enhancement
    const idea = await getIdea(ideaId);
    if (!idea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }
    
    let enhancedIdea: Idea = { ...idea };
    const enhancements: Record<string, any> = {};
    
    // Default: enhance all features if none specified
    const requestedFeatures = features || ['koreaFit', 'trendAnalysis', 'roadmap'];
    
    // Korea Fit Analysis
    if (requestedFeatures.includes('koreaFit')) {
      const koreaFitResult = KoreaFitAnalyzer.calculateKoreaFit(idea);
      enhancedIdea.koreaFit = koreaFitResult.score;
      
      // Store detailed analysis in metrics
      enhancedIdea.metrics = {
        ...enhancedIdea.metrics,
        marketOpportunity: koreaFitResult.factors.marketReadiness,
        executionDifficulty: 10 - koreaFitResult.factors.businessInfrastructure,
        revenuePotential: koreaFitResult.factors.culturalAlignment,
        timingScore: koreaFitResult.factors.marketReadiness,
        regulatoryRisk: 10 - koreaFitResult.factors.regulatoryFriendliness
      };
      
      enhancements.koreaFit = {
        score: koreaFitResult.score,
        factors: koreaFitResult.factors,
        recommendations: koreaFitResult.recommendations
      };
    }
    
    // Trend Analysis
    if (requestedFeatures.includes('trendAnalysis')) {
      const trendAnalysis = await TrendAnalyzer.analyzeTrends(idea);
      const trendScore = TrendAnalyzer.calculateTrendScore(trendAnalysis);
      
      enhancedIdea.trendData = {
        keyword: trendAnalysis.keyword,
        growth: `${trendAnalysis.growthRate > 0 ? '+' : ''}${trendAnalysis.growthRate}%`,
        monthlySearches: trendAnalysis.searchVolume.toLocaleString(),
        trendScore,
        lastUpdated: trendAnalysis.lastAnalyzed
      };
      
      enhancements.trendAnalysis = {
        ...trendAnalysis,
        trendScore
      };
    }
    
    // Execution Roadmap
    if (requestedFeatures.includes('roadmap')) {
      const roadmap = await RoadmapGenerator.generateRoadmap(idea);
      enhancedIdea.executionRoadmap = roadmap;
      
      enhancements.roadmap = {
        steps: roadmap,
        totalSteps: roadmap.length || 0,
        estimatedTimeframe: 'TBD',
        totalBudget: 'TBD'
      };
    }
    
    // Update the idea with enhancements
    enhancedIdea.updatedAt = new Date().toISOString();
    await upsertIdeas([enhancedIdea]);
    
    return NextResponse.json({
      success: true,
      idea: enhancedIdea,
      enhancements
    });
    
  } catch (error) {
    console.error('Enhancement error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Batch enhance all ideas
export async function PUT() {
  try {
    const ideas = await listIdeas();
    const enhancedIdeas: Idea[] = [];
    const results = [];
    
    for (const idea of ideas) {
      let enhanced = { ...idea };
      
      // Korea Fit Analysis
      const koreaFitResult = KoreaFitAnalyzer.calculateKoreaFit(idea);
      enhanced.koreaFit = koreaFitResult.score;
      
      // Trend Analysis
      const trendAnalysis = await TrendAnalyzer.analyzeTrends(idea);
      const trendScore = TrendAnalyzer.calculateTrendScore(trendAnalysis);
      enhanced.trendData = {
        keyword: trendAnalysis.keyword,
        growth: `${trendAnalysis.growthRate > 0 ? '+' : ''}${trendAnalysis.growthRate}%`,
        monthlySearches: trendAnalysis.searchVolume.toLocaleString(),
        trendScore,
        lastUpdated: trendAnalysis.lastAnalyzed
      };
      
      // Update metrics
      enhanced.metrics = {
        marketOpportunity: koreaFitResult.factors.marketReadiness,
        executionDifficulty: 10 - koreaFitResult.factors.businessInfrastructure,
        revenuePotential: koreaFitResult.factors.culturalAlignment,
        timingScore: koreaFitResult.factors.marketReadiness,
        regulatoryRisk: 10 - koreaFitResult.factors.regulatoryFriendliness
      };
      
      enhanced.updatedAt = new Date().toISOString();
      enhancedIdeas.push(enhanced);
      
      results.push({
        id: idea.id,
        title: idea.title,
        koreaFit: enhanced.koreaFit,
        trendScore
      });
    }
    
    await upsertIdeas(enhancedIdeas);
    
    return NextResponse.json({
      success: true,
      enhanced: results.length,
      results
    });
    
  } catch (error) {
    console.error('Batch enhancement error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}