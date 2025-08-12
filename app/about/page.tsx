'use client';
import { TrendingUp, Shield, CheckCircle, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-slate-50 to-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
            해외 비즈니스 모델의 <span className="text-blue-600">한국 진출</span>을 위한
            <br />가장 스마트한 방법
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            IdeaOasis는 한국의 복잡한 규제 환경을 분석하여 해외 비즈니스 모델의 성공 가능성을 사전에 검증하는 
            AI 기반 플랫폼입니다.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              무료로 시작하기
            </Button>
            <Button variant="outline" size="lg">
              데모 보기
            </Button>
          </div>
        </div>
      </div>

      {/* Problem Section */}
      <div className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              왜 해외 기업들이 한국에서 실패할까요?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              성공한 해외 모델도 한국의 독특한 규제 환경과 문화적 차이로 인해 실패하는 경우가 많습니다.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">복잡한 규제 환경</h3>
              <p className="text-slate-600 text-sm">
                200개 이상의 법령과 규제가 얽혀있어 진출 전 사전 검토 없이는 
                예상치 못한 법적 리스크에 직면하게 됩니다.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">높은 진출 비용</h3>
              <p className="text-slate-600 text-sm">
                라이선스, 법무, 컴플라이언스 비용이 예상보다 높아 
                초기 자금 계획이 무너지는 경우가 빈번합니다.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">문화적 차이</h3>
              <p className="text-slate-600 text-sm">
                한국 소비자의 독특한 선호도와 비즈니스 문화를 이해하지 못해 
                시장 진입에 실패하는 사례가 많습니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              어떻게 작동하나요?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              AI 기반 분석으로 3분 만에 한국 진출 가능성을 정확하게 평가해드립니다.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-4 gap-8 mb-16">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl transform rotate-6 group-hover:rotate-3 transition-transform duration-300"></div>
              <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6 mx-auto">
                  <span className="text-3xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-xl font-bold text-center mb-4">비즈니스 모델 입력</h3>
                <p className="text-slate-600 text-center">
                  도입하고 싶은 해외 비즈니스 모델의 핵심 특징과 
                  서비스 내용을 간단히 설명해주세요.
                </p>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl transform rotate-6 group-hover:rotate-3 transition-transform duration-300"></div>
              <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
                <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6 mx-auto">
                  <span className="text-3xl font-bold text-purple-600">2</span>
                </div>
                <h3 className="text-xl font-bold text-center mb-4">AI 규제 분석</h3>
                <p className="text-slate-600 text-center">
                  200개 이상의 한국 법령과 규제를 자동으로 검토하여 
                  리스크 점수를 0-100점으로 산출합니다.
                </p>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl transform rotate-6 group-hover:rotate-3 transition-transform duration-300"></div>
              <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6 mx-auto">
                  <span className="text-3xl font-bold text-green-600">3</span>
                </div>
                <h3 className="text-xl font-bold text-center mb-4">성공 사례 분석</h3>
                <p className="text-slate-600 text-center">
                  유사한 모델로 성공한 한국 기업들의 현지화 전략과 
                  적응 방식을 상세히 분석해드립니다.
                </p>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl transform rotate-6 group-hover:rotate-3 transition-transform duration-300"></div>
              <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
                <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mb-6 mx-auto">
                  <span className="text-3xl font-bold text-orange-600">4</span>
                </div>
                <h3 className="text-xl font-bold text-center mb-4">실행 계획 제공</h3>
                <p className="text-slate-600 text-center">
                  필요한 라이선스, 예상 비용, 경쟁사 분석, 
                  단계별 실행 로드맵을 제공합니다.
                </p>
              </div>
            </div>
          </div>
          
          {/* Process Flow */}
          <div className="flex justify-center mb-16">
            <div className="hidden lg:flex items-center gap-4">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-green-500"></div>
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-orange-500"></div>
              <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              왜 IdeaOasis를 선택해야 할까요?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">실시간 업데이트</h3>
              <p className="text-slate-600 text-sm">
                정부 규제 변화를 실시간으로 추적하여 
                항상 최신 정보를 제공합니다.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">검증된 데이터</h3>
              <p className="text-slate-600 text-sm">
                300개 이상의 실제 한국 진출 사례를 
                바탕으로 한 신뢰할 수 있는 분석입니다.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">빠른 분석</h3>
              <p className="text-slate-600 text-sm">
                기존에 수개월 걸리던 시장 조사를 
                단 3분 만에 완료할 수 있습니다.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">비용 절약</h3>
              <p className="text-slate-600 text-sm">
                컨설팅 비용을 90% 절약하면서도 
                더 정확한 분석 결과를 얻을 수 있습니다.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">한국 특화</h3>
              <p className="text-slate-600 text-sm">
                한국의 독특한 규제 환경과 비즈니스 문화에 
                특화된 분석을 제공합니다.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">지속적 모니터링</h3>
              <p className="text-slate-600 text-sm">
                관심 모델을 watchlist에 저장하여 
                규제 변화를 지속적으로 추적할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Stories */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              성공 사례
            </h2>
            <p className="text-lg text-slate-600">
              IdeaOasis로 성공적인 한국 진출을 이뤄낸 기업들의 이야기
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8 border border-green-200">
              <h3 className="text-xl font-bold text-green-800 mb-4">
                "6개월 단축된 시장 진입"
              </h3>
              <p className="text-green-700 mb-4">
                "기존에 1년 걸릴 것으로 예상했던 시장 조사와 법무 검토를 
                IdeaOasis로 6개월 단축했습니다. 덕분에 경쟁사보다 빠르게 시장에 진입할 수 있었어요."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-green-800">김</span>
                </div>
                <div>
                  <div className="font-semibold text-green-800">김대표</div>
                  <div className="text-sm text-green-600">핀테크 스타트업 CEO</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 border border-blue-200">
              <h3 className="text-xl font-bold text-blue-800 mb-4">
                "예상 비용의 정확성에 놀라"
              </h3>
              <p className="text-blue-700 mb-4">
                "IdeaOasis에서 제시한 진출 비용이 실제와 거의 일치했습니다. 
                덕분에 자금 계획을 정확하게 세울 수 있었고, 예상치 못한 추가 비용 없이 성공적으로 론칭했어요."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-800">박</span>
                </div>
                <div>
                  <div className="font-semibold text-blue-800">박이사</div>
                  <div className="text-sm text-blue-600">글로벌 테크 기업</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            지금 바로 시작해보세요
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            3분 만에 내 아이디어의 한국 진출 가능성을 확인해보세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
              무료 분석 시작하기
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-slate-900">
              트렌드 모델 둘러보기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}