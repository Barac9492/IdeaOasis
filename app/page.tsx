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
      // Keep users on landing page after login - no automatic redirect
    });

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  // Always show landing page first - defer auth check
  if (authLoading) {
    // Show landing page while auth loads in background
    return <ValueLandingPage />;
  }

  // Show landing page for unauthenticated users
  // Authenticated users are redirected to /dashboard in useEffect
  return <ValueLandingPage />;
}