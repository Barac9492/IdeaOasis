'use client';
import { ArrowLeft, FileText, Clock, Database, CheckCircle, AlertTriangle } from 'lucide-react';

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <a href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="w-4 h-4" />
            홈으로 돌아가기
          </a>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">분석 방법론 및 데이터 소스</h1>
            <p className="text-slate-600">
              IdeaOasis의 규제 분석이 어떤 법령과 데이터를 기반으로 하는지, 
              어떻게 업데이트되는지 투명하게 공개합니다.
            </p>
          </div>
        </div>

        {/* Update Cadence */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-blue-900">업데이트 주기</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white p-4 rounded-lg">
              <div className="font-semibold text-blue-800 mb-2">주요 법령</div>
              <div className="text-blue-700">매주 모니터링</div>
              <div className="text-xs text-blue-600 mt-1">국가법령정보센터 자동 확인</div>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="font-semibold text-blue-800 mb-2">규제 해석</div>
              <div className="text-blue-700">월 1회 검토</div>
              <div className="text-xs text-blue-600 mt-1">법무법인 검증 후 반영</div>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="font-semibold text-blue-800 mb-2">비용 정보</div>
              <div className="text-blue-700">분기별 업데이트</div>
              <div className="text-xs text-blue-600 mt-1">시장 조사 및 실제 사례 기반</div>
            </div>
          </div>
        </div>

        {/* Legal Corpus */}
        <div className="bg-white rounded-xl p-6 mb-8 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <Database className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold">법령 데이터베이스 (2024년 8월 기준)</h2>
          </div>
          
          <div className="space-y-6">
            {/* 전자상거래 관련 */}
            <div>
              <h3 className="font-semibold text-lg mb-3 text-slate-800">전자상거래 및 핀테크</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="font-medium mb-2">전자금융거래법</div>
                  <div className="text-sm text-slate-600 mb-2">법률 제19471호 (2023.7.18. 개정)</div>
                  <div className="text-xs text-slate-500">
                    • 전자지급결제대행업 등록 기준<br/>
                    • 전자금융업 허가 조건<br/>
                    • 전자화폐 발행 규제
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="font-medium mb-2">전자상거래법</div>
                  <div className="text-sm text-slate-600 mb-2">법률 제18915호 (2022.6.10. 개정)</div>
                  <div className="text-xs text-slate-500">
                    • 통신판매업 신고<br/>
                    • 소비자 보호 의무<br/>
                    • 환불 및 취소 규정
                  </div>
                </div>
              </div>
            </div>

            {/* 개인정보 및 데이터 */}
            <div>
              <h3 className="font-semibold text-lg mb-3 text-slate-800">개인정보 및 데이터</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="font-medium mb-2">개인정보보호법</div>
                  <div className="text-sm text-slate-600 mb-2">법률 제18298호 (2021.9.14. 개정)</div>
                  <div className="text-xs text-slate-500">
                    • 개인정보 처리 동의<br/>
                    • 개인정보보호책임자 지정<br/>
                    • 국외이전 승인 절차
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="font-medium mb-2">정보통신망법</div>
                  <div className="text-sm text-slate-600 mb-2">법률 제18525호 (2021.12.7. 개정)</div>
                  <div className="text-xs text-slate-500">
                    • 온라인 서비스 신고<br/>
                    • 게시판 운영 의무<br/>
                    • 불법정보 차단 조치
                  </div>
                </div>
              </div>
            </div>

            {/* 금융 및 투자 */}
            <div>
              <h3 className="font-semibold text-lg mb-3 text-slate-800">금융 및 투자</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="font-medium mb-2">자본시장법</div>
                  <div className="text-sm text-slate-600 mb-2">법률 제19524호 (2023.7.4. 개정)</div>
                  <div className="text-xs text-slate-500">
                    • 크라우드펀딩 규제<br/>
                    • 투자자문업 등록<br/>
                    • 가상자산 규제
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="font-medium mb-2">특정금융정보법</div>
                  <div className="text-sm text-slate-600 mb-2">법률 제18068호 (2021.4.20. 개정)</div>
                  <div className="text-xs text-slate-500">
                    • 자금세탁방지 의무<br/>
                    • 고객확인절차<br/>
                    • 의심거래 신고
                  </div>
                </div>
              </div>
            </div>

            {/* 플랫폼 및 공유경제 */}
            <div>
              <h3 className="font-semibold text-lg mb-3 text-slate-800">플랫폼 및 공유경제</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="font-medium mb-2">여객자동차운수사업법</div>
                  <div className="text-sm text-slate-600 mb-2">법률 제18417호 (2021.8.17. 개정)</div>
                  <div className="text-xs text-slate-500">
                    • 택시 플랫폼 운영<br/>
                    • 카풀 서비스 제한<br/>
                    • 운송사업 허가 기준
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="font-medium mb-2">관광진흥법</div>
                  <div className="text-sm text-slate-600 mb-2">법률 제18352호 (2021.7.20. 개정)</div>
                  <div className="text-xs text-slate-500">
                    • 숙박업 신고<br/>
                    • 숙박공유업 등록<br/>
                    • 관광사업 등록 기준
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Methodology */}
        <div className="bg-white rounded-xl p-6 mb-8 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-semibold">분석 방법론</h2>
          </div>
          
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">🤖</span>
                </div>
                <h4 className="font-semibold mb-2">1. AI 법령 매칭</h4>
                <p className="text-sm text-slate-600">
                  입력된 비즈니스 모델을 200+ 개 법령과 자동 대조하여 관련성 점수 산출
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">⚖️</span>
                </div>
                <h4 className="font-semibold mb-2">2. 전문가 검증</h4>
                <p className="text-sm text-slate-600">
                  법무법인 및 규제 전문가가 AI 분석 결과를 월 1회 검토 및 보정
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">📊</span>
                </div>
                <h4 className="font-semibold mb-2">3. 실제 사례 반영</h4>
                <p className="text-sm text-slate-600">
                  기존 해외 기업들의 한국 진출 사례 및 비용 데이터를 지속적으로 수집
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Sources */}
        <div className="bg-white rounded-xl p-6 mb-8 shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold mb-6">참조 데이터 소스</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-medium">국가법령정보센터 (law.go.kr)</div>
                <div className="text-sm text-slate-600">실시간 법령 개정 정보 및 해석례</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-medium">각 부처 고시 및 규정</div>
                <div className="text-sm text-slate-600">금융위, 방통위, 공정위 등 규제기관 공고</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-medium">기업 등록 사례</div>
                <div className="text-sm text-slate-600">공개된 허가/등록 현황 및 소요 기간</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-medium">업계 컨설팅 비용</div>
                <div className="text-sm text-slate-600">법무법인 및 컨설팅사 공개 요율표</div>
              </div>
            </div>
          </div>
        </div>

        {/* Limitations */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
            <h2 className="text-xl font-semibold text-yellow-800">분석의 한계 및 주의사항</h2>
          </div>
          <div className="space-y-3 text-sm text-yellow-800">
            <div className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span><strong>예비 검토 목적:</strong> 상세한 법무 자문을 대체하지 않으며, 실제 사업 추진 시 전문가 상담 필수</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span><strong>법령 변경:</strong> 규제는 수시로 변경되므로 최신 정보 확인 및 전문가 검증 필요</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span><strong>개별 상황:</strong> 기업 규모, 자본금, 사업 구조에 따라 적용 법령과 비용이 달라질 수 있음</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span><strong>비용 추정:</strong> 실제 비용은 시장 상황 및 개별 협상에 따라 차이날 수 있음</span>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-slate-100 rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold mb-4">분석 방법론에 대한 문의</h3>
          <p className="text-slate-600 mb-4">
            더 상세한 분석 과정이 궁금하시거나, 특정 법령에 대한 질문이 있으시면 연락주세요.
          </p>
          <div className="text-sm text-slate-500">
            📧 method@ideaoasis.co.kr | 📞 1588-0000
          </div>
        </div>

      </div>
    </div>
  );
}