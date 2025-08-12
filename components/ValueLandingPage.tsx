'use client';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

export default function ValueLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero - The Problem */}
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-6">
          해외 비즈니스 모델, 한국에서 성공할 수 있을까?
        </h1>
        <p className="text-xl text-slate-600 mb-8">
          우버, 에어비앤비, 페이팔이 실패한 이유를 미리 알았다면? 성공한 쿠팡, 카카오T, 배민의 전략을 분석해드립니다.
        </p>
        
        {/* The Value */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">해외 비즈니스 모델을 한국에 도입하기 전에 확인하세요:</h2>
          <div className="space-y-3 text-lg">
            <div>✓ 200+ 개의 한국 규제법령 분석</div>
            <div>✓ 성공한 한국 기업들의 현지화 전략</div>
            <div>✓ 실제 라이선스 비용과 컴플라이언스 요구사항</div>
            <div>✓ 기존 한국 경쟁사 및 시장 점유율 분석</div>
          </div>
        </div>

        <button 
          onClick={() => signInWithPopup(auth, googleProvider)}
          className="bg-slate-900 text-white px-8 py-4 rounded-lg font-medium text-lg hover:bg-slate-800"
        >
          내 아이디어 한국 적합성 검증받기
        </button>
      </div>

      {/* Proof */}
      <div className="bg-slate-50 border-t border-slate-200 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="text-2xl font-semibold mb-8">실패 vs 성공: 똑같은 아이디어, 다른 결과</h3>
          
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