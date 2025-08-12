import { NextRequest, NextResponse } from 'next/server';
import { businessDevAgent } from '@/lib/services/businessDevAgent';
import { regulatoryMonitor } from '@/lib/services/regulatoryMonitor';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || undefined;
    const industry = searchParams.get('industry') || undefined;
    const size = searchParams.get('size') || undefined;
    const minValue = searchParams.get('minValue') ? parseInt(searchParams.get('minValue')!) : undefined;

    const filters = { status, industry, size, minValue };
    const prospects = await businessDevAgent.getProspects(filters);

    return NextResponse.json({
      success: true,
      prospects,
      count: prospects.length
    });

  } catch (error) {
    console.error('Prospects API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prospects' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { action, prospectId, data } = await req.json();

    if (action === 'identify_from_regulatory') {
      // Automatically identify prospects from recent regulatory updates
      const updates = await regulatoryMonitor.monitorAllTargets();
      const highImpactUpdates = updates.filter(u => u.businessImpact === 'high');
      
      const newProspects = await businessDevAgent.identifyProspects(highImpactUpdates);
      
      // Add to the agent
      newProspects.forEach(prospect => {
        businessDevAgent.addProspect(prospect);
      });

      return NextResponse.json({
        success: true,
        message: `Identified ${newProspects.length} new prospects from regulatory updates`,
        prospects: newProspects,
        triggerUpdates: highImpactUpdates.length
      });
    }

    if (action === 'add_prospect') {
      if (!data || !data.company) {
        return NextResponse.json(
          { error: 'Company name required' },
          { status: 400 }
        );
      }

      const prospect = {
        id: `prospect_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        company: data.company,
        industry: data.industry || 'general',
        size: data.size || 'sme',
        contacts: data.contacts || [],
        status: 'cold' as const,
        source: 'inbound' as const,
        painPoints: data.painPoints || [],
        solutions: data.solutions || [],
        estimatedValue: data.estimatedValue || 0,
        probability: 10,
        nextAction: data.nextAction || 'Initial outreach',
        nextActionDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        tags: data.tags || [],
        regulatoryProfile: {
          complianceRisk: 'medium' as const,
          relevantRegulations: [],
        },
        interactions: [],
        documents: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        assignedTo: data.assignedTo
      };

      businessDevAgent.addProspect(prospect);

      return NextResponse.json({
        success: true,
        prospect
      });
    }

    if (action === 'update_prospect') {
      if (!prospectId) {
        return NextResponse.json(
          { error: 'Prospect ID required' },
          { status: 400 }
        );
      }

      businessDevAgent.updateProspect(prospectId, data);

      return NextResponse.json({
        success: true,
        message: 'Prospect updated'
      });
    }

    if (action === 'track_interaction') {
      if (!prospectId || !data) {
        return NextResponse.json(
          { error: 'Prospect ID and interaction data required' },
          { status: 400 }
        );
      }

      await businessDevAgent.trackInteraction(prospectId, {
        type: data.type,
        date: new Date(data.date || Date.now()),
        contactPersonId: data.contactPersonId,
        subject: data.subject,
        notes: data.notes,
        outcome: data.outcome,
        nextSteps: data.nextSteps || []
      });

      return NextResponse.json({
        success: true,
        message: 'Interaction tracked'
      });
    }

    return NextResponse.json(
      { error: 'Invalid action. Use: identify_from_regulatory, add_prospect, update_prospect, track_interaction' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Prospects POST error:', error);
    return NextResponse.json(
      { error: 'Failed to process request', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}