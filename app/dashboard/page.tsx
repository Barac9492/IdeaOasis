'use client';
import { useState, useEffect, Suspense } from 'react';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/AuthGuard';
import { 
  Shield, Bell, Calendar, AlertTriangle, CheckCircle, 
  User, Settings, ArrowRight, TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { RegulatoryAnalysis } from '@/lib/types';

function DashboardContent() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [recentAnalyses, setRecentAnalyses] = useState<RegulatoryAnalysis[]>([]);
  const [complianceAlerts, setComplianceAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push('/');
        return;
      }
      setUser(user);
      await loadUserData(user.uid);
    });
    return unsubscribe;
  }, [router]);

  const loadUserData = async (userId: string) => {
    setIsLoading(true);
    try {
      // Mock recent regulatory analyses - in production, this would come from a database
      setRecentAnalyses([
        {
          id: '1',
          businessIdea: 'Food delivery app connecting restaurants with customers',
          category: 'food',
          riskScore: 65,
          regulations: ['Food Sanitation Act (식품위생법)', 'Electronic Commerce Consumer Protection Act'],
          costs: {
            licenses: '₩8,000,000 - ₩12,000,000',
            legal: '₩3,000,000 - ₩6,000,000',
            compliance: '₩1,500,000/월'
          },
          competitors: ['Baemin - Leading Korean player', 'Yogiyo - Second largest'],
          timeline: '6-9 months to regulatory approval',
          verdict: 'PROCEED WITH CAUTION',
          keyInsights: ['Business categorized as food industry', '2 major regulations identified'],
          recommendations: ['Engage Korean legal counsel early', 'Set aside ₩10-20M for compliance'],
          analyzedAt: new Date().toISOString(),
          analysisVersion: '1.0'
        }
      ]);

      // Mock compliance alerts
      setComplianceAlerts([
        {
          id: '1',
          title: 'Personal Information Protection Act 개정안 발표',
          severity: 'high',
          deadline: '2025-09-15',
          description: 'AI 서비스 관련 개인정보 처리 기준 강화'
        },
        {
          id: '2', 
          title: 'Electronic Commerce Consumer Protection Act 시행령 개정',
          severity: 'medium',
          deadline: '2025-10-01',
          description: '온라인 플랫폼 사업자 의무사항 추가'
        }
      ]);

    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">대시보드를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  const overallRiskScore = recentAnalyses.length > 0 
    ? Math.round(recentAnalyses.reduce((sum, analysis) => sum + analysis.riskScore, 0) / recentAnalyses.length)
    : 0;

  const upcomingDeadlines = complianceAlerts
    .filter(alert => alert.deadline)
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* User Header */}
          <div className="bg-white rounded-2xl p-6 mb-6 border border-slate-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName} className="w-16 h-16 rounded-full" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="w-8 h-8 text-blue-600" />
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">{user?.displayName || user?.email}</h1>
                  <p className="text-slate-600">Korean Regulatory Compliance Dashboard</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700">
                      무료 분석
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                설정
              </Button>
            </div>
          </div>

          {/* Main Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            
            {/* Overall Risk Score */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">전체 리스크 점수</h3>
                <Shield className={`h-6 w-6 ${
                  overallRiskScore >= 80 ? 'text-red-500' :
                  overallRiskScore >= 60 ? 'text-orange-500' :
                  overallRiskScore >= 40 ? 'text-yellow-500' : 'text-green-500'
                }`} />
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-slate-900">{overallRiskScore}</span>
                <span className="text-slate-600">/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div
                  className={`h-2 rounded-full ${
                    overallRiskScore >= 80 ? 'bg-red-500' :
                    overallRiskScore >= 60 ? 'bg-orange-500' :
                    overallRiskScore >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${overallRiskScore}%` }}
                ></div>
              </div>
              <span className={`text-sm font-medium ${
                overallRiskScore >= 80 ? 'text-red-700' :
                overallRiskScore >= 60 ? 'text-orange-700' :
                overallRiskScore >= 40 ? 'text-yellow-700' : 'text-green-700'
              }`}>
                {overallRiskScore >= 80 ? '높은 리스크' :
                 overallRiskScore >= 60 ? '중간 리스크' :
                 overallRiskScore >= 40 ? '낮은 리스크' : '매우 낮은 리스크'}
              </span>
            </div>

            {/* Active Alerts */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">규제 알림</h3>
                <Bell className="h-6 w-6 text-blue-500" />
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-slate-900">{complianceAlerts.length}</span>
                <span className="text-slate-600">건</span>
              </div>
              <div className="text-sm text-slate-600">
                활성 규제 변경사항
              </div>
              {complianceAlerts.length > 0 && (
                <div className="mt-3">
                  <div className={`px-2 py-1 rounded text-xs ${
                    complianceAlerts[0].severity === 'high' ? 'bg-red-100 text-red-700' :
                    complianceAlerts[0].severity === 'medium' ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    최신: {complianceAlerts[0].title.substring(0, 30)}...
                  </div>
                </div>
              )}
            </div>

            {/* Next Deadline */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">다음 마감일</h3>
                <Calendar className="h-6 w-6 text-purple-500" />
              </div>
              {upcomingDeadlines.length > 0 ? (
                <>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-slate-900">
                      {Math.ceil((new Date(upcomingDeadlines[0].deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}
                    </span>
                    <span className="text-slate-600">일</span>
                  </div>
                  <div className="text-sm text-slate-600 mb-3">
                    {upcomingDeadlines[0].title.substring(0, 20)}...
                  </div>
                  <div className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                    {upcomingDeadlines[0].severity === 'high' ? '긴급 대응 필요' : '대응 필요'}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-slate-900">-</span>
                  </div>
                  <div className="text-sm text-slate-600">예정된 마감일 없음</div>
                </>
              )}
            </div>
          </div>

          {/* Recent Analyses */}
          {recentAnalyses.length > 0 && (
            <div className="bg-white rounded-2xl p-6 mb-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">최근 규제 분석</h3>
                <Button variant="outline" size="sm" onClick={() => router.push('/submit')}>
                  새로운 분석
                </Button>
              </div>
              <div className="space-y-4">
                {recentAnalyses.map((analysis) => (
                  <div key={analysis.id} className="p-4 bg-slate-50 rounded-lg border-l-4 border-l-blue-500">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            analysis.riskScore >= 80 ? 'bg-red-100 text-red-700' :
                            analysis.riskScore >= 60 ? 'bg-orange-100 text-orange-700' :
                            analysis.riskScore >= 40 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            리스크: {analysis.riskScore}/100
                          </span>
                          <span className="text-xs text-slate-500">{analysis.category}</span>
                        </div>
                        <h4 className="font-medium text-slate-900 mb-2">{analysis.verdict}</h4>
                        <p className="text-sm text-slate-600 mb-2">{analysis.businessIdea.substring(0, 100)}...</p>
                        <div className="text-xs text-slate-500">
                          {analysis.regulations.length}개 규제 확인됨 • {analysis.timeline}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 mb-6 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">빠른 작업</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                className="justify-start h-auto p-4 bg-slate-900 hover:bg-slate-800"
                onClick={() => router.push('/submit')}
              >
                <div className="text-left">
                  <div className="font-medium">아이디어 분석</div>
                  <div className="text-sm opacity-90">한국 규제 검토받기</div>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="text-left">
                  <div className="font-medium">규제 모니터링</div>
                  <div className="text-sm text-slate-600">최신 변경사항 추적</div>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="text-left">
                  <div className="font-medium">전문가 상담</div>
                  <div className="text-sm text-slate-600">한국 전문가와 상담</div>
                </div>
              </Button>
            </div>
          </div>

          {/* Active Regulatory Alerts */}
          {complianceAlerts.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">활성 규제 알림</h3>
                <Button variant="outline" size="sm">
                  모두 보기
                </Button>
              </div>
              <div className="space-y-3">
                {complianceAlerts.map((alert) => (
                  <div key={alert.id} className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            alert.severity === 'high' ? 'bg-red-100 text-red-700' :
                            alert.severity === 'medium' ? 'bg-orange-100 text-orange-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {alert.severity === 'high' ? '긴급' : 
                             alert.severity === 'medium' ? '중요' : '일반'}
                          </span>
                          {alert.deadline && (
                            <span className="text-xs text-slate-500">
                              마감: {new Date(alert.deadline).toLocaleDateString('ko-KR')}
                            </span>
                          )}
                        </div>
                        <h4 className="font-medium text-slate-900 mb-1">{alert.title}</h4>
                        <p className="text-sm text-slate-600">{alert.description}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </AuthGuard>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">대시보드를 불러오는 중...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}