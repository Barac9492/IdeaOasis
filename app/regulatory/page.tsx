'use client';
import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, TrendingUp, Calendar, Filter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
// import LiveRegulatoryMonitor from '@/components/LiveRegulatoryMonitor';
import AuthGuard from '@/components/AuthGuard';

export default function RegulatoryDashboardPage() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'critical' | 'high' | 'medium'>('all');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');

  const industries = [
    'all', '핀테크', '이커머스', '헬스테크', '에듀테크', 'AI/ML', '소셜커머스'
  ];

  const industryLabels: Record<string, string> = {
    'all': '전체',
    '핀테크': '핀테크',
    '이커머스': '이커머스',
    '헬스테크': '헬스테크',
    '에듀테크': '에듀테크',
    'AI/ML': 'AI/ML',
    '소셜커머스': '소셜커머스'
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                  <Shield className="w-8 h-8 text-blue-600" />
                  규제 인텔리전스 센터
                </h1>
                <p className="text-slate-600 mt-2">
                  실시간 한국 정부 규제 모니터링 및 비즈니스 영향 분석
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  리포트 다운로드
                </Button>
                <Button>
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  알림 설정
                </Button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <Card className="p-6 mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">심각도:</span>
                {(['all', 'critical', 'high', 'medium'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      activeFilter === filter
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {filter === 'all' ? '전체' :
                     filter === 'critical' ? '긴급' :
                     filter === 'high' ? '높음' : '보통'}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-700">업종:</span>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="px-3 py-1 rounded border border-slate-300 text-sm"
                >
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>
                      {industryLabels[industry]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Live Monitor */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <h3 className="font-semibold text-slate-900 mb-4">실시간 규제 모니터링</h3>
                <div className="text-center py-12 text-slate-500">
                  규제 모니터링 기능이 곧 추가됩니다
                </div>
              </Card>
            </div>

            {/* Right Column - Insights & Actions */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="p-6">
                <h3 className="font-semibold text-slate-900 mb-4">빠른 액세스</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="w-4 h-4 mr-2" />
                    규제 캘린더
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    영향도 분석
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="w-4 h-4 mr-2" />
                    컴플라이언스 체크
                  </Button>
                </div>
              </Card>

              {/* Industry Impact Summary */}
              <Card className="p-6">
                <h3 className="font-semibold text-slate-900 mb-4">업종별 영향도</h3>
                <div className="space-y-3">
                  {[
                    { industry: '핀테크', impact: 'high', count: 3, color: 'bg-red-500' },
                    { industry: '헬스테크', impact: 'high', count: 2, color: 'bg-red-500' },
                    { industry: '이커머스', impact: 'medium', count: 4, color: 'bg-orange-500' },
                    { industry: 'AI/ML', impact: 'medium', count: 1, color: 'bg-orange-500' },
                    { industry: '에듀테크', impact: 'low', count: 1, color: 'bg-green-500' }
                  ].map((item) => (
                    <div key={item.industry} className="flex items-center justify-between py-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                        <span className="text-sm font-medium">{item.industry}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600">{item.count}건</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          item.impact === 'high' ? 'bg-red-100 text-red-700' :
                          item.impact === 'medium' ? 'bg-orange-100 text-orange-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {item.impact === 'high' ? '높음' :
                           item.impact === 'medium' ? '보통' : '낮음'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Upcoming Deadlines */}
              <Card className="p-6">
                <h3 className="font-semibold text-slate-900 mb-4">다가오는 마감일</h3>
                <div className="space-y-3">
                  {[
                    { 
                      title: '개인정보 처리방침 업데이트',
                      deadline: '2024-09-14',
                      daysLeft: 33,
                      priority: 'high'
                    },
                    {
                      title: '전자상거래법 광고 규정 적용',
                      deadline: '2024-10-01', 
                      daysLeft: 50,
                      priority: 'medium'
                    },
                    {
                      title: 'AI 의료기기 가이드라인 적용',
                      deadline: '2024-11-01',
                      daysLeft: 81,
                      priority: 'medium'
                    }
                  ].map((deadline, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="text-sm font-medium text-slate-900">{deadline.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded ${
                          deadline.priority === 'high' ? 'bg-red-100 text-red-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {deadline.daysLeft}일
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        마감일: {new Date(deadline.deadline).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}