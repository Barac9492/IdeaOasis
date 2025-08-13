'use client';
import { useState, useEffect } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function ValueLandingPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return unsubscribe;
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero - The Problem */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-12 sm:pb-20">
        {/* Trust Indicators */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-6 px-6 py-3 bg-white rounded-full shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="font-medium">정부 승인 규제 DB</span>
            </div>
            <div className="w-px h-4 bg-slate-300"></div>
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="font-medium">실시간 업데이트</span>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 mb-4 leading-tight">
            해외 모델이 한국에서 성공할까?
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            AI가 30초 만에 알려드립니다
          </p>
          
          {/* LIVE Auto-Playing Demo */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 max-w-3xl mx-auto mb-8 text-left relative overflow-hidden">
            {/* Terminal-like header */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-slate-300 text-sm ml-2">IdeaOasis AI 분석 시연</span>
            </div>
            
            {/* Auto-typing effect */}
            <div className="space-y-4 text-white font-mono text-sm">
              <div className="flex items-center gap-2">
                <span className="text-green-400">$</span>
                <span className="text-white">분석할 모델: "Stripe 같은 온라인 결제 서비스"</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-blue-400">></span>
                <span className="text-slate-300">AI 분석 시작...</span>
                <div className="w-2 h-4 bg-white animate-pulse"></div>
              </div>
              
              <div className="pl-4 space-y-2 text-slate-300">
                <div className="flex justify-between">
                  <span>전자금융거래법 검토</span>
                  <span className="text-red-400">⚠️ 높은 리스크</span>
                </div>
                <div className="flex justify-between">
                  <span>개인정보보호법 검토</span>
                  <span className="text-yellow-400">⚡ 중간 리스크</span>
                </div>
                <div className="flex justify-between">
                  <span>한국 성공 사례 분석</span>
                  <span className="text-green-400">✅ 토스, 카카오페이</span>
                </div>
              </div>
              
              <div className="border-t border-slate-600 pt-4">
                <div className="flex items-center justify-between text-lg">
                  <span className="text-white font-bold">종합 리스크 점수:</span>
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full font-bold">75/100</span>
                </div>
                <div className="text-slate-300 text-xs mt-2">
                  ⚠️ 높은 규제 리스크 - 현지 파트너십 필수
                </div>
              </div>
            </div>
            
            {/* Floating "LIVE" indicator */}
            <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold animate-pulse">
              LIVE 시연
            </div>
          </div>
          
          {/* Simple emotion-driven question */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              내 아이디어도 확인해보고 싶다면?
            </h2>
            <p className="text-slate-600 mb-6">
              👆 위와 똑같은 분석을 내 아이디어로 받아보세요
            </p>
          </div>
        </div>
        
        {/* Simplified Value - Just 3 Key Points */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-12 text-center">
          <h2 className="text-2xl font-bold mb-6 text-slate-900">
            왜 300+ 창업가들이 선택했을까요?
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">⚡</span>
              </div>
              <h3 className="font-bold text-lg mb-2">3분 만에 완료</h3>
              <p className="text-slate-600 text-sm">복잡한 규제 분석을 AI가 즉시 처리</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">💰</span>
              </div>
              <h3 className="font-bold text-lg mb-2">비용 90% 절약</h3>
              <p className="text-slate-600 text-sm">수천만원 컨설팅 대신 무료로 확인</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">🎯</span>
              </div>
              <h3 className="font-bold text-lg mb-2">실제 성공 사례</h3>
              <p className="text-slate-600 text-sm">쿠팡, 카카오T처럼 성공한 전략 공개</p>
            </div>
          </div>
        </div>

        {/* ZERO-FRICTION CTA - Pure Emotion → Action */}
        <div className="text-center">
          {user ? (
            /* Authenticated User - Direct to Magic */
            <div className="mb-8">              
              <button 
                onClick={() => router.push('/submit')}
                className="group bg-gradient-to-r from-green-600 to-green-700 text-white px-16 py-6 rounded-2xl font-bold text-2xl hover:from-green-700 hover:to-green-800 transform hover:scale-105 transition-all duration-200 shadow-2xl hover:shadow-3xl relative overflow-hidden mb-4"
              >
                <span className="relative z-10">🚀 내 아이디어 분석받기</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
              </button>
              
              <p className="text-slate-600 text-sm">30초 후에 위와 같은 결과를 받게됩니다</p>
            </div>
          ) : (
            /* Unauthenticated User - Pure Desire */
            <div className="mb-8">
              <button 
                onClick={() => signInWithPopup(auth, googleProvider)}
                className="group bg-gradient-to-r from-orange-500 to-red-500 text-white px-16 py-6 rounded-2xl font-bold text-2xl hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200 shadow-2xl hover:shadow-3xl relative overflow-hidden mb-4 animate-pulse"
              >
                <span className="relative z-10">🔥 내 것도 해보기</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
              </button>
              
              <p className="text-slate-600 text-sm">
                Google로 3초 로그인 → 바로 분석 시작
              </p>
            </div>
          )}
          
          {/* Social Proof */}
          <div className="flex items-center justify-center gap-6 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-full border-2 border-white"></div>
              </div>
              <span className="font-medium">300+ 창업가 검증</span>
            </div>
            <div className="w-px h-4 bg-slate-300"></div>
            <div className="flex items-center gap-1">
              <span>⭐⭐⭐⭐⭐</span>
              <span className="font-medium">4.8/5</span>
            </div>
          </div>
        </div>
      </div>

      {/* Proof Section - Enhanced */}
      <div className="bg-gradient-to-b from-slate-50 to-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h3 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-900">
              똑같은 아이디어, <span className="text-red-600">완전히 다른</span> 결과
            </h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              규제 분석 없이 진출한 해외 기업들의 실패와, 첫날부터 한국화에 성공한 기업들의 차이점
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Failures */}
            <div>
              <h4 className="text-lg font-semibold text-red-700 mb-4">❌ 실패한 해외 기업들</h4>
              <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="font-semibold text-lg mb-1">Uber (2013)</div>
                  <div className="text-red-600 text-sm">여객자동차운수사업법 위반</div>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="font-semibold text-lg mb-1">Airbnb (2016)</div>
                  <div className="text-red-600 text-sm">관광진흥법 라이선스 요구</div>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="font-semibold text-lg mb-1">PayPal (2007)</div>
                  <div className="text-red-600 text-sm">전자금융거래법 현지 파트너 필수</div>
                </div>
              </div>
            </div>

            {/* Successes */}
            <div>
              <h4 className="text-lg font-semibold text-green-700 mb-4">✅ 성공한 한국 기업들</h4>
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="font-semibold text-lg mb-1">카카오T (2015)</div>
                  <div className="text-green-600 text-sm">시장 점유율 98%, 사용자 2,300만명</div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="font-semibold text-lg mb-1">쿠팡 (2010)</div>
                  <div className="text-green-600 text-sm">기업가치 60조원, 아마존 한국 압도</div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="font-semibold text-lg mb-1">배달의민족 (2012)</div>
                  <div className="text-green-600 text-sm">시장 점유율 80%, 딜리버리히어로 매각</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="text-2xl font-semibold mb-8">한국 진출 전 반드시 확인해야 할 4단계:</h3>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="text-2xl font-bold text-slate-400">1</div>
              <div>
                <div className="font-semibold mb-1">해외 모델 제출</div>
                <div className="text-slate-600">성공하고 싶은 해외 비즈니스 모델을 입력하세요</div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="text-2xl font-bold text-slate-400">2</div>
              <div>
                <div className="font-semibold mb-1">규제 위험도 분석</div>
                <div className="text-slate-600">200+ 개 한국 법령과 대조하여 리스크 점수 산출</div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="text-2xl font-bold text-slate-400">3</div>
              <div>
                <div className="font-semibold mb-1">현지화 전략 제시</div>
                <div className="text-slate-600">성공한 한국 기업들의 적응 방식과 실제 비용</div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="text-2xl font-bold text-slate-400">4</div>
              <div>
                <div className="font-semibold mb-1">경쟁 환경 파악</div>
                <div className="text-slate-600">기존 한국 기업들의 시장 점유율과 차별화 포인트</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-4">
            해외 모델을 무작정 따라하다가 실패하지 마세요
          </h3>
          <p className="text-xl mb-8 text-slate-300">
            이미 300+ 한국 창업가들이 먼저 검증하고 시작했습니다
          </p>
          <button 
            onClick={() => signInWithPopup(auth, googleProvider)}
            className="bg-white text-slate-900 px-8 py-4 rounded-lg font-medium text-lg hover:bg-slate-100"
          >
            지금 무료로 검증받기
          </button>
        </div>
      </div>
    </div>
  );
}