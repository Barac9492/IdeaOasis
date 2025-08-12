// app/pricing/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { Check, Star, Zap, CreditCard, Users, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SUBSCRIPTION_PLANS, SubscriptionService } from '@/lib/services/subscriptionService';
import type { SubscriptionPlan } from '@/lib/services/subscriptionService';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [user, setUser] = useState<any>(null);
  const [userPlan, setUserPlan] = useState<SubscriptionPlan>(SUBSCRIPTION_PLANS[0]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        const currentPlan = await SubscriptionService.getUserPlan(user.uid);
        setUserPlan(currentPlan);
      }
    });
    return unsubscribe;
  }, []);

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      alert('구독하려면 로그인이 필요합니다.');
      return;
    }

    if (planId === 'free') {
      // Handle downgrade to free
      try {
        await SubscriptionService.cancelSubscription(user.uid);
        await SubscriptionService.subscribeUser(user.uid, 'free');
        setUserPlan(SUBSCRIPTION_PLANS[0]);
        alert('무료 플랜으로 변경되었습니다.');
      } catch (error) {
        alert('플랜 변경 중 오류가 발생했습니다.');
      }
      return;
    }

    setIsLoading(true);
    try {
      // In production, this would integrate with actual payment processor
      const paymentIntent = await SubscriptionService.createPaymentIntent(user.uid, planId, billingCycle);
      
      // Mock payment success for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await SubscriptionService.subscribeUser(user.uid, planId);
      const newPlan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
      if (newPlan) {
        setUserPlan(newPlan);
      }
      
      alert(`${newPlan?.name} 플랜 구독이 완료되었습니다!`);
    } catch (error) {
      alert('구독 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPrice = (plan: SubscriptionPlan) => {
    if (plan.price === 0) return '무료';
    const price = billingCycle === 'annual' ? plan.price * 12 * 0.8 : plan.price;
    const unit = billingCycle === 'annual' ? '년' : plan.priceUnit;
    return `₩${price.toLocaleString()}/${unit}`;
  };

  const getSavings = (plan: SubscriptionPlan) => {
    if (plan.price === 0 || billingCycle === 'monthly') return null;
    return SubscriptionService.calculateAnnualSavings(plan.price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            성공하는 아이디어 발굴을 위한
            <span className="text-blue-600"> 맞춤 플랜</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            한국 시장에 최적화된 비즈니스 인텔리전스로 여러분의 창업 여정을 가속화하세요
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-white p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                billingCycle === 'monthly' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              월간 결제
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-2 rounded-md font-medium transition-colors relative ${
                billingCycle === 'annual' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              연간 결제
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                20% 할인
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isCurrentPlan = userPlan.id === plan.id;
            const savings = getSavings(plan);
            
            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl p-8 border-2 transition-all ${
                  plan.popular 
                    ? 'border-blue-500 shadow-lg scale-105' 
                    : 'border-slate-200 hover:border-slate-300'
                } ${isCurrentPlan ? 'ring-2 ring-green-500 ring-offset-2' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      가장 인기
                    </div>
                  </div>
                )}
                
                {isCurrentPlan && (
                  <div className="absolute -top-4 right-4">
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      현재 플랜
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-slate-900">{getPrice(plan)}</span>
                    {savings && (
                      <div className="text-sm text-green-600 font-medium mt-1">
                        연간 ₩{savings.toLocaleString()} 절약
                      </div>
                    )}
                  </div>
                  
                  {/* Plan Icons */}
                  <div className="flex justify-center mb-4">
                    {plan.id === 'free' && <Zap className="w-8 h-8 text-slate-400" />}
                    {plan.id === 'premium' && <Star className="w-8 h-8 text-blue-600" />}
                    {plan.id === 'enterprise' && <Shield className="w-8 h-8 text-purple-600" />}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Usage Limits */}
                {plan.limits && (
                  <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                    <h4 className="font-medium text-slate-900 mb-2">이용 한도</h4>
                    <div className="space-y-1 text-sm text-slate-600">
                      {plan.limits.ideasPerMonth && (
                        <div>아이디어 조회: 월 {plan.limits.ideasPerMonth}개</div>
                      )}
                      {plan.limits.exportsPerMonth !== undefined && (
                        <div>내보내기: 월 {plan.limits.exportsPerMonth}회</div>
                      )}
                      {plan.limits.apiCalls && (
                        <div>API 호출: 월 {plan.limits.apiCalls.toLocaleString()}회</div>
                      )}
                      <div>지원: {
                        plan.limits.supportLevel === 'community' ? '커뮤니티' :
                        plan.limits.supportLevel === 'email' ? '이메일' :
                        plan.limits.supportLevel === 'priority' ? '우선 지원' :
                        '전담 매니저'
                      }</div>
                    </div>
                  </div>
                )}

                {/* CTA Button */}
                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isLoading || isCurrentPlan}
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : isCurrentPlan 
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-slate-900 hover:bg-slate-800'
                  }`}
                  size="lg"
                >
                  {isCurrentPlan ? (
                    '현재 플랜'
                  ) : isLoading ? (
                    '처리 중...'
                  ) : plan.id === 'free' ? (
                    '무료로 시작하기'
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      {plan.name} 구독하기
                    </>
                  )}
                </Button>

                {plan.id !== 'free' && (
                  <p className="text-xs text-slate-500 text-center mt-3">
                    언제든지 취소 가능 • 첫 7일 무료 체험
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">자주 묻는 질문</h2>
          <div className="space-y-6">
            {[
              {
                q: '무료 플랜으로도 충분한가요?',
                a: '무료 플랜으로 IdeaOasis의 기본 기능을 체험해볼 수 있습니다. 하지만 본격적인 비즈니스 분석과 의사결정을 위해서는 프리미엄 플랜을 추천드립니다.'
              },
              {
                q: '언제든지 플랜을 변경할 수 있나요?',
                a: '네, 언제든지 플랜을 업그레이드하거나 다운그레이드할 수 있습니다. 결제는 일할 계산되어 정확하게 처리됩니다.'
              },
              {
                q: '환불 정책은 어떻게 되나요?',
                a: '모든 유료 플랜은 7일 무료 체험을 제공하며, 체험 기간 내 취소 시 전액 환불됩니다. 이후에도 언제든지 구독을 취소할 수 있습니다.'
              },
              {
                q: '엔터프라이즈 플랜의 전담 매니저는 무엇인가요?',
                a: '엔터프라이즈 고객에게는 비즈니스 전문가가 전담 매니저로 배정되어 맞춤형 컨설팅과 분석을 제공합니다.'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Enterprise CTA */}
        <div className="mt-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-center text-white">
          <Users className="w-12 h-12 mx-auto mb-4 opacity-90" />
          <h2 className="text-2xl font-bold mb-4">대기업 및 단체 고객</h2>
          <p className="text-lg mb-6 opacity-90">
            맞춤형 솔루션과 전용 지원이 필요하신가요? 저희가 도와드리겠습니다.
          </p>
          <Button variant="secondary" size="lg">
            영업팀 문의하기
          </Button>
        </div>
      </div>
    </div>
  );
}