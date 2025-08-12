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
  const [watchlistItems, setWatchlistItems] = useState<any[]>([]);
  const [trendingModels, setTrendingModels] = useState<any[]>([]);
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

      // Load watchlist from localStorage
      try {
        const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
        setWatchlistItems(watchlist);
      } catch (error) {
        console.error('Failed to load watchlist:', error);
      }

      // Mock trending foreign models
      setTrendingModels([
        {
          id: '1',
          name: 'Stripe Atlas',
          description: '원클릭 미국 법인 설립 서비스',
          category: 'fintech',
          trend: 'rising',
          riskScore: 65,
          reason: '한국 법인 설립 규제로 직접 진출 어려움'
        },
        {
          id: '2', 
          name: 'Discord Nitro',
          description: '게이머 커뮤니티 구독 서비스',
          category: 'social',
          trend: 'hot',
          riskScore: 35,
          reason: '국내 게임사들이 주목하는 모델'
        },
        {
          id: '3',
          name: 'Substack',
          description: '뉴스레터 구독 플랫폼',
          category: 'media',
          trend: 'rising',
          riskScore: 45,
          reason: '개인정보보호법 준수 필요'
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            
            {/* Watchlist Count */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">관심목록</h3>
                <TrendingUp className="h-6 w-6 text-blue-500" />
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-slate-900">{watchlistItems.length}</span>
                <span className="text-slate-600">개</span>
              </div>
              <div className="text-sm text-slate-600">
                추적 중인 모델
              </div>
            </div>

            {/* New Trends This Week */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">신규 트렌드</h3>
                <span className="text-orange-500">🔥</span>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-slate-900">6</span>
                <span className="text-slate-600">개</span>
              </div>
              <div className="text-sm text-slate-600">
                이번 주 새로 발견됨
              </div>
            </div>

            {/* Active Alerts */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">규제 알림</h3>
                <Bell className="h-6 w-6 text-red-500" />
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-slate-900">{complianceAlerts.length}</span>
                <span className="text-slate-600">건</span>
              </div>
              <div className="text-sm text-slate-600">
                신규 규제 변경사항
              </div>
            </div>

            {/* Opportunity Score */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">기회 점수</h3>
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-slate-900">78</span>
                <span className="text-slate-600">/100</span>
              </div>
              <div className="text-sm text-slate-600">
                이번 주 기회지수
              </div>
            </div>
          </div>

          {/* Trending Foreign Models */}
          <div className="bg-white rounded-2xl p-6 mb-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">🔥 요즘 뜨는 해외 모델</h3>
              <Button variant="outline" size="sm">
                더 보기
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {trendingModels.map((model) => (
                <div key={model.id} className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      model.trend === 'hot' ? 'bg-red-100 text-red-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {model.trend === 'hot' ? '🔥 HOT' : '📈 급상승'}
                    </div>
                    <div className={`px-2 py-1 rounded text-xs ${
                      model.riskScore > 60 ? 'bg-red-100 text-red-700' :
                      model.riskScore > 40 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      리스크 {model.riskScore}
                    </div>
                  </div>
                  <h4 className="font-medium text-slate-900 mb-1">{model.name}</h4>
                  <p className="text-sm text-slate-600 mb-2">{model.description}</p>
                  <p className="text-xs text-slate-500">{model.reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* My Watchlist */}
          {watchlistItems.length > 0 && (
            <div className="bg-white rounded-2xl p-6 mb-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">📋 내 관심목록</h3>
                <Button variant="outline" size="sm">
                  관리
                </Button>
              </div>
              <div className="space-y-3">
                {watchlistItems.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            item.riskScore > 60 ? 'bg-red-100 text-red-700' :
                            item.riskScore > 40 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            리스크 {item.riskScore}
                          </span>
                          <span className="text-xs text-slate-500">{item.category}</span>
                        </div>
                        <p className="text-sm font-medium text-slate-900">{item.idea.substring(0, 60)}...</p>
                        <p className="text-xs text-slate-500">
                          저장일: {new Date(item.savedAt).toLocaleDateString('ko-KR')}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        분석하기
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
                  <div className="font-medium">새 모델 분석</div>
                  <div className="text-sm opacity-90">해외 비즈니스 모델 검증</div>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="text-left">
                  <div className="font-medium">트렌드 탐색</div>
                  <div className="text-sm text-slate-600">요즘 뜨는 해외 모델 발견</div>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="text-left">
                  <div className="font-medium">규제 알림 설정</div>
                  <div className="text-sm text-slate-600">관심 분야 변화 추적</div>
                </div>
              </Button>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-blue-800">
                <TrendingUp className="w-4 h-4" />
                <span><strong>이번 주 인기:</strong> AI 도구 현지화, 구독 서비스 모델, 커뮤니티 플랫폼</span>
              </div>
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