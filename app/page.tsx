'use client';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import LandingPage from '@/components/LandingPage';
import IdeaCard from '@/components/IdeaCard';
import { ArrowRight, TrendingUp, Target, Zap, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [authLoading, setAuthLoading] = useState(true);
  const [ideasLoading, setIdeasLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setAuthLoading(false);
      if (user) {
        loadIdeas();
      }
    });

    return unsubscribe;
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
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  // Show authenticated dashboard
  return (
    <main className="mx-auto max-w-7xl p-6 space-y-8">
      {/* Welcome Header */}
      <section className="text-center py-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          안녕하세요, {user.displayName || user.email}님! 👋
        </h1>
        <p className="text-xl text-slate-600 mb-8">
          오늘은 어떤 새로운 아이디어를 발견해보시겠어요?
        </p>
        <div className="flex justify-center gap-4">
          <Button className="px-6 py-3" size="lg">
            <TrendingUp className="w-5 h-5 mr-2" />
            인기 아이디어 보기
          </Button>
          <Button variant="outline" className="px-6 py-3" size="lg">
            <Target className="w-5 h-5 mr-2" />
            맞춤 추천받기
          </Button>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {ideas.length || 0}
          </div>
          <div className="text-slate-600">등록된 아이디어</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-emerald-600 mb-2">
            {Math.round(ideas.reduce((acc, idea) => acc + (idea.koreaFit || 0), 0) / Math.max(ideas.length, 1) * 10) / 10}
          </div>
          <div className="text-slate-600">평균 Korea Fit</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {ideas.filter(idea => idea.koreaFit && idea.koreaFit >= 7).length}
          </div>
          <div className="text-slate-600">고득점 아이디어</div>
        </Card>
      </section>

      {/* Top Ideas */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-slate-900">추천 아이디어</h2>
          <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
            전체 보기 <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {ideasLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-slate-100 rounded-2xl h-64 animate-pulse"></div>
            ))}
          </div>
        ) : ideas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.slice(0, 6).map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-2xl">
            <Zap className="w-12 h-12 mx-auto mb-4 text-slate-400" />
            <p className="text-slate-600">아직 등록된 아이디어가 없습니다.</p>
          </div>
        )}
      </section>
    </main>
  );
}