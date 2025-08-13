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
            The $400M Mistake Newsletter
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Every week: One foreign company that burned millions in Korea, and one that didn't. 
            <br/>Learn the difference before you become the cautionary tale.
          </p>
          
          {/* This Week's Story Preview */}
          <div className="bg-gradient-to-br from-red-900 to-orange-900 rounded-2xl p-8 max-w-4xl mx-auto mb-8 text-left relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold">
              이번 주 스토리
            </div>
            
            <div className="text-white">
              <h3 className="text-2xl font-bold mb-6">DoorDash vs. Coupang Eats: The $400M Lesson</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-red-800/30 rounded-lg p-4 border border-red-700">
                  <h4 className="font-bold text-red-200 mb-2">💀 DoorDash Korea</h4>
                  <div className="text-red-100 text-sm space-y-1">
                    <div>• $400M invested</div>
                    <div>• Ignored motorcycle delivery culture</div>
                    <div>• Failed food safety compliance</div>
                    <div>• <strong>Result: Complete withdrawal</strong></div>
                  </div>
                </div>
                
                <div className="bg-green-800/30 rounded-lg p-4 border border-green-700">
                  <h4 className="font-bold text-green-200 mb-2">✅ Coupang Eats</h4>
                  <div className="text-green-100 text-sm space-y-1">
                    <div>• Studied regulations first</div>
                    <div>• Adapted to Korean delivery culture</div>
                    <div>• Motorcycle licenses from day 1</div>
                    <div>• <strong>Result: 25% market share</strong></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-yellow-900/30 rounded-lg p-4 border border-yellow-600">
                <p className="text-yellow-100 text-sm">
                  <strong>The difference?</strong> DoorDash assumed Korean customers would adapt to American delivery. 
                  Coupang built American efficiency around Korean expectations.
                </p>
              </div>
            </div>
          </div>
          
          {/* Newsletter value prop */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Every Thursday: One $100M+ Mistake You Can Avoid
            </h2>
            <p className="text-slate-600 mb-6">
              📧 Get the full DoorDash case study + next week's preview. No regulatory jargon, just expensive lessons.
            </p>
          </div>
        </div>
        
        {/* The Real Problem - Death Spiral */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8 mb-12 text-center border border-red-200">
          <h2 className="text-2xl font-bold mb-6 text-slate-900">
            창업가들이 겪는 규제 데스 스파이럴
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">💀</span>
              </div>
              <h3 className="font-bold text-lg mb-2">18개월 개발</h3>
              <p className="text-slate-600 text-sm">해외 성공 모델 그대로 복사해서 열심히 개발</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">⚠️</span>
              </div>
              <h3 className="font-bold text-lg mb-2">런칭 직전 발견</h3>
              <p className="text-slate-600 text-sm">"이거 한국에서 불법이네?" 늦은 규제 발견</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">💸</span>
              </div>
              <h3 className="font-bold text-lg mb-2">전부 다시</h3>
              <p className="text-slate-600 text-sm">비즈니스 모델 대폭 수정 또는 사업 포기</p>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-white rounded-lg border border-orange-200">
            <p className="text-orange-800 font-medium">
              💡 <strong>Uber, Airbnb, Clubhouse...</strong> 모두 같은 실수를 했습니다
            </p>
          </div>
        </div>

        {/* ZERO-FRICTION CTA - Pure Emotion → Action */}
        <div className="text-center">
          {user ? (
            /* Authenticated User - Direct to Magic */
            <div className="mb-8">              
              <button 
                onClick={() => router.push('/subscribe')}
                className="group bg-gradient-to-r from-blue-600 to-blue-700 text-white px-16 py-6 rounded-2xl font-bold text-2xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-2xl hover:shadow-3xl relative overflow-hidden mb-4"
              >
                <span className="relative z-10">📧 Get This Week's Story</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
              </button>
              
              <p className="text-slate-600 text-sm">Free weekly case studies. Unsubscribe anytime.</p>
            </div>
          ) : (
            /* Unauthenticated User - Pure Desire */
            <div className="mb-8">
              <button 
                onClick={() => signInWithPopup(auth, googleProvider)}
                className="group bg-gradient-to-r from-orange-500 to-red-500 text-white px-16 py-6 rounded-2xl font-bold text-2xl hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200 shadow-2xl hover:shadow-3xl relative overflow-hidden mb-4 animate-pulse"
              >
                <span className="relative z-10">📧 Send Me The Stories</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
              </button>
              
              <p className="text-slate-600 text-sm">
                Google signup → Weekly $100M+ lessons in your inbox
              </p>
            </div>
          )}
          
          {/* Social Proof + Trending Link */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-full border-2 border-white"></div>
                </div>
                <span className="font-medium">스마트한 창업가들이 사용 중</span>
              </div>
              <div className="w-px h-4 bg-slate-300"></div>
              <div className="flex items-center gap-1">
                <span>⭐⭐⭐⭐⭐</span>
                <span className="font-medium">4.8/5</span>
              </div>
            </div>
            
            {/* New: Link to trending */}
            <div className="text-center">
              <a href="/trending" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                🔥 다른 사람들이 분석 중인 모델 보기
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
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
      <div className="bg-gradient-to-br from-red-900 to-red-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-4">
            또 다른 Uber, Airbnb, Clubhouse가 되지 마세요
          </h3>
          <p className="text-xl mb-8 text-red-100">
            18개월 개발 후 "불법"이라는 말을 듣기 전에, 지금 확인하세요
          </p>
          <button 
            onClick={() => signInWithPopup(auth, googleProvider)}
            className="bg-white text-red-900 px-8 py-4 rounded-lg font-medium text-lg hover:bg-red-50 shadow-lg"
          >
            💀 규제 데스 스파이럴 피하기
          </button>
          
          {/* Legal Disclaimer */}
          <div className="mt-8 pt-8 border-t border-slate-700">
            <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4 text-left max-w-2xl mx-auto">
              <h4 className="font-semibold text-yellow-200 mb-2">⚠️ 중요 고지사항</h4>
              <div className="text-sm text-yellow-100 space-y-1">
                <p>• 본 서비스는 <strong>법률 자문이 아닌</strong> 일반적인 규제 정보 제공 목적입니다</p>
                <p>• 실제 사업 추진 시 반드시 <strong>변호사 등 전문가 상담</strong>을 받으시기 바랍니다</p>
                <p>• 규제 정보는 변경될 수 있으며, 최신 정보 확인이 필요합니다</p>
                <p>• 분석 결과에 대한 책임은 <strong>이용자 본인</strong>에게 있습니다</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}