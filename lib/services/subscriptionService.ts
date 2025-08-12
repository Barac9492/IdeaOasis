// lib/services/subscriptionService.ts

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  priceUnit: string;
  features: string[];
  limits: {
    ideasPerMonth?: number;
    exportsPerMonth?: number;
    apiCalls?: number;
    supportLevel: 'community' | 'email' | 'priority' | 'dedicated';
  };
  popular?: boolean;
}

export interface UserSubscription {
  userId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  createdAt: string;
  cancelledAt?: string;
}

// Subscription plans
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: '무료',
    price: 0,
    priceUnit: '월',
    features: [
      '월 5개 아이디어 조회',
      '기본 Korea Fit 점수',
      '커뮤니티 지원',
      '기본 필터링',
      '아이디어 북마크 (최대 3개)'
    ],
    limits: {
      ideasPerMonth: 5,
      exportsPerMonth: 0,
      supportLevel: 'community'
    }
  },
  {
    id: 'premium',
    name: '프리미엄',
    price: 19000,
    priceUnit: '월',
    features: [
      '무제한 아이디어 조회',
      '상세 분석 및 로드맵',
      '고급 필터 및 검색',
      'PDF/Excel 내보내기',
      '트렌드 데이터 분석',
      '개인화된 추천',
      '이메일 지원',
      '무제한 북마크',
      '아이디어 평가 및 댓글'
    ],
    limits: {
      exportsPerMonth: 50,
      supportLevel: 'email'
    },
    popular: true
  },
  {
    id: 'enterprise',
    name: '엔터프라이즈',
    price: 99000,
    priceUnit: '월',
    features: [
      '프리미엄의 모든 기능',
      'API 접근 (월 10,000 호출)',
      '맞춤 분석 리포트',
      '팀 협업 기능',
      '우선 지원',
      '월간 시장 동향 리포트',
      '전담 계정 매니저',
      '맞춤형 integration 지원'
    ],
    limits: {
      exportsPerMonth: 500,
      apiCalls: 10000,
      supportLevel: 'dedicated'
    }
  }
];

// In-memory storage for user subscriptions (replace with database in production)
let userSubscriptions: Map<string, UserSubscription> = new Map();

export class SubscriptionService {
  /**
   * Get user's current subscription
   */
  static async getUserSubscription(userId: string): Promise<UserSubscription | null> {
    return userSubscriptions.get(userId) || null;
  }

  /**
   * Get user's plan details
   */
  static async getUserPlan(userId: string): Promise<SubscriptionPlan> {
    const subscription = await this.getUserSubscription(userId);
    if (!subscription || subscription.status !== 'active') {
      return SUBSCRIPTION_PLANS[0]; // Free plan
    }
    return SUBSCRIPTION_PLANS.find(plan => plan.id === subscription.planId) || SUBSCRIPTION_PLANS[0];
  }

  /**
   * Check if user can access a feature
   */
  static async canAccessFeature(userId: string, feature: string): Promise<boolean> {
    const plan = await this.getUserPlan(userId);
    
    const featureMap: Record<string, (plan: SubscriptionPlan) => boolean> = {
      'unlimited_ideas': (plan) => plan.id !== 'free',
      'export_pdf': (plan) => plan.id !== 'free',
      'export_excel': (plan) => plan.id !== 'free',
      'advanced_filters': (plan) => plan.id !== 'free',
      'api_access': (plan) => plan.id === 'enterprise',
      'trend_analysis': (plan) => plan.id !== 'free',
      'personalized_recommendations': (plan) => plan.id !== 'free',
      'comments_and_ratings': (plan) => plan.id !== 'free',
      'team_collaboration': (plan) => plan.id === 'enterprise',
      'priority_support': (plan) => plan.id === 'enterprise'
    };

    const checker = featureMap[feature];
    return checker ? checker(plan) : false;
  }

  /**
   * Check usage limits
   */
  static async checkUsageLimit(userId: string, limitType: string, currentUsage: number): Promise<boolean> {
    const plan = await this.getUserPlan(userId);
    
    switch (limitType) {
      case 'ideas_per_month':
        return plan.limits.ideasPerMonth ? currentUsage < plan.limits.ideasPerMonth : true;
      case 'exports_per_month':
        return plan.limits.exportsPerMonth ? currentUsage < plan.limits.exportsPerMonth : false;
      case 'api_calls':
        return plan.limits.apiCalls ? currentUsage < plan.limits.apiCalls : false;
      default:
        return true;
    }
  }

  /**
   * Subscribe user to a plan
   */
  static async subscribeUser(userId: string, planId: string): Promise<UserSubscription> {
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
    if (!plan) {
      throw new Error('Invalid plan ID');
    }

    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());

    const subscription: UserSubscription = {
      userId,
      planId,
      status: planId === 'free' ? 'active' : 'trialing', // Start with trial for paid plans
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: nextMonth.toISOString(),
      createdAt: now.toISOString()
    };

    userSubscriptions.set(userId, subscription);
    return subscription;
  }

  /**
   * Cancel subscription
   */
  static async cancelSubscription(userId: string): Promise<void> {
    const subscription = userSubscriptions.get(userId);
    if (subscription) {
      subscription.status = 'cancelled';
      subscription.cancelledAt = new Date().toISOString();
      userSubscriptions.set(userId, subscription);
    }
  }

  /**
   * Get pricing for display
   */
  static getPlansForDisplay(): SubscriptionPlan[] {
    return SUBSCRIPTION_PLANS.map(plan => ({
      ...plan,
      features: plan.features.slice() // Create a copy to avoid mutations
    }));
  }

  /**
   * Calculate savings for annual billing
   */
  static calculateAnnualSavings(monthlyPrice: number): number {
    const annualPrice = monthlyPrice * 12 * 0.8; // 20% discount for annual
    const savings = (monthlyPrice * 12) - annualPrice;
    return Math.round(savings);
  }

  /**
   * Generate payment intent (mock for now)
   */
  static async createPaymentIntent(userId: string, planId: string, billingCycle: 'monthly' | 'annual' = 'monthly'): Promise<{
    clientSecret: string;
    amount: number;
    currency: string;
  }> {
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
    if (!plan) {
      throw new Error('Invalid plan ID');
    }

    const amount = billingCycle === 'annual' ? plan.price * 12 * 0.8 : plan.price;
    
    // In production, this would integrate with Stripe, Toss Payments, or similar
    return {
      clientSecret: `mock_secret_${userId}_${planId}`,
      amount: Math.round(amount),
      currency: 'KRW'
    };
  }
}