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
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            해외 모델을 한국에 도입하기 전
            <span className="block text-blue-600 mt-2">규제 리스크를 미리 확인하세요</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-700 mb-12 max-w-3xl mx-auto leading-relaxed">
            우버•에어비앤비•페이팔의 실패를 반복하지 마세요.<br className="hidden sm:block" />
            <strong className="text-slate-900">성공한 쿠팡•카카오T•배민의 현지화 전략</strong>을 분석해드립니다.
          </p>
        </div>
        
        {/* Value Proposition - Enhanced with visual elements */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 mb-12 shadow-lg relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-50 to-transparent rounded-full transform translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-50 to-transparent rounded-full transform -translate-x-12 translate-y-12"></div>
          
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center text-slate-900">
              3분만에 확인하는 <span className="text-blue-600">한국 진출 가능성</span>
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">200+ 규제법령 분석</h3>
                  <p className="text-sm text-slate-600">실시간 업데이트되는 정부 승인 데이터베이스</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">성공 기업 전략 분석</h3>
                  <p className="text-sm text-slate-600">검증된 현지화 사례와 실제 적용 방법</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">정확한 진출 비용</h3>
                  <p className="text-sm text-slate-600">라이선스부터 월간 컴플라이언스까지</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">경쟁 환경 파악</h3>
                  <p className="text-sm text-slate-600">시장 점유율과 차별화 포인트 분석</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced CTA Section */}
        <div className="text-center">
          {user ? (
            /* Authenticated User CTAs */
            <div className="mb-8">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6 max-w-md mx-auto">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-semibold text-green-800">로그인 완료!</span>
                </div>
                <p className="text-sm text-green-700">이제 규제 분석과 트렌드 모델을 자유롭게 이용하실 수 있습니다.</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => router.push('/submit')}
                  className="group bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl min-h-[60px] relative overflow-hidden"
                >
                  <span className="relative z-10">🚀 규제 분석 시작하기</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                </button>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="group border-2 border-slate-300 text-slate-700 px-8 py-4 rounded-xl font-medium text-lg hover:border-slate-400 hover:bg-slate-50 text-center min-h-[60px] flex items-center justify-center transition-all duration-200"
                >
                  <span className="mr-2">📊</span>
                  <span>내 대시보드 보기</span>
                </button>
              </div>
            </div>
          ) : (
            /* Unauthenticated User CTAs */
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button 
                onClick={() => signInWithPopup(auth, googleProvider)}
                className="group bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl min-h-[60px] relative overflow-hidden"
              >
                <span className="relative z-10">🚀 무료 규제 분석 시작하기</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
              </button>
              <a
                href="/about"
                className="group border-2 border-slate-300 text-slate-700 px-8 py-4 rounded-xl font-medium text-lg hover:border-slate-400 hover:bg-slate-50 text-center min-h-[60px] flex items-center justify-center transition-all duration-200"
              >
                <span className="mr-2">📖</span>
                <span>자세히 알아보기</span>
              </a>
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