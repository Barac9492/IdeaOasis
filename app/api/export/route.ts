// app/api/export/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebaseAdmin';
import { ExportService, ExportOptions } from '@/lib/services/exportService';
import { listIdeas } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const body = await request.json();
    const { 
      format, 
      ideaIds, 
      fileName, 
      includeMetrics = true, 
      includeRoadmap = false 
    }: {
      format: 'pdf' | 'excel';
      ideaIds?: string[];
      fileName?: string;
      includeMetrics?: boolean;
      includeRoadmap?: boolean;
    } = body;

    // Validate format
    if (!format || !['pdf', 'excel'].includes(format)) {
      return NextResponse.json(
        { error: 'Invalid export format' },
        { status: 400 }
      );
    }

    // Get ideas to export
    let allIdeas = await listIdeas();
    
    // Filter to specific ideas if requested
    let ideasToExport = ideaIds && ideaIds.length > 0
      ? allIdeas.filter(idea => ideaIds.includes(idea.id))
      : allIdeas;

    if (ideasToExport.length === 0) {
      return NextResponse.json(
        { error: 'No ideas found to export' },
        { status: 400 }
      );
    }

    // Generate export
    const exportOptions: ExportOptions = {
      format,
      ideas: ideasToExport,
      fileName,
      includeMetrics,
      includeRoadmap
    };

    const result = await ExportService.exportIdeas(userId, exportOptions);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      downloadUrl: result.downloadUrl,
      fileName: fileName || `ideaoasis-export-${Date.now()}`,
      ideaCount: ideasToExport.length
    });

  } catch (error) {
    console.error('Export API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // Get available export options for user
    const templates = await ExportService.getAvailableTemplates(userId);

    return NextResponse.json({
      templates,
      formats: {
        pdf: templates.pdf,
        excel: templates.excel
      }
    });

  } catch (error) {
    console.error('Export options API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}