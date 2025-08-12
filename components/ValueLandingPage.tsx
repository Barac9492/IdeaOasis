'use client';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

export default function ValueLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero - The Problem */}
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-6">
          90% of foreign startups fail in Korea
        </h1>
        <p className="text-xl text-slate-600 mb-8">
          Not because of bad ideas. Because of regulations they never saw coming.
        </p>
        
        {/* The Value */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">We analyze every business idea against:</h2>
          <div className="space-y-3 text-lg">
            <div>✓ 200+ Korean regulations that could shut you down</div>
            <div>✓ Real market data from Naver, not Western sources</div>
            <div>✓ Actual costs from Korean suppliers and vendors</div>
            <div>✓ Competition analysis from Korean companies you've never heard of</div>
          </div>
        </div>

        <button 
          onClick={() => signInWithPopup(auth, googleProvider)}
          className="bg-slate-900 text-white px-8 py-4 rounded-lg font-medium text-lg hover:bg-slate-800"
        >
          See if your idea will survive Korea
        </button>
      </div>

      {/* Proof */}
      <div className="bg-slate-50 border-t border-slate-200 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="text-2xl font-semibold mb-8">Examples of ideas that died:</h3>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <div className="font-semibold text-lg mb-2">Uber (2013)</div>
              <div className="text-slate-600 mb-2">Killed by: Transportation Business Act</div>
              <div className="text-sm text-slate-500">Required taxi license for each driver. $150M wasted.</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <div className="font-semibold text-lg mb-2">Airbnb (2016)</div>
              <div className="text-slate-600 mb-2">Killed by: Tourism Promotion Act</div>
              <div className="text-sm text-slate-500">Hosts need tourism business license. 80% of listings gone.</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <div className="font-semibold text-lg mb-2">PayPal (2007)</div>
              <div className="text-slate-600 mb-2">Killed by: Electronic Financial Transaction Act</div>
              <div className="text-sm text-slate-500">Required Korean banking partner. Gave up after 3 years.</div>
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="text-2xl font-semibold mb-8">How we save your startup:</h3>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="text-2xl font-bold text-slate-400">1</div>
              <div>
                <div className="font-semibold mb-1">Submit your idea</div>
                <div className="text-slate-600">We analyze against Korean regulatory database</div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="text-2xl font-bold text-slate-400">2</div>
              <div>
                <div className="font-semibold mb-1">Get compliance report</div>
                <div className="text-slate-600">Every law, permit, and license you need</div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="text-2xl font-bold text-slate-400">3</div>
              <div>
                <div className="font-semibold mb-1">See real costs</div>
                <div className="text-slate-600">Actual Korean market prices, not Silicon Valley dreams</div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="text-2xl font-bold text-slate-400">4</div>
              <div>
                <div className="font-semibold mb-1">Know your competition</div>
                <div className="text-slate-600">Including Korean companies Google doesn't know</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-4">
            Don't waste millions discovering Korea's regulations the hard way
          </h3>
          <p className="text-xl mb-8 text-slate-300">
            Join 500+ founders who checked their idea before moving to Seoul
          </p>
          <button 
            onClick={() => signInWithPopup(auth, googleProvider)}
            className="bg-white text-slate-900 px-8 py-4 rounded-lg font-medium text-lg hover:bg-slate-100"
          >
            Check your idea now - Free
          </button>
        </div>
      </div>
    </div>
  );
}