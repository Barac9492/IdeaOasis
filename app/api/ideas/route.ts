// app/api/ideas/route.ts
import { listIdeas } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statsParam = searchParams.get('stats');
    
    // Work-While-You-Build filters
    const timeFilter = searchParams.get('time'); // <=5, <=8, <=12 hours/week
    const capitalFilter = searchParams.get('capital'); // <=5000000, <=15000000, <=50000000 KRW
    const automationFilter = searchParams.get('automation'); // >=50, >=70, >=90
    const paybackFilter = searchParams.get('payback'); // <=6, <=12, <=24 months
    const mondayStartable = searchParams.get('mondayStartable'); // true/false
    
    let ideas = await listIdeas();
    
    // Apply Work-While-You-Build filters
    if (timeFilter) {
      const maxTime = parseInt(timeFilter);
      ideas = ideas.filter(idea => !idea.timeBudgetHoursPerWeek || idea.timeBudgetHoursPerWeek <= maxTime);
    }
    
    if (capitalFilter) {
      const maxCapital = parseInt(capitalFilter);
      ideas = ideas.filter(idea => !idea.starterCapitalKRW || idea.starterCapitalKRW <= maxCapital);
    }
    
    if (automationFilter) {
      const minAutomation = parseInt(automationFilter);
      ideas = ideas.filter(idea => idea.automationPct && idea.automationPct >= minAutomation);
    }
    
    if (paybackFilter) {
      const maxPayback = parseInt(paybackFilter);
      ideas = ideas.filter(idea => !idea.paybackMonths || idea.paybackMonths <= maxPayback);
    }
    
    if (mondayStartable === 'true') {
      ideas = ideas.filter(idea => idea.mondayStartable === true);
    }
    
    if (statsParam === 'true') {
      // Calculate admin stats
      const totalIdeas = ideas.length;
      const enhancedIdeas = ideas.filter(idea => 
        idea.koreaFit !== undefined && idea.trendData?.trendScore
      ).length;
      
      const avgKoreaFit = ideas.reduce((sum, idea) => sum + (idea.koreaFit || 0), 0) / Math.max(ideas.length, 1);
      const avgTrendScore = ideas.reduce((sum, idea) => sum + (idea.trendData?.trendScore || 0), 0) / Math.max(ideas.length, 1);
      
      // Work-While-You-Build stats
      const workWhileBuildIdeas = ideas.filter(idea => idea.timeBudgetHoursPerWeek && idea.starterCapitalKRW).length;
      const avgTimeBudget = ideas.reduce((sum, idea) => sum + (idea.timeBudgetHoursPerWeek || 0), 0) / Math.max(ideas.length, 1);
      const avgCapital = ideas.reduce((sum, idea) => sum + (idea.starterCapitalKRW || 0), 0) / Math.max(ideas.length, 1);
      const avgAutomation = ideas.reduce((sum, idea) => sum + (idea.automationPct || 0), 0) / Math.max(ideas.length, 1);
      
      const stats = {
        totalIdeas,
        enhancedIdeas,
        workWhileBuildIdeas,
        avgKoreaFit,
        avgTrendScore,
        avgTimeBudget,
        avgCapital,
        avgAutomation,
        recentActivity: new Date().toISOString()
      };
      
      return NextResponse.json({ ideas, stats });
    }
    
    return NextResponse.json({ ideas });
  } catch (error) {
    console.error('Error in GET /api/ideas:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ideas' },
      { status: 500 }
    );
  }
}