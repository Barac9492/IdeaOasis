'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle, TrendingUp, Building2, Calendar, ChevronRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface RegulatoryUpdate {
  id: string;
  title: string;
  summary: string;
  ministry: string;
  publishedDate: string;
  businessImpact: 'high' | 'medium' | 'low';
  industries: string[];
  category: string;
  affectedBusinessTypes: string[];
  actionItems: string[];
  sourceUrl: string;
}

export default function RegulatoryDashboard() {
  const [updates, setUpdates] = useState<RegulatoryUpdate[]>([]);
  const [stats, setStats] = useState({
    totalChecked: 0,
    newUpdates: 0,
    highImpact: 0,
    affectedIdeas: 0
  });
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');

  const fetchRegulatoryData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/regulatory/monitor');
      const data = await response.json();
      
      if (data.success) {
        setUpdates(data.updates || []);
        setStats(data.stats || stats);
        setAlerts(data.alerts || []);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch regulatory data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegulatoryData();
    const interval = setInterval(fetchRegulatoryData, 60000 * 30); // Refresh every 30 minutes
    return () => clearInterval(interval);
  }, []);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'law': return '⚖️';
      case 'decree': return '📜';
      case 'regulation': return '📋';
      case 'guideline': return '📝';
      case 'announcement': return '📢';
      default: return '📄';
    }
  };

  const industries = ['all', ...new Set(updates.flatMap(u => u.industries))];
  const filteredUpdates = selectedIndustry === 'all' 
    ? updates 
    : updates.filter(u => u.industries.includes(selectedIndustry));

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Regulatory Intelligence Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Real-time Korean government regulatory monitoring
          </p>
        </div>
        <Button 
          onClick={fetchRegulatoryData} 
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {lastUpdated && (
        <p className="text-sm text-muted-foreground mb-4">
          Last updated: {lastUpdated.toLocaleString()}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sources Monitored
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalChecked}</div>
            <div className="text-xs text-muted-foreground mt-1">Government websites</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              New Updates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.newUpdates}</div>
            <div className="text-xs text-muted-foreground mt-1">Since last check</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              High Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.highImpact}</div>
            <div className="text-xs text-muted-foreground mt-1">Require immediate attention</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Affected Ideas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.affectedIdeas}</div>
            <div className="text-xs text-muted-foreground mt-1">Need review</div>
          </CardContent>
        </Card>
      </div>

      {alerts.length > 0 && (
        <div className="mb-6 space-y-2">
          {alerts.map((alert, idx) => (
            <Alert key={idx} className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-sm whitespace-pre-line">
                {alert}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      <div className="mb-4 flex gap-2 flex-wrap">
        {industries.map(industry => (
          <Button
            key={industry}
            variant={selectedIndustry === industry ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedIndustry(industry)}
            className="capitalize"
          >
            {industry === 'all' ? 'All Industries' : industry}
          </Button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredUpdates.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">No regulatory updates found</p>
              <Button 
                onClick={fetchRegulatoryData} 
                variant="outline" 
                className="mt-4"
              >
                Check for Updates
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredUpdates.map(update => (
            <Card key={update.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{getCategoryIcon(update.category)}</span>
                      <Badge className={`${getImpactColor(update.businessImpact)} text-white`}>
                        {update.businessImpact.toUpperCase()} IMPACT
                      </Badge>
                      <Badge variant="outline">{update.category}</Badge>
                    </div>
                    <CardTitle className="text-lg">{update.title}</CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {update.ministry}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(update.publishedDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{update.summary}</p>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium">Industries:</span>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {update.industries.map(industry => (
                        <Badge key={industry} variant="secondary" className="text-xs">
                          {industry}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-sm font-medium">Affected Businesses:</span>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {update.affectedBusinessTypes.map(type => (
                        <Badge key={type} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {update.actionItems.length > 0 && (
                    <div>
                      <span className="text-sm font-medium">Required Actions:</span>
                      <ul className="mt-1 space-y-1">
                        {update.actionItems.map((action, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-1">
                            <ChevronRight className="h-3 w-3 mt-0.5 flex-shrink-0" />
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t">
                  <a 
                    href={update.sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View Official Source →
                  </a>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}