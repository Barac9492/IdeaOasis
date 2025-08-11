'use client';
import { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { Sparkles, TrendingUp, Target, Lightbulb, ArrowRight, CheckCircle, BarChart3, Users, Star } from 'lucide-react';

export default function LandingPage() {
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              IdeaOasis
            </div>
            <button
              onClick={handleSignIn}
              disabled={isSigningIn}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
            >
              {isSigningIn ? '로그인 중...' : '로그인'}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl font-bold text-slate-900 leading-tight">
                  한국 맞춤형<br />
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    비즈니스 아이디어
                  </span><br />
                  발견 플랫폼
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed">
                  글로벌 스타트업 아이디어를 한국 시장에 맞게 분석하고, 
                  AI 기반 Korea Fit 점수와 실행 로드맵을 제공합니다.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleSignIn}
                  disabled={isSigningIn}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold text-lg disabled:opacity-50"
                >
                  {isSigningIn ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      로그인 중...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      무료로 시작하기
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
                <div className="flex items-center gap-2 px-6 py-4 text-slate-600">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span>Google 계정으로 간편 가입</span>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">AI 맞춤형 학습 플랫폼</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-500 fill-current" />
                      <span className="text-sm font-medium text-slate-700">9.2</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-emerald-50 rounded-lg p-3">
                      <div className="text-emerald-800 font-medium">Korea Fit</div>
                      <div className="text-2xl font-bold text-emerald-600">8.5/10</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="text-blue-800 font-medium">시장 성장률</div>
                      <div className="text-2xl font-bold text-blue-600">+24%</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span>한국 교육 시장 규제 환경 적합</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span>K-12 및 대학 시장 진출 가능</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span>정부 에듀테크 지원 정책 활용</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              왜 IdeaOasis를 선택해야 할까요?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              단순한 아이디어 복사가 아닌, 한국 시장의 문화적 특성과 규제 환경을 고려한 
              데이터 기반의 맞춤형 분석을 제공합니다.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Korea Fit 분석</h3>
              <p className="text-slate-600 leading-relaxed">
                규제 친화성, 문화적 적합성, 시장 준비도, 경쟁 환경, 
                비즈니스 인프라 등 5가지 핵심 요소를 기반으로 한국 시장 적합도를 정확히 측정합니다.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">실시간 트렌드 분석</h3>
              <p className="text-slate-600 leading-relaxed">
                네이버 검색 트렌드, 소셜 미디어 반응, 정부 정책 동향을 실시간으로 분석하여
                '지금이 타이밍'인 아이디어를 우선적으로 제안합니다.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">실행 로드맵 제공</h3>
              <p className="text-slate-600 leading-relaxed">
                아이디어부터 실행까지의 구체적인 단계별 가이드를 제공합니다.
                법적 검토, 파트너십 전략, 펀딩 방안까지 모든 것을 커버합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">큐레이션된 아이디어</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-blue-100">Korea Fit 정확도</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-100">성공 사례</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            지금 바로 시작하세요
          </h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            한국 시장에 최적화된 비즈니스 아이디어를 찾아보세요. 
            Google 계정으로 간편하게 가입하고 모든 기능을 무료로 이용할 수 있습니다.
          </p>
          
          <button
            onClick={handleSignIn}
            disabled={isSigningIn}
            className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold text-lg disabled:opacity-50"
          >
            {isSigningIn ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                로그인 중...
              </>
            ) : (
              <>
                <Lightbulb className="w-5 h-5" />
                아이디어 탐색하기
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>무료 회원가입</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>즉시 이용 가능</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>언제든 취소 가능</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="text-2xl font-bold text-white mb-4">IdeaOasis</div>
              <p className="text-slate-400 max-w-md">
                한국 시장에 최적화된 비즈니스 아이디어 발견 플랫폼입니다.
                AI 기반 분석과 실행 로드맵으로 성공적인 창업을 지원합니다.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">플랫폼</h4>
              <div className="space-y-2 text-sm">
                <div>아이디어 탐색</div>
                <div>Korea Fit 분석</div>
                <div>트렌드 분석</div>
                <div>실행 로드맵</div>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">지원</h4>
              <div className="space-y-2 text-sm">
                <div>도움말</div>
                <div>문의하기</div>
                <div>개인정보처리방침</div>
                <div>이용약관</div>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 IdeaOasis. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}