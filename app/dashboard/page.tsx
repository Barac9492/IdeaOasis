// app/dashboard/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import IdeaCardEnhanced from '@/components/IdeaCardEnhanced';
import ExportModal from '@/components/ExportModal';
import { 
  Bookmark, TrendingUp, Clock, Target, User, Settings, 
  CreditCard, Download, BarChart3, Star, ArrowRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Idea } from '@/lib/types';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [bookmarkedIdeas, setBookmarkedIdeas] = useState<Idea[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'bookmarks' | 'history' | 'settings'>('overview');
  const [userPlan, setUserPlan] = useState<'free' | 'premium' | 'enterprise'>('free');
  const [showExportModal, setShowExportModal] = useState(false);

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
      // Load bookmarked ideas
      const bookmarksResponse = await fetch(`/api/bookmark?userUid=${userId}`);
      const bookmarksData = await bookmarksResponse.json();
      
      if (bookmarksData.bookmarks && bookmarksData.bookmarks.length > 0) {
        // Load full idea details for bookmarks
        const ideasResponse = await fetch('/api/ideas');
        const ideasData = await ideasResponse.json();
        const allIdeas = ideasData.ideas || [];
        
        const bookmarkedIdeaIds = bookmarksData.bookmarks.map((b: any) => b.ideaId);
        const bookmarked = allIdeas.filter((idea: Idea) => bookmarkedIdeaIds.includes(idea.id));
        setBookmarkedIdeas(bookmarked);
      }

      // Load recently viewed (mock data for now)
      // In production, this would track actual view history
      const ideasResponse = await fetch('/api/ideas');
      const ideasData = await ideasResponse.json();
      setRecentlyViewed(ideasData.ideas?.slice(0, 3) || []);

    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // User stats
  const stats = {
    bookmarked: bookmarkedIdeas.length,
    viewed: recentlyViewed.length,
    avgKoreaFit: bookmarkedIdeas.length > 0 
      ? bookmarkedIdeas.reduce((sum, idea) => sum + (idea.koreaFit || 0), 0) / bookmarkedIdeas.length 
      : 0,
    trending: bookmarkedIdeas.filter(idea => idea.trendData?.growth?.startsWith('+')).length
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

  return (
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
                <p className="text-slate-600">{user?.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    userPlan === 'premium' ? 'bg-purple-100 text-purple-700' :
                    userPlan === 'enterprise' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {userPlan === 'premium' ? '프리미엄' : 
                     userPlan === 'enterprise' ? '엔터프라이즈' : '무료'} 플랜
                  </span>
                  {userPlan === 'free' && (
                    <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                      업그레이드 →
                    </button>
                  )}
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              설정
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: 'overview', label: '개요', icon: BarChart3 },
            { id: 'bookmarks', label: '저장한 아이디어', icon: Bookmark },
            { id: 'history', label: '최근 본 아이디어', icon: Clock },
            { id: 'settings', label: '설정', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl p-4 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <Bookmark className="w-5 h-5 text-blue-600" />
                  <span className="text-2xl font-bold text-slate-900">{stats.bookmarked}</span>
                </div>
                <p className="text-sm text-slate-600">저장한 아이디어</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <span className="text-2xl font-bold text-slate-900">{stats.viewed}</span>
                </div>
                <p className="text-sm text-slate-600">최근 본 아이디어</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <Star className="w-5 h-5 text-amber-600" />
                  <span className="text-2xl font-bold text-slate-900">{stats.avgKoreaFit.toFixed(1)}</span>
                </div>
                <p className="text-sm text-slate-600">평균 Korea Fit</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <span className="text-2xl font-bold text-slate-900">{stats.trending}</span>
                </div>
                <p className="text-sm text-slate-600">성장 중인 아이디어</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 mb-6 border border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">빠른 작업</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={() => setShowExportModal(true)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  보고서 다운로드
                </Button>
                <Button variant="outline" className="justify-start">
                  <Target className="w-4 h-4 mr-2" />
                  맞춤 추천
                </Button>
                <Button variant="outline" className="justify-start">
                  <CreditCard className="w-4 h-4 mr-2" />
                  플랜 업그레이드
                </Button>
                <Button variant="outline" className="justify-start">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  트렌드 분석
                </Button>
              </div>
            </div>

            {/* Recent Bookmarks */}
            {bookmarkedIdeas.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-900">최근 저장한 아이디어</h2>
                  <button 
                    onClick={() => setActiveTab('bookmarks')}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    모두 보기
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {bookmarkedIdeas.slice(0, 3).map(idea => (
                    <IdeaCardEnhanced key={idea.id} idea={idea} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'bookmarks' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900">저장한 아이디어 ({bookmarkedIdeas.length})</h2>
              {bookmarkedIdeas.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowExportModal(true)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Excel 다운로드
                </Button>
              )}
            </div>
            {bookmarkedIdeas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bookmarkedIdeas.map(idea => (
                  <IdeaCardEnhanced key={idea.id} idea={idea} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
                <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 mb-4">아직 저장한 아이디어가 없습니다</p>
                <Button onClick={() => router.push('/ideas/enhanced')}>
                  아이디어 탐색하기
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">최근 본 아이디어</h2>
            {recentlyViewed.length > 0 ? (
              <div className="space-y-3">
                {recentlyViewed.map(idea => (
                  <IdeaCardEnhanced key={idea.id} idea={idea} compact />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
                <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">최근 본 아이디어가 없습니다</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">계정 설정</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-2">이메일 알림</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="text-sm text-slate-600">새로운 아이디어 알림</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="text-sm text-slate-600">저장한 아이디어 업데이트</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-slate-600">주간 트렌드 리포트</span>
                  </label>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-2">관심 분야</h3>
                <p className="text-sm text-slate-600 mb-3">맞춤 추천을 위한 관심 분야를 선택하세요</p>
                <div className="flex flex-wrap gap-2">
                  {['헬스케어', 'FinTech', '에듀테크', '푸드테크', '시니어테크', 'AI/ML'].map(tag => (
                    <button key={tag} className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t">
                <Button className="w-full sm:w-auto">설정 저장</Button>
              </div>
            </div>
          </div>
        )}

        {/* Export Modal */}
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          ideas={activeTab === 'bookmarks' ? bookmarkedIdeas : recentlyViewed}
        />
      </div>
    </div>
  );
}