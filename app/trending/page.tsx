'use client';
import { useState, useEffect } from 'react';
import { TrendingUp, Clock, Users, Eye, AlertTriangle, CheckCircle, Fire } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Real patterns we see in regulatory analysis
const ANALYSIS_PATTERNS = [
  {
    id: 1,
    pattern: "미국 핀테크 → 한국 진출",
    challenge: "전자금융거래법 자본금 요구",
    solution: "기존 PG사와 파트너십",
    examples: ["Stripe → 토스페이먼츠", "Square → 페이히어"]
  },
  {
    id: 2,
    pattern: "글로벌 플랫폼 → 한국 현지화",
    challenge: "방송통신위원회 콘텐츠 규제",
    solution: "현지 법인 + 신고 시스템",
    examples: ["YouTube → 유튜브 코리아", "Twitch → 트위치 코리아"]
  },
  {
    id: 3,
    pattern: "공유경제 모델 → 한국 적용",
    challenge: "기존 업계 보호 규제",
    solution: "기존 사업자와 협력",
    examples: ["Uber → 실패", "Socar → 성공"]
  }
];

const TOP_CATEGORIES = [
  { name: "핀테크", count: 234, trend: "+15%", hot: true },
  { name: "이커머스", count: 189, trend: "+8%", hot: false },
  { name: "헬스케어", count: 156, trend: "+23%", hot: true },
  { name: "배달/물류", count: 145, trend: "-5%", hot: false },
  { name: "교육테크", count: 98, trend: "+12%", hot: false },
  { name: "부동산", count: 87, trend: "+30%", hot: true }
];

const SUCCESS_STORIES = [
  {
    company: "플렉스팀",
    model: "Slack 같은 협업툴",
    result: "규제 회피 전략으로 6개월 만에 출시",
    fundingStatus: "시리즈 A 50억원",
    riskScore: 45
  },
  {
    company: "페이지",
    model: "Stripe 같은 결제 서비스",
    result: "PG사와 파트너십으로 진출",
    fundingStatus: "시드 10억원",
    riskScore: 75
  },
  {
    company: "스테이어",
    model: "Airbnb 변형 모델",
    result: "호텔업으로 피벗 후 성공",
    fundingStatus: "시리즈 B 100억원",
    riskScore: 85
  }
];

export default function TrendingPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [timeFilter, setTimeFilter] = useState('today');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            📚 Case Study
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            이번 주: Clubhouse는 왜 죽고 Spoon은 살았을까?
          </h1>
          <p className="text-lg text-slate-600">
            같은 음성 소셜 모델, 완전히 다른 결과 - 규제 차이가 만든 명암
          </p>
        </div>

        {/* Full DoorDash Case Study */}
        <div className="space-y-8 mb-12">
          
          {/* The Setup */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold mb-6">The Setup: Same Model, Different Fate</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                <h3 className="font-bold text-red-800 mb-3">💀 DoorDash (2019-2021)</h3>
                <p className="text-red-700 text-sm">Global #1 food delivery company enters Korea with $400M war chest</p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h3 className="font-bold text-green-800 mb-3">✅ Coupang Eats (2019-present)</h3>
                <p className="text-green-700 text-sm">Korean e-commerce giant launches delivery arm with "local-first" strategy</p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-slate-100 rounded-lg">
              <p className="text-slate-700 text-sm">
                <strong>Both launched within months of each other.</strong> One spent billions and retreated. The other captured 25% market share.
              </p>
            </div>
          </div>

          {/* The Death Spiral */}
          <div className="bg-gradient-to-br from-red-900 to-red-800 rounded-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-6">💀 DoorDash Korea: The American Way</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-red-200 mb-3">What they did:</h3>
                <ul className="text-red-100 space-y-2 text-sm">
                  <li>• Copied exact US model: restaurant partnerships, driver network, surge pricing</li>
                  <li>• Focused on "premium" restaurants and American-style service</li>
                  <li>• Ignored Korean delivery culture: no motorcycle delivery, no cash payments</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-red-200 mb-3">The regulatory trap:</h3>
                <ul className="text-red-100 space-y-2 text-sm">
                  <li>• <strong>Food Safety Law:</strong> Required Korean food handling certifications for all delivery staff</li>
                  <li>• <strong>Labor Law:</strong> Motorcycle delivery drivers needed special commercial licenses</li>
                  <li>• <strong>Consumer Protection:</strong> Korean customers expected free delivery - surge pricing triggered complaints</li>
                </ul>
              </div>
              
              <div className="bg-red-800/50 p-4 rounded-lg">
                <h3 className="font-bold text-red-200 mb-3">The death spiral:</h3>
                <div className="grid md:grid-cols-4 gap-4 text-xs">
                  <div><strong>2019:</strong> Launched with 50 restaurants in Gangnam</div>
                  <div><strong>2020:</strong> Burned $200M trying to scale, hit regulatory walls</div>
                  <div><strong>2021:</strong> Quietly shut down Korea operations</div>
                  <div><strong>Total loss:</strong> ~$400M</div>
                </div>
              </div>
            </div>
          </div>

          {/* The Success Story */}
          <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-6">✅ Coupang Eats: The Korean Way</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-green-200 mb-3">What they did differently:</h3>
                <ul className="text-green-100 space-y-2 text-sm">
                  <li>• <strong>Studied the enemy:</strong> Analyzed why Baemin dominated (motorcycle delivery, Korean UX)</li>
                  <li>• <strong>Regulatory-first approach:</strong> Got food safety certifications before launch</li>
                  <li>• <strong>Cultural adaptation:</strong> Free delivery, Korean payment methods, Korean-style customer service</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-green-200 mb-3">The smart moves:</h3>
                <ul className="text-green-100 space-y-2 text-sm">
                  <li>• <strong>Delivery infrastructure:</strong> Leveraged existing Coupang logistics network</li>
                  <li>• <strong>Restaurant relations:</strong> Worked with Korean restaurant culture (no-English menus, cash payments)</li>
                  <li>• <strong>Timing strategy:</strong> Launched during COVID when delivery exploded</li>
                </ul>
              </div>
              
              <div className="bg-green-800/50 p-4 rounded-lg">
                <h3 className="font-bold text-green-200 mb-3">The results:</h3>
                <div className="grid md:grid-cols-4 gap-4 text-xs">
                  <div><strong>2019:</strong> 100 restaurants, regulatory compliance from day 1</div>
                  <div><strong>2020:</strong> 10,000+ restaurants, Korean delivery licenses secured</div>
                  <div><strong>2024:</strong> 25% market share, profitable in major cities</div>
                  <div><strong>Valuation:</strong> Part of Coupang's $60B empire</div>
                </div>
              </div>
            </div>
          </div>

          {/* The Key Difference */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-yellow-900 mb-6">💡 The Key Difference</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-bold text-yellow-800 mb-2">DoorDash mindset:</h3>
                <p className="text-yellow-700 text-sm italic">"Korean market will adapt to our superior American model"</p>
              </div>
              <div>
                <h3 className="font-bold text-yellow-800 mb-2">Coupang mindset:</h3>
                <p className="text-yellow-700 text-sm italic">"We'll build a delivery service that feels Korean-first"</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-yellow-300">
              <p className="text-yellow-800 text-sm">
                <strong>The irony?</strong> DoorDash had better technology, more capital, and global expertise. 
                But they ignored the regulatory and cultural reality that <strong>Korean delivery isn't just food transport - it's a cultural institution.</strong>
              </p>
            </div>
          </div>

        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left: Real Patterns */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                반복되는 3가지 패턴
              </h2>
              
              <div className="space-y-6">
                {ANALYSIS_PATTERNS.map((pattern) => (
                  <div key={pattern.id} className="border border-slate-200 rounded-lg p-6">
                    <h3 className="font-bold text-lg text-slate-900 mb-3">{pattern.pattern}</h3>
                    
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <h4 className="font-semibold text-red-700 mb-2">❌ 걸림돌</h4>
                        <p className="text-sm text-red-600">{pattern.challenge}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-700 mb-2">✅ 해결책</h4>
                        <p className="text-sm text-green-600">{pattern.solution}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-700 mb-2">📋 실제 사례</h4>
                        <div className="space-y-1">
                          {pattern.examples.map((example, idx) => (
                            <div key={idx} className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                              {example}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Success Stories */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                규제 분석 후 성공한 스타트업
              </h2>
              
              <div className="space-y-4">
                {SUCCESS_STORIES.map((story, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-slate-900">{story.company}</h4>
                        <p className="text-sm text-slate-600">{story.model}</p>
                      </div>
                      <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        {story.fundingStatus}
                      </div>
                    </div>
                    <p className="text-sm text-green-700">
                      ✅ {story.result}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Hot Categories */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Fire className="w-5 h-5 text-orange-600" />
                인기 카테고리
              </h3>
              
              <div className="space-y-3">
                {TOP_CATEGORIES.map((cat, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{cat.name}</span>
                      {cat.hot && <span className="text-xs bg-red-100 text-red-600 px-1 rounded">HOT</span>}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-slate-600">{cat.count}</span>
                      <span className={cat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                        {cat.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Distribution */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold mb-4">리스크 분포</h3>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-red-600">높음 (70+)</span>
                    <span className="font-medium">28%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500" style={{width: '28%'}}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-yellow-600">중간 (40-70)</span>
                    <span className="font-medium">45%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500" style={{width: '45%'}}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-green-600">낮음 (0-40)</span>
                    <span className="font-medium">27%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{width: '27%'}}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-3">
                내 아이디어는 어떨까?
              </h3>
              <p className="text-sm text-blue-100 mb-4">
                30초 만에 규제 리스크를 확인하고 한국 시장 진출 가능성을 분석하세요
              </p>
              <Button className="w-full bg-white text-blue-700 hover:bg-blue-50">
                지금 분석하기
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}