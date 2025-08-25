'use client';
import { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { CheckCircle, DollarSign, Clock, TrendingDown } from 'lucide-react';

const CASE_STUDIES = [
  {
    title: "52세 이 과장의 성공",
    subtitle: "20년 경험을 월 2,000만원으로",
    failure: "퇴사 후 6개월 백수, 치킨집 창업 실패",
    success: "B2B 컨설팅 시작, 대기업 3곳 계약",
    lesson: "당신의 20년 경험은 자산입니다. 단지 활용법을 모를 뿐."
  },
  {
    title: "48세 박 차장의 역전",
    subtitle: "회사에서 무시당한 전문성을 연 3억으로",
    failure: "승진 누락 3회, '나이가 많다'는 평가",
    success: "온라인 강의 플랫폼에서 1위 강사",
    lesson: "회사가 무시한 당신의 지식을 시장이 필요로 합니다."
  },
  {
    title: "45세 최 부장의 탈출",
    subtitle: "구조조정 대상에서 B2B 솔루션 CEO로",
    failure: "퇴직금 2억으로 커피샵 창업 실패",
    success: "회사 업무 프로세스 자동화 SaaS 성공",
    lesson: "실패하지 않는 비즈니스는 당신이 아는 문제를 해결하는 것."
  }
];

export default function SubscribePage() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // In production: add to newsletter list
      setSubscribed(true);
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // In production: add email to newsletter list
    setSubscribed(true);
  };

  if (subscribed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            회사가 버린 당신을 위한 뉴스레터에 가입하셨습니다
          </h1>
          <p className="text-lg text-slate-600 mb-8">
            첫 번째 사례 (52세 이 과장의 성공스토리)가 이번 목요일 오전 9시에 도착합니다.
          </p>
          <div className="bg-white rounded-lg p-6 border border-green-200">
            <h3 className="font-semibold mb-3">매주 받게 될 컨텐츠:</h3>
            <div className="text-left space-y-2 text-sm text-slate-600">
              <div>📧 40대 이상 성공 사례 1건 (5분 읽기)</div>
              <div>💰 실제 수익 및 실패 비용 공개</div>
              <div>📋 한국 규제 대응 전략</div>
              <div>🎯 당신의 경험을 활용한 실행 방법</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        
        <div className="mb-16">
          <h1 className="text-5xl font-light text-slate-900 mb-8 leading-tight">
            당신도 치킨집을<br/>
            차릴 수 있습니다.<br/>
            아니면...
          </h1>
          <p className="text-2xl text-slate-700 mb-8 font-light">
            성공한 40대들의 비밀을 배울 수 있습니다.
          </p>
        </div>

        <div className="mb-16">
          <p className="text-xl text-slate-700 mb-6">
            매주 목요일, 퇴사 후 성공한 40대의 실제 사례를 보내드립니다.
          </p>
          <p className="text-xl text-slate-700 mb-6">
            그리고 실패한 사례도 함께.
          </p>
          <p className="text-xl text-slate-700 mb-8">
            차이는 항상 같습니다. 하나는 20년 경험을 버렸고, 하나는 활용했습니다.
          </p>
          <div className="border-l-4 border-black pl-8">
            <p className="text-lg text-slate-600 mb-4">
              <strong>다음 주:</strong> 48세 박 차장의 역전
            </p>
            <p className="text-lg text-slate-600 mb-4">
              3번의 승진 누락, '나이가 많다'는 평가.
            </p>
            <p className="text-lg text-slate-600">
              지금은 온라인 강의로 연 3억. 비밀은?
            </p>
          </div>
        </div>

        <div className="border-t-2 border-black pt-12">
          <h2 className="text-3xl text-slate-900 mb-8 font-light">
            선택은 당신의 것:
          </h2>
          <p className="text-xl text-slate-700 mb-8">
            그들의 실수에서 배우거나, 반복하거나.
          </p>
          
          <div className="space-y-6">
            <button
              onClick={handleGoogleSignup}
              className="text-2xl underline text-black hover:no-underline"
            >
              성공 사례 받기 →
            </button>
            
            <div className="text-left">
              <form onSubmit={handleEmailSignup} className="flex gap-4 items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="px-4 py-2 border-2 border-black text-lg"
                  required
                />
                <button
                  type="submit"
                  className="text-lg underline text-black hover:no-underline"
                >
                  구독하기
                </button>
              </form>
            </div>
          </div>
          
          <p className="text-lg text-slate-600 mt-8">
            매주 목요일. 무료. 언제든 해지 가능.
          </p>
        </div>

      </div>
    </div>
  );
}