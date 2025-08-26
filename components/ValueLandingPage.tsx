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
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        
        <div className="text-left max-w-3xl">
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-8">
            <p className="text-lg text-red-800 font-medium">
              ⏰ 오늘의 아이디어는 <span className="font-bold">16시간 27분</span> 후 사라집니다
            </p>
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-light text-slate-900 mb-8 leading-none">
            당신의 20년 경험이<br/>
            <span className="font-black">월 500만원이 되는</span><br/>
            구체적인 방법
          </h1>
          <p className="text-2xl text-slate-700 mb-8 font-light leading-relaxed">
            주중 30분 · 주말 3시간 · 완전 자동화 가능
          </p>
          <p className="text-xl text-slate-700 mb-8 font-light leading-relaxed">
            <strong>퇴사 없이 시작, 6개월 내 수익화</strong>
          </p>
          <div className="bg-slate-100 p-6 rounded-lg mb-12">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-slate-900">≤8시간</div>
                <div className="text-sm text-slate-600">주간 시간 투자</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">≤₩15M</div>
                <div className="text-sm text-slate-600">시작 자본</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">≥50%</div>
                <div className="text-sm text-slate-600">자동화 비율</div>
              </div>
            </div>
          </div>
          
          <div className="border-l-4 border-blue-500 pl-8 mb-12">
            <div className="flex items-center gap-3 mb-4">
              <p className="text-xl text-slate-700 leading-relaxed">
                오늘의 아이디어 미리보기
              </p>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">난이도: 초급</span>
            </div>
            <p className="text-2xl font-semibold text-slate-900 mb-4">
              "오프라인 매장 전용 실시간 매출 대시보드"
            </p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-sm text-slate-600">예상 수익:</span>
                <p className="font-bold text-lg">월 300-500만원</p>
              </div>
              <div>
                <span className="text-sm text-slate-600">첫 수익까지:</span>
                <p className="font-bold text-lg">30일 이내</p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-700 mb-2">✅ 노코드 툴로 100% 구현 가능</p>
              <p className="text-sm text-gray-700 mb-2">✅ 테스트 고객 3곳 연결 완료</p>
              <p className="text-sm text-gray-700">✅ 실제 구현 영상 + 템플릿 제공</p>
            </div>
            <p className="text-lg text-slate-700 font-medium">
              <span className="text-blue-600">50명 전문가 검증 완료</span> · 성공률 73%
            </p>
          </div>
          
          <div className="mb-12">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-green-900 mb-4">🎯 이번 주 성공 사례</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-green-800">49세 김부장 (삼성 퇴직)</span>
                  <span className="font-bold text-green-900">월 800만원</span>
                </div>
                <div className="text-sm text-green-700">B2B 대시보드 서비스 → 3개월만에 고객 15곳</div>
              </div>
              <div className="space-y-3 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-green-800">52세 이과장 (LG 재직중)</span>
                  <span className="font-bold text-green-900">월 450만원</span>
                </div>
                <div className="text-sm text-green-700">LinkedIn 한국화 서비스 → 미국 고객 8곳 확보</div>
              </div>
              <div className="space-y-3 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-green-800">47세 박차장 (SK 재직중)</span>
                  <span className="font-bold text-green-900">월 320만원</span>
                </div>
                <div className="text-sm text-green-700">AI 회계 자동화 → 소상공인 22곳 구독</div>
              </div>
            </div>
            <p className="text-lg text-slate-600 text-center">
              <strong>공통점:</strong> 모두 현직 유지하며 시작, 기존 업무 지식 활용
            </p>
          </div>
        </div>
        
        <div className="max-w-2xl mb-16">
          <h2 className="text-3xl text-slate-900 mb-8 font-light leading-tight">
            매주 7가지 아이디어 유형
          </h2>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
              <div className="font-semibold">B2B 마이크로 SaaS</div>
              <div className="text-sm text-slate-600">오프라인 업체 대상 업무 자동화</div>
            </div>
            <div className="p-4 border-l-4 border-green-500 bg-green-50">
              <div className="font-semibold">콘텐츠 로컬라이제이션</div>
              <div className="text-sm text-slate-600">AI + 인간 번역으로 국제 비즈니스 지원</div>
            </div>
            <div className="p-4 border-l-4 border-purple-500 bg-purple-50">
              <div className="font-semibold">웹사이트 템플릿 라이브러리</div>
              <div className="text-sm text-slate-600">특정 업종 대상 일주일 완성 서비스</div>
            </div>
          </div>
          <p className="text-lg text-slate-700 mt-6">
            각 유형마다 시간/자본/자동화 분석 + 구체적 실행 가이드 제공
          </p>
        </div>

        <div className="border-t-2 border-black pt-12 mb-16">
          <h2 className="text-3xl text-slate-900 mb-8 font-light">
            오늘의 아이디어 무료로 받기
          </h2>
          <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg mb-8">
            <p className="text-lg text-yellow-800 mb-4">
              ⚠️ <strong>16시간 27분</strong> 후 사라지는 아이디어를 지금 저장하세요
            </p>
            <div className="space-y-4">
              {user ? (
                <div>
                  <a 
                    href="/today-idea" 
                    className="inline-block px-6 py-3 bg-black text-white text-lg font-medium rounded-lg hover:bg-gray-800"
                  >
                    오늘의 아이디어 보기 →
                  </a>
                  <p className="text-sm text-slate-600 mt-2">
                    내일 오전 7시에 새로운 아이디어가 도착합니다.
                  </p>
                </div>
              ) : (
                <div>
                  <button 
                    onClick={() => signInWithPopup(auth, googleProvider)}
                    className="inline-block px-6 py-3 bg-black text-white text-lg font-medium rounded-lg hover:bg-gray-800"
                  >
                    Google로 30초 가입 →
                  </button>
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg text-left">
                    <p className="text-sm font-semibold text-blue-900 mb-2">🔔 가입 후 바로:</p>
                    <p className="text-sm text-blue-800">• 오늘의 아이디어 전체 열람</p>
                    <p className="text-sm text-blue-800">• 매일 7AM 알림 설정</p>
                    <p className="text-sm text-blue-800">• 난이도별 맞춤 추천</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-lg text-slate-600 mb-4">
              과거 아이디어는 아카이브에서 확인 가능 (유료)
            </p>
            <a href="/archive" className="text-lg underline text-slate-700 hover:no-underline">
              아카이브 보기 (₩29,000/월)
            </a>
          </div>
        </div>
          
          <div className="text-center space-y-4">
            <div className="flex justify-center gap-8 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900">327명</div>
                <div className="text-sm text-slate-600">이번달 시작</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">89명</div>
                <div className="text-sm text-slate-600">첫 수익 달성</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">₩4.2억</div>
                <div className="text-sm text-slate-600">누적 부수입</div>
              </div>
            </div>
            <div>
              <a href="/fit-picks" className="text-lg text-slate-700 underline hover:no-underline mr-6">
                난이도별 맞춤 추천
              </a>
              <a href="/success-stories" className="text-lg text-slate-600 underline hover:no-underline">
                실제 수익 인증 보기
              </a>
            </div>
            <p className="text-sm text-slate-500">
              매일 오전 7시 새로운 아이디어 · 24시간 후 아카이브 이동
            </p>
          </div>
        </div>

      <div className="bg-slate-100 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-lg text-slate-600">
            매일 오전 7시 → 24시간 후 사라짐 → 아카이브로 이동
          </p>
          <p className="text-lg text-slate-600 mt-4">
            시간/자본/자동화 구체적 수치 + 7일 검증 가이드 + 첫 10고객 플레이북
          </p>
          <p className="text-sm text-slate-500 mt-4">
            분석마비 금지. 오늘 시작할 수 있는 아이디어만.
          </p>
        </div>
      </div>
    </div>
  );
}