'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">IdeaOasis</h4>
            <p className="text-slate-300 text-sm mb-4">
              한국 규제 분석으로 해외 모델의 성공적인 현지화를 지원합니다.
            </p>
            <div className="text-sm text-slate-400">
              <div>대표: 조여준</div>
              <div>이메일: support@ideaoasis.co.kr</div>
              <div>전화: 1588-0000</div>
            </div>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">서비스</h4>
            <div className="space-y-2 text-sm">
              <Link href="/submit" className="block text-slate-300 hover:text-white">
                규제 분석
              </Link>
              <Link href="/sample" className="block text-slate-300 hover:text-white">
                분석 샘플
              </Link>
              <Link href="/method" className="block text-slate-300 hover:text-white">
                분석 방법론
              </Link>
              <Link href="/about" className="block text-slate-300 hover:text-white">
                서비스 소개
              </Link>
            </div>
          </div>
          
          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4">법적 고지</h4>
            <div className="space-y-2 text-sm">
              <Link href="/terms" className="block text-slate-300 hover:text-white">
                이용약관
              </Link>
              <Link href="/privacy" className="block text-slate-300 hover:text-white">
                개인정보처리방침
              </Link>
              <Link href="/business-info" className="block text-slate-300 hover:text-white">
                사업자 정보
              </Link>
              <div className="text-slate-400">
                사업자등록번호: [등록 예정]
              </div>
              <div className="text-slate-400">
                통신판매업 신고: [신고 예정]
              </div>
            </div>
          </div>
          
          {/* Important Disclaimers */}
          <div>
            <h4 className="text-lg font-semibold mb-4">⚠️ 중요 안내</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div>
                본 서비스는 <strong className="text-yellow-300">법률 자문이 아닌</strong> 일반적인 규제 정보 제공 목적입니다.
              </div>
              <div>
                실제 사업 추진 시 반드시 <strong className="text-yellow-300">변호사 등 전문가 상담</strong>을 받으시기 바랍니다.
              </div>
              <div>
                분석 결과에 대한 책임은 <strong className="text-yellow-300">이용자 본인</strong>에게 있습니다.
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
            <div>
              © 2024 IdeaOasis. All rights reserved.
            </div>
            <div className="mt-4 md:mt-0">
              <span className="bg-yellow-900/30 text-yellow-200 px-2 py-1 rounded text-xs">
                법률 자문 아님 - 전문가 상담 필수
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}