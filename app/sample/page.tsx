'use client';
import { ArrowLeft, AlertTriangle, DollarSign, Building, FileText, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SampleReportPage() {
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
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">💳</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">분석 샘플: Stripe 유형 온라인 결제 서비스</h1>
                <p className="text-slate-600">한국 진출 규제 분석 리포트 (샘플)</p>
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                <strong>📋 샘플 목적:</strong> 실제 분석 결과의 형태와 내용을 보여드리기 위한 예시입니다. 
                실제 서비스에서는 입력하신 모델에 맞는 맞춤 분석을 제공합니다.
              </p>
            </div>
          </div>
        </div>

        {/* Analysis Summary */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">분석 요약</h2>
            <div className="text-sm text-slate-500">분석일: 2024-08-13</div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-3xl font-bold text-orange-600 mb-2">75</div>
              <div className="text-sm font-medium text-orange-800">규제 리스크 점수</div>
              <div className="text-xs text-orange-600 mt-1">높음 (70+ 고위험)</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-3xl font-bold text-blue-600 mb-2">6</div>
              <div className="text-sm font-medium text-blue-800">주요 관련 법령</div>
              <div className="text-xs text-blue-600 mt-1">전자금융거래법 등</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-3xl font-bold text-purple-600 mb-2">12-18</div>
              <div className="text-sm font-medium text-purple-800">예상 준비 기간 (개월)</div>
              <div className="text-xs text-purple-600 mt-1">라이선스 포함</div>
            </div>
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
            <h3 className="text-lg font-semibold">주요 규제 리스크</h3>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-2">전자금융거래법 (높음)</h4>
              <p className="text-sm text-red-700 mb-2">전자지급결제대행업 등록 필수 (금융위원회)</p>
              <div className="text-xs text-red-600">
                • 자본금 요건: 20억원 이상<br/>
                • 전산설비 기준 충족<br/>
                • 내부통제기준 수립
              </div>
            </div>
            
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">개인정보보호법 (중간)</h4>
              <p className="text-sm text-yellow-700 mb-2">결제 정보 처리 시 고도화된 보안 조치 필요</p>
              <div className="text-xs text-yellow-600">
                • 암호화 의무<br/>
                • 개인정보보호책임자 지정<br/>
                • 정기적 보안 점검
              </div>
            </div>
            
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h4 className="font-semibold text-orange-800 mb-2">특정금융정보법 (중간)</h4>
              <p className="text-sm text-orange-700 mb-2">자금세탁방지 의무 및 고객확인절차</p>
              <div className="text-xs text-orange-600">
                • 의심거래 신고<br/>
                • 고객신원확인<br/>
                • 자금세탁방지 프로그램 운영
              </div>
            </div>
          </div>
        </div>

        {/* Required Licenses & Costs */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold">라이선스 및 예상 비용</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left p-3 font-medium text-slate-700">구분</th>
                  <th className="text-left p-3 font-medium text-slate-700">비용 범위</th>
                  <th className="text-left p-3 font-medium text-slate-700">소요 기간</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-3">전자지급결제대행업 등록</td>
                  <td className="p-3 font-semibold">₩20억+ (자본금)</td>
                  <td className="p-3">6-12개월</td>
                </tr>
                <tr>
                  <td className="p-3">법무 컨설팅</td>
                  <td className="p-3">₩50-100M</td>
                  <td className="p-3">3-6개월</td>
                </tr>
                <tr>
                  <td className="p-3">시스템 구축 및 보안</td>
                  <td className="p-3">₩300-500M</td>
                  <td className="p-3">6-12개월</td>
                </tr>
                <tr>
                  <td className="p-3">연간 컴플라이언스</td>
                  <td className="p-3">₩100-200M/년</td>
                  <td className="p-3">지속적</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Korean Market Players */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <Building className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold">한국 시장 주요 플레이어</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="font-semibold mb-2">토스페이먼츠</h4>
              <p className="text-sm text-slate-600 mb-2">시장 점유율: ~25%</p>
              <div className="text-xs text-slate-500">
                • 간편결제 + PG 서비스<br/>
                • 개발자 친화적 API<br/>
                • 높은 브랜드 인지도
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="font-semibold mb-2">이니시스, KG 이니시스</h4>
              <p className="text-sm text-slate-600 mb-2">시장 점유율: ~40%</p>
              <div className="text-xs text-slate-500">
                • 전통 PG 업체<br/>
                • 대기업 고객 기반<br/>
                • 레거시 시스템 기반
              </div>
            </div>
          </div>
        </div>

        {/* Success Factors */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-green-800">성공 가능성을 높이는 요소</h3>
          </div>
          
          <div className="space-y-3 text-sm text-green-700">
            <div className="flex items-start gap-2">
              <span className="mt-1">✓</span>
              <span><strong>충분한 자본력:</strong> 최소 50억원 이상의 초기 투자 확보</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-1">✓</span>
              <span><strong>현지 파트너십:</strong> 기존 금융기관 또는 핀테크와의 전략적 제휴</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-1">✓</span>
              <span><strong>차별화된 기술:</strong> 기존 업체 대비 명확한 기술적 우위</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-1">✓</span>
              <span><strong>전문 인력:</strong> 한국 금융 규제 경험이 있는 컴플라이언스 팀</span>
            </div>
          </div>
        </div>

        {/* Sources & Methodology */}
        <div className="bg-slate-100 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-6 h-6 text-slate-600" />
            <h3 className="text-lg font-semibold text-slate-700">분석 근거 및 한계</h3>
          </div>
          
          <div className="space-y-4 text-sm text-slate-600">
            <div>
              <h4 className="font-semibold mb-2">참조 법령 (2024년 8월 기준)</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>전자금융거래법 (법률 제19471호, 2023.7.18. 개정)</li>
                <li>특정 금융거래정보의 보고 및 이용 등에 관한 법률</li>
                <li>개인정보보호법 (법률 제18298호, 2021.9.14. 개정)</li>
                <li>전자상거래 등에서의 소비자보호에 관한 법률</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">분석 방법론</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>공개된 법령 및 규정 검토</li>
                <li>기존 사업자 등록 사례 분석</li>
                <li>업계 전문가 인터뷰 (익명)</li>
                <li>공개 자료 기반 시장 분석</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">⚠️ 분석의 한계</h4>
              <ul className="list-disc list-inside space-y-1 text-yellow-700">
                <li>일반적인 규제 정보 제공 목적이며, 개별 상황에 따라 달라질 수 있음</li>
                <li>법령 및 규정은 수시로 변경되므로 최신 정보 확인 필요</li>
                <li>실제 사업 추진 시 전문 변호사 상담 필수</li>
                <li>비용 추정치는 참고용이며 실제 비용과 차이날 수 있음</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 text-center">
          <h3 className="text-xl font-semibold mb-4">내 아이디어도 분석받고 싶다면?</h3>
          <p className="text-slate-600 mb-6">
            위와 같은 상세 분석을 원하는 비즈니스 모델로 받아보세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              무료 분석 시작하기
            </Button>
            <Button variant="outline" size="lg">
              더 많은 샘플 보기
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}