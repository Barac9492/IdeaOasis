'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Code, 
  Zap, 
  Cpu, 
  Database,
  Bot,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  Plus,
  Terminal,
  Layers,
  Rocket,
  Settings,
  Activity
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DevelopmentTask {
  id: string;
  title: string;
  type: string;
  status: string;
  priority: string;
  estimatedHours: number;
  actualHours?: number;
  createdAt: string;
  completedAt?: string;
  generatedFiles: number;
  testResults: number;
  errors: number;
}

interface AutomationScript {
  id: string;
  name: string;
  description: string;
  status: string;
  trigger: string;
  schedule?: string;
  lastRun?: string;
  logs: any[];
}

interface SystemStatus {
  tasks: {
    total: number;
    queued: number;
    inProgress: number;
    testing: number;
    deployed: number;
    failed: number;
  };
  automation: {
    total: number;
    active: number;
    failed: number;
  };
  performance: {
    averageTaskTime: number;
    successRate: number;
  };
  isProcessing: boolean;
}

export default function PlatformDashboard() {
  const [tasks, setTasks] = useState<DevelopmentTask[]>([]);
  const [scripts, setScripts] = useState<AutomationScript[]>([]);
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [newTaskSpec, setNewTaskSpec] = useState({
    type: 'dashboard',
    name: '',
    description: '',
    endpoint: '',
    method: 'GET'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tasksRes, scriptsRes, statusRes] = await Promise.all([
        fetch('/api/platform/develop?type=tasks'),
        fetch('/api/platform/develop?type=automation'),
        fetch('/api/platform/develop?type=status')
      ]);

      const [tasksData, scriptsData, statusData] = await Promise.all([
        tasksRes.json(),
        scriptsRes.json(),
        statusRes.json()
      ]);

      if (tasksData.success) setTasks(tasksData.tasks);
      if (scriptsData.success) setScripts(scriptsData.scripts);
      if (statusData.success) setStatus(statusData.status);
    } catch (error) {
      console.error('Failed to fetch platform data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDashboard = async () => {
    if (!newTaskSpec.name || !newTaskSpec.description) {
      alert('Please fill in name and description');
      return;
    }

    try {
      const response = await fetch('/api/platform/develop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_dashboard',
          specification: {
            name: newTaskSpec.name,
            description: newTaskSpec.description,
            dataSource: 'api',
            chartTypes: ['line', 'bar'],
            filters: ['date', 'category'],
            realTime: false
          }
        })
      });

      const data = await response.json();
      if (data.success) {
        alert(`Dashboard "${newTaskSpec.name}" generation started!`);
        setNewTaskSpec({ ...newTaskSpec, name: '', description: '' });
        fetchData();
      }
    } catch (error) {
      console.error('Failed to create dashboard:', error);
      alert('Failed to create dashboard. Check console for details.');
    }
  };

  const createAPI = async () => {
    if (!newTaskSpec.endpoint || !newTaskSpec.description) {
      alert('Please fill in endpoint and description');
      return;
    }

    try {
      const response = await fetch('/api/platform/develop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_api',
          specification: {
            endpoint: newTaskSpec.endpoint,
            method: newTaskSpec.method,
            description: newTaskSpec.description,
            parameters: [],
            authentication: false
          }
        })
      });

      const data = await response.json();
      if (data.success) {
        alert(`API endpoint "${newTaskSpec.endpoint}" generation started!`);
        setNewTaskSpec({ ...newTaskSpec, endpoint: '', description: '' });
        fetchData();
      }
    } catch (error) {
      console.error('Failed to create API:', error);
      alert('Failed to create API. Check console for details.');
    }
  };

  const runAutomation = async (scriptId: string) => {
    try {
      const response = await fetch('/api/platform/develop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'run_automation',
          specification: { scriptId }
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('Automation script executed successfully!');
        fetchData();
      }
    } catch (error) {
      console.error('Failed to run automation:', error);
      alert('Failed to run automation. Check console for details.');
    }
  };

  const deployTask = async (taskId: string) => {
    try {
      const response = await fetch('/api/platform/develop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'deploy_task',
          specification: { taskId }
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('Task deployed successfully!');
        fetchData();
      }
    } catch (error) {
      console.error('Failed to deploy task:', error);
      alert('Failed to deploy task. Check console for details.');
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed': return 'bg-green-100 text-green-800';
      case 'testing': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'queued': return 'bg-gray-100 text-gray-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'dashboard': return <Layers className="h-4 w-4" />;
      case 'api': return <Database className="h-4 w-4" />;
      case 'component': return <Code className="h-4 w-4" />;
      case 'automation': return <Bot className="h-4 w-4" />;
      default: return <Terminal className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Rocket className="h-8 w-8 text-purple-600" />
            Platform Development Agent
          </h1>
          <p className="text-muted-foreground mt-1">
            Autonomous code generation and infrastructure management
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchData} disabled={loading} variant="outline" className="gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {status?.isProcessing && (
            <Badge variant="destructive" className="gap-1">
              <Activity className="h-3 w-3" />
              Processing
            </Badge>
          )}
        </div>
      </div>

      {/* System Status */}
      {status && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{status.tasks.total}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {status.tasks.deployed} deployed • {status.tasks.failed} failed
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {Math.round(status.performance.successRate)}%
              </div>
              <div className="text-xs text-muted-foreground mt-1">Development tasks</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Task Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(status.performance.averageTaskTime * 10) / 10}h
              </div>
              <div className="text-xs text-muted-foreground mt-1">Per task</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Automation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {status.automation.active}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {status.automation.total} total scripts
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="create" className="space-y-4">
        <TabsList>
          <TabsTrigger value="create">Create Features</TabsTrigger>
          <TabsTrigger value="tasks">Development Tasks</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dashboard Creator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Generate Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Dashboard Name</label>
                  <Input
                    placeholder="e.g., Revenue Analytics Dashboard"
                    value={newTaskSpec.name}
                    onChange={(e) => setNewTaskSpec({...newTaskSpec, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    placeholder="Describe what this dashboard should show and its purpose"
                    value={newTaskSpec.description}
                    onChange={(e) => setNewTaskSpec({...newTaskSpec, description: e.target.value})}
                    className="min-h-[100px]"
                  />
                </div>
                
                <Button onClick={createDashboard} className="w-full gap-2">
                  <Code className="h-4 w-4" />
                  Generate Dashboard Component
                </Button>
              </CardContent>
            </Card>

            {/* API Creator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Generate API Endpoint
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium mb-2">Method</label>
                    <Select value={newTaskSpec.method} onValueChange={(value) => setNewTaskSpec({...newTaskSpec, method: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GET">GET</SelectItem>
                        <SelectItem value="POST">POST</SelectItem>
                        <SelectItem value="PUT">PUT</SelectItem>
                        <SelectItem value="DELETE">DELETE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Endpoint</label>
                    <Input
                      placeholder="/api/your-endpoint"
                      value={newTaskSpec.endpoint}
                      onChange={(e) => setNewTaskSpec({...newTaskSpec, endpoint: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    placeholder="Describe what this API endpoint should do"
                    value={newTaskSpec.description}
                    onChange={(e) => setNewTaskSpec({...newTaskSpec, description: e.target.value})}
                    className="min-h-[100px]"
                  />
                </div>
                
                <Button onClick={createAPI} className="w-full gap-2">
                  <Database className="h-4 w-4" />
                  Generate API Endpoint
                </Button>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <Zap className="h-4 w-4" />
            <AlertDescription>
              The Platform Development Agent automatically generates production-ready code with proper TypeScript types, 
              error handling, validation, and tests. Generated code follows your project's conventions and integrates 
              seamlessly with existing components.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin" />
            </div>
          ) : tasks.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Terminal className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No development tasks found</p>
                <p className="text-sm text-muted-foreground">Create your first dashboard or API endpoint to get started</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {tasks.map(task => (
                <Card key={task.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(task.type)}
                        <CardTitle className="text-lg">{task.title}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(task.status)}>
                          {task.status}
                        </Badge>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <span className="text-sm font-medium">Generated Files</span>
                        <p className="text-2xl font-bold text-blue-600">{task.generatedFiles}</p>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium">Estimated Time</span>
                        <p className="text-lg font-semibold">{task.estimatedHours}h</p>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium">Test Results</span>
                        <p className="text-lg font-semibold">{task.testResults}</p>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium">Errors</span>
                        <p className={`text-lg font-semibold ${task.errors > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {task.errors}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                      {task.completedAt && (
                        <span>Completed: {new Date(task.completedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {task.status === 'testing' && (
                        <Button 
                          size="sm" 
                          onClick={() => deployTask(task.id)}
                          className="gap-2"
                        >
                          <Rocket className="h-4 w-4" />
                          Deploy
                        </Button>
                      )}
                      
                      <Button size="sm" variant="outline">
                        View Code
                      </Button>
                      
                      <Button size="sm" variant="outline">
                        Run Tests
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          {scripts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No automation scripts configured</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {scripts.map(script => (
                <Card key={script.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Bot className="h-5 w-5" />
                          {script.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{script.description}</p>
                      </div>
                      <Badge className={script.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {script.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span>Trigger: {script.trigger}</span>
                      {script.schedule && <span>Schedule: {script.schedule}</span>}
                      {script.lastRun && <span>Last run: {new Date(script.lastRun).toLocaleString()}</span>}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => runAutomation(script.id)}
                        className="gap-2"
                      >
                        <Play className="h-4 w-4" />
                        Run Now
                      </Button>
                      
                      <Button size="sm" variant="outline" className="gap-2">
                        <Settings className="h-4 w-4" />
                        Configure
                      </Button>
                      
                      <Button size="sm" variant="outline">
                        View Logs
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="examples" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Dashboard Examples</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded">
                    <h4 className="font-medium">Regulatory Impact Dashboard</h4>
                    <p className="text-sm text-muted-foreground">Real-time visualization of regulatory changes and business impact</p>
                  </div>
                  <div className="p-3 border rounded">
                    <h4 className="font-medium">Sales Pipeline Analytics</h4>
                    <p className="text-sm text-muted-foreground">Interactive funnel and conversion metrics</p>
                  </div>
                  <div className="p-3 border rounded">
                    <h4 className="font-medium">Expert Network Performance</h4>
                    <p className="text-sm text-muted-foreground">Expert utilization and client satisfaction metrics</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Examples</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded">
                    <h4 className="font-medium">POST /api/insights/generate</h4>
                    <p className="text-sm text-muted-foreground">Generate business insights from regulatory data</p>
                  </div>
                  <div className="p-3 border rounded">
                    <h4 className="font-medium">POST /api/experts/match</h4>
                    <p className="text-sm text-muted-foreground">Match clients with relevant experts</p>
                  </div>
                  <div className="p-3 border rounded">
                    <h4 className="font-medium">GET /api/analytics/pipeline</h4>
                    <p className="text-sm text-muted-foreground">Sales pipeline analytics and forecasting</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}