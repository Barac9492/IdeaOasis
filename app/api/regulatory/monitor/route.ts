import { NextRequest, NextResponse } from 'next/server';
import { regulatoryMonitor } from '@/lib/services/regulatoryMonitor';

export async function GET(req: NextRequest) {
  try {
    const updates = await regulatoryMonitor.monitorAllTargets();
    
    const newUpdates = updates.filter(u => u.changeDetected || !u.previousVersion);
    const impactAnalysis = await regulatoryMonitor.analyzeImpactOnIdeas(newUpdates);
    
    const alerts = await Promise.all(
      newUpdates
        .filter(u => u.businessImpact === 'high')
        .map(u => regulatoryMonitor.generateAlert(u))
    );
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      stats: {
        totalChecked: updates.length,
        newUpdates: newUpdates.length,
        highImpact: newUpdates.filter(u => u.businessImpact === 'high').length,
        affectedIdeas: Array.from(impactAnalysis.values()).flat().length
      },
      updates: newUpdates,
      impactAnalysis: Object.fromEntries(impactAnalysis),
      alerts
    });
  } catch (error) {
    console.error('Monitoring error:', error);
    return NextResponse.json(
      { error: 'Failed to monitor regulatory updates' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { generateNewsletter } = await req.json();
    
    const updates = await regulatoryMonitor.monitorAllTargets();
    
    if (generateNewsletter) {
      const newsletterContent = await regulatoryMonitor.generateNewsletterSection(updates);
      
      return NextResponse.json({
        success: true,
        newsletterContent,
        updateCount: updates.length
      });
    }
    
    return NextResponse.json({
      success: true,
      updates
    });
  } catch (error) {
    console.error('Monitoring error:', error);
    return NextResponse.json(
      { error: 'Failed to process regulatory monitoring request' },
      { status: 500 }
    );
  }
}