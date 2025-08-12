import { NextRequest, NextResponse } from 'next/server';
import { emailNotificationService } from '@/lib/services/emailNotificationService';

export async function POST(req: NextRequest) {
  try {
    const { action, data } = await req.json();

    if (action === 'send_critical_alert') {
      const { userId, alert } = data;
      
      // Get user from database (mock implementation)
      const user = {
        id: userId,
        email: 'user@example.com',
        name: '사용자',
        industry: 'fintech',
        urgencyLevel: 'high',
        preferences: {
          criticalAlerts: true,
          weeklyDigest: true,
          monthlyReport: true,
          industryUpdates: true,
          emailAddress: 'user@example.com'
        }
      };

      const success = await emailNotificationService.sendCriticalAlert(user, alert);
      
      return NextResponse.json({
        success,
        message: success ? 'Critical alert sent successfully' : 'Failed to send critical alert'
      });
    }

    if (action === 'send_weekly_digest') {
      const { userId } = data;
      
      // This would typically be triggered by a cron job
      await emailNotificationService.sendWeeklyDigestToAllUsers();
      
      return NextResponse.json({
        success: true,
        message: 'Weekly digest sent to all subscribed users'
      });
    }

    if (action === 'notify_all_users') {
      const { alert, urgencyFilter } = data;
      
      await emailNotificationService.notifyAllUsers(alert, urgencyFilter);
      
      return NextResponse.json({
        success: true,
        message: 'Notification sent to all eligible users'
      });
    }

    if (action === 'update_preferences') {
      const { userId, preferences } = data;
      
      // In production, save to database
      console.log(`[NOTIFICATIONS] Updated preferences for user ${userId}:`, preferences);
      
      return NextResponse.json({
        success: true,
        message: 'Notification preferences updated successfully'
      });
    }

    if (action === 'test_email') {
      const { email, type } = data;
      
      const testUser = {
        id: 'test',
        email,
        name: '테스트 사용자',
        industry: 'fintech',
        urgencyLevel: 'high',
        preferences: {
          criticalAlerts: true,
          weeklyDigest: true,
          monthlyReport: true,
          industryUpdates: true,
          emailAddress: email
        }
      };

      const testAlert = {
        title: '개인정보보호법 시행령 개정안 테스트',
        summary: '이것은 이메일 알림 시스템의 테스트 메시지입니다. 실제 규제 변화가 아닙니다.',
        importance: 'high',
        sourceName: '개인정보보호위원회',
        affectedIndustries: ['fintech', 'healthtech'],
        publishedDate: new Date().toISOString(),
        businessImpact: 'high'
      };

      let success = false;
      let message = '';

      switch (type) {
        case 'critical':
          success = await emailNotificationService.sendCriticalAlert(testUser, testAlert);
          message = success ? 'Test critical alert sent' : 'Failed to send test alert';
          break;
          
        case 'weekly':
          success = await emailNotificationService.sendWeeklyDigest(testUser, [testAlert]);
          message = success ? 'Test weekly digest sent' : 'Failed to send test digest';
          break;
          
        case 'compliance':
          const testDeadline = {
            title: '개인정보보호법 준수 마감',
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
          };
          success = await emailNotificationService.sendComplianceReminder(testUser, testDeadline);
          message = success ? 'Test compliance reminder sent' : 'Failed to send test reminder';
          break;
          
        default:
          return NextResponse.json(
            { error: 'Invalid test type. Use: critical, weekly, compliance' },
            { status: 400 }
          );
      }

      return NextResponse.json({
        success,
        message,
        testEmail: email,
        testType: type
      });
    }

    return NextResponse.json(
      { error: 'Invalid action. Use: send_critical_alert, send_weekly_digest, notify_all_users, update_preferences, test_email' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Notification API error:', error);
    return NextResponse.json(
      { error: 'Failed to process notification request' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action') || 'status';
    const userId = searchParams.get('userId');

    if (action === 'status') {
      return NextResponse.json({
        success: true,
        service: 'Email Notification Service',
        features: [
          '긴급 규제 알림 이메일',
          '주간 규제 다이제스트',
          '컴플라이언스 마감일 알림',
          '맞춤형 업계 뉴스',
          '실시간 알림 설정'
        ],
        templates: [
          'critical_alert',
          'weekly_digest', 
          'compliance_reminder',
          'monthly_report'
        ],
        supportedLanguages: ['ko', 'en']
      });
    }

    if (action === 'preferences' && userId) {
      // In production, fetch from database
      const mockPreferences = {
        userId,
        preferences: {
          criticalAlerts: true,
          weeklyDigest: true,
          monthlyReport: false,
          industryUpdates: true,
          emailAddress: 'user@example.com',
          frequency: 'immediate',
          quietHours: {
            enabled: true,
            start: '22:00',
            end: '08:00'
          }
        },
        lastUpdated: new Date().toISOString()
      };

      return NextResponse.json({
        success: true,
        preferences: mockPreferences
      });
    }

    if (action === 'history' && userId) {
      // Mock notification history
      const history = [
        {
          id: '1',
          type: 'critical_alert',
          title: '개인정보보호법 시행령 개정',
          sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'delivered',
          opened: true,
          clicked: false
        },
        {
          id: '2',
          type: 'weekly_digest',
          title: '주간 규제 다이제스트 - 5건 업데이트',
          sentAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'delivered',
          opened: true,
          clicked: true
        },
        {
          id: '3',
          type: 'compliance_reminder',
          title: '컴플라이언스 마감일 7일 남음',
          sentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'delivered',
          opened: false,
          clicked: false
        }
      ];

      return NextResponse.json({
        success: true,
        history,
        stats: {
          totalSent: history.length,
          opened: history.filter(h => h.opened).length,
          clicked: history.filter(h => h.clicked).length,
          deliveryRate: 100
        }
      });
    }

    if (action === 'templates') {
      const templates = [
        {
          id: 'critical_alert',
          name: '긴급 규제 알림',
          description: '중요하거나 긴급한 규제 변화 즉시 알림',
          frequency: 'immediate',
          enabled: true
        },
        {
          id: 'weekly_digest',
          name: '주간 다이제스트',
          description: '매주 월요일 오전 9시 규제 업데이트 요약',
          frequency: 'weekly',
          enabled: true
        },
        {
          id: 'compliance_reminder',
          name: '컴플라이언스 알림',
          description: '규제 준수 마감일 및 액션 아이템 알림',
          frequency: 'as_needed',
          enabled: true
        },
        {
          id: 'monthly_report',
          name: '월간 리포트',
          description: '종합적인 규제 동향 및 비즈니스 인사이트',
          frequency: 'monthly',
          enabled: false
        }
      ];

      return NextResponse.json({
        success: true,
        templates
      });
    }

    return NextResponse.json(
      { error: 'Invalid action. Use: status, preferences, history, templates' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Notification GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notification data' },
      { status: 500 }
    );
  }
}

// Webhook endpoint for handling email events (opens, clicks, bounces)
export async function PUT(req: NextRequest) {
  try {
    const { event, data } = await req.json();

    switch (event) {
      case 'email_opened':
        console.log(`[NOTIFICATIONS] Email ${data.messageId} opened by ${data.email}`);
        // Update analytics in database
        break;
        
      case 'email_clicked':
        console.log(`[NOTIFICATIONS] Link clicked in email ${data.messageId} by ${data.email}`);
        console.log(`[NOTIFICATIONS] URL: ${data.url}`);
        // Track engagement metrics
        break;
        
      case 'email_bounced':
        console.log(`[NOTIFICATIONS] Email bounced: ${data.email}, reason: ${data.reason}`);
        // Handle bounce - maybe disable notifications for this email
        break;
        
      case 'unsubscribed':
        console.log(`[NOTIFICATIONS] User unsubscribed: ${data.email}`);
        // Update user preferences to disable all notifications
        break;
        
      default:
        return NextResponse.json(
          { error: 'Unknown event type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `Event ${event} processed successfully`
    });

  } catch (error) {
    console.error('Notification webhook error:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}