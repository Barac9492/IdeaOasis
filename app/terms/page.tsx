'use client';
import { ArrowLeft, FileText, AlertTriangle, DollarSign, Scale } from 'lucide-react';

export default function TermsPage() {
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
            <h1 className="text-3xl font-bold text-slate-900 mb-4">서비스 이용약관</h1>
            <p className="text-slate-600">
              IdeaOasis 서비스 이용에 관한 제반 사항과 기타 필요한 사항을 규정합니다.
            </p>
            <div className="mt-4 text-sm text-slate-500">
              최종 개정일: 2024년 8월 13일 | 시행일: 2024년 8월 13일
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-semibold text-red-800">중요 고지사항</h2>
          </div>
          <div className="space-y-3 text-sm text-red-800">
            <div className="flex items-start gap-2">
              <span className="mt-1">⚠️</span>
              <span><strong>법률 자문 면책:</strong> 본 서비스는 법률 자문이 아닌 일반적인 규제 정보 제공 목적입니다</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-1">⚠️</span>
              <span><strong>전문가 상담 필수:</strong> 실제 사업 추진 시 반드시 변호사 등 전문가 상담을 받으시기 바랍니다</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-1">⚠️</span>
              <span><strong>정보 변경 가능성:</strong> 규제 정보는 변경될 수 있으며, 최신 정보 확인이 필요합니다</span>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Article 1 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold">제1조 (목적)</h2>
            </div>
            <div className="space-y-4 text-slate-700">
              <p>
                이 약관은 IdeaOasis(이하 "회사")가 제공하는 규제 분석 서비스(이하 "서비스")의 이용과 관련하여 
                회사와 이용자간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
              </p>
            </div>
          </div>

          {/* Article 2 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold mb-4">제2조 (정의)</h2>
            <div className="space-y-4 text-slate-700">
              <p>이 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
              
              <div className="space-y-3">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="font-semibold mb-2">1. "서비스"</div>
                  <div className="text-sm text-slate-600">
                    회사가 제공하는 해외 비즈니스 모델의 한국 진출 규제 분석 서비스를 의미합니다.
                  </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="font-semibold mb-2">2. "이용자"</div>
                  <div className="text-sm text-slate-600">
                    이 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 의미합니다.
                  </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="font-semibold mb-2">3. "회원"</div>
                  <div className="text-sm text-slate-600">
                    회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 정보를 지속적으로 제공받으며 
                    회사가 제공하는 서비스를 계속적으로 이용할 수 있는 자를 의미합니다.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Article 3 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold mb-4">제3조 (약관의 명시와 개정)</h2>
            <div className="space-y-4 text-slate-700">
              <p>
                ① 회사는 이 약관의 내용과 상호, 영업소 소재지, 대표자의 성명, 사업자등록번호, 
                연락처 등을 이용자가 알 수 있도록 서비스 초기화면에 게시합니다.
              </p>
              <p>
                ② 회사는 관련법을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.
              </p>
              <p>
                ③ 회사가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행약관과 함께 
                그 적용일자 7일 이전부터 적용일자 전일까지 공지합니다.
              </p>
            </div>
          </div>

          {/* Article 4 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold mb-4">제4조 (서비스의 제공)</h2>
            <div className="space-y-4 text-slate-700">
              <p>회사가 제공하는 서비스는 다음과 같습니다.</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">기본 서비스</h4>
                  <ul className="text-sm space-y-1 text-slate-600">
                    <li>• 규제 리스크 분석</li>
                    <li>• 관련 법령 검토</li>
                    <li>• 예상 비용 산정</li>
                    <li>• 경쟁사 현황 제공</li>
                  </ul>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">부가 서비스</h4>
                  <ul className="text-sm space-y-1 text-slate-600">
                    <li>• 분석 결과 저장</li>
                    <li>• 규제 변화 알림</li>
                    <li>• 상세 보고서 제공</li>
                    <li>• 전문가 상담 연결</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Article 5 - Service Limitations */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-6 h-6 text-orange-600" />
              <h2 className="text-xl font-semibold">제5조 (서비스 이용의 제한)</h2>
            </div>
            <div className="space-y-4 text-slate-700">
              <p>① 회사는 다음 각 호에 해당하는 경우 서비스 이용을 제한할 수 있습니다.</p>
              
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <ul className="text-sm space-y-2 text-yellow-800">
                  <li>• 타인의 개인정보를 도용하여 신청하는 경우</li>
                  <li>• 서비스 정보를 허위로 기재한 경우</li>
                  <li>• 사회의 안녕과 질서, 미풍양속을 저해할 목적으로 신청한 경우</li>
                  <li>• 불법적인 목적으로 서비스를 이용하고자 하는 경우</li>
                  <li>• 기타 회사가 정한 이용신청 요건이 미비된 경우</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Article 6 - Liability */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h2 className="text-xl font-semibold">제6조 (책임의 제한)</h2>
            </div>
            <div className="space-y-4 text-slate-700">
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">⚠️ 중요: 법률 자문 면책</h4>
                <div className="text-sm text-red-700 space-y-2">
                  <p>① 본 서비스는 <strong>법률 자문이 아닌</strong> 일반적인 정보 제공 목적입니다.</p>
                  <p>② 실제 사업 추진 시 반드시 <strong>변호사 등 전문가 상담</strong>을 받으시기 바랍니다.</p>
                  <p>③ 서비스 이용으로 인한 결과에 대한 책임은 <strong>이용자 본인</strong>에게 있습니다.</p>
                </div>
              </div>
              
              <p>④ 회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.</p>
              <p>⑤ 회사는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여 책임을 지지 않습니다.</p>
            </div>
          </div>

          {/* Article 7 - Fees */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold">제7조 (요금 및 결제)</h2>
            </div>
            <div className="space-y-4 text-slate-700">
              <p>① 회사가 제공하는 서비스는 기본적으로 무료입니다.</p>
              <p>② 일부 프리미엄 서비스의 경우 별도 요금이 부과될 수 있으며, 이 경우 사전에 명확히 고지합니다.</p>
              <p>③ 유료 서비스 이용 시 취소 및 환불은 관련 법령에 따라 처리됩니다.</p>
            </div>
          </div>

          {/* Article 8 - Termination */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold mb-4">제8조 (계약의 해지)</h2>
            <div className="space-y-4 text-slate-700">
              <p>① 이용자는 언제든지 서비스 해지를 신청할 수 있으며, 회사는 즉시 서비스 해지를 처리합니다.</p>
              <p>② 회사는 다음 각 호에 해당하는 경우 서비스 이용계약을 해지할 수 있습니다.</p>
              
              <div className="bg-slate-50 p-4 rounded-lg">
                <ul className="text-sm space-y-1 text-slate-600">
                  <li>• 이용자가 이 약관을 위반한 경우</li>
                  <li>• 불법적인 목적으로 서비스를 이용한 경우</li>
                  <li>• 기타 회사가 합리적인 판단에 의하여 서비스 제공이 곤란하다고 인정하는 경우</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Article 9 - Disputes */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold mb-4">제9조 (분쟁의 해결)</h2>
            <div className="space-y-4 text-slate-700">
              <p>① 회사와 이용자는 서비스와 관련하여 발생한 분쟁을 원만하게 해결하기 위하여 필요한 모든 노력을 하여야 합니다.</p>
              <p>② 제1항의 규정에도 불구하고 분쟁으로 인하여 소송이 제기될 경우 소송은 회사의 본사 소재지를 관할하는 법원에 제기합니다.</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-slate-100 rounded-xl p-6 text-center">
            <h3 className="text-lg font-semibold mb-4">회사 정보 및 연락처</h3>
            <div className="space-y-2 text-sm text-slate-700">
              <div><strong>상호:</strong> IdeaOasis</div>
              <div><strong>대표자:</strong> 조여준</div>
              <div><strong>사업자등록번호:</strong> [등록 예정]</div>
              <div><strong>통신판매업 신고번호:</strong> [신고 예정]</div>
              <div><strong>주소:</strong> 서울특별시 [상세 주소 등록 예정]</div>
              <div><strong>연락처:</strong> 1588-0000</div>
              <div><strong>이메일:</strong> support@ideaoasis.co.kr</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}