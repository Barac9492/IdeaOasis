// app/api/quality-check/route.ts
import { NextResponse } from 'next/server';
import { listIdeas } from '@/lib/db';
import { ContentQualityMonitor } from '@/lib/services/contentQualityMonitor';

export async function GET() {
  try {
    // Get all ideas
    const ideas = await listIdeas();
    
    // Run quality check
    const { reports, summary } = ContentQualityMonitor.validateAllIdeas(ideas);
    
    // Generate detailed report
    const detailedReport = ContentQualityMonitor.generateQualityReport(ideas);
    
    // Log to console for monitoring
    console.log(detailedReport);
    
    // Return JSON response
    return NextResponse.json({
      success: true,
      summary,
      reports,
      detailedReport,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Quality check error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to run quality check' },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    // Get all ideas
    const ideas = await listIdeas();
    
    // Auto-fix issues
    const fixedIdeas = ideas.map(idea => ContentQualityMonitor.autoFixIdea(idea));
    
    // Validate fixed ideas
    const { reports, summary } = ContentQualityMonitor.validateAllIdeas(fixedIdeas);
    
    // Only proceed if all critical issues are fixed
    if (summary.errors === 0) {
      // Here you would save the fixed ideas back to database
      // await updateIdeas(fixedIdeas);
      
      return NextResponse.json({
        success: true,
        message: 'Content quality issues fixed',
        summary,
        fixedCount: ideas.length
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Some critical issues could not be auto-fixed',
        summary,
        reports: reports.filter(r => !r.isValid)
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Quality fix error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fix quality issues' },
      { status: 500 }
    );
  }
}