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
            매일 오전 7시,<br/>
            <span className="font-black">24시간만 공개</span><br/>
            직장인형 창업 아이디어
          </h1>
          <p className="text-2xl text-slate-700 mb-8 font-light leading-relaxed">
            주중 30분 · 주말 3시간으로 시작하는 사이드 창업
          </p>
          <p className="text-xl text-slate-700 mb-8 font-light leading-relaxed">
            <strong>출근은 계속, 소득원은 추가</strong>
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
          
          <div className="border-l-4 border-black pl-8 mb-12">
            <p className="text-xl text-slate-700 mb-4 leading-relaxed">
              오늘의 아이디어: B2B KPI 대시보드 서비스
            </p>
            <p className="text-lg text-slate-600 mb-4">
              시간 예산: 주 8시간 | 시작 자본: ₩5M | 자동화: 70%
            </p>
            <p className="text-lg text-slate-600 mb-4">
              툴스택: Make + Google Sheets + Appsheet
            </p>
            <p className="text-lg text-slate-600 mb-4">
              첫 10고객 전략: 오프라인 상점 대상 DM 10건/일
            </p>
            <p className="text-xl text-slate-700 mb-4 leading-relaxed">
              검증 기간: 7일 | 목표: 3건 유료 체험 @ ₩200k/월
            </p>
            <p className="text-lg text-slate-600">
              <strong>위에 처럼 자세한 실행 가이드가 매일 오전 7시에.</strong>
            </p>
          </div>
          
          <div className="mb-12">
            <p className="text-2xl text-slate-900 mb-6 font-light">
              회사는 당신을 지킬 수 없습니다.
            </p>
            <p className="text-xl text-slate-700 mb-4">
              AI가 당신의 업무를 대체하고 있습니다.
            </p>
            <p className="text-xl text-slate-700 mb-4">
              MZ 세대가 당신 연봉의 절반으로 일합니다.
            </p>
            <p className="text-xl text-slate-700 mb-6">
              주주들은 인건비 절감을 요구합니다.
            </p>
            <p className="text-2xl text-slate-900 mb-6 font-light">
              <strong>당신에게 남은 시간은 2년입니다.</strong>
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
                    Google로 로그인하고 아이디어 받기 →
                  </button>
                  <p className="text-sm text-slate-600 mt-2">
                    로그인 후 매일 오전 7시 아이디어 알림 받음
                  </p>
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
            <div>
              <a href="/fit-picks" className="text-lg text-slate-700 underline hover:no-underline mr-6">
                이번 주 3가지 선별 아이디어
              </a>
              <a href="/success-stories" className="text-lg text-slate-600 underline hover:no-underline">
                40대 성공 사례 보기
              </a>
            </div>
            <p className="text-sm text-slate-500">
              출근은 계속, 소득원은 추가 - Work-While-You-Build
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