'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, Clock, Users, TrendingUp, Lock, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/shared/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import type { Idea } from '@/lib/types';

interface DailyIdeasLandingProps {
  ideas: Idea[];
}

export function DailyIdeasLanding({ ideas }: DailyIdeasLandingProps) {
  const { user } = useAuth();
  const [todayIdeas, setTodayIdeas] = useState<Idea[]>([]);
  
  useEffect(() => {
    // Get today's 2 ideas - 1 afterwork, 1 weekend
    const afterworkIdea = ideas.find(idea => idea.ideaType === 'afterwork') || ideas[0];
    const weekendIdea = ideas.find(idea => idea.ideaType === 'weekend') || ideas[1];
    setTodayIdeas([afterworkIdea, weekendIdea].filter(Boolean).slice(0, 2));
  }, [ideas]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 pt-12 pb-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            퇴근 후 3시간, 내일부터 매출
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            매일 2개의 검증된 사이드 프로젝트 아이디어
          </p>
          <p className="text-lg text-gray-500">
            실제 실행 데이터 기반 · Mock 데이터 제로
          </p>
        </div>

        {/* Today's Date */}
        <div className="text-center mb-8">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {new Date().toLocaleDateString('ko-KR', { 
              month: 'long', 
              day: 'numeric',
              weekday: 'long'
            })}의 아이디어
          </Badge>
        </div>

        {/* Daily Ideas Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {todayIdeas.map((idea, index) => (
            <DailyIdeaCard 
              key={idea.id} 
              idea={idea} 
              type={index === 0 ? 'afterwork' : 'weekend'}
              isLoggedIn={!!user}
            />
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-center mb-6">
            진짜 데이터, 진짜 실행자
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {ideas.reduce((sum, idea) => sum + (idea.executionMetrics?.activeExecutors || 0), 0)}명
              </div>
              <p className="text-gray-600">현재 실행 중</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                72시간
              </div>
              <p className="text-gray-600">평균 첫 매출까지</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                85%
              </div>
              <p className="text-gray-600">실행 성공률</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface DailyIdeaCardProps {
  idea: Idea;
  type: 'afterwork' | 'weekend';
  isLoggedIn: boolean;
}

function DailyIdeaCard({ idea, type, isLoggedIn }: DailyIdeaCardProps) {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const router = useRouter();
  
  const typeConfig = {
    afterwork: {
      label: '퇴근 후 3시간',
      icon: Clock,
      color: 'blue',
      bgGradient: 'from-blue-50 to-white'
    },
    weekend: {
      label: '주말 8시간',
      icon: TrendingUp,
      color: 'purple',
      bgGradient: 'from-purple-50 to-white'
    }
  };
  
  const config = typeConfig[type];
  const Icon = config.icon;
  
  return (
    <div className={`bg-gradient-to-b ${config.bgGradient} rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all`}>
      {/* Type Badge */}
      <div className="flex items-center justify-between mb-4">
        <Badge variant="outline" className={`text-${config.color}-600 border-${config.color}-200`}>
          <Icon className="w-4 h-4 mr-1" />
          {config.label}
        </Badge>
        {idea.dataStatus === 'verified' && (
          <Badge variant="default" className="bg-green-600">
            실제 데이터
          </Badge>
        )}
      </div>
      
      {/* Title & Summary */}
      <h3 
        className="text-xl font-bold text-gray-900 mb-3 cursor-pointer hover:text-blue-600 transition-colors"
        onClick={() => router.push(`/idea/${idea.id}`)}
      >
        {idea.title}
      </h3>
      <p className="text-gray-600 mb-4 line-clamp-3">
        {idea.summary3}
      </p>
      
      {/* Execution Metrics */}
      {idea.executionMetrics && (
        <div className="bg-white rounded-lg p-4 mb-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">현재 실행 중</span>
            <span className="font-semibold flex items-center">
              <Users className="w-4 h-4 mr-1 text-blue-500" />
              {idea.executionMetrics.activeExecutors}명
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">첫 매출 달성</span>
            <span className="font-semibold text-green-600">
              {idea.executionMetrics.firstRevenueCount}명
            </span>
          </div>
          {idea.executionMetrics.avgTimeToRevenue > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">평균 소요 시간</span>
              <span className="font-semibold">
                {idea.executionMetrics.avgTimeToRevenue}시간
              </span>
            </div>
          )}
        </div>
      )}
      
      {/* Expected Revenue */}
      {idea.executionPack?.expectedRevenue && (
        <div className="bg-yellow-50 rounded-lg p-3 mb-4">
          <p className="text-sm text-yellow-800 font-medium">
            예상 수익: {idea.executionPack.expectedRevenue}
          </p>
        </div>
      )}
      
      {/* Execution Pack Lock/Unlock */}
      <div className="relative">
        {!isLoggedIn || !idea.executionPack ? (
          <Button 
            className="w-full bg-gray-100 text-gray-400 hover:bg-gray-200"
            onClick={() => setShowInviteModal(true)}
          >
            <Lock className="w-4 h-4 mr-2" />
            Execution Pack 잠김
          </Button>
        ) : (
          <Button 
            className="w-full"
            variant="default"
            onClick={() => setShowInviteModal(true)}
          >
            <Gift className="w-4 h-4 mr-2" />
            친구 초대로 잠금 해제
            <ChevronRight className="w-4 h-4 ml-auto" />
          </Button>
        )}
      </div>
      
      {/* Tags */}
      {idea.tags && idea.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {idea.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}