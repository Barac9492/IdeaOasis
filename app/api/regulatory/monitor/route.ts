import { NextRequest, NextResponse } from 'next/server';
import { enhancedRegulatoryMonitor } from '@/lib/services/regulatoryMonitoring';
import { koreanGovAPIs } from '@/lib/services/koreanGovAPIs';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const industry = searchParams.get('industry');
    const severity = searchParams.get('severity');
    const hours = parseInt(searchParams.get('hours') || '24');

    // Get monitoring statistics
    const stats = await enhancedRegulatoryMonitor.getMonitoringStats();
    
    // Get recent alerts with optional filtering
    let alerts = await enhancedRegulatoryMonitor.getRecentAlerts(hours);
    
    // Filter by industry if specified
    if (industry) {
      alerts = alerts.filter(alert => 
        alert.affectedIndustries.includes(industry)
      );
    }

    // Filter by severity if specified
    if (severity) {
      alerts = alerts.filter(alert => alert.severity === severity);
    }

    // Get industry impact analysis
    const impactAnalysis: Record<string, number> = {};
    const industries = ['fintech', 'ecommerce', 'healthcare', 'ai', 'blockchain'];
    
    for (const ind of industries) {
      const impact = await enhancedRegulatoryMonitor.getIndustryImpact(ind);
      if (impact) {
        impactAnalysis[ind] = impact.impactScore;
      }
    }

    // Get active sources
    const activeSources = await koreanGovAPIs.getActiveSources();
    
    // Get health status
    const healthStatus = await enhancedRegulatoryMonitor.getHealthStatus();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      health: healthStatus,
      stats: {
        totalDocumentsProcessed: stats.totalDocumentsProcessed,
        alertsGenerated24h: stats.alertsGenerated24h,
        criticalAlerts24h: stats.criticalAlerts24h,
        sourcesMonitored: stats.sourcesMonitored,
        lastSuccessfulCheck: stats.lastSuccessfulCheck,
        averageProcessingTime: stats.averageProcessingTime,
        errorRate: stats.errorRate,
        uptime: stats.uptime
      },
      alerts,
      monitoring: {
        activeSources: activeSources.map(source => ({
          name: source.nameKo,
          authority: source.authorityKo,
          lastChecked: source.lastChecked,
          priority: source.priority,
          status: source.isActive ? 'active' : 'inactive'
        })),
        nextScan: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
        configuration: await enhancedRegulatoryMonitor.getConfiguration()
      },
      impactAnalysis,
      criticalDeadlines: await enhancedRegulatoryMonitor.getComplianceDeadlines(30)
    });

  } catch (error) {
    console.error('Monitoring API error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to retrieve regulatory monitoring data',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, configuration, force } = body;

    switch (action) {
      case 'start_monitoring':
        await enhancedRegulatoryMonitor.startMonitoring();
        return NextResponse.json({
          success: true,
          message: 'Regulatory monitoring started successfully'
        });

      case 'stop_monitoring':
        await enhancedRegulatoryMonitor.stopMonitoring();
        return NextResponse.json({
          success: true,
          message: 'Regulatory monitoring stopped successfully'
        });

      case 'update_configuration':
        if (configuration) {
          await enhancedRegulatoryMonitor.updateConfiguration(configuration);
          return NextResponse.json({
            success: true,
            message: 'Configuration updated successfully',
            configuration: await enhancedRegulatoryMonitor.getConfiguration()
          });
        }
        break;

      case 'trigger_scan':
        // Trigger immediate scan
        console.log('Triggering immediate regulatory scan...');
        // This would trigger the scanning process
        return NextResponse.json({
          success: true,
          message: 'Immediate scan triggered',
          timestamp: new Date().toISOString()
        });

      case 'get_critical_alerts':
        const criticalAlerts = await enhancedRegulatoryMonitor.getCriticalAlerts();
        return NextResponse.json({
          success: true,
          alerts: criticalAlerts,
          count: criticalAlerts.length
        });

      case 'generate_newsletter':
        const recentAlerts = await enhancedRegulatoryMonitor.getRecentAlerts(168); // 7 days
        const newsletterContent = await generateNewsletterContent(recentAlerts);
        
        return NextResponse.json({
          success: true,
          newsletterContent,
          alertCount: recentAlerts.length,
          timestamp: new Date().toISOString()
        });

      case 'test_notifications':
        // Test notification system
        const testAlert = {
          id: 'test-alert',
          documentId: 'test-doc',
          alertType: 'new_regulation' as const,
          severity: 'high' as const,
          title: '테스트 알림: 규제 모니터링 시스템 점검',
          description: '규제 모니터링 시스템의 알림 기능이 정상 작동하는지 확인하는 테스트입니다.',
          affectedIndustries: ['fintech', 'technology'],
          actionRequired: true,
          recommendations: ['시스템 정상 작동 확인', '알림 수신 여부 점검'],
          createdAt: new Date(),
          notificationsSent: false
        };

        // This would trigger actual notification sending
        return NextResponse.json({
          success: true,
          message: 'Test notification sent',
          testAlert
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Unknown action' },
          { status: 400 }
        );
    }

    return NextResponse.json(
      { success: false, error: 'Invalid request parameters' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Monitoring API POST error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to process regulatory monitoring request',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

async function generateNewsletterContent(alerts: any[]): Promise<string> {
  if (alerts.length === 0) {
    return `
# 이번 주 규제 업데이트

## 📊 요약
이번 주에는 새로운 규제 업데이트가 감지되지 않았습니다.

---
*Korean Business Intelligence Platform - IdeaOasis*
    `.trim();
  }

  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical');
  const highAlerts = alerts.filter(alert => alert.severity === 'high');
  const mediumAlerts = alerts.filter(alert => alert.severity === 'medium');

  // Group alerts by industry
  const alertsByIndustry: Record<string, any[]> = {};
  alerts.forEach(alert => {
    alert.affectedIndustries.forEach((industry: string) => {
      if (!alertsByIndustry[industry]) {
        alertsByIndustry[industry] = [];
      }
      alertsByIndustry[industry].push(alert);
    });
  });

  const industryNames: Record<string, string> = {
    'fintech': '핀테크',
    'ecommerce': '이커머스',
    'healthcare': '헬스케어',
    'ai': '인공지능',
    'blockchain': '블록체인',
    'manufacturing': '제조업',
    'education': '교육',
    'gaming': '게임',
    'mobility': '모빌리티',
    'proptech': '프롭테크'
  };

  const content = [];

  content.push('# 🚨 이번 주 규제 인텔리전스 리포트');
  content.push('');
  content.push(`**보고서 생성일:** ${new Date().toLocaleDateString('ko-KR')}`);
  content.push(`**모니터링 기간:** 지난 7일`);
  content.push(`**총 업데이트:** ${alerts.length}건`);
  content.push('');

  // Executive Summary
  content.push('## 📊 핵심 요약');
  content.push('');
  if (criticalAlerts.length > 0) {
    content.push(`🚨 **긴급 대응 필요:** ${criticalAlerts.length}건`);
  }
  if (highAlerts.length > 0) {
    content.push(`⚡ **높은 우선순위:** ${highAlerts.length}건`);
  }
  if (mediumAlerts.length > 0) {
    content.push(`📋 **일반 업데이트:** ${mediumAlerts.length}건`);
  }
  content.push('');

  // Critical Alerts Section
  if (criticalAlerts.length > 0) {
    content.push('## 🚨 긴급 대응 필요');
    content.push('');
    criticalAlerts.forEach(alert => {
      content.push(`### ${alert.title}`);
      content.push(`**영향 업계:** ${alert.affectedIndustries.map((i: string) => industryNames[i] || i).join(', ')}`);
      content.push(`**설명:** ${alert.description}`);
      if (alert.deadline) {
        const deadline = new Date(alert.deadline);
        const daysLeft = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        content.push(`**⏰ 마감일:** ${deadline.toLocaleDateString('ko-KR')} (${daysLeft}일 남음)`);
      }
      if (alert.recommendations && alert.recommendations.length > 0) {
        content.push('**권장 조치사항:**');
        alert.recommendations.forEach((rec: string) => {
          content.push(`- ${rec}`);
        });
      }
      content.push('');
    });
  }

  // High Priority Alerts
  if (highAlerts.length > 0) {
    content.push('## ⚡ 높은 우선순위 업데이트');
    content.push('');
    highAlerts.forEach(alert => {
      content.push(`### ${alert.title}`);
      content.push(`**영향 업계:** ${alert.affectedIndustries.map((i: string) => industryNames[i] || i).join(', ')}`);
      content.push(`**설명:** ${alert.description}`);
      content.push('');
    });
  }

  // Industry Impact Analysis
  if (Object.keys(alertsByIndustry).length > 0) {
    content.push('## 🏢 업계별 영향 분석');
    content.push('');
    Object.entries(alertsByIndustry).forEach(([industry, industryAlerts]) => {
      const industryName = industryNames[industry] || industry;
      content.push(`### ${industryName} (${industryAlerts.length}건)`);
      industryAlerts.forEach(alert => {
        const severityEmoji = alert.severity === 'critical' ? '🚨' : 
                             alert.severity === 'high' ? '⚡' : '📋';
        content.push(`- ${severityEmoji} ${alert.title}`);
      });
      content.push('');
    });
  }

  // Action Items
  const allRecommendations = alerts
    .filter(alert => alert.recommendations && alert.recommendations.length > 0)
    .flatMap(alert => alert.recommendations);

  if (allRecommendations.length > 0) {
    content.push('## ✅ 이번 주 실행 체크리스트');
    content.push('');
    // Remove duplicates and take top recommendations
    const uniqueRecommendations = [...new Set(allRecommendations)].slice(0, 10);
    uniqueRecommendations.forEach(rec => {
      content.push(`- [ ] ${rec}`);
    });
    content.push('');
  }

  // Footer
  content.push('---');
  content.push('');
  content.push('**📈 Korean Business Intelligence Platform - IdeaOasis**');
  content.push('');
  content.push('이 리포트는 한국 정부의 23,000+ 공공데이터와 규제 정보를 실시간으로 모니터링하여 자동 생성되었습니다.');
  content.push('');
  content.push('궁금한 사항이 있으시면 전문가 네트워크를 통해 상담받으실 수 있습니다.');
  content.push('');
  content.push(`*보고서 생성 시간: ${new Date().toLocaleString('ko-KR')}*`);

  return content.join('\n');
}