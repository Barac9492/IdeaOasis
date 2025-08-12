import { NextRequest, NextResponse } from 'next/server';
import { contentAgent } from '@/lib/services/contentAgent';
import { regulatoryMonitor } from '@/lib/services/regulatoryMonitor';

export async function POST(req: NextRequest) {
  try {
    const {
      type,
      targetAudience = ['all'],
      includeExpertContent = true,
      urgentOnly = false,
      customPrompt
    } = await req.json();

    if (type === 'newsletter') {
      // Get latest regulatory updates
      const regulatoryUpdates = await regulatoryMonitor.monitorAllTargets();
      
      // Get ideas data
      const ideasResponse = await fetch(`${req.nextUrl.origin}/api/ideas`);
      const ideas = await ideasResponse.json();

      // Generate newsletter
      const newsletter = await contentAgent.generateNewsletter(
        regulatoryUpdates,
        ideas,
        {
          targetAudience,
          includeExpertContent,
          urgentOnly
        }
      );

      return NextResponse.json({
        success: true,
        newsletter,
        meta: {
          sectionsGenerated: newsletter.sections.length,
          estimatedReadTime: newsletter.metrics?.estimatedReadTime,
          keyTopics: newsletter.metrics?.keyTopics
        }
      });
    }

    if (type === 'regulatory_summary') {
      const updates = await regulatoryMonitor.monitorAllTargets();
      const highImpact = updates.filter(u => u.businessImpact === 'high');
      
      const summary = await contentAgent.generateNewsletter(
        highImpact,
        [],
        { urgentOnly: true, includeExpertContent: false }
      );

      return NextResponse.json({
        success: true,
        summary: summary.sections[0]?.content || 'No urgent updates found',
        updateCount: highImpact.length
      });
    }

    if (type === 'social_posts') {
      const updates = await regulatoryMonitor.monitorAllTargets();
      const posts = await generateSocialPosts(updates.slice(0, 3));
      
      return NextResponse.json({
        success: true,
        posts
      });
    }

    if (type === 'expert_content') {
      if (!customPrompt) {
        return NextResponse.json(
          { error: 'Custom prompt required for expert content' },
          { status: 400 }
        );
      }

      const content = await generateExpertContent(customPrompt);
      
      return NextResponse.json({
        success: true,
        content
      });
    }

    return NextResponse.json(
      { error: 'Invalid content type. Use: newsletter, regulatory_summary, social_posts, expert_content' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Content generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

async function generateSocialPosts(updates: any[]): Promise<any[]> {
  const posts = [];
  
  for (const update of updates) {
    // LinkedIn post
    const linkedinPost = {
      platform: 'linkedin',
      content: `🚨 한국 ${update.ministry} 새로운 규제 발표

${update.title}

주요 영향:
• ${update.industries.map((i: string) => `#${i}`).join(' ')} 업계
• ${update.businessImpact} 영향도
• ${update.affectedBusinessTypes.join(', ')} 대상

스타트업 창업자들은 반드시 확인하세요!

#한국스타트업 #규제 #비즈니스인텔리전스`,
      hashtags: ['한국스타트업', '규제', '비즈니스인텔리전스', ...update.industries],
      scheduledFor: new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now
    };

    // Twitter post
    const twitterPost = {
      platform: 'twitter',
      content: `🚨 ${update.ministry} 규제 업데이트

${update.title}

영향: ${update.businessImpact.toUpperCase()}
대상: ${update.industries.join(', ')}

자세히 → ${update.sourceUrl}

#KoreaStartup #Regulation`,
      hashtags: ['KoreaStartup', 'Regulation', ...update.industries.slice(0, 2)],
      scheduledFor: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes from now
    };

    posts.push(linkedinPost, twitterPost);
  }
  
  return posts;
}

async function generateExpertContent(prompt: string): Promise<string> {
  // Simulated expert content generation
  // In production, this would integrate with GPT-4 or similar
  const templates = {
    'market_analysis': `# 시장 분석: ${prompt}

## 현황 분석
한국 시장에서 이 분야는 현재 급속한 성장을 보이고 있습니다.

## 주요 동향
- 정부 정책 지원 강화
- 대기업 투자 증가
- 스타트업 생태계 활성화

## 전문가 의견
"${prompt} 분야는 향후 3년간 연평균 30% 성장이 예상됩니다."

## 실행 전략
1. 파일럿 프로젝트 시작
2. 파트너십 구축
3. 정부 지원 사업 활용`,

    'compliance_guide': `# 규제 준수 가이드: ${prompt}

## 필수 확인사항
규제 요구사항을 명확히 파악하고 준수 계획을 수립하세요.

## 단계별 액션플랜
1. 현행 규제 검토
2. 갭 분석 수행
3. 준수 방안 수립
4. 모니터링 체계 구축

## 주의사항
- 규제 변경 모니터링 필수
- 전문가 자문 권장
- 단계적 접근 필요`,

    'opportunity_assessment': `# 기회 분석: ${prompt}

## 시장 기회
이 분야에서 발견되는 주요 기회들을 분석했습니다.

## 성공 요인
- 빠른 시장 진입
- 차별화된 서비스
- 규제 환경 이해

## 리스크 요인
- 경쟁 심화
- 규제 변경
- 기술적 장벽

## 추천 전략
단기적으로는 파일럿을 통한 시장 검증을, 중장기적으로는 본격적인 사업 확장을 권장합니다.`
  };

  // Simple keyword-based template selection
  const templateKey = prompt.includes('규제') || prompt.includes('준수') ? 'compliance_guide' :
                     prompt.includes('시장') || prompt.includes('분석') ? 'market_analysis' :
                     'opportunity_assessment';

  return templates[templateKey];
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'status';

    if (type === 'status') {
      return NextResponse.json({
        success: true,
        status: 'Content Agent ready',
        capabilities: [
          'newsletter_generation',
          'regulatory_summaries',
          'social_posts',
          'expert_content'
        ],
        templates: [
          'regulatory_alert',
          'trend_analysis', 
          'idea_spotlight',
          'expert_interview'
        ]
      });
    }

    if (type === 'templates') {
      const templates = [
        { name: 'Regulatory Alert', category: 'regulatory' },
        { name: 'Trend Analysis', category: 'trends' },
        { name: 'Idea Spotlight', category: 'ideas' },
        { name: 'Expert Interview', category: 'expert' }
      ];

      return NextResponse.json({
        success: true,
        templates
      });
    }

    return NextResponse.json(
      { error: 'Invalid request type' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Content API error:', error);
    return NextResponse.json(
      { error: 'Content service unavailable' },
      { status: 500 }
    );
  }
}