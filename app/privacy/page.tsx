'use client';
import { ArrowLeft, Shield, UserCheck, Eye, Trash2 } from 'lucide-react';

export default function PrivacyPage() {
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
            <h1 className="text-3xl font-bold text-slate-900 mb-4">개인정보처리방침</h1>
            <p className="text-slate-600">
              IdeaOasis(이하 "회사")는 정보주체의 자유와 권리 보호를 위해 「개인정보 보호법」 및 관련 법령이 정한 바를 준수하여, 
              적법하게 개인정보를 처리하고 안전하게 관리하고 있습니다.
            </p>
            <div className="mt-4 text-sm text-slate-500">
              최종 개정일: 2024년 8월 13일 | 시행일: 2024년 8월 13일
            </div>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">목차</h2>
          <div className="grid md:grid-cols-2 gap-2 text-sm">
            <a href="#article1" className="text-blue-700 hover:text-blue-900">1. 개인정보의 처리목적</a>
            <a href="#article2" className="text-blue-700 hover:text-blue-900">2. 개인정보의 처리 및 보유기간</a>
            <a href="#article3" className="text-blue-700 hover:text-blue-900">3. 개인정보의 제3자 제공</a>
            <a href="#article4" className="text-blue-700 hover:text-blue-900">4. 개인정보의 위탁</a>
            <a href="#article5" className="text-blue-700 hover:text-blue-900">5. 정보주체의 권리</a>
            <a href="#article6" className="text-blue-700 hover:text-blue-900">6. 개인정보보호책임자</a>
          </div>
        </div>

        <div className="space-y-8">
          {/* Article 1 */}
          <div id="article1" className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold">1. 개인정보의 처리목적</h2>
            </div>
            <div className="space-y-4 text-slate-700">
              <p>회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
              
              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">가. 서비스 제공</h4>
                <ul className="text-sm space-y-1 text-slate-600">
                  <li>• 회원 가입 및 본인확인</li>
                  <li>• 규제 분석 서비스 제공</li>
                  <li>• 분석 결과 저장 및 관리</li>
                  <li>• 고객 문의 및 지원</li>
                </ul>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">나. 서비스 개선</h4>
                <ul className="text-sm space-y-1 text-slate-600">
                  <li>• 서비스 이용 통계 분석</li>
                  <li>• 신규 서비스 개발</li>
                  <li>• 사용자 경험 개선</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Article 2 */}
          <div id="article2" className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <UserCheck className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold">2. 개인정보의 처리 및 보유기간</h2>
            </div>
            <div className="space-y-4 text-slate-700">
              <p>회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-slate-200 rounded-lg">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left p-3 font-medium text-slate-700 border-b">개인정보 항목</th>
                      <th className="text-left p-3 font-medium text-slate-700 border-b">보유기간</th>
                      <th className="text-left p-3 font-medium text-slate-700 border-b">근거</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-3">회원정보 (이메일, 프로필)</td>
                      <td className="p-3">회원탈퇴 시까지</td>
                      <td className="p-3">서비스 제공</td>
                    </tr>
                    <tr>
                      <td className="p-3">분석 기록</td>
                      <td className="p-3">2년</td>
                      <td className="p-3">서비스 개선 및 품질 관리</td>
                    </tr>
                    <tr>
                      <td className="p-3">접속 로그</td>
                      <td className="p-3">3개월</td>
                      <td className="p-3">정보통신망법</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Article 3 */}
          <div id="article3" className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-semibold">3. 개인정보의 제3자 제공</h2>
            </div>
            <div className="space-y-4 text-slate-700">
              <p>회사는 원칙적으로 정보주체의 개인정보를 제1항에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보보호법 제17조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.</p>
              
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">현재 제3자 제공 현황</h4>
                <p className="text-sm text-green-700">
                  회사는 현재 개인정보를 제3자에게 제공하고 있지 않습니다. 
                  향후 제3자 제공이 필요한 경우 사전에 동의를 받겠습니다.
                </p>
              </div>
            </div>
          </div>

          {/* Article 4 */}
          <div id="article4" className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold mb-4">4. 개인정보 처리의 위탁</h2>
            <div className="space-y-4 text-slate-700">
              <p>회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.</p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-slate-200 rounded-lg">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left p-3 font-medium text-slate-700 border-b">수탁업체</th>
                      <th className="text-left p-3 font-medium text-slate-700 border-b">위탁업무</th>
                      <th className="text-left p-3 font-medium text-slate-700 border-b">개인정보 항목</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-3">Google (Firebase)</td>
                      <td className="p-3">사용자 인증 및 데이터 저장</td>
                      <td className="p-3">이메일, 프로필 정보</td>
                    </tr>
                    <tr>
                      <td className="p-3">Vercel</td>
                      <td className="p-3">웹사이트 호스팅</td>
                      <td className="p-3">접속 로그, IP 주소</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Article 5 */}
          <div id="article5" className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
              <h2 className="text-xl font-semibold">5. 정보주체의 권리·의무 및 행사방법</h2>
            </div>
            <div className="space-y-4 text-slate-700">
              <p>정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">행사 가능한 권리</h4>
                  <ul className="text-sm space-y-1 text-slate-600">
                    <li>• 개인정보 처리정지 요구권</li>
                    <li>• 개인정보 열람요구권</li>
                    <li>• 개인정보 정정·삭제요구권</li>
                    <li>• 개인정보 손해배상청구권</li>
                  </ul>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">권리 행사 방법</h4>
                  <ul className="text-sm space-y-1 text-slate-600">
                    <li>• 서면, 전화, 이메일 통해 연락</li>
                    <li>• 회사는 지체없이 조치</li>
                    <li>• 법정대리인 또는 위임 대행 가능</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Article 6 */}
          <div id="article6" className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold mb-4">6. 개인정보보호책임자</h2>
            <div className="space-y-4 text-slate-700">
              <p>회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보보호책임자를 지정하고 있습니다.</p>
              
              <div className="bg-slate-50 p-6 rounded-lg">
                <h4 className="font-semibold mb-4">▶ 개인정보보호책임자</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium mb-1">성명: 조여준</div>
                    <div>직책: 대표</div>
                  </div>
                  <div>
                    <div className="font-medium mb-1">연락처: 1588-0000</div>
                    <div>이메일: privacy@ideaoasis.co.kr</div>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-slate-600">
                정보주체는 회사의 서비스를 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보보호책임자에게 문의하실 수 있습니다. 회사는 정보주체의 문의에 대해 지체없이 답변 및 처리해드릴 것입니다.
              </p>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-yellow-800 mb-4">기타 개인정보 침해신고</h2>
            <div className="text-sm text-yellow-700 space-y-2">
              <p>아래의 기관에도 개인정보 침해신고를 접수하실 수 있습니다.</p>
              <div>• 개인정보보호위원회 (www.pipc.go.kr / 전화번호 국번없이 182)</div>
              <div>• 개인정보 침해신고센터 (privacy.korea.kr / 전화번호 국번없이 182)</div>
              <div>• 대검찰청 사이버범죄수사단 (www.spo.go.kr / 전화번호 02-3480-3573)</div>
              <div>• 경찰청 사이버안전국 (cyberbureau.police.go.kr / 전화번호 국번없이 182)</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}