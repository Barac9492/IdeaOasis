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
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span>⚡</span>
            <span>30초 무료 체험</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            내 아이디어가 한국에서
            <span className="block text-blue-600 mt-2">성공할 수 있을까?</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            <strong className="text-slate-900">Stripe, Discord, Notion 같은 해외 모델</strong>이 한국에 도입될 때<br className="hidden sm:block" />
            어떤 규제 리스크가 있는지 <span className="text-blue-600 font-semibold">즉시 확인</span>해보세요.
          </p>
          
          {/* Interactive Demo - Click to See Magic */}
          <div className="bg-white border-2 border-blue-200 rounded-2xl p-6 max-w-2xl mx-auto mb-8 text-left hover:shadow-lg transition-shadow cursor-pointer group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm">⚡</span>
                </div>
                <span className="font-semibold text-slate-900">즉시 체험해보기</span>
              </div>
              <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium group-hover:bg-blue-200 transition-colors">
                클릭해보세요 →
              </div>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="group/item flex justify-between items-center p-3 bg-slate-50 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                <span className="flex items-center gap-2">
                  <span>💳</span>
                  <span>"Stripe 같은 온라인 결제 서비스"</span>
                </span>
                <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium group-hover/item:bg-orange-200 transition-colors">리스크 75</span>
              </div>
              
              <div className="group/item flex justify-between items-center p-3 bg-slate-50 rounded-lg hover:bg-green-50 transition-colors cursor-pointer">
                <span className="flex items-center gap-2">
                  <span>🎮</span>
                  <span>"Discord 같은 게이머 커뮤니티"</span>
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium group-hover/item:bg-green-200 transition-colors">리스크 35</span>
              </div>
              
              <div className="group/item flex justify-between items-center p-3 bg-slate-50 rounded-lg hover:bg-yellow-50 transition-colors cursor-pointer">
                <span className="flex items-center gap-2">
                  <span>📝</span>
                  <span>"Notion 같은 협업 도구"</span>
                </span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium group-hover/item:bg-yellow-200 transition-colors">리스크 45</span>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-2 text-xs text-slate-600 bg-slate-100 px-3 py-2 rounded-full">
                <span>👆</span>
                <span>실제 AI 분석 결과 • 클릭하면 상세 분석 보기</span>
              </div>
            </div>
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

        {/* 직관적 CTA Section - ONE CLEAR ACTION */}
        <div className="text-center">
          {user ? (
            /* Authenticated User - Direct to Action */
            <div className="mb-8">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 max-w-lg mx-auto">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-green-600">✓</span>
                  <span className="font-semibold text-green-800">로그인 완료! 이제 분석을 시작하세요</span>
                </div>
              </div>
              
              {/* Single Primary Action */}
              <button 
                onClick={() => router.push('/submit')}
                className="group bg-gradient-to-r from-blue-600 to-blue-700 text-white px-12 py-5 rounded-2xl font-bold text-xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-2xl relative overflow-hidden mb-4"
              >
                <span className="relative z-10">✨ 내 아이디어 분석 시작</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
              </button>
              
              <div className="text-sm text-slate-600">
                또는 <button onClick={() => router.push('/trends')} className="text-blue-600 hover:text-blue-700 underline">인기 트렌드 먼저 둘러보기</button>
              </div>
            </div>
          ) : (
            /* Unauthenticated User - ONE CLEAR PATH */
            <div className="mb-8">
              {/* Dominant Single Action */}
              <button 
                onClick={() => signInWithPopup(auth, googleProvider)}
                className="group bg-gradient-to-r from-blue-600 to-blue-700 text-white px-12 py-5 rounded-2xl font-bold text-xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-2xl relative overflow-hidden mb-4"
              >
                <span className="relative z-10">✨ 30초 무료 체험 시작</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
              </button>
              
              <div className="text-sm text-slate-600 mb-4">
                Google 계정으로 즉시 시작 • 신용카드 불필요
              </div>
              
              <div className="text-sm text-slate-600">
                궁금한 점이 있나요? <a href="/about" className="text-blue-600 hover:text-blue-700 underline">작동 원리 알아보기</a>
              </div>
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