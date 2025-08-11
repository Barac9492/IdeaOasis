'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [currentIdea, setCurrentIdea] = useState(0);
  
  const featuredIdeas = [
    {
      title: "AI-Powered Korean Recipe Generator",
      summary: "Transform global recipes into Korean-friendly versions using AI",
      koreaFit: 9,
      tags: ["AI", "Food", "Localization"]
    },
    {
      title: "Remote Work Cafe Subscription",
      summary: "Monthly membership for premium workspace access across Seoul",
      koreaFit: 8,
      tags: ["Workspace", "Subscription", "Remote Work"]
    },
    {
      title: "K-Beauty Ingredient Scanner",
      summary: "Scan cosmetics to understand ingredients in Korean context",
      koreaFit: 10,
      tags: ["Beauty", "Health", "Mobile App"]
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdea((prev) => (prev + 1) % featuredIdeas.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5" />
        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                💡
                글로벌 아이디어를 한국 시장에 맞게
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                아이디어의
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> 오아시스</span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                전 세계에서 검증된 스타트업 아이디어를 한국 시장 맥락으로 큐레이션하여 
                당신의 다음 비즈니스 기회를 발견하세요.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/ideas" 
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  아이디어 둘러보기
                  →
                </Link>
                <Link 
                  href="/top" 
                  className="inline-flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                >
                  인기 아이디어
                  📈
                </Link>
              </div>
            </div>
            
            {/* Featured Ideas Carousel */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl border p-8 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">오늘의 추천 아이디어</h3>
                  <div className="flex items-center gap-1 text-sm text-orange-600 font-medium">
                    ⭐
                    Korea Fit {featuredIdeas[currentIdea].koreaFit}/10
                  </div>
                </div>
                
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  {featuredIdeas[currentIdea].title}
                </h4>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {featuredIdeas[currentIdea].summary}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {featuredIdeas[currentIdea].tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {featuredIdeas.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIdea(idx)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          idx === currentIdea ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <Link href="/ideas" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                    자세히 보기
                    →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600 font-medium">큐레이션된 아이디어</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-purple-600 mb-2">50+</div>
              <div className="text-gray-600 font-medium">글로벌 소스</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-green-600 mb-2">8.5/10</div>
              <div className="text-gray-600 font-medium">평균 Korea Fit</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-orange-600 mb-2">매일</div>
              <div className="text-gray-600 font-medium">새로운 업데이트</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              왜 IdeaOasis인가요?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              단순한 아이디어 모음이 아닙니다. 한국 시장에 최적화된 인사이트와 함께 
              검증된 비즈니스 기회를 제공합니다.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">글로벌 검증</h3>
              <p className="text-gray-600 leading-relaxed">
                Product Hunt, Y Combinator, Indie Hackers 등 신뢰할 수 있는 
                글로벌 플랫폼에서 이미 검증받은 아이디어들만 엄선합니다.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Korea Fit 점수</h3>
              <p className="text-gray-600 leading-relaxed">
                각 아이디어가 한국 시장에 얼마나 적합한지 0-10점으로 평가하여 
                현실적인 비즈니스 기회를 쉽게 파악할 수 있습니다.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">커뮤니티 인사이트</h3>
              <p className="text-gray-600 leading-relaxed">
                다른 창업가들과 아이디어에 대해 토론하고, 투표하며, 
                집단 지성을 통해 더 나은 판단을 내릴 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            다음 성공 아이디어를 찾아보세요
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            매일 업데이트되는 글로벌 아이디어 중에서 한국 시장에 가장 적합한 
            기회를 발견하고 당신의 비즈니스를 시작하세요.
          </p>
          <Link 
            href="/ideas" 
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 hover:scale-105 transition-all duration-200 shadow-lg"
          >
            지금 시작하기
            →
          </Link>
        </div>
      </section>
    </div>
  );
}