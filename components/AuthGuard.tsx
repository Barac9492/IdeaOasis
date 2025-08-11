'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { User, Lock } from 'lucide-react';
import Nav from '@/components/Nav';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Routes that don't require authentication
  const publicRoutes = ['/'];
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Sign in error:', error);
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

  // Allow public routes without authentication
  if (isPublicRoute) {
    return <>{children}</>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            {/* Logo */}
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            
            {/* Heading */}
            <h1 className="text-2xl font-bold text-slate-900 mb-2">로그인이 필요합니다</h1>
            <p className="text-slate-600 mb-8">
              IdeaOasis의 모든 기능을 이용하려면 로그인해주세요
            </p>
            
            {/* Sign In Button */}
            <button
              onClick={handleSignIn}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              <User className="w-5 h-5" />
              Google로 로그인
            </button>
            
            {/* Features Preview */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <p className="text-sm text-slate-500 mb-4">로그인 후 이용할 수 있는 기능:</p>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>한국 맞춤형 비즈니스 아이디어 탐색</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span>AI 기반 Korea Fit 분석</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>실행 로드맵 및 트렌드 데이터</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span>아이디어 북마크 및 투표</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Nav />
      {children}
    </>
  );
}