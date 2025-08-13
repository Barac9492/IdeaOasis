'use client';
import { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { CheckCircle, DollarSign, Clock, TrendingDown } from 'lucide-react';

const CASE_STUDIES = [
  {
    title: "DoorDash vs. Coupang Eats",
    subtitle: "The $400M delivery culture lesson",
    failure: "DoorDash: Complete withdrawal after $400M investment",
    success: "Coupang Eats: 25% market share by studying regulations first",
    lesson: "Korean customers won't adapt to American delivery - build around motorcycle culture"
  },
  {
    title: "Zoom vs. Microsoft Teams",
    subtitle: "Why simple won in Korea's hierarchy culture",
    failure: "Teams: 15% adoption despite Office integration",
    success: "Zoom: 70% market share with 'respect for hierarchy' features",
    lesson: "Korean business culture values clear hierarchy - one-click 'host takeover' matters"
  },
  {
    title: "PayPal vs. Toss",
    subtitle: "The $2B fintech regulation maze",
    failure: "PayPal: 8-year struggle, never achieved full Korean service",
    success: "Toss: Became Korea's #1 fintech in 6 years with regulatory-first approach",
    lesson: "In Korean fintech, regulatory approval isn't optional - it's your entire strategy"
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
            Welcome to The $400M Mistake Newsletter
          </h1>
          <p className="text-lg text-slate-600 mb-8">
            Your first case study (DoorDash vs. Coupang Eats) arrives this Thursday at 9 AM KST.
          </p>
          <div className="bg-white rounded-lg p-6 border border-green-200">
            <h3 className="font-semibold mb-3">What you'll get every week:</h3>
            <div className="text-left space-y-2 text-sm text-slate-600">
              <div>📧 One detailed case study (5-minute read)</div>
              <div>💰 Exact dollar amounts lost/gained</div>
              <div>📋 The specific regulation that made the difference</div>
              <div>🎯 Action items for your own business model</div>
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
            You're about to make<br/>
            the same mistake<br/>
            DoorDash made.
          </h1>
          <p className="text-2xl text-slate-700 mb-8 font-light">
            Unless you learn from it first.
          </p>
        </div>

        <div className="mb-16">
          <p className="text-xl text-slate-700 mb-6">
            Every Thursday, I send one story about a company that burned millions in Korea.
          </p>
          <p className="text-xl text-slate-700 mb-6">
            And one that didn't.
          </p>
          <p className="text-xl text-slate-700 mb-8">
            The difference is always the same. One fought Korean culture. One embraced it.
          </p>
          <div className="border-l-4 border-black pl-8">
            <p className="text-lg text-slate-600 mb-4">
              <strong>Next week:</strong> PayPal vs. Toss
            </p>
            <p className="text-lg text-slate-600 mb-4">
              PayPal spent 8 years and millions trying to crack Korean fintech. Failed.
            </p>
            <p className="text-lg text-slate-600">
              Toss became Korea's #1 fintech in 6 years. How?
            </p>
          </div>
        </div>

        <div className="border-t-2 border-black pt-12">
          <h2 className="text-3xl text-slate-900 mb-8 font-light">
            Your choice:
          </h2>
          <p className="text-xl text-slate-700 mb-8">
            Learn from their mistakes, or repeat them.
          </p>
          
          <div className="space-y-6">
            <button
              onClick={handleGoogleSignup}
              className="text-2xl underline text-black hover:no-underline"
            >
              Send me the stories →
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
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          
          <p className="text-lg text-slate-600 mt-8">
            Every Thursday. Free. Unsubscribe anytime.
          </p>
        </div>

      </div>
    </div>
  );
}