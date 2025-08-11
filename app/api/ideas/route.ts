// app/api/ideas/route.ts
import { listIdeas } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statsParam = searchParams.get('stats');
    
    const ideas = await listIdeas();
    
    if (statsParam === 'true') {
      // Calculate admin stats
      const totalIdeas = ideas.length;
      const enhancedIdeas = ideas.filter(idea => 
        idea.koreaFit !== undefined && idea.trendData?.trendScore
      ).length;
      
      const avgKoreaFit = ideas.reduce((sum, idea) => sum + (idea.koreaFit || 0), 0) / Math.max(ideas.length, 1);
      const avgTrendScore = ideas.reduce((sum, idea) => sum + (idea.trendData?.trendScore || 0), 0) / Math.max(ideas.length, 1);
      
      const stats = {
        totalIdeas,
        enhancedIdeas,
        avgKoreaFit,
        avgTrendScore,
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