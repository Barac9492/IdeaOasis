'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { auth, provider as googleProvider } from '@/shared/lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { User, Lock, Shield } from 'lucide-react';

const ADMIN_EMAILS = ['ethancho12@gmail.com']; // Hardcoded for reliability

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Routes that require admin access
  const adminRoutes = [
    '/ai-agents',
    '/dashboard/chief',
    '/dashboard/platform', 
    '/dashboard/business',
    '/dashboard/content',
    '/dashboard/regulatory'
  ];
  
  const requiresAdmin = adminRoutes.some(route => pathname.startsWith(route));

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log('Auth state changed:', user?.email || 'No user');
      setUser(user);
      if (user?.email) {
        const isUserAdmin = ADMIN_EMAILS.includes(user.email);
        console.log('Is admin?', isUserAdmin, 'Admin emails:', ADMIN_EMAILS);
        setIsAdmin(isUserAdmin);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleSignIn = async () => {
    try {
      console.log('Attempting to sign in...');
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Sign in successful:', result.user?.email);
    } catch (error: any) {
      console.error('Sign in error:', error);
      alert(`Login failed: ${error?.message || 'Unknown error'}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  // If route doesn't require admin, allow access
  if (!requiresAdmin) {
    return <>{children}</>;
  }

  // If no user, show login
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-slate-900 mb-2">관리자 로그인</h1>
            <p className="text-slate-600 mb-8">
              AI 에이전트 시스템에 접근하려면 관리자 권한이 필요합니다
            </p>
            
            <button
              onClick={handleSignIn}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              <User className="w-5 h-5" />
              Google로 관리자 로그인
            </button>
            
            {/* Temporary bypass for testing */}
            <button
              onClick={() => {
                // Simulate admin user for testing
                setUser({ email: 'ethancho12@gmail.com', displayName: 'Admin User' });
                setIsAdmin(true);
                setLoading(false);
              }}
              className="w-full mt-2 px-6 py-2 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              임시 관리자 접근 (테스트용)
            </button>
            
            <div className="mt-8 pt-6 border-t border-slate-200">
              <p className="text-sm text-slate-500 mb-4">관리자 전용 기능:</p>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>AI 에이전트 시스템 관리</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span>플랫폼 개발 에이전트 제어</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>규제 모니터링 설정</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span>전문가 네트워크 관리</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If user but not admin, show access denied
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-slate-100">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-red-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-slate-900 mb-2">접근 권한 없음</h1>
            <p className="text-slate-600 mb-4">
              현재 계정 ({user.email})은 관리자 권한이 없습니다.
            </p>
            <p className="text-sm text-slate-500 mb-8">
              AI 에이전트 시스템은 관리자만 접근할 수 있습니다.
            </p>
            
            <button
              onClick={() => auth.signOut()}
              className="w-full px-6 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-colors font-medium"
            >
              다른 계정으로 로그인
            </button>
            
            <div className="mt-6">
              <a 
                href="/" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                홈페이지로 돌아가기
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // User is admin, allow access
  return <>{children}</>;
}