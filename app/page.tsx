'use client';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import ValueLandingPage from '@/components/ValueLandingPage';
import IdeaCardSimple from '@/components/IdeaCardSimple';

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [authLoading, setAuthLoading] = useState(true);
  const [ideasLoading, setIdeasLoading] = useState(true);

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
        loadIdeas();
      }
    });

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const loadIdeas = async () => {
    setIdeasLoading(true);
    try {
      const response = await fetch('/api/ideas');
      const data = await response.json();
      setIdeas(data.ideas || []);
    } catch (error) {
      console.error('Failed to load ideas:', error);
    } finally {
      setIdeasLoading(false);
    }
  };

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

  if (!user) {
    return <ValueLandingPage />;
  }

  // Show authenticated dashboard
  return (
    <main className="mx-auto max-w-6xl p-6">
      {/* Simple Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div>
          <div className="text-2xl font-bold text-slate-900">{ideas.length}</div>
          <div className="text-sm text-slate-600">Ideas</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-slate-900">
            {ideas.filter(idea => idea.koreaFit && idea.koreaFit >= 7).length}
          </div>
          <div className="text-sm text-slate-600">High Potential</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-slate-900">
            {new Set(ideas.map(idea => idea.sector).filter(Boolean)).size}
          </div>
          <div className="text-sm text-slate-600">Sectors</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-slate-900">
            {Math.round(ideas.reduce((acc, idea) => acc + (idea.koreaFit || 0), 0) / Math.max(ideas.length, 1) * 10) / 10}
          </div>
          <div className="text-sm text-slate-600">Avg Score</div>
        </div>
      </div>

      {/* Ideas */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900">Business Opportunities</h2>
          <a href="/ideas/enhanced" className="text-sm text-blue-600 hover:text-blue-700">
            View all →
          </a>
        </div>

        {ideasLoading ? (
          <div className="text-sm text-slate-500">Loading...</div>
        ) : ideas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ideas.slice(0, 6).map((idea) => (
              <IdeaCardSimple key={idea.id} idea={idea} />
            ))}
          </div>
        ) : (
          <div className="text-sm text-slate-500">No ideas available</div>
        )}
      </section>
    </main>
  );
}