/**
 * Newsletter Content Validator - Pre-send validation system
 * Integrates with StrictFactChecker to block publication of unverified content
 */

import { StrictFactChecker, NewsletterContent, FactCheckResult } from '@/lib/services/factChecker';

export class NewsletterValidator {
  private factChecker: StrictFactChecker;

  constructor() {
    this.factChecker = new StrictFactChecker();
  }

  /**
   * Parse newsletter HTML/text content into structured format for fact-checking
   */
  parseNewsletterContent(html: string, subject: string): NewsletterContent {
    const content: NewsletterContent = {
      subject,
      sections: []
    };

    // Extract sections from HTML
    const sectionRegex = /<div class="section[^"]*"[^>]*>(.*?)<\/div>/gs;
    const matches = html.match(sectionRegex) || [];

    for (const match of matches) {
      const section = this.parseSection(match);
      if (section) {
        content.sections.push(section);
      }
    }

    return content;
  }

  /**
   * Parse individual section content
   */
  private parseSection(sectionHtml: string) {
    // Extract title
    const titleMatch = sectionHtml.match(/<h[3-4][^>]*>(.*?)<\/h[3-4]>/);
    const title = titleMatch ? this.stripHtml(titleMatch[1]) : 'Untitled';

    // Extract all text content
    const content = this.stripHtml(sectionHtml);

    // Extract claims (sentences that make factual assertions)
    const claims = this.extractClaims(content);

    // Extract dates
    const dates = this.extractDates(content);

    // Extract source mentions
    const sources = this.extractSources(content);

    return {
      title,
      content,
      claims,
      dates,
      sources
    };
  }

  /**
   * Extract factual claims from content
   */
  private extractClaims(content: string): string[] {
    const claims: string[] = [];
    
    // Split into sentences
    const sentences = content.split(/[.!?]/).map(s => s.trim()).filter(s => s.length > 10);
    
    // Identify factual claim patterns
    const claimPatterns = [
      /.*발표.*/, // announcements
      /.*시행.*/, // implementation
      /.*공포.*/, // promulgation
      /.*확정.*/, // confirmation
      /.*승인.*/, // approval
      /.*허용.*/, // permission
      /.*금지.*/, // prohibition
      /.*의무.*/, // obligation
      /.*처벌.*/, // punishment
      /.*과태료.*/, // fines
      /\d{4}년.*\d{1,2}월.*/, // dates
      /\d+%.*/, // percentages
      /\d+억원.*|만원.*/, // monetary amounts
    ];

    for (const sentence of sentences) {
      if (claimPatterns.some(pattern => pattern.test(sentence))) {
        claims.push(sentence);
      }
    }

    return claims;
  }

  /**
   * Extract dates from content
   */
  private extractDates(content: string): string[] {
    const datePatterns = [
      /\d{4}년\s*\d{1,2}월\s*\d{1,2}일/g,
      /\d{1,2}월\s*\d{1,2}일/g,
      /\d{4}-\d{1,2}-\d{1,2}/g,
      /\d{4}\.\d{1,2}\.\d{1,2}/g
    ];

    const dates: string[] = [];
    for (const pattern of datePatterns) {
      const matches = content.match(pattern) || [];
      dates.push(...matches);
    }

    return [...new Set(dates)]; // Remove duplicates
  }

  /**
   * Extract source mentions from content
   */
  private extractSources(content: string): string[] {
    const sourcePatterns = [
      /https?:\/\/[^\s]+/g, // URLs
      /금융위원회|과기정통부|개인정보보호위원회|보건복지부|중소벤처기업부|국회/g, // Government agencies
      /연합뉴스|한국경제신문|전자신문|매일경제/g, // News sources
    ];

    const sources: string[] = [];
    for (const pattern of sourcePatterns) {
      const matches = content.match(pattern) || [];
      sources.push(...matches);
    }

    return [...new Set(sources)];
  }

  /**
   * Strip HTML tags from content
   */
  private stripHtml(html: string): string {
    return html
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Main validation method - BLOCKS sending if validation fails
   */
  async validateBeforeSend(newsletterHtml: string, subject: string): Promise<{
    canSend: boolean;
    report: string;
    result: FactCheckResult;
  }> {
    console.log('🛡️ NEWSLETTER VALIDATION: Starting pre-send verification...');

    try {
      // Parse content
      const content = this.parseNewsletterContent(newsletterHtml, subject);
      
      // Run strict fact-checking
      const result = await this.factChecker.verifyNewsletter(content);
      
      // Generate comprehensive report
      const report = this.factChecker.generateReport(result);
      
      console.log(report);

      if (!result.isVerified) {
        console.error('🚫 SEND BLOCKED: Newsletter failed validation requirements');
        console.error(`Confidence: ${result.confidence}% (Required: 85%+)`);
        console.error(`Errors: ${result.errors.length}`);
      } else {
        console.log('✅ VALIDATION PASSED: Newsletter approved for sending');
      }

      return {
        canSend: result.isVerified,
        report,
        result
      };

    } catch (error) {
      const errorReport = `🚨 CRITICAL VALIDATION ERROR: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error(errorReport);

      return {
        canSend: false,
        report: errorReport,
        result: {
          isVerified: false,
          confidence: 0,
          sources: [],
          errors: [error instanceof Error ? error.message : 'Unknown error'],
          warnings: [],
          recommendations: ['Fix validation system error before attempting to send']
        }
      };
    }
  }

  /**
   * Generate validation summary for logging
   */
  generateValidationSummary(result: FactCheckResult): string {
    return `Validation: ${result.isVerified ? 'PASS' : 'FAIL'} | ` +
           `Confidence: ${result.confidence}% | ` +
           `Errors: ${result.errors.length} | ` +
           `Warnings: ${result.warnings.length} | ` +
           `Sources: ${result.sources.length}`;
  }
}

/**
 * Convenience function for quick validation
 */
export async function validateNewsletter(html: string, subject: string) {
  const validator = new NewsletterValidator();
  return await validator.validateBeforeSend(html, subject);
}