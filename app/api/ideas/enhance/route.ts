// app/api/ideas/enhance/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { listIdeas, getIdea, upsertIdeas } from '@/lib/db';
import { KoreaFitAnalyzer } from '@/lib/services/koreaFitAnalyzer';
import { TrendAnalyzer } from '@/lib/services/trendAnalyzer';
import { RoadmapGenerator } from '@/lib/services/roadmapGenerator';
import type { Idea } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const { ideaId, features } = await req.json();
    
    if (!ideaId) {
      return NextResponse.json({ error: 'ideaId is required' }, { status: 400 });
    }
    
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
      const roadmap = RoadmapGenerator.generateRoadmap(idea);
      enhancedIdea.executionRoadmap = roadmap;
      
      enhancements.roadmap = {
        steps: roadmap,
        totalSteps: roadmap.length,
        estimatedTimeframe: '16-24주',
        highPrioritySteps: roadmap.filter(s => s.priority === 'high').length
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