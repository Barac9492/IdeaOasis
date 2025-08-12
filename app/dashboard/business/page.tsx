'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Mail,
  Phone,
  Building2,
  Target,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  Plus,
  Eye,
  Send,
  FileText,
  BarChart3
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Prospect {
  id: string;
  company: string;
  industry: string;
  size: string;
  status: string;
  estimatedValue: number;
  probability: number;
  nextAction: string;
  nextActionDate: string;
  contacts: any[];
  painPoints: string[];
  interactions: any[];
  regulatoryProfile: {
    complianceRisk: string;
    relevantRegulations: string[];
  };
}

interface Analytics {
  totalProspects: number;
  totalPipelineValue: number;
  avgDealSize: number;
  statusDistribution: Record<string, number>;
  topProspects: any[];
}

export default function BusinessDashboard() {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [generatedContent, setGeneratedContent] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterIndustry, setFilterIndustry] = useState('all');

  const fetchProspects = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (filterIndustry !== 'all') params.append('industry', filterIndustry);
      
      const response = await fetch(`/api/business/prospects?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setProspects(data.prospects);
      }
    } catch (error) {
      console.error('Failed to fetch prospects:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/business/analytics');
      const data = await response.json();
      
      if (data.success) {
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  const identifyProspectsFromRegulatory = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/business/prospects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'identify_from_regulatory' })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert(`Successfully identified ${data.prospects.length} new prospects from ${data.triggerUpdates} regulatory updates!`);
        await fetchProspects();
        await fetchAnalytics();
      }
    } catch (error) {
      console.error('Failed to identify prospects:', error);
      alert('Failed to identify prospects. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const generateOutreach = async (prospectId: string, templateName: string) => {
    try {
      const response = await fetch('/api/business/outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_outreach',
          prospectId,
          templateName
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setGeneratedContent(data.content);
      }
    } catch (error) {
      console.error('Failed to generate outreach:', error);
    }
  };

  useEffect(() => {
    fetchProspects();
    fetchAnalytics();
  }, [filterStatus, filterIndustry]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'cold': 'bg-gray-100 text-gray-800',
      'contacted': 'bg-blue-100 text-blue-800',
      'interested': 'bg-yellow-100 text-yellow-800',
      'meeting': 'bg-purple-100 text-purple-800',
      'proposal': 'bg-orange-100 text-orange-800',
      'negotiation': 'bg-pink-100 text-pink-800',
      'closed_won': 'bg-green-100 text-green-800',
      'closed_lost': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Business Development Agent</h1>
          <p className="text-muted-foreground mt-1">
            AI-powered prospect identification and sales automation
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={identifyProspectsFromRegulatory} disabled={loading} className="gap-2">
            <Target className="h-4 w-4" />
            Find Regulatory Prospects
          </Button>
          <Button onClick={fetchProspects} variant="outline" className="gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Prospects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalProspects}</div>
              <div className="text-xs text-muted-foreground mt-1">Active pipeline</div>
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
                {formatCurrency(analytics.totalPipelineValue)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Weighted by probability</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Deal Size
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(analytics.avgDealSize)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Per prospect</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Conversion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">23.4%</div>
              <div className="text-xs text-muted-foreground mt-1">Regulatory leads</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="prospects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="prospects">Prospects</TabsTrigger>
          <TabsTrigger value="outreach">Outreach</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="prospects" className="space-y-4">
          <div className="flex gap-4 items-center">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="cold">Cold</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="interested">Interested</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="proposal">Proposal</SelectItem>
                <SelectItem value="negotiation">Negotiation</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterIndustry} onValueChange={setFilterIndustry}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                <SelectItem value="fintech">Fintech</SelectItem>
                <SelectItem value="venture_capital">Venture Capital</SelectItem>
                <SelectItem value="cloud_services">Cloud Services</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Prospect
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin" />
            </div>
          ) : prospects.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No prospects found</p>
                <Button onClick={identifyProspectsFromRegulatory} className="gap-2">
                  <Target className="h-4 w-4" />
                  Identify Prospects from Regulatory Updates
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {prospects.map(prospect => (
                <Card key={prospect.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{prospect.company}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {prospect.industry} • {prospect.size}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(prospect.status)}>
                          {prospect.status}
                        </Badge>
                        <Badge variant="outline">
                          {prospect.probability}% prob
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <span className="text-sm font-medium">Estimated Value</span>
                        <p className="text-lg font-bold text-green-600">
                          {formatCurrency(prospect.estimatedValue)}
                        </p>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium">Next Action</span>
                        <p className="text-sm">{prospect.nextAction}</p>
                        <p className="text-xs text-muted-foreground">
                          Due: {new Date(prospect.nextActionDate).toLocaleDateString()}
                        </p>
                      </div>

                      <div>
                        <span className="text-sm font-medium">Compliance Risk</span>
                        <Badge 
                          variant="outline" 
                          className={prospect.regulatoryProfile.complianceRisk === 'high' ? 'text-red-600' : 
                                    prospect.regulatoryProfile.complianceRisk === 'medium' ? 'text-yellow-600' : 
                                    'text-green-600'}
                        >
                          {prospect.regulatoryProfile.complianceRisk}
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-4">
                      <span className="text-sm font-medium">Pain Points:</span>
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {prospect.painPoints.map((pain, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {pain}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="gap-2"
                        onClick={() => generateOutreach(prospect.id, 'Regulatory Alert Cold Email')}
                      >
                        <Mail className="h-4 w-4" />
                        Generate Email
                      </Button>
                      <Button size="sm" variant="outline" className="gap-2">
                        <Calendar className="h-4 w-4" />
                        Schedule Call
                      </Button>
                      <Button size="sm" variant="outline" className="gap-2">
                        <FileText className="h-4 w-4" />
                        Create Proposal
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="gap-2"
                        onClick={() => setSelectedProspect(prospect)}
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="outreach" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Generate Outreach Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Select Prospect</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a prospect" />
                    </SelectTrigger>
                    <SelectContent>
                      {prospects.map(prospect => (
                        <SelectItem key={prospect.id} value={prospect.id}>
                          {prospect.company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Template</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Regulatory Alert Cold Email">📧 Regulatory Alert</SelectItem>
                      <SelectItem value="Follow-up After Regulatory Brief">↩️ Follow-up</SelectItem>
                      <SelectItem value="Meeting Request">📅 Meeting Request</SelectItem>
                      <SelectItem value="Enterprise Proposal">📋 Proposal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full gap-2">
                  <Send className="h-4 w-4" />
                  Generate Outreach
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Generated Content</CardTitle>
              </CardHeader>
              <CardContent>
                {generatedContent ? (
                  <Textarea
                    value={generatedContent}
                    readOnly
                    className="min-h-[300px] font-mono text-sm"
                  />
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Mail className="h-12 w-12 mx-auto mb-4" />
                    <p>Select a prospect and template to generate outreach content</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {analytics && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Pipeline Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(analytics.statusDistribution).map(([status, count]) => (
                      <div key={status} className="flex justify-between items-center">
                        <span className="capitalize">{status.replace('_', ' ')}</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Top Prospects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.topProspects.map((prospect, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">{prospect.company}</span>
                          <p className="text-xs text-muted-foreground">{prospect.status}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-green-600">
                            {formatCurrency(prospect.estimatedValue)}
                          </span>
                          <p className="text-xs text-muted-foreground">{prospect.probability}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Regulatory Alert Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  규제 변경사항을 활용한 첫 연락 템플릿
                </p>
                <div className="flex gap-2 mb-3">
                  <Badge variant="secondary">Response Rate: 8-12%</Badge>
                  <Badge variant="secondary">Enterprise Focus</Badge>
                </div>
                <Button variant="outline" size="sm">Preview Template</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" />
                  Follow-up Template
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  규제 브리핑 후 후속 연락 템플릿
                </p>
                <div className="flex gap-2 mb-3">
                  <Badge variant="secondary">Response Rate: 25-35%</Badge>
                  <Badge variant="secondary">All Sizes</Badge>
                </div>
                <Button variant="outline" size="sm">Preview Template</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Meeting Request
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  긴급 규제 이슈 관련 미팅 요청 템플릿
                </p>
                <div className="flex gap-2 mb-3">
                  <Badge variant="secondary">Response Rate: 15-25%</Badge>
                  <Badge variant="secondary">Urgent Issues</Badge>
                </div>
                <Button variant="outline" size="sm">Preview Template</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Enterprise Proposal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  맞춤형 엔터프라이즈 제안서 템플릿
                </p>
                <div className="flex gap-2 mb-3">
                  <Badge variant="secondary">Response Rate: 45-60%</Badge>
                  <Badge variant="secondary">Large Deals</Badge>
                </div>
                <Button variant="outline" size="sm">Preview Template</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {selectedProspect && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">{selectedProspect.company}</h3>
              <Button variant="outline" size="sm" onClick={() => setSelectedProspect(null)}>
                ✕
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Contact Information</h4>
                {selectedProspect.contacts.map((contact, idx) => (
                  <div key={idx} className="text-sm mt-2">
                    <p><strong>{contact.name}</strong> - {contact.title}</p>
                    <p>{contact.email}</p>
                  </div>
                ))}
              </div>
              
              <div>
                <h4 className="font-medium">Recent Interactions</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedProspect.interactions.length} total interactions
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">Regulatory Profile</h4>
                <p className="text-sm">
                  Compliance Risk: <Badge variant="outline">
                    {selectedProspect.regulatoryProfile.complianceRisk}
                  </Badge>
                </p>
                <p className="text-sm mt-1">
                  Relevant Regulations: {selectedProspect.regulatoryProfile.relevantRegulations.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}