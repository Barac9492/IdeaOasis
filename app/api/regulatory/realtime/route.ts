import { NextRequest, NextResponse } from 'next/server';
import { enhancedRegulatoryMonitor } from '@/lib/services/regulatoryMonitoring';
import { koreanGovAPIs } from '@/lib/services/koreanGovAPIs';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'latest';
    const industry = searchParams.get('industry');
    const severity = searchParams.get('severity');
    const limit = parseInt(searchParams.get('limit') || '10');

    let updates: any[] = [];
    
    switch (type) {
      case 'critical':
        const criticalAlerts = await enhancedRegulatoryMonitor.getCriticalAlerts();
        updates = criticalAlerts.map(alert => ({
          id: alert.id,
          title: alert.title,
          description: alert.description,
          importance: alert.severity,
          publishedDate: alert.createdAt.toISOString(),
          affectedIndustries: alert.affectedIndustries,
          actionRequired: alert.actionRequired,
          source: 'Enhanced Regulatory Monitor',
          changeDetected: true,
          deadline: alert.deadline?.toISOString()
        }));
        break;
      
      case 'industry':
        if (!industry) {
          return NextResponse.json(
            { error: 'Industry parameter required for industry-specific updates' },
            { status: 400 }
          );
        }
        
        const industryDocs = await koreanGovAPIs.getDocumentsByIndustry(industry);
        updates = industryDocs.slice(0, limit).map(doc => ({
          id: doc.id,
          title: doc.title,
          description: doc.summary || doc.title,
          importance: doc.impactLevel,
          publishedDate: doc.publishedDate.toISOString(),
          affectedIndustries: doc.industries,
          actionRequired: doc.impactLevel === 'critical' || doc.impactLevel === 'high',
          source: doc.authority,
          sourceUrl: doc.url,
          changeDetected: doc.changeDetected,
          deadline: doc.complianceDeadline?.toISOString(),
          keyChanges: doc.keyChanges
        }));
        break;
      
      case 'recent':
        const recentChanges = await koreanGovAPIs.getRecentChanges(1); // Last 24 hours
        updates = recentChanges.slice(0, limit).map(doc => ({
          id: doc.id,
          title: doc.title,
          description: doc.summary || doc.title,
          importance: doc.impactLevel,
          publishedDate: doc.publishedDate.toISOString(),
          effectiveDate: doc.effectiveDate?.toISOString(),
          affectedIndustries: doc.industries,
          actionRequired: doc.impactLevel === 'critical' || doc.impactLevel === 'high',
          source: doc.authority,
          sourceUrl: doc.url,
          changeDetected: doc.changeDetected,
          keyChanges: doc.keyChanges,
          businessTypes: doc.businessTypes
        }));
        break;
      
      case 'latest':
      default:
        const recentAlerts = await enhancedRegulatoryMonitor.getRecentAlerts(24);
        updates = recentAlerts.slice(0, limit).map(alert => ({
          id: alert.id,
          title: alert.title,
          description: alert.description,
          importance: alert.severity,
          publishedDate: alert.createdAt.toISOString(),
          affectedIndustries: alert.affectedIndustries,
          actionRequired: alert.actionRequired,
          source: 'Regulatory Intelligence System',
          recommendations: alert.recommendations,
          deadline: alert.deadline?.toISOString()
        }));
        break;
    }

    // Apply additional filtering
    if (severity) {
      updates = updates.filter(update => update.importance === severity);
    }

    // Generate actionable insights for each update
    const enrichedUpdates = updates.map(update => ({
      ...update,
      actionableInsights: generateActionableInsights(update),
      complianceDeadline: update.deadline || calculateComplianceDeadline(update),
      estimatedImpact: estimateBusinessImpact(update),
      riskAssessment: generateRiskAssessment(update),
      nextSteps: generateNextSteps(update)
    }));

    // Generate real-time analysis
    const realTimeAnalysis = await generateRealTimeAnalysis(enrichedUpdates);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      type,
      industry,
      count: enrichedUpdates.length,
      updates: enrichedUpdates,
      summary: {
        critical: enrichedUpdates.filter(u => u.importance === 'critical').length,
        high: enrichedUpdates.filter(u => u.importance === 'high').length,
        medium: enrichedUpdates.filter(u => u.importance === 'medium').length,
        low: enrichedUpdates.filter(u => u.importance === 'low').length
      },
      realTimeAnalysis,
      monitoring: {
        sourcesActive: (await koreanGovAPIs.getActiveSources()).length,
        lastUpdate: new Date().toISOString(),
        nextCheck: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes
      }
    });

  } catch (error) {
    console.error('Real-time monitoring error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch real-time regulatory updates',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { action, data } = await req.json();

    switch (action) {
      case 'subscribe':
        return await handleSubscribeAction(data);
      
      case 'analyze':
        return await handleAnalyzeAction(data);
      
      case 'monitor':
        return await handleMonitorAction(data);
      
      case 'alert':
        return await handleAlertAction(data);
      
      case 'impact_assessment':
        return await handleImpactAssessment(data);
      
      default:
        return NextResponse.json(
          { error: 'Invalid action. Available: subscribe, analyze, monitor, alert, impact_assessment' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Real-time monitoring POST error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// ===== ACTION HANDLERS =====

async function handleSubscribeAction(data: any) {
  const { email, industries, categories, frequency, alertTypes } = data;
  
  // Validate subscription data
  if (!email || !industries?.length) {
    return NextResponse.json(
      { error: 'Email and industries are required for subscription' },
      { status: 400 }
    );
  }

  // In production, this would save to database and integrate with email service
  const subscription = {
    id: `sub_${Date.now()}`,
    email,
    industries: Array.isArray(industries) ? industries : [industries],
    categories: Array.isArray(categories) ? categories : (categories ? [categories] : []),
    frequency: frequency || 'daily',
    alertTypes: alertTypes || ['critical', 'high'],
    createdAt: new Date().toISOString(),
    status: 'active'
  };

  console.log('[SUBSCRIPTION] New real-time subscription:', subscription);

  return NextResponse.json({
    success: true,
    message: 'Successfully subscribed to real-time regulatory updates',
    subscription,
    expectedDelivery: {
      critical: 'Immediate notification',
      high: 'Within 1 hour',
      medium: frequency === 'immediate' ? 'Within 4 hours' : 'Daily digest',
      low: 'Weekly digest'
    }
  });
}

async function handleAnalyzeAction(data: any) {
  const { updateId, businessProfile } = data;
  
  if (!updateId) {
    return NextResponse.json(
      { error: 'updateId is required for analysis' },
      { status: 400 }
    );
  }

  // Get recent alerts to find the specified update
  const recentAlerts = await enhancedRegulatoryMonitor.getRecentAlerts(168); // 7 days
  const targetAlert = recentAlerts.find(alert => alert.id === updateId);

  if (!targetAlert) {
    return NextResponse.json(
      { error: 'Update not found' },
      { status: 404 }
    );
  }

  // Generate detailed business impact analysis
  const analysis = {
    updateId,
    analysisId: `analysis_${Date.now()}`,
    timestamp: new Date().toISOString(),
    regulation: {
      title: targetAlert.title,
      description: targetAlert.description,
      severity: targetAlert.severity,
      affectedIndustries: targetAlert.affectedIndustries
    },
    businessProfile: businessProfile || {
      industry: 'technology',
      size: 'startup',
      location: 'Korea'
    },
    impact: {
      level: targetAlert.severity,
      score: calculateImpactScore(targetAlert),
      areas: identifyImpactAreas(targetAlert),
      financialImpact: estimateFinancialImpact(targetAlert, businessProfile)
    },
    complianceRequirements: generateComplianceRequirements(targetAlert),
    actionPlan: generateDetailedActionPlan(targetAlert),
    timeline: generateComplianceTimeline(targetAlert),
    riskAssessment: {
      complianceRisk: assessComplianceRisk(targetAlert),
      businessRisk: assessBusinessRisk(targetAlert),
      reputationalRisk: assessReputationalRisk(targetAlert),
      mitigation: generateMitigationStrategies(targetAlert)
    },
    expertRecommendations: targetAlert.recommendations || [],
    resources: generateResourceRecommendations(targetAlert)
  };

  return NextResponse.json({
    success: true,
    analysis
  });
}

async function handleMonitorAction(data: any) {
  const { targetUrl, targetName, checkInterval, industries, alertThreshold } = data;
  
  if (!targetUrl || !targetName) {
    return NextResponse.json(
      { error: 'targetUrl and targetName are required' },
      { status: 400 }
    );
  }

  // Create monitoring target configuration
  const monitoringTarget = {
    id: `target_${Date.now()}`,
    name: targetName,
    url: targetUrl,
    checkInterval: checkInterval || 60, // minutes
    industries: industries || ['general'],
    alertThreshold: alertThreshold || 'medium',
    status: 'active',
    createdAt: new Date().toISOString(),
    lastCheck: null,
    alertsGenerated: 0
  };

  console.log('[MONITOR] Adding new monitoring target:', monitoringTarget);

  return NextResponse.json({
    success: true,
    message: 'Monitoring target added successfully',
    target: monitoringTarget,
    monitoring: {
      checkFrequency: `Every ${checkInterval || 60} minutes`,
      alertCriteria: `Threshold: ${alertThreshold || 'medium'} and above`,
      coverageAreas: industries || ['general']
    }
  });
}

async function handleAlertAction(data: any) {
  const { alertId, action: alertAction, userFeedback } = data;
  
  if (!alertId || !alertAction) {
    return NextResponse.json(
      { error: 'alertId and action are required' },
      { status: 400 }
    );
  }

  const alertResponse = {
    alertId,
    action: alertAction,
    timestamp: new Date().toISOString(),
    status: 'processed'
  };

  switch (alertAction) {
    case 'acknowledge':
      alertResponse.status = 'acknowledged';
      break;
    
    case 'escalate':
      alertResponse.status = 'escalated';
      // In production, would trigger escalation workflow
      break;
    
    case 'dismiss':
      alertResponse.status = 'dismissed';
      break;
    
    case 'feedback':
      if (userFeedback) {
        alertResponse.status = 'feedback_received';
        // Store feedback for improving alert quality
      }
      break;
  }

  console.log('[ALERT ACTION]', alertResponse);

  return NextResponse.json({
    success: true,
    message: `Alert ${alertAction} processed successfully`,
    response: alertResponse
  });
}

async function handleImpactAssessment(data: any) {
  const { regulation, businessContext } = data;
  
  if (!regulation) {
    return NextResponse.json(
      { error: 'regulation information is required' },
      { status: 400 }
    );
  }

  const assessment = {
    assessmentId: `assessment_${Date.now()}`,
    timestamp: new Date().toISOString(),
    regulation: regulation,
    businessContext: businessContext || {},
    assessment: {
      overallImpact: 'high',
      impactScore: 7.5,
      dimensions: {
        operational: { score: 8, description: 'Significant operational changes required' },
        financial: { score: 7, description: 'Moderate financial investment needed' },
        technical: { score: 6, description: 'Some technical adaptations required' },
        legal: { score: 9, description: 'High legal compliance requirements' },
        strategic: { score: 5, description: 'Minimal strategic impact' }
      }
    },
    recommendations: [
      'Conduct comprehensive compliance audit',
      'Engage regulatory affairs specialist',
      'Develop phased implementation plan',
      'Allocate dedicated budget for compliance'
    ],
    timeline: '3-6 months for full compliance',
    cost: 'Estimated ₩50-150 million based on company size'
  };

  return NextResponse.json({
    success: true,
    assessment
  });
}

// ===== UTILITY FUNCTIONS =====

function generateActionableInsights(update: any): string[] {
  const insights: string[] = [];
  
  if (update.importance === 'critical') {
    insights.push('24시간 내 경영진 보고 필요');
    insights.push('긴급 대응팀 구성 및 비상회의 소집');
    insights.push('즉시 법무팀 검토 및 대응방안 수립');
  } else if (update.importance === 'high') {
    insights.push('72시간 내 영향 분석 완료 필요');
    insights.push('관련 부서와 긴급 회의 소집');
    insights.push('전문가 상담을 통한 대응방안 검토');
  }
  
  // Industry-specific insights
  if (update.affectedIndustries?.includes('fintech')) {
    insights.push('금융위원회 가이드라인 재검토');
    insights.push('핀테크 라이센스 영향도 분석');
    insights.push('고객 데이터 처리 프로세스 점검');
  }
  
  if (update.affectedIndustries?.includes('healthcare')) {
    insights.push('의료기기 허가 현황 재검토');
    insights.push('환자 정보 보호 강화 방안 수립');
    insights.push('임상시험 계획서 업데이트 검토');
  }
  
  if (update.affectedIndustries?.includes('ecommerce')) {
    insights.push('전자상거래법 준수사항 점검');
    insights.push('소비자 보호 정책 업데이트');
    insights.push('광고 표시 규정 재검토');
  }

  // Add compliance-specific insights
  if (update.actionRequired) {
    insights.push('컴플라이언스 체크리스트 즉시 업데이트');
    insights.push('관련 직원 교육 프로그램 실시');
  }
  
  return [...new Set(insights)].slice(0, 5); // Remove duplicates, return top 5
}

function calculateComplianceDeadline(update: any): string {
  const publishedDate = new Date(update.publishedDate);
  const deadlineDate = new Date(publishedDate);
  
  // Set deadline based on importance and change type
  switch (update.importance) {
    case 'critical':
      deadlineDate.setDate(deadlineDate.getDate() + 14); // 14 days for critical
      break;
    case 'high':
      deadlineDate.setDate(deadlineDate.getDate() + 30); // 30 days for high
      break;
    case 'medium':
      deadlineDate.setDate(deadlineDate.getDate() + 60); // 60 days for medium
      break;
    default:
      deadlineDate.setDate(deadlineDate.getDate() + 90); // 90 days for low
  }
  
  return deadlineDate.toISOString();
}

function estimateBusinessImpact(update: any): any {
  const baseImpact = {
    financial: 0,
    operational: 0,
    reputational: 0,
    strategic: 0,
    timeline: 0
  };
  
  const importanceWeights = {
    critical: 10,
    high: 7,
    medium: 4,
    low: 2
  };
  
  const weight = importanceWeights[update.importance as keyof typeof importanceWeights] || 1;
  const industryMultiplier = (update.affectedIndustries?.length || 1) * 0.5 + 0.5;
  
  baseImpact.financial = weight * 2000000 * industryMultiplier; // KRW
  baseImpact.operational = weight * 15 * industryMultiplier; // Complexity score
  baseImpact.reputational = weight * 12 * industryMultiplier; // Risk score
  baseImpact.strategic = weight * 8 * industryMultiplier; // Strategic importance
  baseImpact.timeline = Math.max(7, (10 - weight) * 7); // Days to compliance
  
  return {
    scores: baseImpact,
    totalScore: Object.values(baseImpact).reduce((a, b) => a + b, 0) - baseImpact.timeline,
    level: weight >= 7 ? 'high' : weight >= 4 ? 'medium' : 'low',
    estimatedCost: baseImpact.financial,
    timeToCompliance: `${baseImpact.timeline}일`,
    confidenceLevel: update.changeDetected ? 95 : 75
  };
}

function generateRiskAssessment(update: any): any {
  const riskFactors = {
    complianceRisk: calculateComplianceRisk(update),
    operationalRisk: calculateOperationalRisk(update),
    financialRisk: calculateFinancialRisk(update),
    reputationalRisk: calculateReputationalRisk(update)
  };

  const overallRisk = Object.values(riskFactors).reduce((a, b) => a + b, 0) / 4;

  return {
    riskFactors,
    overallRisk: Math.round(overallRisk * 10) / 10,
    riskLevel: overallRisk >= 8 ? 'very_high' : 
               overallRisk >= 6 ? 'high' : 
               overallRisk >= 4 ? 'medium' : 'low',
    mitigationPriority: overallRisk >= 7 ? 'urgent' : 
                        overallRisk >= 5 ? 'high' : 'medium'
  };
}

function generateNextSteps(update: any): string[] {
  const steps: string[] = [];
  
  switch (update.importance) {
    case 'critical':
      steps.push('1. 즉시 경영진에게 보고 (24시간 이내)');
      steps.push('2. 긴급 대응팀 구성 및 역할 분담');
      steps.push('3. 전문가 상담 및 법무 검토 실시');
      steps.push('4. 영향받는 사업부서와 긴급회의');
      steps.push('5. 48시간 내 초기 대응방안 수립');
      break;
    
    case 'high':
      steps.push('1. 관련 부서장에게 보고 (48시간 이내)');
      steps.push('2. 영향 분석팀 구성');
      steps.push('3. 전문가 의견 수렴 및 검토');
      steps.push('4. 1주일 내 대응 계획 수립');
      break;
    
    default:
      steps.push('1. 담당 부서에서 영향 분석');
      steps.push('2. 내부 검토 및 대응방안 논의');
      steps.push('3. 필요시 외부 전문가 상담');
      steps.push('4. 단계적 대응 계획 수립');
  }
  
  return steps;
}

async function generateRealTimeAnalysis(updates: any[]): Promise<any> {
  const criticalCount = updates.filter(u => u.importance === 'critical').length;
  const highCount = updates.filter(u => u.importance === 'high').length;
  
  // Analyze trends
  const industryImpacts = updates.reduce((acc, update) => {
    update.affectedIndustries.forEach((industry: string) => {
      acc[industry] = (acc[industry] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const mostImpactedIndustry = Object.entries(industryImpacts)
    .sort(([,a], [,b]) => (b as number) - (a as number))[0];

  return {
    totalUpdates: updates.length,
    urgencyDistribution: {
      critical: criticalCount,
      high: highCount,
      medium: updates.filter(u => u.importance === 'medium').length,
      low: updates.filter(u => u.importance === 'low').length
    },
    trendAnalysis: {
      mostImpactedIndustry: mostImpactedIndustry ? mostImpactedIndustry[0] : null,
      averageImpactScore: updates.reduce((sum, u) => sum + (u.estimatedImpact?.totalScore || 0), 0) / updates.length,
      actionRequiredCount: updates.filter(u => u.actionRequired).length
    },
    recommendations: generateSystemRecommendations(updates),
    alertLevel: criticalCount > 0 ? 'critical' : 
                highCount > 2 ? 'high' : 'normal'
  };
}

function generateSystemRecommendations(updates: any[]): string[] {
  const recommendations = [];
  
  const criticalCount = updates.filter(u => u.importance === 'critical').length;
  const highCount = updates.filter(u => u.importance === 'high').length;
  
  if (criticalCount > 0) {
    recommendations.push(`${criticalCount}건의 긴급 규제 변경에 대한 즉시 대응 필요`);
    recommendations.push('경영진 보고 및 비상 대응체계 가동');
  }
  
  if (highCount > 2) {
    recommendations.push(`${highCount}건의 중요 규제 변경에 대한 체계적 대응 계획 수립`);
    recommendations.push('부서별 대응팀 구성 및 역할 분담');
  }
  
  recommendations.push('규제 변화 모니터링 빈도 증가 검토');
  recommendations.push('컴플라이언스 전담팀 역량 강화');
  
  return recommendations;
}

// Risk calculation helper functions
function calculateComplianceRisk(update: any): number {
  let risk = 3; // base risk
  
  if (update.importance === 'critical') risk += 4;
  else if (update.importance === 'high') risk += 2;
  
  if (update.actionRequired) risk += 1;
  if (update.deadline && new Date(update.deadline) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)) risk += 2;
  
  return Math.min(risk, 10);
}

function calculateOperationalRisk(update: any): number {
  let risk = 2;
  
  if (update.affectedIndustries?.length > 2) risk += 2;
  if (update.keyChanges?.length > 3) risk += 1;
  if (update.importance === 'critical') risk += 3;
  
  return Math.min(risk, 10);
}

function calculateFinancialRisk(update: any): number {
  let risk = 2;
  
  if (update.estimatedImpact?.estimatedCost > 10000000) risk += 3; // > 10M KRW
  else if (update.estimatedImpact?.estimatedCost > 5000000) risk += 2;
  
  if (update.importance === 'critical') risk += 2;
  
  return Math.min(risk, 10);
}

function calculateReputationalRisk(update: any): number {
  let risk = 1;
  
  if (update.affectedIndustries?.includes('fintech')) risk += 2;
  if (update.affectedIndustries?.includes('healthcare')) risk += 2;
  if (update.changeDetected && update.importance === 'critical') risk += 3;
  
  return Math.min(risk, 10);
}

// Analysis helper functions
function calculateImpactScore(alert: any): number {
  const severityScores = { critical: 10, high: 7, medium: 4, low: 2 };
  const baseScore = severityScores[alert.severity as keyof typeof severityScores] || 2;
  
  const industryMultiplier = alert.affectedIndustries.length * 0.2 + 0.8;
  return Math.round(baseScore * industryMultiplier * 10) / 10;
}

function identifyImpactAreas(alert: any): string[] {
  const areas = ['Compliance requirements'];
  
  if (alert.severity === 'critical' || alert.severity === 'high') {
    areas.push('Operational changes', 'Legal obligations');
  }
  
  if (alert.affectedIndustries.includes('technology')) {
    areas.push('Technical infrastructure', 'Data management');
  }
  
  if (alert.actionRequired) {
    areas.push('Process updates', 'Staff training');
  }
  
  return areas;
}

function estimateFinancialImpact(alert: any, businessProfile: any): any {
  const severityMultipliers = { critical: 5, high: 3, medium: 1.5, low: 0.5 };
  const multiplier = severityMultipliers[alert.severity as keyof typeof severityMultipliers] || 1;
  
  const sizeMultipliers = { enterprise: 3, large: 2, medium: 1.5, startup: 1 };
  const sizeMultiplier = sizeMultipliers[businessProfile?.size as keyof typeof sizeMultipliers] || 1;
  
  const baseCost = 10000000; // 10M KRW base
  const estimatedCost = baseCost * multiplier * sizeMultiplier;
  
  return {
    estimatedCost,
    costRange: {
      min: Math.round(estimatedCost * 0.5),
      max: Math.round(estimatedCost * 2)
    },
    currency: 'KRW',
    breakdown: {
      compliance: Math.round(estimatedCost * 0.4),
      implementation: Math.round(estimatedCost * 0.3),
      training: Math.round(estimatedCost * 0.2),
      external_consulting: Math.round(estimatedCost * 0.1)
    }
  };
}

function generateComplianceRequirements(alert: any): any {
  return {
    immediate: [
      'Current compliance status assessment',
      'Gap analysis against new requirements',
      'Risk assessment documentation'
    ],
    shortTerm: [
      'Policy updates and documentation',
      'Process modifications',
      'Staff training program implementation'
    ],
    longTerm: [
      'System upgrades if required',
      'Ongoing monitoring procedures',
      'Periodic compliance audits'
    ]
  };
}

function generateDetailedActionPlan(alert: any): any {
  const plans = {
    critical: {
      phase1: { duration: '1-7 days', actions: ['Emergency response activation', 'Senior management briefing', 'Expert consultation'] },
      phase2: { duration: '1-4 weeks', actions: ['Detailed impact analysis', 'Implementation planning', 'Resource allocation'] },
      phase3: { duration: '1-3 months', actions: ['Full implementation', 'Testing and validation', 'Compliance verification'] }
    },
    high: {
      phase1: { duration: '1-2 weeks', actions: ['Impact assessment', 'Stakeholder notification', 'Planning committee formation'] },
      phase2: { duration: '4-8 weeks', actions: ['Solution development', 'Implementation preparation', 'Training program design'] },
      phase3: { duration: '2-4 months', actions: ['Phased implementation', 'Monitoring and adjustment', 'Compliance validation'] }
    }
  };
  
  return plans[alert.severity as keyof typeof plans] || plans.high;
}

function generateComplianceTimeline(alert: any): any {
  const baseDays = { critical: 30, high: 60, medium: 90, low: 180 };
  const timelineDays = baseDays[alert.severity as keyof typeof baseDays] || 90;
  
  const milestones = [];
  milestones.push({ milestone: 'Initial assessment', daysFromStart: 7 });
  milestones.push({ milestone: 'Implementation plan', daysFromStart: Math.round(timelineDays * 0.25) });
  milestones.push({ milestone: 'Mid-point review', daysFromStart: Math.round(timelineDays * 0.5) });
  milestones.push({ milestone: 'Final implementation', daysFromStart: Math.round(timelineDays * 0.9) });
  milestones.push({ milestone: 'Compliance verification', daysFromStart: timelineDays });
  
  return {
    totalDays: timelineDays,
    milestones,
    criticalPath: alert.severity === 'critical'
  };
}

function assessComplianceRisk(alert: any): string {
  if (alert.severity === 'critical') return 'Very High - Immediate action required';
  if (alert.severity === 'high') return 'High - Urgent attention needed';
  if (alert.severity === 'medium') return 'Medium - Timely response recommended';
  return 'Low - Monitor and plan accordingly';
}

function assessBusinessRisk(alert: any): string {
  const riskDescriptions = {
    critical: 'Business operations may be significantly impacted',
    high: 'Important business processes may require modification',
    medium: 'Some operational adjustments may be needed',
    low: 'Minimal business impact expected'
  };
  
  return riskDescriptions[alert.severity as keyof typeof riskDescriptions] || 'Impact assessment needed';
}

function assessReputationalRisk(alert: any): string {
  if (alert.affectedIndustries.includes('fintech') || alert.affectedIndustries.includes('healthcare')) {
    return alert.severity === 'critical' ? 'Very High - Industry trust at stake' : 'High - Reputation monitoring required';
  }
  
  return alert.severity === 'critical' ? 'High - Public attention likely' : 'Medium - Standard reputational considerations';
}

function generateMitigationStrategies(alert: any): string[] {
  const strategies = [
    'Establish dedicated compliance team',
    'Implement regular monitoring procedures',
    'Create escalation protocols'
  ];
  
  if (alert.severity === 'critical') {
    strategies.unshift('Activate emergency response procedures');
    strategies.push('Engage external regulatory experts');
  }
  
  return strategies;
}

function generateResourceRecommendations(alert: any): any {
  return {
    internal: [
      'Legal/Compliance team involvement',
      'IT/Technical team for system changes',
      'Training team for staff education',
      'Communications team for stakeholder updates'
    ],
    external: [
      'Regulatory compliance consultants',
      'Legal advisors specializing in relevant regulations',
      'Industry-specific experts',
      'Implementation specialists'
    ],
    tools: [
      'Compliance management software',
      'Document management systems',
      'Training platforms',
      'Monitoring and reporting tools'
    ]
  };
}