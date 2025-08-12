'use client';
import { useState } from 'react';
import { ArrowRight, CheckCircle, TrendingUp, AlertCircle, Users, Star, Mail, Zap, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function NewsletterPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // TODO: Replace with actual newsletter API endpoint
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSubscribed(true);
      } else {
        setError('구독 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">구독 완료!</h2>
          <p className="text-slate-600 mb-6">
            {email}로 확인 이메일을 보냈습니다.<br />
            매주 월요일 아침, 한국 비즈니스 인텔리전스를 받아보세요.
          </p>
          <Button 
            onClick={() => window.location.href = '/'}
            className="w-full"
          >
            홈으로 돌아가기
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              매주 월요일 아침 7시 발송
            </div>

            {/* Headline */}
            <h1 className="text-5xl font-bold text-slate-900 mb-6 leading-tight">
              한국 비즈니스 규제 변화를<br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                가장 먼저 알려드립니다
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              매주 1,500명+ 한국 창업가들이 읽는 규제 인텔리전스 뉴스레터.<br />
              정부 정책 변화, 전문가 인사이트, 성공/실패 사례를 5분 안에 파악하세요.
            </p>

            {/* Subscription Form */}
            <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-6">
              <div className="flex gap-3">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 h-12 text-base"
                  disabled={isSubmitting}
                />
                <Button 
                  type="submit" 
                  size="lg"
                  disabled={isSubmitting}
                  className="px-6"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      무료 구독
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
              {error && (
                <p className="text-red-600 text-sm mt-2">{error}</p>
              )}
            </form>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>완전 무료</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span>언제든 구독 취소</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500" />
                <span>스팸 없음</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              매주 월요일, 5분 안에 파악하는 비즈니스 인텔리전스
            </h2>
            <p className="text-lg text-slate-600">
              한국 창업가를 위한 필수 규제 정보와 시장 인사이트
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                주간 규제 알림
              </h3>
              <p className="text-slate-600">
                이번 주 시행되는 신규 규제와 정책 변화를 한눈에 파악. 
                컴플라이언스 리스크를 사전에 예방하세요.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                전문가 인사이트
              </h3>
              <p className="text-slate-600">
                전직 정부 관계자, 대기업 임원들의 독점 인터뷰와 
                규제 네비게이션 노하우를 제공합니다.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Korea Fit 분석
              </h3>
              <p className="text-slate-600">
                글로벌 비즈니스 아이디어의 한국 시장 적합도를 
                데이터 기반으로 평가한 점수를 제공합니다.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                성공/실패 사례
              </h3>
              <p className="text-slate-600">
                한국 스타트업의 규제 대응 성공 사례와 
                실패에서 배우는 교훈을 심층 분석합니다.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                시행 일정 캘린더
              </h3>
              <p className="text-slate-600">
                향후 3개월간 예정된 규제 시행 일정과 
                준비해야 할 액션 아이템을 미리 알려드립니다.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                실행 가이드
              </h3>
              <p className="text-slate-600">
                새로운 규제에 대응하기 위한 구체적인 
                실행 단계와 체크리스트를 제공합니다.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Sample Newsletter Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              실제 뉴스레터 미리보기
            </h2>
            <p className="text-lg text-slate-600">
              매주 월요일 받게 될 내용을 확인해보세요
            </p>
          </div>

          <Card className="p-8 bg-slate-50 border-2">
            <div className="space-y-6">
              {/* Newsletter Header */}
              <div className="border-b border-slate-300 pb-4">
                <h3 className="text-xl font-bold text-slate-900">
                  Korean Business Intelligence Weekly
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Issue #42 | 2024.08.12 | 1,500+ 구독자
                </p>
              </div>

              {/* Sample Content */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <h4 className="font-semibold text-slate-900">이번 주 긴급 규제 알림</h4>
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    금융위원회, 8월 15일부터 디지털 자산 사업자 신고 의무화 시행. 
                    암호화폐 거래소 외 P2P, DeFi 서비스도 포함. 미신고 시 5년 이하 징역 또는 5천만원 이하 벌금...
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">📊 Korea Fit Score: 배달 로봇 서비스</h4>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    미국에서 급성장 중인 배달 로봇 서비스의 한국 적합도: 6.8/10
                    규제 장벽은 높지만 인건비 상승과 비대면 선호로 기회 존재...
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">🎤 전문가 인사이트</h4>
                  <p className="text-slate-700 text-sm italic">
                    "한국의 규제 샌드박스를 활용하면 혁신 서비스도 빠르게 시장 진입이 가능합니다. 
                    중요한 것은 사전에 규제 당국과 충분한 소통을 하는 것입니다."
                    <span className="block text-right mt-1 not-italic">- 김현수, 前 금융위원회 핀테크 정책관</span>
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-300 pt-4">
                <p className="text-xs text-slate-500 text-center">
                  더 많은 인사이트를 원하시면 지금 구독하세요
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">1,500+</div>
              <div className="text-blue-100">활성 구독자</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">42%</div>
              <div className="text-blue-100">평균 오픈율</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.8/5</div>
              <div className="text-blue-100">독자 만족도</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              한국 창업가들의 필수 뉴스레터
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-500 fill-current" />
                ))}
              </div>
              <p className="text-slate-700 mb-4 italic">
                "규제 변화를 놓쳐서 과태료를 낸 적이 있었는데, 
                이제는 매주 월요일 체크하면서 미리 대비하고 있습니다."
              </p>
              <p className="text-sm text-slate-600 font-medium">
                박민수, 핀테크 스타트업 CEO
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-500 fill-current" />
                ))}
              </div>
              <p className="text-slate-700 mb-4 italic">
                "전문가 인사이트가 정말 valuable해요. 
                다른 곳에서는 들을 수 없는 실무 노하우를 배웁니다."
              </p>
              <p className="text-sm text-slate-600 font-medium">
                김서연, 헬스테크 스타트업 COO
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-500 fill-current" />
                ))}
              </div>
              <p className="text-slate-700 mb-4 italic">
                "5분만 투자하면 일주일치 규제 동향을 파악할 수 있어요. 
                시간 대비 가치가 최고입니다."
              </p>
              <p className="text-sm text-slate-600 font-medium">
                이준호, 이커머스 플랫폼 대표
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            규제로 인한 실패를 예방하세요
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            매주 월요일, 한국 비즈니스 규제 인텔리전스를 무료로 받아보세요.
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-6">
            <div className="flex gap-3">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 h-12 text-base"
                disabled={isSubmitting}
              />
              <Button 
                type="submit" 
                size="lg"
                disabled={isSubmitting}
                className="px-8"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  '무료 구독'
                )}
              </Button>
            </div>
          </form>

          <p className="text-sm text-slate-500">
            구독자 1,500명과 함께 한국 비즈니스 인텔리전스를 받아보세요
          </p>
        </div>
      </section>
    </div>
  );
}