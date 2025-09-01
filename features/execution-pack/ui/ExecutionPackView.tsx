'use client';

import { useState } from 'react';
import { 
  Lock, 
  Unlock, 
  Package, 
  Clock, 
  DollarSign, 
  FileText, 
  Code, 
  TrendingUp,
  Users,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InviteModal } from '@/features/invitation/ui/InviteModal';
import type { ExecutionPack, Idea } from '@/lib/types';

interface ExecutionPackViewProps {
  idea: Idea;
  isUnlocked: boolean;
  userId?: string;
}

export function ExecutionPackView({ idea, isUnlocked, userId }: ExecutionPackViewProps) {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const executionPack = idea.executionPack;
  
  if (!executionPack) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-12 text-center">
          <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">Execution Pack 준비 중</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Execution Pack
            </CardTitle>
            {isUnlocked ? (
              <Badge className="bg-green-500">
                <Unlock className="w-3 h-3 mr-1" />
                해제됨
              </Badge>
            ) : (
              <Badge className="bg-gray-600">
                <Lock className="w-3 h-3 mr-1" />
                잠김
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Pack Overview */}
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">{executionPack.title}</h3>
            <p className="text-gray-600">{executionPack.description}</p>
          </div>
          
          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <Clock className="w-5 h-5 mx-auto mb-1 text-blue-600" />
              <p className="text-xs text-gray-600">소요 시간</p>
              <p className="font-semibold">{executionPack.estimatedTime}</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <DollarSign className="w-5 h-5 mx-auto mb-1 text-green-600" />
              <p className="text-xs text-gray-600">예상 수익</p>
              <p className="font-semibold">{executionPack.expectedRevenue}</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <TrendingUp className="w-5 h-5 mx-auto mb-1 text-purple-600" />
              <p className="text-xs text-gray-600">난이도</p>
              <p className="font-semibold">
                {executionPack.difficulty === 'easy' ? '쉬움' : 
                 executionPack.difficulty === 'medium' ? '보통' : '어려움'}
              </p>
            </div>
          </div>
          
          {/* Live Execution Data */}
          {idea.executionMetrics && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                실시간 실행 현황
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">실행 중</span>
                  <span className="font-semibold">{idea.executionMetrics.activeExecutors}명</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">첫 매출</span>
                  <span className="font-semibold text-green-600">
                    {idea.executionMetrics.firstRevenueCount}명
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">평균 시간</span>
                  <span className="font-semibold">{idea.executionMetrics.avgExecutionHours}시간</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">성공률</span>
                  <span className="font-semibold">
                    {100 - idea.executionMetrics.failureRate}%
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {/* Content Preview or Lock */}
          {isUnlocked ? (
            <Tabs defaultValue="sourcing" className="w-full">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="sourcing">소싱</TabsTrigger>
                <TabsTrigger value="templates">템플릿</TabsTrigger>
                <TabsTrigger value="scripts">스크립트</TabsTrigger>
                <TabsTrigger value="tools">도구</TabsTrigger>
              </TabsList>
              
              <TabsContent value="sourcing" className="mt-4">
                <div className="space-y-3">
                  {executionPack.contents.sourcing?.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      <p className="text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="templates" className="mt-4">
                <div className="space-y-3">
                  {executionPack.contents.templates?.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <FileText className="w-4 h-4 text-blue-600 mt-0.5" />
                      <p className="text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="scripts" className="mt-4">
                <div className="space-y-3">
                  {executionPack.contents.scripts?.map((item, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                      <Code className="w-4 h-4 text-purple-600 mb-2" />
                      <p className="text-sm font-mono">{item}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="tools" className="mt-4">
                <div className="space-y-3">
                  {executionPack.contents.tools?.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5" />
                      <p className="text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <Lock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-4">
                Execution Pack을 보려면 친구를 초대하세요
              </p>
              <p className="text-sm text-gray-500 mb-6">
                친구가 가입하면 둘 다 무료로 이용 가능합니다
              </p>
              <Button 
                onClick={() => setShowInviteModal(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600"
              >
                친구 초대하기
              </Button>
            </div>
          )}
          
          {/* Budget & Timeline */}
          {isUnlocked && executionPack.contents.budget && (
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium mb-2">예산 계획</h4>
              <p className="text-sm text-gray-700">{executionPack.contents.budget}</p>
            </div>
          )}
          
          {isUnlocked && executionPack.contents.timeline && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium mb-2">실행 타임라인</h4>
              <p className="text-sm text-gray-700">{executionPack.contents.timeline}</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <InviteModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        ideaId={idea.id}
        ideaTitle={idea.title}
        userId={userId}
      />
    </>
  );
}