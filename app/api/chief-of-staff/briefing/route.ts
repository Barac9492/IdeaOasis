import { NextRequest, NextResponse } from 'next/server';
import { chiefOfStaffAgent } from '@/lib/services/chiefOfStaffAgent';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'daily';
    const force = searchParams.get('force') === 'true';

    if (type === 'daily') {
      // Check if we already have today's briefing
      const lastBriefing = chiefOfStaffAgent.getLastBriefing();
      const today = new Date().toDateString();
      
      if (!force && lastBriefing && lastBriefing.date.toDateString() === today) {
        return NextResponse.json({
          success: true,
          briefing: lastBriefing,
          cached: true
        });
      }

      // Generate new briefing
      const briefing = await chiefOfStaffAgent.generateDailyBriefing();
      
      return NextResponse.json({
        success: true,
        briefing,
        cached: false,
        generated: new Date().toISOString()
      });
    }

    if (type === 'insights') {
      const insights = chiefOfStaffAgent.getInsights();
      
      return NextResponse.json({
        success: true,
        insights,
        count: insights.length
      });
    }

    if (type === 'goals') {
      const goals = chiefOfStaffAgent.getGoals();
      
      return NextResponse.json({
        success: true,
        goals,
        count: goals.length
      });
    }

    return NextResponse.json(
      { error: 'Invalid briefing type. Use: daily, insights, goals' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Briefing generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate briefing', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { action, data } = await req.json();

    if (action === 'acknowledge_insight') {
      const { insightId } = data;
      chiefOfStaffAgent.acknowledgeInsight(insightId);
      
      return NextResponse.json({
        success: true,
        message: 'Insight acknowledged'
      });
    }

    if (action === 'add_goal') {
      const goal = await chiefOfStaffAgent.addGoal(data);
      
      return NextResponse.json({
        success: true,
        goal
      });
    }

    if (action === 'execute_workflow') {
      await chiefOfStaffAgent.executeAutomatedWorkflow();
      
      return NextResponse.json({
        success: true,
        message: 'Automated workflow executed'
      });
    }

    return NextResponse.json(
      { error: 'Invalid action. Use: acknowledge_insight, add_goal, execute_workflow' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Chief of Staff action error:', error);
    return NextResponse.json(
      { error: 'Failed to execute action', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}