import { NextRequest, NextResponse } from 'next/server';
import { businessDevAgent } from '@/lib/services/businessDevAgent';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'pipeline';

    if (type === 'pipeline') {
      const analytics = await businessDevAgent.getPipelineAnalytics();
      
      return NextResponse.json({
        success: true,
        analytics: {
          ...analytics,
          forecastedRevenue: analytics.totalPipelineValue,
          avgSalesVelocity: '45 days', // Mock data
          quotaAttainment: 73.2,
          targetForMonth: 200000000,
          performance: {
            thisMonth: {
              newProspects: 12,
              qualified: 8,
              meetings: 5,
              proposals: 2,
              closedWon: 1
            },
            lastMonth: {
              newProspects: 15,
              qualified: 10,
              meetings: 6,
              proposals: 3,
              closedWon: 1
            }
          }
        }
      });
    }

    if (type === 'forecast') {
      // Generate sales forecast based on current pipeline
      const analytics = await businessDevAgent.getPipelineAnalytics();
      
      const forecast = {
        thisMonth: {
          likely: analytics.totalPipelineValue * 0.3,
          best: analytics.totalPipelineValue * 0.5,
          worst: analytics.totalPipelineValue * 0.1
        },
        nextMonth: {
          likely: analytics.totalPipelineValue * 0.4,
          best: analytics.totalPipelineValue * 0.7,
          worst: analytics.totalPipelineValue * 0.2
        },
        quarter: {
          likely: analytics.totalPipelineValue * 0.8,
          best: analytics.totalPipelineValue * 1.2,
          worst: analytics.totalPipelineValue * 0.4
        },
        confidence: calculateForecastConfidence(analytics),
        keyDrivers: [
          'Regulatory environment changes',
          'Enterprise compliance urgency',
          'Competitive positioning',
          'Economic conditions'
        ]
      };

      return NextResponse.json({
        success: true,
        forecast
      });
    }

    if (type === 'activity') {
      const activityData = {
        daily: generateDailyActivity(),
        weekly: generateWeeklyActivity(),
        targets: {
          dailyProspectingTarget: 10,
          weeklyMeetingTarget: 5,
          monthlyProposalTarget: 8,
          quarterlyClosureTarget: 12
        },
        completion: {
          prospecting: 85,
          meetings: 92,
          proposals: 67,
          followUps: 78
        }
      };

      return NextResponse.json({
        success: true,
        activity: activityData
      });
    }

    if (type === 'regulatory_impact') {
      // Analyze how regulatory updates affect sales pipeline
      const impactAnalysis = {
        regulatoryTriggeredProspects: 23,
        regulatoryInfluencedDeals: 8,
        avgTimeToClose: {
          regulatory: '32 days',
          traditional: '67 days'
        },
        conversionRates: {
          regulatoryLead: 24.3,
          traditionalLead: 12.7
        },
        topRegulatoryTriggers: [
          { regulation: 'AI Basic Law', prospects: 8, value: 45000000 },
          { regulation: 'Data Protection Act Amendment', prospects: 6, value: 32000000 },
          { regulation: 'Fintech Sandbox Expansion', prospects: 9, value: 67000000 }
        ]
      };

      return NextResponse.json({
        success: true,
        impact: impactAnalysis
      });
    }

    return NextResponse.json(
      { error: 'Invalid type. Use: pipeline, forecast, activity, regulatory_impact' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}

function calculateForecastConfidence(analytics: any): number {
  const factors = [
    analytics.totalProspects > 20 ? 20 : analytics.totalProspects,
    Math.min(analytics.statusDistribution?.meeting || 0, 10) * 2,
    Math.min(analytics.statusDistribution?.proposal || 0, 5) * 4,
    Math.min(analytics.conversionRates?.cold_to_next || 0, 30)
  ];
  
  return Math.round(factors.reduce((sum, factor) => sum + factor, 0) / 4);
}

function generateDailyActivity() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  return days.map(day => ({
    day,
    prospectingCalls: Math.floor(Math.random() * 15) + 5,
    emails: Math.floor(Math.random() * 25) + 10,
    meetings: Math.floor(Math.random() * 3) + 1,
    proposals: Math.random() > 0.7 ? 1 : 0
  }));
}

function generateWeeklyActivity() {
  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  return weeks.map(week => ({
    week,
    newProspects: Math.floor(Math.random() * 8) + 3,
    qualifiedLeads: Math.floor(Math.random() * 5) + 2,
    meetingsHeld: Math.floor(Math.random() * 6) + 2,
    proposalsSent: Math.floor(Math.random() * 3) + 1,
    dealsClosed: Math.random() > 0.6 ? 1 : 0
  }));
}