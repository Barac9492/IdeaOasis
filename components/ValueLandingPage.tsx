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
          <h1 className="text-5xl sm:text-7xl font-light text-slate-900 mb-8 leading-none">
            당신의 회사는<br/>
            <span className="font-black">당신을 버릴</span><br/>
            준비를 하고 있습니다.
          </h1>
          <p className="text-2xl text-slate-700 mb-8 font-light leading-relaxed">
            작년에 삼성은 3,000명을 정리해고했습니다. 평균 근속 18년.
          </p>
          <p className="text-2xl text-slate-700 mb-8 font-light leading-relaxed">
            그들은 모두 "나는 아니겠지"라고 생각했습니다.
          </p>
          <p className="text-2xl text-slate-700 mb-12 font-light leading-relaxed">
            <strong>당신도 그렇게 생각하시나요?</strong>
          </p>
          
          <div className="border-l-4 border-black pl-8 mb-12">
            <p className="text-xl text-slate-700 mb-4 leading-relaxed">
              47세 김 부장의 이야기:
            </p>
            <p className="text-lg text-slate-600 mb-4">
              20년간 완벽한 평가. 3번의 승진. 본부장 추천.
            </p>
            <p className="text-lg text-slate-600 mb-4">
              그런데 지난달, "구조조정 대상자"라는 통보.
            </p>
            <p className="text-lg text-slate-600 mb-4">
              이유? "젊은 인재 영입을 위한 불가피한 선택."
            </p>
            <p className="text-xl text-slate-700 mb-4 leading-relaxed">
              그는 지금 치킨집을 알아보고 있습니다.
            </p>
            <p className="text-lg text-slate-600">
              <strong>당신은 다를까요?</strong>
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
            그런데 희망이 있습니다.
          </h2>
          <p className="text-xl text-slate-700 mb-6">
            52세 이 과장은 퇴사 후 1인 컨설팅으로 월 2,000만원을 법니다.
          </p>
          <p className="text-xl text-slate-700 mb-6">
            48세 박 차장은 부업으로 시작한 온라인 강의로 연 3억을 벌었습니다.
          </p>
          <p className="text-xl text-slate-700 mb-6">
            45세 최 부장은 회사 경험을 살려 B2B 솔루션을 만들어 엑싯했습니다.
          </p>
          <p className="text-2xl text-slate-900 mb-8 font-light">
            <strong>그들의 공통점? 회사가 자신을 버리기 전에 먼저 준비했습니다.</strong>
          </p>
          <p className="text-xl text-slate-700">
            당신의 20년 경험은 쓸모없지 않습니다.
          </p>
          <p className="text-xl text-slate-700 mb-8">
            단지 어떻게 활용할지 모를 뿐입니다.
          </p>
        </div>

        <div className="border-t-2 border-black pt-12 mb-16">
          <h2 className="text-3xl text-slate-900 mb-8 font-light">
            선택은 당신의 것입니다.
          </h2>
          <p className="text-xl text-slate-700 mb-6">
            2년 후 치킨집을 차릴 것인가.
          </p>
          <p className="text-xl text-slate-700 mb-6">
            아니면 지금 준비를 시작할 것인가.
          </p>
          <div className="mt-12">
            {user ? (
              <a 
                href="/subscribe"
                className="text-2xl underline text-black hover:no-underline"
              >
                매주 실패하지 않는 사업 아이디어 받기 →
              </a>
            ) : (
              <button 
                onClick={() => signInWithPopup(auth, googleProvider)}
                className="text-2xl underline text-black hover:no-underline"
              >
                매주 실패하지 않는 사업 아이디어 받기 →
              </button>
            )}
            <p className="text-lg text-slate-600 mt-4">
              매주 목요일. 무료. 언제든 해지 가능.
            </p>
          </div>
        </div>
          
          <div className="text-center">
            <a href="/trending" className="text-lg text-slate-600 underline hover:no-underline">
              성공한 40대들의 실제 사례 보기
            </a>
          </div>
        </div>

      <div className="bg-slate-100 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-lg text-slate-600">
            우리는 실패 확률 87%인 치킨집 대신, 당신의 경험이 자산이 되는 사업을 찾아드립니다.
          </p>
          <p className="text-lg text-slate-600 mt-4">
            50명의 전문가가 검증한, 한국에서만 가능한 기회들.
          </p>
        </div>
      </div>
    </div>
  );
}