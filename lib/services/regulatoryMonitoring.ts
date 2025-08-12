// Enhanced Regulatory Monitoring Service - Core monitoring engine for real-time regulatory intelligence
// Integrates with Korean Government APIs and provides comprehensive change detection and alerting

import { Idea } from '@/lib/types';
import { 
  koreanGovAPIs, 
  RegulatoryDocument, 
  RegulatoryAlert, 
  GovDataSource,
  AlertType 
} from './koreanGovAPIs';
import { emailNotificationService } from './emailNotificationService';
import crypto from 'crypto';

export interface RegulatoryUpdate {
  id: string;
  sourceUrl: string;
  title: string;
  summary: string;
  publishedDate: Date;
  effectiveDate?: Date;
  ministry: string;
  category: 'law' | 'decree' | 'regulation' | 'guideline' | 'announcement';
  industries: string[];
  complianceRequired: boolean;
  businessImpact: 'high' | 'medium' | 'low';
  keyChanges: string[];
  affectedBusinessTypes: string[];
  actionItems: string[];
  deadline?: Date;
  penalties?: string;
  opportunities?: string[];
  risks?: string[];
  relatedRegulations?: string[];
  fullText?: string;
  lastChecked: Date;
  changeDetected: boolean;
  previousVersion?: string;
}

export interface MonitoringConfiguration {
  checkIntervalMinutes: number;
  enableRealTimeAlerts: boolean;
  enableEmailNotifications: boolean;
  enableSlackIntegration: boolean;
  industryFilters: string[];
  severityFilters: ('critical' | 'high' | 'medium' | 'low')[];
  businessTypeFilters: string[];
  autoTranslation: boolean;
  retentionDays: number;
}

export interface MonitoringStats {
  totalDocumentsProcessed: number;
  alertsGenerated24h: number;
  criticalAlerts24h: number;
  sourcesMonitored: number;
  lastSuccessfulCheck: Date;
  averageProcessingTime: number;
  errorRate: number;
  uptime: number;
}

export interface ChangeDetectionResult {
  documentId: string;
  changeType: 'new' | 'modified' | 'deleted';
  changedSections: ChangedSection[];
  severity: 'critical' | 'high' | 'medium' | 'low';
  confidence: number; // 0-100%
  automatedAnalysis: string;
  requiresHumanReview: boolean;
}

export interface ChangedSection {
  sectionName: string;
  previousContent: string;
  newContent: string;
  changeType: 'addition' | 'deletion' | 'modification';
  impactAssessment: string;
}

export interface ComplianceDeadline {
  documentId: string;
  title: string;
  deadline: Date;
  daysRemaining: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  affectedIndustries: string[];
  requirements: string[];
  penalties: string[];
  actionItems: string[];
}

export interface IndustryImpactAnalysis {
  industry: string;
  impactScore: number; // 0-100
  affectedDocuments: string[];
  keyRegulations: RegulatoryDocument[];
  riskLevel: 'very_high' | 'high' | 'medium' | 'low' | 'very_low';
  opportunityAreas: string[];
  complianceGaps: string[];
  recommendations: string[];
}

// ===== ENHANCED REGULATORY MONITORING SERVICE =====

export class EnhancedRegulatoryMonitoringService {
  private config: MonitoringConfiguration = {
    checkIntervalMinutes: 30,
    enableRealTimeAlerts: true,
    enableEmailNotifications: true,
    enableSlackIntegration: false,
    industryFilters: [],
    severityFilters: ['critical', 'high'],
    businessTypeFilters: [],
    autoTranslation: false,
    retentionDays: 365
  };

  private monitoringStats: MonitoringStats = {
    totalDocumentsProcessed: 0,
    alertsGenerated24h: 0,
    criticalAlerts24h: 0,
    sourcesMonitored: 0,
    lastSuccessfulCheck: new Date(),
    averageProcessingTime: 0,
    errorRate: 0,
    uptime: 100
  };

  private isMonitoring = false;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private documentHistory = new Map<string, RegulatoryDocument[]>();
  private alertHistory = new Map<string, RegulatoryAlert[]>();
  private processingQueue: string[] = [];
  private errorLog: Array<{ timestamp: Date; error: string; source: string }> = [];

  // ===== MAIN MONITORING LOOP =====

  async startMonitoring(): Promise<void> {
    if (this.isMonitoring) {
      console.log('⚠️ Monitoring already active');
      return;
    }

    console.log('🚀 Starting enhanced regulatory monitoring system...');
    this.isMonitoring = true;

    // Initial full scan
    await this.performFullScan();

    // Set up periodic monitoring
    this.monitoringInterval = setInterval(
      () => this.performIncrementalScan(),
      this.config.checkIntervalMinutes * 60 * 1000
    );

    console.log(`✅ Monitoring active - checking every ${this.config.checkIntervalMinutes} minutes`);
  }

  async stopMonitoring(): Promise<void> {
    console.log('🛑 Stopping regulatory monitoring system...');
    this.isMonitoring = false;

    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }

    console.log('✅ Monitoring stopped');
  }

  private async performFullScan(): Promise<void> {
    const startTime = Date.now();
    console.log('🔍 Performing full regulatory scan...');

    try {
      // Fetch from all Korean government sources
      const documents = await koreanGovAPIs.fetchAllSources();
      console.log(`📄 Retrieved ${documents.length} documents from ${await this.getActiveSourceCount()} sources`);

      // Process documents and detect changes
      const changeResults = await this.performChangeDetection(documents);
      console.log(`🔄 Detected ${changeResults.length} changes`);

      // Generate alerts for significant changes
      const alerts = await this.generateIntelligentAlerts(documents, changeResults);
      console.log(`🚨 Generated ${alerts.length} alerts`);

      // Send notifications for critical alerts
      await this.processAlertNotifications(alerts);

      // Update statistics
      this.updateMonitoringStats(documents, alerts, Date.now() - startTime);

      // Store results for future comparison
      await this.storeDocumentHistory(documents);

      console.log('✅ Full scan completed successfully');

    } catch (error) {
      console.error('❌ Full scan failed:', error);
      this.logError('full_scan', error as string);
    }
  }

  private async performIncrementalScan(): Promise<void> {
    if (!this.isMonitoring) return;

    const startTime = Date.now();
    console.log('🔍 Performing incremental regulatory scan...');

    try {
      // Get recent changes only (last 2 hours)
      const recentDocs = await koreanGovAPIs.getRecentChanges(0.083); // 2 hours in days
      
      if (recentDocs.length === 0) {
        console.log('ℹ️ No new changes detected');
        return;
      }

      console.log(`📄 Processing ${recentDocs.length} recent documents`);

      // Analyze changes with higher precision
      const changeResults = await this.performAdvancedChangeDetection(recentDocs);
      
      // Generate real-time alerts
      const alerts = await this.generateRealTimeAlerts(recentDocs, changeResults);
      
      if (alerts.length > 0) {
        console.log(`🚨 Generated ${alerts.length} real-time alerts`);
        await this.processUrgentAlerts(alerts);
      }

      // Update incremental statistics
      this.updateIncrementalStats(recentDocs, alerts, Date.now() - startTime);

    } catch (error) {
      console.error('❌ Incremental scan failed:', error);
      this.logError('incremental_scan', error as string);
    }
  }

  // ===== ADVANCED CHANGE DETECTION ALGORITHMS =====

  private async performChangeDetection(documents: RegulatoryDocument[]): Promise<ChangeDetectionResult[]> {
    const results: ChangeDetectionResult[] = [];

    for (const doc of documents) {
      try {
        const changeResult = await this.analyzeDocumentChanges(doc);
        if (changeResult) {
          results.push(changeResult);
        }
      } catch (error) {
        console.error(`Failed to analyze changes for ${doc.id}:`, error);
      }
    }

    return results;
  }

  private async performAdvancedChangeDetection(documents: RegulatoryDocument[]): Promise<ChangeDetectionResult[]> {
    const results: ChangeDetectionResult[] = [];

    for (const doc of documents) {
      const changeResult = await this.performDeepChangeAnalysis(doc);
      if (changeResult) {
        results.push(changeResult);
      }
    }

    return results;
  }

  private async analyzeDocumentChanges(document: RegulatoryDocument): Promise<ChangeDetectionResult | null> {
    // Get document history
    const history = this.documentHistory.get(document.id) || [];
    
    if (history.length === 0) {
      // New document
      return {
        documentId: document.id,
        changeType: 'new',
        changedSections: [],
        severity: document.impactLevel,
        confidence: 100,
        automatedAnalysis: `New regulatory document: ${document.title}`,
        requiresHumanReview: document.impactLevel === 'critical'
      };
    }

    const previousVersion = history[history.length - 1];
    
    // Compare content hashes
    if (previousVersion.currentVersionHash === document.currentVersionHash) {
      return null; // No changes
    }

    // Analyze what changed
    const changedSections = await this.identifyChangedSections(previousVersion, document);
    const severity = this.assessChangeSeverity(changedSections, document);
    const confidence = this.calculateChangeConfidence(changedSections);

    return {
      documentId: document.id,
      changeType: 'modified',
      changedSections,
      severity,
      confidence,
      automatedAnalysis: await this.generateChangeAnalysis(changedSections, document),
      requiresHumanReview: severity === 'critical' || confidence < 80
    };
  }

  private async performDeepChangeAnalysis(document: RegulatoryDocument): Promise<ChangeDetectionResult | null> {
    // Enhanced analysis with section-by-section comparison
    const history = this.documentHistory.get(document.id) || [];
    
    if (history.length === 0) {
      return await this.analyzeDocumentChanges(document);
    }

    const previousVersion = history[history.length - 1];
    
    // Perform semantic analysis of changes
    const semanticChanges = await this.performSemanticAnalysis(previousVersion, document);
    const legalImpactAnalysis = await this.analyzeLegalImpact(document);
    const businessImpactAssessment = await this.assessBusinessImpact(document);

    const changedSections = await this.identifyChangedSections(previousVersion, document);
    
    return {
      documentId: document.id,
      changeType: 'modified',
      changedSections,
      severity: document.impactLevel,
      confidence: this.calculateAdvancedConfidence(semanticChanges, legalImpactAnalysis),
      automatedAnalysis: await this.generateAdvancedAnalysis(document, semanticChanges, businessImpactAssessment),
      requiresHumanReview: document.impactLevel === 'critical' || semanticChanges.requiresExpertReview
    };
  }

  private async identifyChangedSections(previous: RegulatoryDocument, current: RegulatoryDocument): Promise<ChangedSection[]> {
    const sections: ChangedSection[] = [];
    
    // Compare key fields
    if (previous.title !== current.title) {
      sections.push({
        sectionName: 'title',
        previousContent: previous.title,
        newContent: current.title,
        changeType: 'modification',
        impactAssessment: 'Document title changed - may indicate significant regulatory shift'
      });
    }

    if (previous.status !== current.status) {
      sections.push({
        sectionName: 'status',
        previousContent: previous.status,
        newContent: current.status,
        changeType: 'modification',
        impactAssessment: 'Legal status changed - immediate compliance review required'
      });
    }

    if (previous.effectiveDate?.getTime() !== current.effectiveDate?.getTime()) {
      sections.push({
        sectionName: 'effective_date',
        previousContent: previous.effectiveDate?.toISOString() || '',
        newContent: current.effectiveDate?.toISOString() || '',
        changeType: 'modification',
        impactAssessment: 'Implementation timeline changed - update compliance calendar'
      });
    }

    // Compare content using diff algorithm
    if (previous.content !== current.content) {
      const contentDiff = await this.generateContentDiff(previous.content || '', current.content || '');
      sections.push({
        sectionName: 'content',
        previousContent: previous.content || '',
        newContent: current.content || '',
        changeType: 'modification',
        impactAssessment: contentDiff
      });
    }

    return sections;
  }

  private async generateContentDiff(previousContent: string, newContent: string): Promise<string> {
    // Simple diff implementation - in production would use proper diff algorithm
    const previousLines = previousContent.split('\n');
    const newLines = newContent.split('\n');
    
    let changes = 0;
    const maxLines = Math.max(previousLines.length, newLines.length);
    
    for (let i = 0; i < maxLines; i++) {
      if (previousLines[i] !== newLines[i]) {
        changes++;
      }
    }
    
    const changePercentage = (changes / maxLines) * 100;
    
    if (changePercentage > 50) {
      return 'Major content revision - comprehensive review required';
    } else if (changePercentage > 20) {
      return 'Significant content changes - detailed analysis needed';
    } else if (changePercentage > 5) {
      return 'Minor content updates - review recommended';
    } else {
      return 'Minimal content changes - low priority review';
    }
  }

  private assessChangeSeverity(changedSections: ChangedSection[], document: RegulatoryDocument): 'critical' | 'high' | 'medium' | 'low' {
    // Critical changes
    const hasCriticalSections = changedSections.some(section => 
      section.sectionName === 'status' || 
      section.sectionName === 'effective_date' ||
      section.impactAssessment.includes('immediate') ||
      section.impactAssessment.includes('required')
    );

    if (hasCriticalSections || document.impactLevel === 'critical') {
      return 'critical';
    }

    // High impact changes
    if (changedSections.length > 3 || document.impactLevel === 'high') {
      return 'high';
    }

    // Medium impact
    if (changedSections.length > 1 || document.impactLevel === 'medium') {
      return 'medium';
    }

    return 'low';
  }

  private calculateChangeConfidence(changedSections: ChangedSection[]): number {
    let confidence = 100;
    
    // Reduce confidence for unclear changes
    changedSections.forEach(section => {
      if (section.impactAssessment.includes('review')) {
        confidence -= 10;
      }
      if (section.changeType === 'modification' && section.newContent.length < 50) {
        confidence -= 5;
      }
    });

    return Math.max(confidence, 50); // Minimum 50% confidence
  }

  private async generateChangeAnalysis(changedSections: ChangedSection[], document: RegulatoryDocument): Promise<string> {
    const analysis = [];
    analysis.push(`Analysis for ${document.title}:`);
    analysis.push(`Document Impact Level: ${document.impactLevel.toUpperCase()}`);
    analysis.push(`Changes Detected: ${changedSections.length} sections modified`);
    
    changedSections.forEach(section => {
      analysis.push(`• ${section.sectionName}: ${section.impactAssessment}`);
    });

    if (document.keyChanges.length > 0) {
      analysis.push('Key Changes:');
      document.keyChanges.forEach(change => analysis.push(`• ${change}`));
    }

    return analysis.join('\n');
  }

  // ===== INTELLIGENT ALERT GENERATION =====

  private async generateIntelligentAlerts(documents: RegulatoryDocument[], changes: ChangeDetectionResult[]): Promise<RegulatoryAlert[]> {
    const alerts: RegulatoryAlert[] = [];
    
    // Process all documents for potential alerts
    for (const doc of documents) {
      const relatedChanges = changes.filter(change => change.documentId === doc.id);
      
      if (this.shouldGenerateAlert(doc, relatedChanges)) {
        const alert = await this.createIntelligentAlert(doc, relatedChanges);
        alerts.push(alert);
      }
    }

    // Generate industry impact alerts
    const industryAlerts = await this.generateIndustryImpactAlerts(documents);
    alerts.push(...industryAlerts);

    // Generate compliance deadline alerts
    const deadlineAlerts = await this.generateComplianceDeadlineAlerts(documents);
    alerts.push(...deadlineAlerts);

    return alerts;
  }

  private async generateRealTimeAlerts(documents: RegulatoryDocument[], changes: ChangeDetectionResult[]): Promise<RegulatoryAlert[]> {
    const alerts: RegulatoryAlert[] = [];
    
    // Only generate alerts for high-priority changes
    for (const doc of documents) {
      if (doc.impactLevel === 'critical' || doc.changeDetected) {
        const relatedChanges = changes.filter(change => change.documentId === doc.id);
        const alert = await this.createUrgentAlert(doc, relatedChanges);
        alerts.push(alert);
      }
    }

    return alerts;
  }

  private shouldGenerateAlert(document: RegulatoryDocument, changes: ChangeDetectionResult[]): boolean {
    // Always alert for critical documents
    if (document.impactLevel === 'critical') return true;
    
    // Alert for any detected changes with high confidence
    if (changes.some(change => change.confidence > 90 && change.severity !== 'low')) return true;
    
    // Alert for documents with approaching deadlines
    if (document.complianceDeadline) {
      const daysUntilDeadline = Math.floor(
        (document.complianceDeadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      if (daysUntilDeadline <= 30) return true;
    }

    // Alert for documents in filtered industries
    if (this.config.industryFilters.length > 0) {
      return document.industries.some(industry => this.config.industryFilters.includes(industry));
    }

    return document.impactLevel === 'high';
  }

  private async createIntelligentAlert(document: RegulatoryDocument, changes: ChangeDetectionResult[]): Promise<RegulatoryAlert> {
    const alertType = this.determineAlertType(document, changes);
    const severity = this.mapImpactToSeverity(document.impactLevel);
    
    return {
      id: crypto.randomUUID(),
      documentId: document.id,
      alertType,
      severity,
      title: await this.generateSmartAlertTitle(document, alertType, changes),
      description: await this.generateSmartAlertDescription(document, changes),
      affectedIndustries: document.industries,
      actionRequired: this.determineActionRequired(document, changes),
      deadline: document.complianceDeadline,
      recommendations: await this.generateContextualRecommendations(document, changes),
      createdAt: new Date(),
      notificationsSent: false
    };
  }

  private async createUrgentAlert(document: RegulatoryDocument, changes: ChangeDetectionResult[]): Promise<RegulatoryAlert> {
    return {
      id: crypto.randomUUID(),
      documentId: document.id,
      alertType: 'new_regulation',
      severity: 'critical',
      title: `🚨 긴급: ${document.title}`,
      description: `중대한 규제 변경이 감지되었습니다.\n\n${document.summary}\n\n즉시 검토가 필요합니다.`,
      affectedIndustries: document.industries,
      actionRequired: true,
      deadline: document.complianceDeadline,
      recommendations: [
        '즉시 법무팀 또는 컴플라이언스 담당자에게 알림',
        '현재 운영에 미치는 영향 긴급 평가',
        '필요시 전문가 상담 진행',
        '관련 이해관계자에게 상황 공유'
      ],
      createdAt: new Date(),
      notificationsSent: false
    };
  }

  private determineAlertType(document: RegulatoryDocument, changes: ChangeDetectionResult[]): AlertType {
    if (changes.some(change => change.changeType === 'new')) {
      return 'new_regulation';
    }
    
    if (changes.some(change => change.changeType === 'modified')) {
      return 'regulation_change';
    }

    if (document.complianceDeadline) {
      const daysUntilDeadline = Math.floor(
        (document.complianceDeadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      if (daysUntilDeadline <= 30) {
        return 'deadline_approaching';
      }
    }

    return 'compliance_update';
  }

  private async generateSmartAlertTitle(document: RegulatoryDocument, alertType: AlertType, changes: ChangeDetectionResult[]): Promise<string> {
    const alertTypeNames = {
      'new_regulation': '신규 규제',
      'regulation_change': '규제 변경',
      'deadline_approaching': '마감일 임박',
      'compliance_update': '컴플라이언스 업데이트',
      'industry_impact': '업계 영향',
      'penalty_change': '처벌 기준 변경'
    };

    const severityEmoji = {
      'critical': '🚨',
      'high': '⚡',
      'medium': '📋',
      'low': 'ℹ️'
    };

    const severity = this.mapImpactToSeverity(document.impactLevel);
    const emoji = severityEmoji[severity];
    const typeName = alertTypeNames[alertType];

    return `${emoji} [${typeName}] ${document.title}`;
  }

  private async generateSmartAlertDescription(document: RegulatoryDocument, changes: ChangeDetectionResult[]): Promise<string> {
    const description = [];
    
    description.push(document.summary || document.title);
    description.push('');

    if (changes.length > 0) {
      description.push('🔄 주요 변경사항:');
      changes.forEach(change => {
        description.push(`• ${change.automatedAnalysis}`);
      });
      description.push('');
    }

    if (document.keyChanges.length > 0) {
      description.push('📋 핵심 변화:');
      document.keyChanges.slice(0, 3).forEach(change => {
        description.push(`• ${change}`);
      });
      description.push('');
    }

    if (document.complianceDeadline) {
      const deadline = document.complianceDeadline.toLocaleDateString('ko-KR');
      description.push(`⏰ 준수 마감일: ${deadline}`);
    }

    return description.join('\n');
  }

  private async generateContextualRecommendations(document: RegulatoryDocument, changes: ChangeDetectionResult[]): Promise<string[]> {
    const recommendations: string[] = [];

    // Based on document impact level
    if (document.impactLevel === 'critical') {
      recommendations.push('즉시 경영진에게 보고 및 긴급 대응팀 구성');
      recommendations.push('현재 사업 운영에 미치는 즉각적 영향 분석');
      recommendations.push('전문 법률 자문을 통한 대응 전략 수립');
    } else if (document.impactLevel === 'high') {
      recommendations.push('담당 부서별 영향 분석 및 대응 계획 수립');
      recommendations.push('관련 팀과의 협의를 통한 구체적 실행 방안 논의');
    }

    // Based on change types
    const hasContentChanges = changes.some(change => 
      change.changedSections.some(section => section.sectionName === 'content')
    );
    
    if (hasContentChanges) {
      recommendations.push('변경된 내용에 대한 상세한 조항별 분석 실시');
      recommendations.push('기존 정책 및 프로세스와의 정합성 검토');
    }

    // Based on compliance deadline
    if (document.complianceDeadline) {
      const daysRemaining = Math.floor(
        (document.complianceDeadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );

      if (daysRemaining <= 7) {
        recommendations.push('긴급 태스크포스 구성 및 24시간 대응 체계 가동');
      } else if (daysRemaining <= 30) {
        recommendations.push('주간 진행상황 모니터링 및 단계별 실행 계획 수립');
      } else {
        recommendations.push('분기별 준비 현황 점검 및 필요 자원 확보');
      }
    }

    // Industry-specific recommendations
    if (document.industries.includes('fintech')) {
      recommendations.push('금융당국 가이드라인과의 정합성 검토');
      recommendations.push('금융보안원 등 관련 기관과의 사전 협의');
    }

    // Generic recommendations
    recommendations.push('관련 부서 직원 대상 교육 및 인식 제고');
    recommendations.push('고객 및 파트너사 대상 변경사항 사전 안내');

    return recommendations;
  }

  // ===== NOTIFICATION AND ALERT PROCESSING =====

  private async processAlertNotifications(alerts: RegulatoryAlert[]): Promise<void> {
    if (!this.config.enableEmailNotifications) {
      console.log('📧 Email notifications disabled');
      return;
    }

    const criticalAlerts = alerts.filter(alert => alert.severity === 'critical');
    const highPriorityAlerts = alerts.filter(alert => alert.severity === 'high');

    console.log(`📬 Processing ${criticalAlerts.length} critical and ${highPriorityAlerts.length} high priority alerts`);

    // Send critical alerts immediately
    for (const alert of criticalAlerts) {
      await this.sendCriticalAlert(alert);
      alert.notificationsSent = true;
    }

    // Batch send high priority alerts
    if (highPriorityAlerts.length > 0) {
      await this.sendBatchAlerts(highPriorityAlerts);
      highPriorityAlerts.forEach(alert => alert.notificationsSent = true);
    }

    // Store alerts for future reference
    await this.storeAlertHistory(alerts);
  }

  private async processUrgentAlerts(alerts: RegulatoryAlert[]): Promise<void> {
    console.log(`🚨 Processing ${alerts.length} urgent alerts`);

    for (const alert of alerts) {
      await this.sendCriticalAlert(alert);
      
      // Also send to Slack if enabled
      if (this.config.enableSlackIntegration) {
        await this.sendSlackAlert(alert);
      }

      alert.notificationsSent = true;
    }

    await this.storeAlertHistory(alerts);
  }

  private async sendCriticalAlert(alert: RegulatoryAlert): Promise<void> {
    try {
      // Convert to format expected by email service
      const emailAlert = {
        title: alert.title,
        summary: alert.description,
        importance: alert.severity,
        sourceName: '규제 모니터링 시스템',
        affectedIndustries: alert.affectedIndustries,
        publishedDate: alert.createdAt.toISOString(),
        businessImpact: alert.severity.toUpperCase()
      };

      // Send to all relevant users based on industry filters
      await emailNotificationService.notifyAllUsers(emailAlert, [alert.severity]);
      
      console.log(`✅ Critical alert sent: ${alert.title}`);
    } catch (error) {
      console.error(`❌ Failed to send critical alert:`, error);
      this.logError('critical_alert', error as string);
    }
  }

  private async sendBatchAlerts(alerts: RegulatoryAlert[]): Promise<void> {
    // Group alerts by industry for targeted sending
    const alertsByIndustry = new Map<string, RegulatoryAlert[]>();
    
    alerts.forEach(alert => {
      alert.affectedIndustries.forEach(industry => {
        const industryAlerts = alertsByIndustry.get(industry) || [];
        industryAlerts.push(alert);
        alertsByIndustry.set(industry, industryAlerts);
      });
    });

    // Send batch notifications per industry
    for (const [industry, industryAlerts] of alertsByIndustry) {
      try {
        await this.sendIndustryBatchAlert(industry, industryAlerts);
        console.log(`✅ Batch alert sent to ${industry}: ${industryAlerts.length} alerts`);
      } catch (error) {
        console.error(`❌ Failed to send batch alert to ${industry}:`, error);
        this.logError('batch_alert', error as string);
      }
    }
  }

  private async sendIndustryBatchAlert(industry: string, alerts: RegulatoryAlert[]): Promise<void> {
    const batchAlert = {
      title: `${industry} 업계 규제 업데이트 ${alerts.length}건`,
      summary: `${industry} 업계 관련 주요 규제 변경사항을 안내드립니다.`,
      importance: 'high' as const,
      sourceName: '규제 모니터링 시스템',
      affectedIndustries: [industry],
      publishedDate: new Date().toISOString(),
      businessImpact: 'HIGH',
      alerts: alerts.map(alert => ({
        title: alert.title,
        description: alert.description,
        severity: alert.severity
      }))
    };

    await emailNotificationService.notifyAllUsers(batchAlert, ['high']);
  }

  private async sendSlackAlert(alert: RegulatoryAlert): Promise<void> {
    // Placeholder for Slack integration
    console.log(`📱 Slack alert: ${alert.title}`);
    // In production, implement actual Slack webhook integration
  }

  // ===== INDUSTRY IMPACT AND COMPLIANCE ANALYSIS =====

  private async generateIndustryImpactAlerts(documents: RegulatoryDocument[]): Promise<RegulatoryAlert[]> {
    const alerts: RegulatoryAlert[] = [];
    const industryImpacts = await this.analyzeIndustryImpacts(documents);

    for (const impact of industryImpacts) {
      if (impact.impactScore > 70) { // High impact threshold
        const alert = await this.createIndustryImpactAlert(impact);
        alerts.push(alert);
      }
    }

    return alerts;
  }

  private async generateComplianceDeadlineAlerts(documents: RegulatoryDocument[]): Promise<RegulatoryAlert[]> {
    const alerts: RegulatoryAlert[] = [];
    const deadlines = this.extractComplianceDeadlines(documents);

    for (const deadline of deadlines) {
      if (deadline.daysRemaining <= 30) {
        const alert = await this.createDeadlineAlert(deadline);
        alerts.push(alert);
      }
    }

    return alerts;
  }

  private async analyzeIndustryImpacts(documents: RegulatoryDocument[]): Promise<IndustryImpactAnalysis[]> {
    const industryGroups = new Map<string, RegulatoryDocument[]>();
    
    // Group documents by industry
    documents.forEach(doc => {
      doc.industries.forEach(industry => {
        const industryDocs = industryGroups.get(industry) || [];
        industryDocs.push(doc);
        industryGroups.set(industry, industryDocs);
      });
    });

    const impactAnalyses: IndustryImpactAnalysis[] = [];

    // Analyze impact for each industry
    for (const [industry, industryDocs] of industryGroups) {
      const analysis = await this.calculateIndustryImpact(industry, industryDocs);
      impactAnalyses.push(analysis);
    }

    return impactAnalyses;
  }

  private async calculateIndustryImpact(industry: string, documents: RegulatoryDocument[]): Promise<IndustryImpactAnalysis> {
    const criticalCount = documents.filter(doc => doc.impactLevel === 'critical').length;
    const highCount = documents.filter(doc => doc.impactLevel === 'high').length;
    const recentChanges = documents.filter(doc => doc.changeDetected).length;

    // Calculate impact score (0-100)
    let impactScore = 0;
    impactScore += criticalCount * 25; // Critical documents heavily weighted
    impactScore += highCount * 15;    // High impact documents
    impactScore += recentChanges * 10; // Recent changes
    impactScore += documents.length * 2; // Overall regulatory activity

    // Cap at 100
    impactScore = Math.min(impactScore, 100);

    // Determine risk level
    let riskLevel: IndustryImpactAnalysis['riskLevel'] = 'low';
    if (impactScore >= 80) riskLevel = 'very_high';
    else if (impactScore >= 60) riskLevel = 'high';
    else if (impactScore >= 40) riskLevel = 'medium';
    else if (impactScore >= 20) riskLevel = 'low';
    else riskLevel = 'very_low';

    return {
      industry,
      impactScore,
      affectedDocuments: documents.map(doc => doc.id),
      keyRegulations: documents.filter(doc => doc.impactLevel === 'critical' || doc.impactLevel === 'high'),
      riskLevel,
      opportunityAreas: await this.identifyOpportunities(industry, documents),
      complianceGaps: await this.identifyComplianceGaps(documents),
      recommendations: await this.generateIndustryRecommendations(industry, documents, impactScore)
    };
  }

  private extractComplianceDeadlines(documents: RegulatoryDocument[]): ComplianceDeadline[] {
    const deadlines: ComplianceDeadline[] = [];

    documents.forEach(doc => {
      if (doc.complianceDeadline) {
        const daysRemaining = Math.floor(
          (doc.complianceDeadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );

        let severity: ComplianceDeadline['severity'] = 'low';
        if (daysRemaining <= 7) severity = 'critical';
        else if (daysRemaining <= 14) severity = 'high';
        else if (daysRemaining <= 30) severity = 'medium';

        deadlines.push({
          documentId: doc.id,
          title: doc.title,
          deadline: doc.complianceDeadline,
          daysRemaining,
          severity,
          affectedIndustries: doc.industries,
          requirements: this.extractRequirements(doc),
          penalties: doc.penalties ? [doc.penalties] : [],
          actionItems: this.generateDeadlineActionItems(doc, daysRemaining)
        });
      }
    });

    return deadlines.sort((a, b) => a.daysRemaining - b.daysRemaining);
  }

  // ===== UTILITY AND HELPER METHODS =====

  private async getActiveSourceCount(): Promise<number> {
    const sources = await koreanGovAPIs.getActiveSources();
    return sources.length;
  }

  private updateMonitoringStats(documents: RegulatoryDocument[], alerts: RegulatoryAlert[], processingTime: number): void {
    this.monitoringStats.totalDocumentsProcessed += documents.length;
    this.monitoringStats.alertsGenerated24h = alerts.length;
    this.monitoringStats.criticalAlerts24h = alerts.filter(a => a.severity === 'critical').length;
    this.monitoringStats.sourcesMonitored = documents.map(d => d.sourceId).filter((v, i, a) => a.indexOf(v) === i).length;
    this.monitoringStats.lastSuccessfulCheck = new Date();
    this.monitoringStats.averageProcessingTime = processingTime;
  }

  private updateIncrementalStats(documents: RegulatoryDocument[], alerts: RegulatoryAlert[], processingTime: number): void {
    this.monitoringStats.totalDocumentsProcessed += documents.length;
    this.monitoringStats.averageProcessingTime = (this.monitoringStats.averageProcessingTime + processingTime) / 2;
    this.monitoringStats.lastSuccessfulCheck = new Date();
  }

  private async storeDocumentHistory(documents: RegulatoryDocument[]): Promise<void> {
    documents.forEach(doc => {
      const history = this.documentHistory.get(doc.id) || [];
      history.push(doc);
      
      // Keep only last 10 versions
      if (history.length > 10) {
        history.shift();
      }
      
      this.documentHistory.set(doc.id, history);
    });
  }

  private async storeAlertHistory(alerts: RegulatoryAlert[]): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    const todayAlerts = this.alertHistory.get(today) || [];
    todayAlerts.push(...alerts);
    this.alertHistory.set(today, todayAlerts);
  }

  private logError(context: string, error: string): void {
    this.errorLog.push({
      timestamp: new Date(),
      error,
      source: context
    });

    // Keep only last 100 errors
    if (this.errorLog.length > 100) {
      this.errorLog.shift();
    }

    // Update error rate
    const recentErrors = this.errorLog.filter(log => 
      Date.now() - log.timestamp.getTime() < 24 * 60 * 60 * 1000
    );
    this.monitoringStats.errorRate = (recentErrors.length / Math.max(this.monitoringStats.totalDocumentsProcessed, 1)) * 100;
  }

  private mapImpactToSeverity(impact: string): 'critical' | 'high' | 'medium' | 'low' {
    return impact as 'critical' | 'high' | 'medium' | 'low';
  }

  private determineActionRequired(document: RegulatoryDocument, changes: ChangeDetectionResult[]): boolean {
    return document.impactLevel === 'critical' || 
           document.impactLevel === 'high' ||
           changes.some(change => change.severity === 'critical') ||
           !!document.complianceDeadline;
  }

  // Placeholder methods for advanced features
  private async performSemanticAnalysis(previous: RegulatoryDocument, current: RegulatoryDocument): Promise<any> {
    return { requiresExpertReview: current.impactLevel === 'critical' };
  }

  private async analyzeLegalImpact(document: RegulatoryDocument): Promise<any> {
    return { score: 85 };
  }

  private async assessBusinessImpact(document: RegulatoryDocument): Promise<any> {
    return { score: 75 };
  }

  private calculateAdvancedConfidence(semanticChanges: any, legalImpact: any): number {
    return Math.min((semanticChanges.score || 80) + (legalImpact.score || 80)) / 2;
  }

  private async generateAdvancedAnalysis(document: RegulatoryDocument, semanticChanges: any, businessImpact: any): Promise<string> {
    return `Advanced analysis for ${document.title}: Legal impact score ${businessImpact.score}/100`;
  }

  private async createIndustryImpactAlert(impact: IndustryImpactAnalysis): Promise<RegulatoryAlert> {
    return {
      id: crypto.randomUUID(),
      documentId: 'industry-impact',
      alertType: 'industry_impact',
      severity: impact.riskLevel === 'very_high' || impact.riskLevel === 'high' ? 'high' : 'medium',
      title: `${impact.industry} 업계 규제 영향도 ${impact.impactScore}/100`,
      description: `${impact.industry} 업계에 영향을 미치는 ${impact.keyRegulations.length}건의 주요 규제 변화가 감지되었습니다.`,
      affectedIndustries: [impact.industry],
      actionRequired: impact.riskLevel === 'very_high' || impact.riskLevel === 'high',
      recommendations: impact.recommendations,
      createdAt: new Date(),
      notificationsSent: false
    };
  }

  private async createDeadlineAlert(deadline: ComplianceDeadline): Promise<RegulatoryAlert> {
    return {
      id: crypto.randomUUID(),
      documentId: deadline.documentId,
      alertType: 'deadline_approaching',
      severity: deadline.severity,
      title: `⏰ 마감일 ${deadline.daysRemaining}일 전: ${deadline.title}`,
      description: `컴플라이언스 마감일이 ${deadline.daysRemaining}일 남았습니다.\n\n필요한 조치사항을 확인하고 준비해주세요.`,
      affectedIndustries: deadline.affectedIndustries,
      actionRequired: true,
      deadline: deadline.deadline,
      recommendations: deadline.actionItems,
      createdAt: new Date(),
      notificationsSent: false
    };
  }

  private async identifyOpportunities(industry: string, documents: RegulatoryDocument[]): Promise<string[]> {
    // Basic opportunity identification based on regulatory changes
    return [
      '새로운 규제에 따른 컨설팅 서비스 기회',
      '컴플라이언스 솔루션 개발 및 제공',
      '규제 적응을 위한 기술 혁신 기회'
    ];
  }

  private async identifyComplianceGaps(documents: RegulatoryDocument[]): Promise<string[]> {
    return [
      '신규 규제에 대한 내부 정책 미비',
      '컴플라이언스 체크 프로세스 부족',
      '규제 변화에 대한 모니터링 시스템 부재'
    ];
  }

  private async generateIndustryRecommendations(industry: string, documents: RegulatoryDocument[], impactScore: number): Promise<string[]> {
    const recommendations = [
      `${industry} 업계 특화 컴플라이언스 팀 구성`,
      '규제 변화 모니터링 시스템 도입',
      '정기적인 리스크 어세스먼트 실시'
    ];

    if (impactScore > 70) {
      recommendations.unshift('즉시 경영진 보고 및 비상 대응팀 가동');
    }

    return recommendations;
  }

  private extractRequirements(document: RegulatoryDocument): string[] {
    // Extract requirements from document content
    return document.keyChanges.filter(change => 
      change.includes('의무') || change.includes('필수') || change.includes('준수')
    );
  }

  private generateDeadlineActionItems(document: RegulatoryDocument, daysRemaining: number): string[] {
    const items = [];

    if (daysRemaining <= 7) {
      items.push('긴급 대응팀 구성 및 24시간 모니터링');
      items.push('모든 필수 문서 및 절차 최종 점검');
    } else if (daysRemaining <= 14) {
      items.push('필수 준비사항 점검 리스트 작성');
      items.push('관련 팀별 역할 분담 및 일정 확정');
    } else {
      items.push('준비 현황 검토 및 계획 수립');
      items.push('필요 자원 및 예산 확보');
    }

    return items;
  }

  // ===== PUBLIC API METHODS =====

  async getMonitoringStats(): Promise<MonitoringStats> {
    return { ...this.monitoringStats };
  }

  async updateConfiguration(newConfig: Partial<MonitoringConfiguration>): Promise<void> {
    this.config = { ...this.config, ...newConfig };
    console.log('✅ Monitoring configuration updated');
  }

  async getConfiguration(): Promise<MonitoringConfiguration> {
    return { ...this.config };
  }

  async getRecentAlerts(hours: number = 24): Promise<RegulatoryAlert[]> {
    const cutoff = new Date();
    cutoff.setHours(cutoff.getHours() - hours);
    
    const recentAlerts: RegulatoryAlert[] = [];
    
    for (const alerts of this.alertHistory.values()) {
      recentAlerts.push(...alerts.filter(alert => alert.createdAt >= cutoff));
    }
    
    return recentAlerts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getCriticalAlerts(): Promise<RegulatoryAlert[]> {
    return await koreanGovAPIs.getCriticalAlerts();
  }

  async getIndustryImpact(industry: string): Promise<IndustryImpactAnalysis | null> {
    const documents = await koreanGovAPIs.getDocumentsByIndustry(industry);
    if (documents.length === 0) return null;
    
    return await this.calculateIndustryImpact(industry, documents);
  }

  async getComplianceDeadlines(days: number = 30): Promise<ComplianceDeadline[]> {
    const recentDocs = await koreanGovAPIs.getRecentChanges(days);
    return this.extractComplianceDeadlines(recentDocs);
  }

  async getHealthStatus(): Promise<{ status: string; details: any }> {
    const errors24h = this.errorLog.filter(log => 
      Date.now() - log.timestamp.getTime() < 24 * 60 * 60 * 1000
    ).length;

    const status = this.isMonitoring && errors24h < 10 ? 'healthy' : 'degraded';
    
    return {
      status,
      details: {
        monitoring: this.isMonitoring,
        errors24h,
        lastCheck: this.monitoringStats.lastSuccessfulCheck,
        sourcesActive: this.monitoringStats.sourcesMonitored,
        uptime: this.monitoringStats.uptime
      }
    };
  }
}

export const enhancedRegulatoryMonitor = new EnhancedRegulatoryMonitoringService();