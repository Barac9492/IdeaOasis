import { NextRequest, NextResponse } from 'next/server';
import { regulatoryMonitor } from '@/lib/services/regulatoryMonitor';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('[CRON] Starting regulatory monitoring check...');
    
    const updates = await regulatoryMonitor.monitorAllTargets();
    const newUpdates = updates.filter(u => u.changeDetected || !u.previousVersion);
    
    if (newUpdates.length > 0) {
      console.log(`[CRON] Found ${newUpdates.length} new regulatory updates`);
      
      const highImpactUpdates = newUpdates.filter(u => u.businessImpact === 'high');
      
      if (highImpactUpdates.length > 0) {
        const alerts = await Promise.all(
          highImpactUpdates.map(u => regulatoryMonitor.generateAlert(u))
        );
        
        for (const alert of alerts) {
          await sendAlert(alert);
        }
      }
      
      const impactAnalysis = await regulatoryMonitor.analyzeImpactOnIdeas(newUpdates);
      
      if (impactAnalysis.size > 0) {
        await updateAffectedIdeas(impactAnalysis);
      }
      
      await storeUpdates(newUpdates);
    }
    
    return NextResponse.json({
      success: true,
      message: `Processed ${newUpdates.length} new updates`,
      timestamp: new Date().toISOString(),
      stats: {
        totalChecked: updates.length,
        newUpdates: newUpdates.length,
        highImpact: newUpdates.filter(u => u.businessImpact === 'high').length
      }
    });
    
  } catch (error) {
    console.error('[CRON] Regulatory monitoring error:', error);
    return NextResponse.json(
      { error: 'Failed to run regulatory monitoring', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

async function sendAlert(alert: string): Promise<void> {
  if (process.env.WEBHOOK_URL) {
    try {
      await fetch(process.env.WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: alert })
      });
    } catch (error) {
      console.error('Failed to send alert:', error);
    }
  }
  
  console.log('[ALERT]', alert);
}

async function updateAffectedIdeas(impactMap: Map<string, string[]>): Promise<void> {
  for (const [updateId, ideaIds] of impactMap.entries()) {
    console.log(`[IMPACT] Regulatory update ${updateId} affects ${ideaIds.length} ideas`);
    
    for (const ideaId of ideaIds) {
      try {
        await fetch(`/api/ideas/${ideaId}/regulatory-impact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            updateId,
            timestamp: new Date().toISOString()
          })
        });
      } catch (error) {
        console.error(`Failed to update idea ${ideaId}:`, error);
      }
    }
  }
}

async function storeUpdates(updates: any[]): Promise<void> {
  try {
    const response = await fetch('/api/regulatory/store', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-internal-api': 'true'
      },
      body: JSON.stringify({ updates })
    });
    
    if (!response.ok) {
      console.error('Failed to store updates:', await response.text());
    }
  } catch (error) {
    console.error('Failed to store regulatory updates:', error);
  }
}