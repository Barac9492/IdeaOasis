'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileText, 
  Send, 
  Eye, 
  Calendar, 
  Users, 
  TrendingUp, 
  Shield,
  Sparkles,
  MessageSquare,
  Download,
  RefreshCw
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Newsletter {
  id: string;
  issueNumber: number;
  subject: string;
  preheader: string;
  status: 'draft' | 'scheduled' | 'sent';
  createdAt: string;
  publishedAt?: string;
  metrics?: {
    estimatedReadTime: number;
    keyTopics: string[];
    expertQuotes: number;
    regulatoryUpdates: number;
  };
}

export default function ContentDashboard() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedType, setSelectedType] = useState('newsletter');
  const [targetAudience, setTargetAudience] = useState(['startup_founders']);
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const fetchNewsletters = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/newsletter/store');
      const data = await response.json();
      if (data.success) {
        setNewsletters(data.newsletters || []);
      }
    } catch (error) {
      console.error('Failed to fetch newsletters:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsletters();
  }, []);

  const generateContent = async () => {
    setGenerating(true);
    try {
      const payload: any = {
        type: selectedType,
        targetAudience,
        includeExpertContent: true,
        urgentOnly: false
      };

      if (customPrompt) {
        payload.customPrompt = customPrompt;
      }

      const response = await fetch('/api/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (data.success) {
        if (selectedType === 'newsletter') {
          setGeneratedContent(JSON.stringify(data.newsletter, null, 2));
          await fetchNewsletters(); // Refresh list
        } else {
          setGeneratedContent(data.content || data.summary || JSON.stringify(data, null, 2));
        }
      }
    } catch (error) {
      console.error('Content generation failed:', error);
    } finally {
      setGenerating(false);
    }
  };

  const previewNewsletter = async () => {
    const url = '/api/newsletter/send?preview=true';
    setPreviewUrl(url);
    window.open(url, '_blank');
  };

  const sendTestNewsletter = async () => {
    if (!confirm('Send test newsletter to configured email?')) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET || 'test'}`
        }
      });

      const data = await response.json();
      if (data.success) {
        alert('Test newsletter sent successfully!');
        await fetchNewsletters();
      } else {
        alert(`Failed to send: ${data.error}`);
      }
    } catch (error) {
      console.error('Send failed:', error);
      alert('Send failed. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Content Creation Agent</h1>
          <p className="text-muted-foreground mt-1">
            AI-powered content generation for newsletters, summaries, and social media
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={previewNewsletter} variant="outline" className="gap-2">
            <Eye className="h-4 w-4" />
            Preview Newsletter
          </Button>
          <Button onClick={sendTestNewsletter} className="gap-2">
            <Send className="h-4 w-4" />
            Send Test
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Newsletters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newsletters.length}</div>
            <div className="text-xs text-muted-foreground mt-1">All time</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {newsletters.filter(n => {
                const date = new Date(n.createdAt);
                const now = new Date();
                return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
              }).length}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Newsletters sent</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Read Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {Math.round(newsletters.reduce((sum, n) => sum + (n.metrics?.estimatedReadTime || 0), 0) / Math.max(newsletters.length, 1))}m
            </div>
            <div className="text-xs text-muted-foreground mt-1">Minutes</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Next Scheduled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              <Calendar className="h-6 w-6" />
            </div>
            <div className="text-xs text-muted-foreground mt-1">Tue/Fri 9AM</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="generate" className="space-y-4">
        <TabsList>
          <TabsTrigger value="generate">Generate Content</TabsTrigger>
          <TabsTrigger value="newsletters">Newsletter History</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Content Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Content Type</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newsletter">📧 Newsletter</SelectItem>
                      <SelectItem value="regulatory_summary">📋 Regulatory Summary</SelectItem>
                      <SelectItem value="social_posts">📱 Social Media Posts</SelectItem>
                      <SelectItem value="expert_content">🎙️ Expert Content</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Target Audience</label>
                  <Select 
                    value={targetAudience[0]} 
                    onValueChange={(value) => setTargetAudience([value])}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="startup_founders">🚀 Startup Founders</SelectItem>
                      <SelectItem value="enterprise_executives">🏢 Enterprise Executives</SelectItem>
                      <SelectItem value="investors">💰 Investors</SelectItem>
                      <SelectItem value="consultants">📊 Consultants</SelectItem>
                      <SelectItem value="all">👥 All Audiences</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedType === 'expert_content' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Custom Prompt</label>
                  <Textarea
                    placeholder="Enter your custom prompt for expert content generation..."
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              )}

              <Button 
                onClick={generateContent} 
                disabled={generating}
                className="w-full gap-2"
              >
                {generating ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {generating ? 'Generating...' : 'Generate Content'}
              </Button>

              {generatedContent && (
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">Generated Content</label>
                  <Textarea
                    value={generatedContent}
                    readOnly
                    className="min-h-[300px] font-mono text-sm"
                  />
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="newsletters" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Newsletter History</h3>
            <Button onClick={fetchNewsletters} variant="outline" size="sm" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin" />
            </div>
          ) : newsletters.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No newsletters found</p>
                <Button onClick={generateContent} className="mt-4">
                  Generate First Newsletter
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {newsletters.map(newsletter => (
                <Card key={newsletter.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          Newsletter #{newsletter.issueNumber}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {newsletter.subject}
                        </p>
                      </div>
                      <Badge className={getStatusColor(newsletter.status)}>
                        {newsletter.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(newsletter.createdAt).toLocaleDateString()}
                      </span>
                      {newsletter.metrics?.estimatedReadTime && (
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {newsletter.metrics.estimatedReadTime}분 읽기
                        </span>
                      )}
                      {newsletter.metrics?.regulatoryUpdates && (
                        <span className="flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          {newsletter.metrics.regulatoryUpdates}개 규제 업데이트
                        </span>
                      )}
                    </div>
                    
                    {newsletter.metrics?.keyTopics && (
                      <div className="flex gap-1 mt-3 flex-wrap">
                        {newsletter.metrics.keyTopics.map(topic => (
                          <Badge key={topic} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <h3 className="text-lg font-semibold">Content Templates</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Regulatory Alert
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  템플릿으로 긴급 규제 변경사항을 빠르게 전달합니다.
                </p>
                <div className="flex gap-2 mt-3">
                  <Badge variant="secondary">Ministry</Badge>
                  <Badge variant="secondary">Impact Level</Badge>
                  <Badge variant="secondary">Action Items</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Trend Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  시장 트렌드와 성장 기회를 데이터와 함께 분석합니다.
                </p>
                <div className="flex gap-2 mt-3">
                  <Badge variant="secondary">Growth Rate</Badge>
                  <Badge variant="secondary">Market Data</Badge>
                  <Badge variant="secondary">Applications</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Idea Spotlight
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  주요 비즈니스 아이디어를 Korea Fit 점수와 함께 조명합니다.
                </p>
                <div className="flex gap-2 mt-3">
                  <Badge variant="secondary">Korea Fit</Badge>
                  <Badge variant="secondary">Revenue</Badge>
                  <Badge variant="secondary">Strategy</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Expert Interview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  업계 전문가의 인사이트를 Q&A 형식으로 정리합니다.
                </p>
                <div className="flex gap-2 mt-3">
                  <Badge variant="secondary">Expert Profile</Badge>
                  <Badge variant="secondary">Key Insights</Badge>
                  <Badge variant="secondary">Contact Info</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}