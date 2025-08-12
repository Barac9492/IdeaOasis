'use client';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import ValueLandingPage from '@/components/ValueLandingPage';

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Set a timeout to prevent infinite loading if Firebase fails
    const timeout = setTimeout(() => {
      if (authLoading) {
        console.warn('Firebase auth timeout - showing landing page');
        setAuthLoading(false);
      }
    }, 10000); // 10 second timeout

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setAuthLoading(false);
      clearTimeout(timeout);
      if (user) {
        // Redirect authenticated users to dashboard instead of showing content on landing page
        window.location.href = '/dashboard';
      }
    });

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  // Show landing page for unauthenticated users
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">인증 상태 확인 중...</p>
        </div>
      </div>
    );
  }

  // Show landing page for unauthenticated users
  // Authenticated users are redirected to /dashboard in useEffect
  return <ValueLandingPage />;
}