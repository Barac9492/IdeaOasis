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
            DoorDash burned<br/>
            <span className="font-black">$400,000,000</span><br/>
            in Korea.
          </h1>
          <p className="text-2xl text-slate-700 mb-8 font-light leading-relaxed">
            Same week they launched, Coupang Eats quietly started building the opposite strategy.
          </p>
          <p className="text-2xl text-slate-700 mb-8 font-light leading-relaxed">
            Today, DoorDash is gone. Coupang is worth $60 billion.
          </p>
          <p className="text-2xl text-slate-700 mb-12 font-light leading-relaxed">
            <strong>The difference?</strong> One ignored Korean motorcycle delivery culture. One built around it.
          </p>
          
          <div className="border-l-4 border-black pl-8 mb-12">
            <p className="text-xl text-slate-700 mb-4 leading-relaxed">
              Here's what DoorDash did wrong:
            </p>
            <p className="text-lg text-slate-600 mb-4">
              They copied their exact US model. Restaurant partnerships. Driver network. Surge pricing.
            </p>
            <p className="text-lg text-slate-600 mb-4">
              But Korean delivery runs on motorcycles, not cars. Cash payments, not credit cards. Free delivery, not surge pricing.
            </p>
            <p className="text-lg text-slate-600 mb-4">
              DoorDash never bothered to learn this.
            </p>
            <p className="text-xl text-slate-700 mb-4 leading-relaxed">
              Meanwhile, Coupang studied why Baemin dominated. Then built around Korean expectations, not against them.
            </p>
            <p className="text-lg text-slate-600">
              <strong>Result:</strong> DoorDash lost $400M. Coupang gained 25% market share.
            </p>
          </div>
          
          <div className="mb-12">
            <p className="text-2xl text-slate-900 mb-6 font-light">
              This isn't the only story.
            </p>
            <p className="text-xl text-slate-700 mb-4">
              Every week, another foreign company makes the same mistake.
            </p>
            <p className="text-xl text-slate-700 mb-4">
              They assume Korean consumers will adapt to their "superior" global model.
            </p>
            <p className="text-xl text-slate-700 mb-6">
              They're wrong. And it costs them millions.
            </p>
            <p className="text-2xl text-slate-900 mb-6 font-light">
              <strong>Unless you learn from their mistakes first.</strong>
            </p>
          </div>
        </div>
        
        <div className="max-w-2xl mb-16">
          <h2 className="text-3xl text-slate-900 mb-8 font-light leading-tight">
            Here's what happens next.
          </h2>
          <p className="text-xl text-slate-700 mb-6">
            PayPal tried for 8 years to crack Korean fintech. Failed.
          </p>
          <p className="text-xl text-slate-700 mb-6">
            Uber spent millions on Korean ride-sharing. Banned.
          </p>
          <p className="text-xl text-slate-700 mb-6">
            Clubhouse had 10 million Korean users. Gone.
          </p>
          <p className="text-2xl text-slate-900 mb-8 font-light">
            <strong>Meanwhile, Korean companies built billion-dollar businesses in the same markets.</strong>
          </p>
          <p className="text-xl text-slate-700">
            Toss. Kakao T. Spoon Radio.
          </p>
          <p className="text-xl text-slate-700 mb-8">
            They didn't fight Korean culture. They embraced it.
          </p>
        </div>

        <div className="border-t-2 border-black pt-12 mb-16">
          <h2 className="text-3xl text-slate-900 mb-8 font-light">
            So what's your choice?
          </h2>
          <p className="text-xl text-slate-700 mb-6">
            Learn from their $400 million mistakes.
          </p>
          <p className="text-xl text-slate-700 mb-6">
            Or repeat them.
          </p>
          <div className="mt-12">
            {user ? (
              <a 
                href="/subscribe"
                className="text-2xl underline text-black hover:no-underline"
              >
                Send me the stories →
              </a>
            ) : (
              <button 
                onClick={() => signInWithPopup(auth, googleProvider)}
                className="text-2xl underline text-black hover:no-underline"
              >
                Send me the stories →
              </button>
            )}
            <p className="text-lg text-slate-600 mt-4">
              Every Thursday. Free. Unsubscribe anytime.
            </p>
          </div>
        </div>
          
          <div className="text-center">
            <a href="/trending" className="text-lg text-slate-600 underline hover:no-underline">
              Read the full DoorDash story
            </a>
          </div>
        </div>

      <div className="bg-slate-100 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-lg text-slate-600">
            Every story we send is real. Every dollar amount is verified. Every lesson costs someone millions to learn.
          </p>
          <p className="text-lg text-slate-600 mt-4">
            You get them for free.
          </p>
        </div>
      </div>
    </div>
  );
}