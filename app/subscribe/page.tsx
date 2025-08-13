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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            The $400M Mistake Newsletter
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Every Thursday: One foreign company that burned millions in Korea, 
            and one that built a billion-dollar business instead. 
            <strong>Learn the difference in 5 minutes.</strong>
          </p>
        </div>

        {/* Value Props */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Real Money Lost</h3>
            <p className="text-slate-600 text-sm">$100M+ failures with exact dollar amounts and timelines</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Success Blueprints</h3>
            <p className="text-slate-600 text-sm">How Korean companies cracked the same market with smart regulation strategies</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">5-Minute Reads</h3>
            <p className="text-slate-600 text-sm">No regulatory jargon. Just expensive lessons in plain English.</p>
          </div>
        </div>

        {/* Sample Case Studies */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">What You'll Learn</h2>
          <div className="space-y-6">
            {CASE_STUDIES.map((study, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{study.title}</h3>
                    <p className="text-slate-600">{study.subtitle}</p>
                  </div>
                  <div className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                    Week {idx + 1}
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-800 mb-2">💀 The Failure</h4>
                    <p className="text-red-700 text-sm">{study.failure}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2">✅ The Success</h4>
                    <p className="text-green-700 text-sm">{study.success}</p>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">💡 The Lesson</h4>
                  <p className="text-blue-700 text-sm">{study.lesson}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Signup Form */}
        <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Avoid The Next $400M Mistake?</h2>
          <p className="text-blue-100 mb-8">
            Join 2,847 entrepreneurs who get these case studies every Thursday.
          </p>
          
          <div className="max-w-md mx-auto space-y-4">
            <button
              onClick={handleGoogleSignup}
              className="w-full bg-white text-blue-900 py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
            
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-blue-700"></div>
              <span className="text-blue-200 text-sm">or</span>
              <div className="flex-1 h-px bg-blue-700"></div>
            </div>
            
            <form onSubmit={handleEmailSignup} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 rounded-lg text-slate-900 placeholder-slate-500"
                required
              />
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
          
          <p className="text-xs text-blue-200 mt-6">
            Free forever. Unsubscribe anytime. No spam, just expensive lessons.
          </p>
        </div>

      </div>
    </div>
  );
}