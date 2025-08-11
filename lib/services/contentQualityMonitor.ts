// lib/services/contentQualityMonitor.ts
import type { Idea, ExecutionStep } from '../types';

interface QualityIssue {
  field: string;
  issue: string;
  severity: 'error' | 'warning';
}

interface QualityReport {
  ideaId: string;
  title: string;
  issues: QualityIssue[];
  score: number; // 0-100
  isValid: boolean;
}

export class ContentQualityMonitor {
  // Korean language patterns to check
  private static readonly BROKEN_KOREAN_PATTERNS = [
    /노시니어/g,  // Should be 시니어
    /클라우드펀딩/g, // Should be 크라우드펀딩
    /퀄리티/g, // Should be 품질
    /리스크/g, // Consider using 위험
    /밸류/g, // Consider using 가치
  ];

  private static readonly KOREAN_FIXES: Record<string, string> = {
    '노시니어': '시니어',
    '클라우드펀딩': '크라우드펀딩',
    '퀄리티': '품질',
    '유져': '유저',
    '플렛폼': '플랫폼',
    '컨텐츠': '콘텐츠',
    '쿼리티': '품질',
    '비지니스': '비즈니스',
    '어플리케이션': '애플리케이션',
    '메니저': '매니저'
  };

  // Check for quality issues in an idea
  static validateIdea(idea: Idea): QualityReport {
    const issues: QualityIssue[] = [];
    
    // 1. Check required fields
    if (!idea.title || idea.title.trim().length < 5) {
      issues.push({ field: 'title', issue: 'Title is missing or too short', severity: 'error' });
    }
    
    if (!idea.summary3 || idea.summary3.length < 50) {
      issues.push({ field: 'summary3', issue: 'Summary is missing or too short', severity: 'error' });
    }
    
    // 2. Check Korean language quality
    const koreanIssues = this.checkKoreanQuality(idea);
    issues.push(...koreanIssues);
    
    // 3. Check data consistency
    if (idea.koreaFit !== undefined) {
      if (idea.koreaFit < 1 || idea.koreaFit > 10) {
        issues.push({ field: 'koreaFit', issue: `Korea Fit score ${idea.koreaFit} is out of range (1-10)`, severity: 'error' });
      }
    }
    
    if (idea.effort !== undefined) {
      if (idea.effort < 1 || idea.effort > 5) {
        issues.push({ field: 'effort', issue: `Effort score ${idea.effort} is out of range (1-5)`, severity: 'error' });
      }
    }
    
    // 4. Check for duplicate or generic content
    if (idea.executionRoadmap && idea.executionRoadmap.length > 0) {
      const genericPhrases = [
        '자세한 내용은 추후 결정',
        'TBD',
        '미정',
        '추가 논의 필요'
      ];
      
      idea.executionRoadmap.forEach((step, index) => {
        genericPhrases.forEach(phrase => {
          if (step.description.includes(phrase)) {
            issues.push({ 
              field: `executionRoadmap[${index}]`, 
              issue: `Generic/placeholder content found: "${phrase}"`, 
              severity: 'warning' 
            });
          }
        });
      });
    }
    
    // 5. Check for consistency in business model fields
    if (idea.businessModel && idea.businessModel.includes('구독')) {
      if (!idea.summary3?.includes('구독') && !idea.summary3?.includes('정기')) {
        issues.push({ 
          field: 'businessModel', 
          issue: 'Business model mentions subscription but summary does not explain it', 
          severity: 'warning' 
        });
      }
    }
    
    // Calculate quality score
    const errorCount = issues.filter(i => i.severity === 'error').length;
    const warningCount = issues.filter(i => i.severity === 'warning').length;
    const score = Math.max(0, 100 - (errorCount * 20) - (warningCount * 5));
    
    return {
      ideaId: idea.id,
      title: idea.title,
      issues,
      score,
      isValid: errorCount === 0
    };
  }
  
  // Check Korean language quality
  private static checkKoreanQuality(idea: Idea): QualityIssue[] {
    const issues: QualityIssue[] = [];
    const fieldsToCheck = ['title', 'summary3', 'whyNow', 'businessModel', 'targetUser'];
    
    fieldsToCheck.forEach(field => {
      const value = (idea as any)[field];
      if (typeof value === 'string') {
        // Check for broken Korean patterns
        Object.entries(this.KOREAN_FIXES).forEach(([broken, correct]) => {
          if (value.includes(broken)) {
            issues.push({
              field,
              issue: `Contains broken Korean: "${broken}" should be "${correct}"`,
              severity: 'error'
            });
          }
        });
        
        // Check for mixed language issues
        if (/[A-Za-z]+[가-힣]+[A-Za-z]+/.test(value) || /[가-힣]+[A-Za-z]+[가-힣]+/.test(value)) {
          issues.push({
            field,
            issue: 'Mixed Korean and English without proper spacing',
            severity: 'warning'
          });
        }
      }
    });
    
    // Check risks array
    if (idea.risks && Array.isArray(idea.risks)) {
      idea.risks.forEach((risk, index) => {
        Object.entries(this.KOREAN_FIXES).forEach(([broken, correct]) => {
          if (risk.includes(broken)) {
            issues.push({
              field: `risks[${index}]`,
              issue: `Contains broken Korean: "${broken}" should be "${correct}"`,
              severity: 'error'
            });
          }
        });
      });
    }
    
    return issues;
  }
  
  // Auto-fix common issues
  static autoFixIdea(idea: Idea): Idea {
    const fixed = { ...idea };
    
    // Fix Korean language issues
    const fieldsToFix = ['title', 'summary3', 'whyNow', 'businessModel', 'targetUser'] as const;
    
    fieldsToFix.forEach(field => {
      if (fixed[field] && typeof fixed[field] === 'string') {
        let value = fixed[field] as string;
        Object.entries(this.KOREAN_FIXES).forEach(([broken, correct]) => {
          value = value.replace(new RegExp(broken, 'g'), correct);
        });
        (fixed as any)[field] = value;
      }
    });
    
    // Fix risks array
    if (fixed.risks && Array.isArray(fixed.risks)) {
      fixed.risks = fixed.risks.map(risk => {
        let fixedRisk = risk;
        Object.entries(this.KOREAN_FIXES).forEach(([broken, correct]) => {
          fixedRisk = fixedRisk.replace(new RegExp(broken, 'g'), correct);
        });
        return fixedRisk;
      });
    }
    
    // Fix out-of-range scores
    if (fixed.koreaFit !== undefined) {
      fixed.koreaFit = Math.max(1, Math.min(10, fixed.koreaFit));
    }
    
    if (fixed.effort !== undefined) {
      fixed.effort = Math.max(1, Math.min(5, Math.round(fixed.effort)));
    }
    
    return fixed;
  }
  
  // Validate all ideas and generate report
  static validateAllIdeas(ideas: Idea[]): {
    reports: QualityReport[];
    summary: {
      total: number;
      valid: number;
      errors: number;
      warnings: number;
      averageScore: number;
    };
  } {
    const reports = ideas.map(idea => this.validateIdea(idea));
    
    const summary = {
      total: reports.length,
      valid: reports.filter(r => r.isValid).length,
      errors: reports.reduce((sum, r) => sum + r.issues.filter(i => i.severity === 'error').length, 0),
      warnings: reports.reduce((sum, r) => sum + r.issues.filter(i => i.severity === 'warning').length, 0),
      averageScore: reports.reduce((sum, r) => sum + r.score, 0) / reports.length
    };
    
    return { reports, summary };
  }
  
  // Generate detailed quality report
  static generateQualityReport(ideas: Idea[]): string {
    const { reports, summary } = this.validateAllIdeas(ideas);
    
    let report = '=== Content Quality Report ===\n\n';
    report += `Total Ideas: ${summary.total}\n`;
    report += `Valid Ideas: ${summary.valid} (${((summary.valid / summary.total) * 100).toFixed(1)}%)\n`;
    report += `Total Errors: ${summary.errors}\n`;
    report += `Total Warnings: ${summary.warnings}\n`;
    report += `Average Quality Score: ${summary.averageScore.toFixed(1)}/100\n\n`;
    
    // List critical issues
    const criticalReports = reports.filter(r => !r.isValid);
    if (criticalReports.length > 0) {
      report += '=== Critical Issues (Must Fix) ===\n\n';
      criticalReports.forEach(r => {
        report += `[${r.ideaId}] ${r.title}\n`;
        r.issues.filter(i => i.severity === 'error').forEach(issue => {
          report += `  ❌ ${issue.field}: ${issue.issue}\n`;
        });
        report += '\n';
      });
    }
    
    // List warnings
    const warningReports = reports.filter(r => r.issues.some(i => i.severity === 'warning'));
    if (warningReports.length > 0) {
      report += '=== Warnings (Should Fix) ===\n\n';
      warningReports.forEach(r => {
        const warnings = r.issues.filter(i => i.severity === 'warning');
        if (warnings.length > 0) {
          report += `[${r.ideaId}] ${r.title}\n`;
          warnings.forEach(issue => {
            report += `  ⚠️  ${issue.field}: ${issue.issue}\n`;
          });
          report += '\n';
        }
      });
    }
    
    return report;
  }
}