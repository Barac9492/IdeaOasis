import { NextRequest, NextResponse } from 'next/server';
import { activePlatformAgent } from '@/lib/services/activePlatformAgent';

export async function POST(req: NextRequest) {
  try {
    const { action, specification } = await req.json();

    if (action === 'create_dashboard') {
      const task = await activePlatformAgent.createDashboardFeature({
        name: specification.name,
        description: specification.description,
        dataSource: specification.dataSource || 'api',
        chartTypes: specification.chartTypes || ['line', 'bar'],
        filters: specification.filters || ['date', 'category'],
        realTime: specification.realTime || false
      });

      return NextResponse.json({
        success: true,
        task: {
          id: task.id,
          title: task.title,
          status: task.status,
          estimatedHours: task.estimatedHours,
          generatedFiles: task.generatedFiles.map(f => ({
            path: f.path,
            type: f.type,
            size: f.size
          }))
        }
      });
    }

    if (action === 'create_api') {
      const task = await activePlatformAgent.createApiEndpoint({
        endpoint: specification.endpoint,
        method: specification.method || 'GET',
        description: specification.description,
        parameters: specification.parameters || [],
        responseSchema: specification.responseSchema || {},
        authentication: specification.authentication || false,
        rateLimit: specification.rateLimit,
        middleware: specification.middleware || []
      });

      return NextResponse.json({
        success: true,
        task: {
          id: task.id,
          title: task.title,
          status: task.status,
          estimatedHours: task.estimatedHours,
          generatedFiles: task.generatedFiles.map(f => ({
            path: f.path,
            type: f.type,
            size: f.size
          }))
        }
      });
    }

    if (action === 'deploy_task') {
      const { taskId } = specification;
      await activePlatformAgent.deployTask(taskId);

      return NextResponse.json({
        success: true,
        message: 'Task deployed successfully'
      });
    }

    if (action === 'run_automation') {
      const { scriptId } = specification;
      const result = await activePlatformAgent.runAutomationScript(scriptId);

      return NextResponse.json({
        success: true,
        result
      });
    }

    if (action === 'generate_feature') {
      // Advanced: Generate a complete feature with multiple components
      const { featureName, requirements, components } = specification;
      
      const tasks = [];
      
      // Generate API endpoints
      if (requirements.api) {
        for (const apiSpec of requirements.api) {
          const task = await activePlatformAgent.createApiEndpoint(apiSpec);
          tasks.push(task);
        }
      }
      
      // Generate dashboard components
      if (requirements.dashboard) {
        for (const dashboardSpec of requirements.dashboard) {
          const task = await activePlatformAgent.createDashboardFeature(dashboardSpec);
          tasks.push(task);
        }
      }

      return NextResponse.json({
        success: true,
        message: `Generated ${tasks.length} development tasks for feature: ${featureName}`,
        tasks: tasks.map(t => ({
          id: t.id,
          title: t.title,
          status: t.status,
          type: t.type
        }))
      });
    }

    return NextResponse.json(
      { error: 'Invalid action. Use: create_dashboard, create_api, deploy_task, run_automation, generate_feature' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Platform development error:', error);
    return NextResponse.json(
      { error: 'Failed to execute platform development task', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'status';

    if (type === 'status') {
      const status = await activePlatformAgent.getSystemStatus();
      return NextResponse.json({
        success: true,
        status
      });
    }

    if (type === 'tasks') {
      const tasks = activePlatformAgent.getTasks();
      return NextResponse.json({
        success: true,
        tasks: tasks.map(task => ({
          id: task.id,
          title: task.title,
          type: task.type,
          status: task.status,
          priority: task.priority,
          estimatedHours: task.estimatedHours,
          actualHours: task.actualHours,
          createdAt: task.createdAt,
          completedAt: task.completedAt,
          generatedFiles: task.generatedFiles.length,
          testResults: task.testResults?.length || 0,
          errors: task.errors?.length || 0
        }))
      });
    }

    if (type === 'automation') {
      const scripts = activePlatformAgent.getAutomationScripts();
      return NextResponse.json({
        success: true,
        scripts: scripts.map(script => ({
          id: script.id,
          name: script.name,
          description: script.description,
          status: script.status,
          trigger: script.trigger,
          schedule: script.schedule,
          lastRun: script.lastRun,
          logs: script.logs.slice(-5) // Last 5 logs
        }))
      });
    }

    if (type === 'examples') {
      // Provide examples of what the platform agent can build
      const examples = {
        dashboards: [
          {
            name: 'Regulatory Impact Dashboard',
            description: 'Real-time visualization of regulatory changes and their business impact',
            dataSource: 'regulatory_monitor',
            chartTypes: ['line', 'bar', 'pie'],
            filters: ['date', 'ministry', 'industry', 'impact_level']
          },
          {
            name: 'Sales Pipeline Analytics',
            description: 'Interactive dashboard showing sales funnel and conversion metrics',
            dataSource: 'business_dev_agent',
            chartTypes: ['funnel', 'line', 'bar'],
            filters: ['date', 'stage', 'industry', 'size']
          }
        ],
        apis: [
          {
            endpoint: '/api/insights/generate',
            method: 'POST',
            description: 'Generate business insights from regulatory data',
            authentication: true,
            parameters: [
              { name: 'industry', type: 'string', required: true },
              { name: 'timeframe', type: 'string', required: false }
            ]
          },
          {
            endpoint: '/api/experts/match',
            method: 'POST',
            description: 'Match clients with relevant experts based on criteria',
            authentication: true,
            parameters: [
              { name: 'expertise', type: 'string[]', required: true },
              { name: 'budget', type: 'number', required: false }
            ]
          }
        ],
        automations: [
          'Daily data backup and cleanup',
          'Performance monitoring and alerting',
          'Automated testing and deployment',
          'Content optimization and A/B testing',
          'User behavior analysis and reporting'
        ]
      };

      return NextResponse.json({
        success: true,
        examples
      });
    }

    return NextResponse.json(
      { error: 'Invalid type. Use: status, tasks, automation, examples' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Platform development GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch platform development data' },
      { status: 500 }
    );
  }
}