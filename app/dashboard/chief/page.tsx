'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Target,
  Users,
  FileText,
  Shield,
  RefreshCw,
  Lightbulb,
  Calendar,
  BarChart3,
  Zap,
  ArrowRight,
  Play
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DailyBriefing {
  date: string;
  sections: BriefingSection[];
  topPriorities: string[];
  keyInsights: ProactiveInsight[];
  scheduledActivities: ScheduledActivity[];
  followUps: FollowUp[];
  metrics: {
    goalsProgress: number;
    pipelineValue: number;
    regulatoryAlerts: number;
    contentGenerated: number;
  };
}

interface BriefingSection {
  title: string;
  priority: number;
  content: string;
  actionItems: string[];
  relatedData: any;
}

interface ProactiveInsight {
  id: string;
  type: 'opportunity' | 'risk' | 'suggestion' | 'reminder' | 'update';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionRequired: boolean;
  suggestedActions: string[];
  deadline?: string;
  acknowledged: boolean;
}

interface ScheduledActivity {
  time: string;
  activity: string;
  type: string;
  priority: string;
}

interface FollowUp {
  company: string;
  daysSince: number;
  nextAction: string;
  priority: string;
}

export default function ChiefOfStaffDashboard() {
  const [briefing, setBriefing] = useState<DailyBriefing | null>(null);
  const [insights, setInsights] = useState<ProactiveInsight[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchBriefing = async (force = false) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/chief-of-staff/briefing?type=daily&force=${force}`);
      const data = await response.json();
      
      if (data.success) {
        setBriefing(data.briefing);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch briefing:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInsights = async () => {
    try {
      const response = await fetch('/api/chief-of-staff/briefing?type=insights');
      const data = await response.json();
      
      if (data.success) {
        setInsights(data.insights);
      }
    } catch (error) {
      console.error('Failed to fetch insights:', error);
    }
  };

  const acknowledgeInsight = async (insightId: string) => {
    try {
      const response = await fetch('/api/chief-of-staff/briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'acknowledge_insight',
          data: { insightId }
        })
      });
      
      if (response.ok) {
        setInsights(prev => prev.filter(i => i.id !== insightId));
      }
    } catch (error) {
      console.error('Failed to acknowledge insight:', error);
    }
  };

  const executeWorkflow = async () => {
    try {
      const response = await fetch('/api/chief-of-staff/briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'execute_workflow' })
      });
      
      if (response.ok) {
        alert('Automated workflow executed successfully!');
        await fetchBriefing(true); // Refresh briefing
      }
    } catch (error) {
      console.error('Failed to execute workflow:', error);
    }
  };

  useEffect(() => {
    fetchBriefing();
    fetchInsights();
    
    // Auto-refresh every 30 minutes
    const interval = setInterval(() => {
      fetchBriefing();
      fetchInsights();
    }, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '좋은 아침입니다!';
    if (hour < 18) return '좋은 오후입니다!';
    return '좋은 저녁입니다!';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <TrendingUp className="h-4 w-4" />;
      case 'risk': return <AlertCircle className="h-4 w-4" />;
      case 'suggestion': return <Lightbulb className="h-4 w-4" />;
      case 'reminder': return <Clock className="h-4 w-4" />;
      case 'update': return <CheckCircle className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Brain className="h-8 w-8 text-blue-600" />
            Chief of Staff AI
          </h1>
          <p className="text-muted-foreground mt-1">
            {getGreeting()} 오늘의 인텔리전스 브리핑을 확인하세요.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={executeWorkflow} variant="outline" className="gap-2">
            <Play className="h-4 w-4" />
            Execute Workflow
          </Button>
          <Button onClick={() => fetchBriefing(true)} disabled={loading} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {lastUpdate && (
        <p className="text-sm text-muted-foreground mb-4">
          Last updated: {lastUpdate.toLocaleString()}
        </p>
      )}

      {/* Key Metrics */}
      {briefing && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Goals Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{briefing.metrics.goalsProgress}%</div>
              <div className="text-xs text-muted-foreground mt-1">Active goals</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pipeline Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(briefing.metrics.pipelineValue)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Total opportunity</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Regulatory Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {briefing.metrics.regulatoryAlerts}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Requiring attention</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Content Generated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {briefing.metrics.contentGenerated}
              </div>
              <div className="text-xs text-muted-foreground mt-1">This week</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Top Priorities */}
      {briefing && briefing.topPriorities.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Today's Top Priorities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {briefing.topPriorities.map((priority, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center font-bold">
                    {idx + 1}
                  </div>
                  <span>{priority}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="briefing" className="space-y-4">
        <TabsList>
          <TabsTrigger value="briefing">Daily Briefing</TabsTrigger>
          <TabsTrigger value="insights">
            Proactive Insights
            {insights.length > 0 && (
              <Badge variant="destructive" className="ml-2">{insights.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="schedule">Today's Schedule</TabsTrigger>
          <TabsTrigger value="followups">Follow-ups Required</TabsTrigger>
        </TabsList>

        <TabsContent value="briefing" className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin" />
            </div>
          ) : briefing ? (
            <div className="space-y-4">
              {briefing.sections.map((section, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {section.title === '규제 인텔리전스' && <Shield className="h-5 w-5" />}
                      {section.title === '비즈니스 개발' && <Users className="h-5 w-5" />}
                      {section.title === '콘텐츠 & 마케팅' && <FileText className="h-5 w-5" />}
                      {section.title === '목표 관리' && <Target className="h-5 w-5" />}
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="whitespace-pre-line text-sm mb-4">
                      {section.content}
                    </div>
                    
                    {section.actionItems.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Action Items:</h4>
                        <ul className="space-y-1">
                          {section.actionItems.map((item, itemIdx) => (
                            <li key={itemIdx} className="flex items-start gap-2 text-sm">
                              <ArrowRight className="h-3 w-3 mt-0.5 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No briefing available</p>
                <Button onClick={() => fetchBriefing(true)} className="mt-4">
                  Generate Briefing
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          {insights.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No new insights</p>
                <p className="text-sm text-muted-foreground">You're all caught up!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {insights.map(insight => (
                <Card key={insight.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {getInsightIcon(insight.type)}
                        <CardTitle className="text-lg">{insight.title}</CardTitle>
                      </div>
                      <Badge className={getPriorityColor(insight.priority)}>
                        {insight.priority}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {insight.description}
                    </p>
                    
                    {insight.suggestedActions.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Suggested Actions:</h4>
                        <ul className="space-y-1">
                          {insight.suggestedActions.map((action, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <ArrowRight className="h-3 w-3 mt-0.5 flex-shrink-0" />
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {insight.deadline && (
                      <div className="flex items-center gap-2 text-sm text-orange-600 mb-4">
                        <Clock className="h-4 w-4" />
                        <span>Deadline: {new Date(insight.deadline).toLocaleDateString()}</span>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => acknowledgeInsight(insight.id)}
                        variant="outline"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Acknowledge
                      </Button>
                      {insight.actionRequired && (
                        <Button size="sm">
                          Take Action
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          {briefing?.scheduledActivities && briefing.scheduledActivities.length > 0 ? (
            <div className="space-y-2">
              {briefing.scheduledActivities.map((activity, idx) => (
                <Card key={idx}>
                  <CardContent className="py-4">
                    <div className="flex items-center gap-4">
                      <div className="text-lg font-bold text-blue-600 min-w-[60px]">
                        {activity.time}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{activity.activity}</div>
                        <div className="text-sm text-muted-foreground capitalize">
                          {activity.type} • {activity.priority} priority
                        </div>
                      </div>
                      <Badge className={getPriorityColor(activity.priority)}>
                        {activity.priority}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No scheduled activities for today</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="followups" className="space-y-4">
          {briefing?.followUps && briefing.followUps.length > 0 ? (
            <div className="space-y-2">
              {briefing.followUps.map((followUp, idx) => (
                <Card key={idx}>
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{followUp.company}</div>
                        <div className="text-sm text-muted-foreground">
                          {followUp.daysSince} days since last contact • {followUp.nextAction}
                        </div>
                      </div>
                      <Badge className={getPriorityColor(followUp.priority)}>
                        {followUp.priority}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No follow-ups required</p>
                <p className="text-sm text-muted-foreground">Great job staying on top of everything!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}