'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Brain, 
  FileText, 
  Users, 
  Shield, 
  Code, 
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp
} from 'lucide-react';

interface AgentStatus {
  name: string;
  status: 'active' | 'generating' | 'monitoring' | 'idle';
  lastActivity: string;
  tasksCompleted: number;
  description: string;
  icon: any;
  color: string;
}

interface SystemMetrics {
  totalAgents: number;
  activeAgents: number;
  codeGenerated: number;
  contentGenerated: number;
  regulatoryAlerts: number;
  pipelineValue: number;
}

export default function AiAgentSystemDemo() {
  const [agents, setAgents] = useState<AgentStatus[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [briefing, setBriefing] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const agentData: AgentStatus[] = [
    {
      name: '규제 인텔리전스 에이전트',
      status: 'monitoring',
      lastActivity: '3분 전 - 한국 정부 웹사이트 모니터링',
      tasksCompleted: 247,
      description: '한국 정부 규제 변화를 실시간 모니터링하고 비즈니스 영향 분석',
      icon: Shield,
      color: 'bg-blue-500'
    },
    {
      name: '콘텐츠 생성 에이전트',
      status: 'active',
      lastActivity: '15분 전 - 주간 뉴스레터 생성 완료',
      tasksCompleted: 89,
      description: '규제 동향 기반 자동 뉴스레터 및 마케팅 콘텐츠 생성',
      icon: FileText,
      color: 'bg-green-500'
    },
    {
      name: '비즈니스 개발 에이전트',
      status: 'active',
      lastActivity: '8분 전 - 잠재 고객 아웃리치 생성',
      tasksCompleted: 156,
      description: '규제 변화 기반 영업 기회 발굴 및 맞춤형 제안서 자동 생성',
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      name: '전문가 네트워크 에이전트',
      status: 'idle',
      lastActivity: '1시간 전 - 전문가 매칭 완료',
      tasksCompleted: 73,
      description: '50+ 한국 비즈니스 전문가와 클라이언트 매칭 자동화',
      icon: Brain,
      color: 'bg-orange-500'
    },
    {
      name: '플랫폼 개발 에이전트',
      status: 'generating',
      lastActivity: '방금 - 대시보드 컴포넌트 생성',
      tasksCompleted: 42,
      description: 'Claude Code를 사용한 자율적 코드 생성 및 인프라 관리',
      icon: Code,
      color: 'bg-red-500'
    }
  ];

  const fetchSystemStatus = async () => {
    setLoading(true);
    try {
      // Fetch briefing from Chief of Staff
      const briefingRes = await fetch('/api/chief-of-staff/briefing');
      if (briefingRes.ok) {
        const briefingData = await briefingRes.json();
        setBriefing(briefingData.briefing);
      }

      // Fetch business analytics
      const analyticsRes = await fetch('/api/business/analytics');
      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        
        setMetrics({
          totalAgents: 5,
          activeAgents: 4,
          codeGenerated: 42,
          contentGenerated: 89,
          regulatoryAlerts: 8,
          pipelineValue: analyticsData.analytics?.totalPipelineValue || 0
        });
      }

      setAgents(agentData);
    } catch (error) {
      console.error('Failed to fetch system status:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateCode = async () => {
    try {
      const response = await fetch('/api/platform/develop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_dashboard',
          specification: {
            title: 'Korea Business Intelligence Dashboard',
            description: 'Real-time regulatory intelligence and expert network analytics',
            features: ['Regulatory alerts', 'Expert matching', 'Pipeline analytics'],
            apiEndpoint: '/api/intelligence/dashboard'
          }
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Generated code:', result);
        // Update agent status
        setAgents(prev => prev.map(agent => 
          agent.name === '플랫폼 개발 에이전트' 
            ? { ...agent, lastActivity: '방금 - 새 대시보드 생성 완료', tasksCompleted: agent.tasksCompleted + 1 }
            : agent
        ));
      }
    } catch (error) {
      console.error('Failed to generate code:', error);
    }
  };

  useEffect(() => {
    fetchSystemStatus();
    // Refresh every 30 seconds
    const interval = setInterval(fetchSystemStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'generating': return 'bg-blue-100 text-blue-800';
      case 'monitoring': return 'bg-yellow-100 text-yellow-800';
      case 'idle': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Activity className="h-4 w-4" />;
      case 'generating': return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'monitoring': return <AlertCircle className="h-4 w-4" />;
      case 'idle': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">🤖 AI Agent System</h1>
        <p className="text-gray-600">
          IdeaOasis의 지능형 Chief of Staff AI 시스템 - 한국 규제 인텔리전스 & 전문가 네트워크 플랫폼
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <Button onClick={fetchSystemStatus} disabled={loading} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            상태 새로고침
          </Button>
          <Button onClick={generateCode} variant="outline" className="gap-2">
            <Code className="h-4 w-4" />
            실시간 코드 생성 데모
          </Button>
        </div>
      </div>

      {/* System Metrics */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{metrics.totalAgents}</div>
              <div className="text-sm text-gray-600">총 에이전트</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{metrics.activeAgents}</div>
              <div className="text-sm text-gray-600">활성 에이전트</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{metrics.codeGenerated}</div>
              <div className="text-sm text-gray-600">생성된 코드</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{metrics.contentGenerated}</div>
              <div className="text-sm text-gray-600">생성된 콘텐츠</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{metrics.regulatoryAlerts}</div>
              <div className="text-sm text-gray-600">규제 알림</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-lg font-bold text-indigo-600">
                {new Intl.NumberFormat('ko-KR', { 
                  style: 'currency', 
                  currency: 'KRW',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0 
                }).format(metrics.pipelineValue)}
              </div>
              <div className="text-sm text-gray-600">파이프라인</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Agent Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent, index) => {
          const IconComponent = agent.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${agent.color}`}>
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                  </div>
                  <Badge className={getStatusColor(agent.status)}>
                    {getStatusIcon(agent.status)}
                    <span className="ml-1 capitalize">{agent.status}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">{agent.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{agent.lastActivity}</span>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="font-medium">{agent.tasksCompleted}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Chief of Staff Briefing */}
      {briefing && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Chief of Staff 일일 브리핑
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-700">📊 핵심 지표</h4>
                <div className="space-y-1 text-sm">
                  <div>목표 진행률: {briefing.metrics?.goalsProgress || 0}%</div>
                  <div>파이프라인: {new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(briefing.metrics?.pipelineValue || 0)}</div>
                  <div>규제 알림: {briefing.metrics?.regulatoryAlerts || 0}건</div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-700">⚡ 오늘의 우선순위</h4>
                <div className="space-y-1 text-sm">
                  {briefing.topPriorities?.slice(0, 3).map((priority: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2">
                      <TrendingUp className="h-3 w-3 mt-1 text-blue-500 flex-shrink-0" />
                      <span>{priority}</span>
                    </div>
                  )) || <div>우선순위 없음</div>}
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-700">📅 예정된 활동</h4>
                <div className="space-y-1 text-sm">
                  {briefing.scheduledActivities?.slice(0, 3).map((activity: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-gray-500" />
                      <span>{activity.time} - {activity.activity}</span>
                    </div>
                  )) || <div>예정된 활동 없음</div>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 pt-6">
        <p>🚀 IdeaOasis AI Agent System - 한국의 첫 번째 규제 인텔리전스 & 전문가 네트워크 플랫폼</p>
        <p>실시간 규제 모니터링 • 자동 콘텐츠 생성 • 지능형 영업 지원 • 코드 자동 생성</p>
      </div>
    </div>
  );
}