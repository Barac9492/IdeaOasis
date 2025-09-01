'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Users, TrendingUp, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExecutionPackView } from '@/features/execution-pack/ui/ExecutionPackView';
import { useAuth } from '@/shared/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import type { Idea } from '@/lib/types';

interface IdeaDetailViewProps {
  idea: Idea;
}

export function IdeaDetailView({ idea }: IdeaDetailViewProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isUnlocked, setIsUnlocked] = useState(false);
  
  useEffect(() => {
    // Check if user has unlocked this idea
    // TODO: Implement actual unlock check from database
    if (user) {
      // For demo purposes, unlock if user is logged in
      setIsUnlocked(false); // Keep locked to show invitation flow
    }
  }, [user, idea.id]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push('/')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          돌아가기
        </Button>
        
        {/* Idea Header */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                {idea.ideaType === 'afterwork' ? (
                  <Badge variant="outline" className="text-blue-600 border-blue-200">
                    <Clock className="w-3 h-3 mr-1" />
                    퇴근 후 3시간
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-purple-600 border-purple-200">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    주말 8시간
                  </Badge>
                )}
                {idea.dataStatus === 'verified' && (
                  <Badge className="bg-green-600">
                    실제 데이터
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                {idea.title}
              </h1>
              <p className="text-gray-600 leading-relaxed">
                {idea.summary3}
              </p>
            </div>
          </div>
          
          {/* Tags */}
          {idea.tags && idea.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {idea.tags.map(tag => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        {/* Execution Metrics */}
        {idea.executionMetrics && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                실시간 실행 현황
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {idea.executionMetrics.activeExecutors}명
                  </div>
                  <p className="text-sm text-gray-600 mt-1">현재 실행 중</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {idea.executionMetrics.firstRevenueCount}명
                  </div>
                  <p className="text-sm text-gray-600 mt-1">첫 매출 달성</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {idea.executionMetrics.avgTimeToRevenue}시간
                  </div>
                  <p className="text-sm text-gray-600 mt-1">평균 소요 시간</p>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    ₩{(idea.executionMetrics.totalRevenue / 1000000).toFixed(1)}M
                  </div>
                  <p className="text-sm text-gray-600 mt-1">총 매출액</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">
                    {100 - idea.executionMetrics.failureRate}%
                  </div>
                  <p className="text-sm text-gray-600 mt-1">성공률</p>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {idea.executionMetrics.avgExecutionHours}시간
                  </div>
                  <p className="text-sm text-gray-600 mt-1">평균 실행 시간</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Business Model & Target */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {idea.businessModel && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">비즈니스 모델</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{idea.businessModel}</p>
              </CardContent>
            </Card>
          )}
          
          {idea.targetUser && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">타겟 고객</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{idea.targetUser}</p>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Why Now */}
        {idea.whyNow && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">왜 지금인가?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{idea.whyNow}</p>
            </CardContent>
          </Card>
        )}
        
        {/* Risks */}
        {idea.risks && idea.risks.length > 0 && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <AlertCircle className="w-5 h-5" />
                주요 리스크
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {idea.risks.map((risk, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-orange-600 mt-0.5">•</span>
                    <span className="text-gray-700">{risk}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
        
        {/* Execution Pack */}
        <ExecutionPackView 
          idea={idea} 
          isUnlocked={isUnlocked}
          userId={user?.uid}
        />
      </div>
    </div>
  );
}