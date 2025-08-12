'use client';
import Link from "next/link";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { Home, Search, TrendingUp, Settings, User, BarChart3, CreditCard, Sparkles, Shield, FileText, Users, Brain, Rocket } from "lucide-react";

export default function Nav() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    return auth.onAuthStateChanged(setUser);
  }, []);

  return (
    <nav className="border-b border-slate-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-slate-900 tracking-tight">
            IdeaOasis
          </Link>
          
          {/* Main Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors font-medium"
            >
              <Home className="w-4 h-4" />
              <span>홈</span>
            </Link>
            <Link 
              href="/ideas/enhanced" 
              className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors font-medium"
            >
              <Sparkles className="w-4 h-4" />
              <span>아이디어 탐색</span>
            </Link>
            <Link 
              href="/top" 
              className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors font-medium"
            >
              <TrendingUp className="w-4 h-4" />
              <span>인기 아이디어</span>
            </Link>
            {user && (
              <>
                <Link 
                  href="/dashboard/chief" 
                  className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors font-medium"
                >
                  <Brain className="w-4 h-4" />
                  <span>Chief of Staff</span>
                </Link>
                <Link 
                  href="/dashboard" 
                  className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors font-medium"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>대시보드</span>
                </Link>
                <Link 
                  href="/dashboard/regulatory" 
                  className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors font-medium"
                >
                  <Shield className="w-4 h-4" />
                  <span>규제 모니터링</span>
                </Link>
                <Link 
                  href="/dashboard/content" 
                  className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors font-medium"
                >
                  <FileText className="w-4 h-4" />
                  <span>콘텐츠 에이전트</span>
                </Link>
                <Link 
                  href="/dashboard/business" 
                  className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors font-medium"
                >
                  <Users className="w-4 h-4" />
                  <span>영업 에이전트</span>
                </Link>
                <Link 
                  href="/dashboard/platform" 
                  className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors font-medium"
                >
                  <Rocket className="w-4 h-4" />
                  <span>플랫폼 개발</span>
                </Link>
              </>
            )}
            <Link 
              href="/pricing" 
              className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors font-medium"
            >
              <CreditCard className="w-4 h-4" />
              <span>요금제</span>
            </Link>
            {user && user.email === 'ethancho12@gmail.com' && (
              <Link 
                href="/admin" 
                className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors font-medium"
              >
                <Settings className="w-4 h-4" />
                <span>관리자</span>
              </Link>
            )}
          </div>

          {/* User Authentication */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <User className="w-4 h-4" />
                  <span>{user.displayName || user.email}</span>
                </div>
                <button 
                  onClick={() => signOut(auth)}
                  className="px-4 py-2 text-sm text-slate-700 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <button 
                onClick={() => signInWithPopup(auth, googleProvider)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                로그인
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-slate-200 px-6 py-3">
        <div className="flex items-center justify-around">
          <Link href="/" className="flex flex-col items-center gap-1 text-xs text-slate-600 hover:text-blue-600">
            <Home className="w-4 h-4" />
            <span>홈</span>
          </Link>
          <Link href="/ideas/enhanced" className="flex flex-col items-center gap-1 text-xs text-slate-600 hover:text-blue-600">
            <Sparkles className="w-4 h-4" />
            <span>탐색</span>
          </Link>
          {user && (
            <Link href="/dashboard" className="flex flex-col items-center gap-1 text-xs text-slate-600 hover:text-blue-600">
              <BarChart3 className="w-4 h-4" />
              <span>대시보드</span>
            </Link>
          )}
          <Link href="/pricing" className="flex flex-col items-center gap-1 text-xs text-slate-600 hover:text-blue-600">
            <CreditCard className="w-4 h-4" />
            <span>요금제</span>
          </Link>
          {user && user.email === 'ethancho12@gmail.com' && (
            <Link href="/admin" className="flex flex-col items-center gap-1 text-xs text-slate-600 hover:text-blue-600">
              <Settings className="w-4 h-4" />
              <span>관리</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
