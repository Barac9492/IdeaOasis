import { NextRequest, NextResponse } from 'next/server';
import { businessDevAgent } from '@/lib/services/businessDevAgent';

export async function POST(req: NextRequest) {
  try {
    const { prospectId, templateName, customization, action } = await req.json();

    if (action === 'generate_outreach') {
      if (!prospectId || !templateName) {
        return NextResponse.json(
          { error: 'Prospect ID and template name required' },
          { status: 400 }
        );
      }

      const outreachContent = await businessDevAgent.generateOutreach(
        prospectId,
        templateName,
        customization
      );

      return NextResponse.json({
        success: true,
        content: outreachContent,
        templateUsed: templateName,
        prospectId
      });
    }

    if (action === 'generate_proposal') {
      if (!prospectId) {
        return NextResponse.json(
          { error: 'Prospect ID required' },
          { status: 400 }
        );
      }

      const proposalContent = await businessDevAgent.generateProposalContent(prospectId);

      return NextResponse.json({
        success: true,
        content: proposalContent,
        type: 'proposal',
        prospectId
      });
    }

    if (action === 'bulk_outreach') {
      const body = await req.json();
      const { prospectIds, templateName, customizations } = body;
      
      if (!prospectIds || !Array.isArray(prospectIds) || !templateName) {
        return NextResponse.json(
          { error: 'Prospect IDs array and template name required' },
          { status: 400 }
        );
      }

      const results = [];
      
      for (let i = 0; i < prospectIds.length; i++) {
        const prospectId = prospectIds[i];
        const customization = customizations?.[i] || {};
        
        try {
          const content = await businessDevAgent.generateOutreach(
            prospectId,
            templateName,
            customization
          );
          
          results.push({
            prospectId,
            success: true,
            content
          });
        } catch (error) {
          results.push({
            prospectId,
            success: false,
            error: error instanceof Error ? error.message : 'Generation failed'
          });
        }
      }

      return NextResponse.json({
        success: true,
        results,
        generated: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length
      });
    }

    return NextResponse.json(
      { error: 'Invalid action. Use: generate_outreach, generate_proposal, bulk_outreach' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Outreach API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate outreach content', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'templates';

    if (type === 'templates') {
      const templates = [
        {
          name: 'Regulatory Alert Cold Email',
          type: 'cold_email',
          description: '규제 변경사항을 활용한 첫 연락',
          bestFor: ['enterprise', 'conglomerate'],
          estimatedResponseRate: '8-12%'
        },
        {
          name: 'Follow-up After Regulatory Brief',
          type: 'follow_up',
          description: '규제 브리핑 후 후속 연락',
          bestFor: ['all'],
          estimatedResponseRate: '25-35%'
        },
        {
          name: 'Enterprise Proposal',
          type: 'proposal',
          description: '맞춤형 엔터프라이즈 제안서',
          bestFor: ['enterprise', 'conglomerate'],
          estimatedResponseRate: '45-60%'
        },
        {
          name: 'Meeting Request',
          type: 'meeting_request',
          description: '긴급 규제 이슈 관련 미팅 요청',
          bestFor: ['all'],
          estimatedResponseRate: '15-25%'
        }
      ];

      return NextResponse.json({
        success: true,
        templates
      });
    }

    if (type === 'performance') {
      // Mock performance data - in production, track actual metrics
      const performance = {
        totalOutreach: 147,
        responseRate: 18.4,
        meetingRate: 12.2,
        proposalRate: 8.1,
        closureRate: 3.4,
        avgResponseTime: '2.3 days',
        bestPerformingTemplate: 'Follow-up After Regulatory Brief',
        worstPerformingTemplate: 'Meeting Request',
        monthlyTrend: [
          { month: 'Jan', sent: 32, responses: 6 },
          { month: 'Feb', sent: 41, responses: 8 },
          { month: 'Mar', sent: 38, responses: 7 },
          { month: 'Apr', sent: 36, responses: 9 }
        ]
      };

      return NextResponse.json({
        success: true,
        performance
      });
    }

    return NextResponse.json(
      { error: 'Invalid type. Use: templates, performance' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Outreach GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch outreach data' },
      { status: 500 }
    );
  }
}