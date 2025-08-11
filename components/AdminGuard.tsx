'use client';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { Shield, AlertCircle } from 'lucide-react';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        // Check if user email is in admin list
        const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',').map(email => email.trim());
        setIsAdmin(Boolean(user.email && adminEmails.includes(user.email)));
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">권한 확인 중...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-slate-100">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            {/* Icon */}
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            
            {/* Heading */}
            <h1 className="text-2xl font-bold text-slate-900 mb-2">관리자 권한이 필요합니다</h1>
            <p className="text-slate-600 mb-6">
              이 페이지는 관리자만 접근할 수 있습니다.
            </p>
            
            {user && (
              <div className="bg-slate-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-slate-600">현재 로그인된 계정:</p>
                <p className="font-medium text-slate-900">{user.email}</p>
              </div>
            )}
            
            <div className="flex gap-3">
              <button
                onClick={() => window.history.back()}
                className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-medium"
              >
                뒤로 가기
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                홈으로
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Admin Badge */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
        <div className="flex items-center gap-2 text-green-800">
          <Shield className="w-4 h-4" />
          <span className="text-sm font-medium">관리자 모드 - {user.email}</span>
        </div>
      </div>
      {children}
    </div>
  );
}