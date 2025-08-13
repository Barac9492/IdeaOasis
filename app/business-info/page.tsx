'use client';
import { ArrowLeft, Building, FileText, AlertTriangle, CheckCircle } from 'lucide-react';

export default function BusinessInfoPage() {
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
            <h1 className="text-3xl font-bold text-slate-900 mb-4">사업자 정보</h1>
            <p className="text-slate-600">
              IdeaOasis의 사업자 등록 정보 및 통신판매업 신고 현황을 투명하게 공개합니다.
            </p>
          </div>
        </div>

        {/* Current Status */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
            <h2 className="text-xl font-semibold text-yellow-800">현재 상태 (2024년 8월 기준)</h2>
          </div>
          <div className="space-y-3 text-sm text-yellow-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span><strong>사업자등록:</strong> 준비 중 (2024년 8월 말 예정)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span><strong>통신판매업 신고:</strong> 사업자등록 완료 후 진행 예정</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span><strong>서비스 운영:</strong> 베타 서비스로 무료 제공 중</span>
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div className="bg-white rounded-xl p-6 mb-8 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <Building className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold">회사 정보</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="font-semibold text-slate-700 mb-1">회사명</div>
                <div className="text-slate-600">IdeaOasis (아이디어오아시스)</div>
              </div>
              
              <div>
                <div className="font-semibold text-slate-700 mb-1">대표자</div>
                <div className="text-slate-600">조여준</div>
              </div>
              
              <div>
                <div className="font-semibold text-slate-700 mb-1">사업자등록번호</div>
                <div className="text-orange-600 font-medium">[2024년 8월 말 등록 예정]</div>
              </div>
              
              <div>
                <div className="font-semibold text-slate-700 mb-1">통신판매업 신고번호</div>
                <div className="text-orange-600 font-medium">[사업자등록 후 신고 예정]</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="font-semibold text-slate-700 mb-1">소재지</div>
                <div className="text-slate-600">서울특별시 [상세 주소 등록 예정]</div>
              </div>
              
              <div>
                <div className="font-semibold text-slate-700 mb-1">업종</div>
                <div className="text-slate-600">소프트웨어 개발 및 공급업</div>
              </div>
              
              <div>
                <div className="font-semibold text-slate-700 mb-1">연락처</div>
                <div className="text-slate-600">
                  <div>전화: 1588-0000</div>
                  <div>이메일: support@ideaoasis.co.kr</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Process */}
        <div className="bg-white rounded-xl p-6 mb-8 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold">등록 진행 현황</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="font-semibold">1. 서비스 개발 및 베타 테스트</div>
                <div className="text-sm text-slate-600">완료 (2024년 8월)</div>
              </div>
              <div className="text-green-600 font-medium">완료</div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              </div>
              <div className="flex-1">
                <div className="font-semibold">2. 사업자등록 신청</div>
                <div className="text-sm text-slate-600">진행 중 (2024년 8월 말 예정)</div>
              </div>
              <div className="text-orange-600 font-medium">진행 중</div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
              </div>
              <div className="flex-1">
                <div className="font-semibold">3. 통신판매업 신고</div>
                <div className="text-sm text-slate-600">사업자등록 완료 후 즉시 진행</div>
              </div>
              <div className="text-slate-500 font-medium">대기 중</div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
              </div>
              <div className="flex-1">
                <div className="font-semibold">4. 정식 서비스 런칭</div>
                <div className="text-sm text-slate-600">모든 등록 절차 완료 후</div>
              </div>
              <div className="text-slate-500 font-medium">대기 중</div>
            </div>
          </div>
        </div>

        {/* Legal Compliance */}
        <div className="bg-white rounded-xl p-6 mb-8 shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold mb-6">법적 의무 준수 현황</h2>
          
          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div className="font-semibold text-green-800">전자상거래법</div>
                </div>
                <div className="text-sm text-green-700">
                  • 이용약관 게시<br/>
                  • 개인정보처리방침 게시<br/>
                  • 사업자 정보 공개
                </div>
              </div>
              
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div className="font-semibold text-green-800">개인정보보호법</div>
                </div>
                <div className="text-sm text-green-700">
                  • 개인정보보호책임자 지정<br/>
                  • 수집·이용 동의 절차<br/>
                  • 개인정보 암호화
                </div>
              </div>
              
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <div className="font-semibold text-orange-800">통신판매업법</div>
                </div>
                <div className="text-sm text-orange-700">
                  • 사업자등록 후 신고<br/>
                  • 소비자 분쟁처리 기준<br/>
                  • 거래 기록 보관
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Service Scope During Beta */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">베타 서비스 기간 중 서비스 범위</h2>
          <div className="space-y-3 text-sm text-blue-800">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
              <span><strong>무료 제공:</strong> 모든 분석 서비스를 무료로 제공합니다</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
              <span><strong>피드백 수집:</strong> 서비스 개선을 위한 사용자 의견을 적극 수렴합니다</span>
            </div>
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-blue-600 mt-0.5" />
              <span><strong>책임 제한:</strong> 베타 서비스로서 분석 결과의 정확성을 보장하지 않습니다</span>
            </div>
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-blue-600 mt-0.5" />
              <span><strong>법률 자문 아님:</strong> 모든 분석은 참고용이며, 실제 사업 추진 시 전문가 상담 필수입니다</span>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-slate-100 rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold mb-4">사업자 정보 관련 문의</h3>
          <p className="text-slate-600 mb-4">
            사업자등록 진행 현황이나 법적 의무 준수에 대한 문의사항이 있으시면 연락주세요.
          </p>
          <div className="text-sm text-slate-500">
            📧 legal@ideaoasis.co.kr | 📞 1588-0000
          </div>
          
          <div className="mt-6 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
            <div className="text-sm text-yellow-800">
              <strong>업데이트 예정:</strong> 사업자등록 완료 시 즉시 이 페이지를 업데이트하겠습니다.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}