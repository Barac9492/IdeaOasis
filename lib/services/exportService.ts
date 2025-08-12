// lib/services/exportService.ts

import { SubscriptionService } from './subscriptionService';
import type { Idea } from '@/lib/types';

export interface ExportOptions {
  format: 'pdf' | 'excel';
  ideas: Idea[];
  fileName?: string;
  includeMetrics?: boolean;
  includeRoadmap?: boolean;
}

export interface ExportResult {
  success: boolean;
  downloadUrl?: string;
  error?: string;
}

export class ExportService {
  /**
   * Export ideas to PDF or Excel
   */
  static async exportIdeas(userId: string, options: ExportOptions): Promise<ExportResult> {
    try {
      // Check subscription permissions
      const canExport = await SubscriptionService.canAccessFeature(userId, `export_${options.format}`);
      if (!canExport) {
        return {
          success: false,
          error: 'Export 기능은 프리미엄 이상 플랜에서 이용 가능합니다.'
        };
      }

      // Check usage limits
      const currentUsage = await this.getCurrentMonthlyExports(userId);
      const withinLimit = await SubscriptionService.checkUsageLimit(userId, 'exports_per_month', currentUsage);
      if (!withinLimit) {
        return {
          success: false,
          error: '월간 내보내기 한도를 초과했습니다. 플랜을 업그레이드하세요.'
        };
      }

      // Generate export file
      const fileName = options.fileName || `ideaoasis-ideas-${new Date().toISOString().split('T')[0]}`;
      
      if (options.format === 'pdf') {
        return await this.generatePDF(options.ideas, fileName, {
          includeMetrics: options.includeMetrics,
          includeRoadmap: options.includeRoadmap
        });
      } else {
        return await this.generateExcel(options.ideas, fileName, {
          includeMetrics: options.includeMetrics,
          includeRoadmap: options.includeRoadmap
        });
      }
    } catch (error) {
      console.error('Export failed:', error);
      return {
        success: false,
        error: '내보내기 중 오류가 발생했습니다.'
      };
    }
  }

  /**
   * Generate PDF report
   */
  private static async generatePDF(ideas: Idea[], fileName: string, options: {
    includeMetrics?: boolean;
    includeRoadmap?: boolean;
  }): Promise<ExportResult> {
    // In production, this would use a PDF generation library like jsPDF or Puppeteer
    // For now, we'll simulate the PDF generation process
    
    const pdfContent = this.generatePDFContent(ideas, options);
    
    // Simulate PDF generation delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In production, this would upload to cloud storage and return actual URL
    const mockUrl = `data:application/pdf;base64,${btoa(pdfContent)}`;
    
    // Track usage
    await this.incrementExportUsage(fileName.split('-')[0]); // Extract userId from fileName pattern
    
    return {
      success: true,
      downloadUrl: mockUrl
    };
  }

  /**
   * Generate Excel report
   */
  private static async generateExcel(ideas: Idea[], fileName: string, options: {
    includeMetrics?: boolean;
    includeRoadmap?: boolean;
  }): Promise<ExportResult> {
    // In production, this would use a library like SheetJS or ExcelJS
    // For now, we'll generate CSV-like content
    
    const csvContent = this.generateCSVContent(ideas, options);
    
    // Simulate Excel generation delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Convert to downloadable format
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const mockUrl = `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`;
    
    // Track usage
    await this.incrementExportUsage(fileName.split('-')[0]); // Extract userId from fileName pattern
    
    return {
      success: true,
      downloadUrl: mockUrl
    };
  }

  /**
   * Generate PDF content
   */
  private static generatePDFContent(ideas: Idea[], options: {
    includeMetrics?: boolean;
    includeRoadmap?: boolean;
  }): string {
    let content = `IdeaOasis 아이디어 리포트\n`;
    content += `생성일: ${new Date().toLocaleDateString('ko-KR')}\n`;
    content += `총 ${ideas.length}개의 아이디어\n\n`;
    
    ideas.forEach((idea, index) => {
      content += `${index + 1}. ${idea.title}\n`;
      content += `Korea Fit: ${idea.koreaFit}/10\n`;
      content += `분야: ${idea.sector || '미분류'}\n`;
      content += `요약: ${idea.summary3}\n`;
      
      if (options.includeMetrics && idea.metrics) {
        content += `\n메트릭:\n`;
        content += `- 시장 기회: ${idea.metrics.marketOpportunity}/10\n`;
        content += `- 실행 난이도: ${idea.metrics.executionDifficulty}/10\n`;
        content += `- 수익 잠재력: ${idea.metrics.revenuePotential}/10\n`;
        content += `- 타이밍 점수: ${idea.metrics.timingScore}/10\n`;
        content += `- 규제 리스크: ${idea.metrics.regulatoryRisk}/10\n`;
      }
      
      if (options.includeRoadmap && idea.executionRoadmap) {
        content += `\n실행 로드맵:\n`;
        idea.executionRoadmap.forEach((step, stepIndex) => {
          content += `${stepIndex + 1}. ${step.title}: ${step.description}\n`;
          content += `   카테고리: ${step.category} | 우선순위: ${step.priority} | 예상 기간: ${step.timeframe}\n`;
        });
      }
      
      content += `\n원문 링크: ${idea.sourceUrl}\n`;
      content += `${'='.repeat(50)}\n\n`;
    });
    
    return content;
  }

  /**
   * Generate CSV content
   */
  private static generateCSVContent(ideas: Idea[], options: {
    includeMetrics?: boolean;
    includeRoadmap?: boolean;
  }): string {
    let headers = ['제목', 'Korea Fit', '분야', '요약', '트렌드 성장률', '원문 링크'];
    
    if (options.includeMetrics) {
      headers.push('시장 기회', '실행 난이도', '수익 잠재력', '타이밍 점수', '규제 리스크');
    }
    
    let csv = headers.join(',') + '\n';
    
    ideas.forEach(idea => {
      let row = [
        `"${idea.title.replace(/"/g, '""')}"`,
        idea.koreaFit || 0,
        `"${idea.sector || '미분류'}"`,
        `"${(idea.summary3 || '').replace(/"/g, '""')}"`,
        `"${idea.trendData?.growth || 'N/A'}"`,
        `"${idea.sourceUrl}"`
      ];
      
      if (options.includeMetrics && idea.metrics) {
        row.push(
          String(idea.metrics.marketOpportunity || 0),
          String(idea.metrics.executionDifficulty || 0),
          String(idea.metrics.revenuePotential || 0),
          String(idea.metrics.timingScore || 0),
          String(idea.metrics.regulatoryRisk || 0)
        );
      }
      
      csv += row.join(',') + '\n';
    });
    
    return csv;
  }

  /**
   * Get current monthly export usage for user
   */
  private static async getCurrentMonthlyExports(userId: string): Promise<number> {
    // In production, this would query actual usage from database
    // For demo purposes, return a mock value
    return Math.floor(Math.random() * 10);
  }

  /**
   * Increment export usage tracking
   */
  private static async incrementExportUsage(userId: string): Promise<void> {
    // In production, this would increment usage counter in database
    // For now, just log the usage
    console.log(`Export usage incremented for user: ${userId}`);
  }

  /**
   * Get export templates available to user
   */
  static async getAvailableTemplates(userId: string): Promise<{
    pdf: boolean;
    excel: boolean;
    templates: string[];
  }> {
    const canExportPDF = await SubscriptionService.canAccessFeature(userId, 'export_pdf');
    const canExportExcel = await SubscriptionService.canAccessFeature(userId, 'export_excel');
    
    const templates = [];
    if (canExportPDF || canExportExcel) {
      templates.push('기본 아이디어 리스트', '상세 분석 리포트');
      
      // Enterprise users get additional templates
      const isEnterprise = await SubscriptionService.canAccessFeature(userId, 'api_access');
      if (isEnterprise) {
        templates.push('경영진 요약 리포트', '투자 검토 리포트', '시장 분석 리포트');
      }
    }
    
    return {
      pdf: canExportPDF,
      excel: canExportExcel,
      templates
    };
  }

  /**
   * Generate export preview
   */
  static generateExportPreview(ideas: Idea[], maxItems: number = 3): {
    totalIdeas: number;
    previewIdeas: Array<{
      title: string;
      koreaFit: number;
      sector: string;
    }>;
    estimatedFileSize: string;
  } {
    return {
      totalIdeas: ideas.length,
      previewIdeas: ideas.slice(0, maxItems).map(idea => ({
        title: idea.title,
        koreaFit: idea.koreaFit || 0,
        sector: idea.sector || '미분류'
      })),
      estimatedFileSize: ideas.length < 10 ? '< 1MB' : 
                         ideas.length < 50 ? '1-3MB' : '3-5MB'
    };
  }
}