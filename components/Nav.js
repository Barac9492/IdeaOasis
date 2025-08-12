'use client';
import Link from "next/link";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { User } from "lucide-react";

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
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-slate-700 hover:text-slate-900 transition-colors font-medium"
            >
              Home
            </Link>
            <Link 
              href="/submit" 
              className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors font-medium"
            >
              아이디어 검증
            </Link>
            {user && (
              <Link 
                href="/dashboard" 
                className="text-slate-700 hover:text-slate-900 transition-colors font-medium"
              >
                Dashboard
              </Link>
            )}
            <Link 
              href="/regulatory" 
              className="text-slate-700 hover:text-slate-900 transition-colors font-medium"
            >
              규제 정보
            </Link>
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
      <div className="md:hidden border-t border-slate-200">
        <div className="flex items-center justify-around py-3">
          <Link href="/" className="text-xs text-slate-600 hover:text-slate-900">
            Home
          </Link>
          <Link href="/submit" className="text-xs bg-slate-900 text-white px-3 py-2 rounded">
            아이디어 검증
          </Link>
          {user && (
            <Link href="/dashboard" className="text-xs text-slate-600 hover:text-slate-900">
              Dashboard
            </Link>
          )}
          <Link href="/regulatory" className="text-xs text-slate-600 hover:text-slate-900">
            규제 정보
          </Link>
        </div>
      </div>
    </nav>
  );
}
