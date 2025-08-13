'use client';
import { useState } from 'react';
import { AlertTriangle, CheckCircle, DollarSign, Building, FileText, Bookmark, Bell } from 'lucide-react';

export default function SubmitIdeaPage() {
  const [idea, setIdea] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [savedToWatchlist, setSavedToWatchlist] = useState(false);

  const analyzeIdea = async () => {
    if (!idea.trim()) return;
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/regulatory/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idea }),
      });

      const data = await response.json();
      
      if (data.success) {
        setAnalysis(data.analysis);
      } else {
        console.error('Analysis failed:', data.error);
        setAnalysis({
          riskScore: 50,
          regulations: ['Analysis failed - please try again'],
          costs: { licenses: 'N/A', legal: 'N/A', compliance: 'N/A' },
          competitors: ['Analysis unavailable'],
          timeline: 'Unable to determine',
          verdict: 'ANALYSIS FAILED - PLEASE RETRY'
        });
      }
    } catch (error) {
      console.error('Failed to analyze idea:', error);
      setAnalysis({
        riskScore: 50,
        regulations: ['Network error - please try again'],
        costs: { licenses: 'N/A', legal: 'N/A', compliance: 'N/A' },
        competitors: ['Analysis unavailable'],
        timeline: 'Unable to determine',
        verdict: 'CONNECTION FAILED - PLEASE RETRY'
      });
    } finally {
      setLoading(false);
    }
  };

  const analyzePresetIdea = async (presetText: string) => {
    setIdea(presetText);
    setLoading(true);
    
    try {
      const response = await fetch('/api/regulatory/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idea: presetText }),
      });

      const data = await response.json();
      
      if (data.success) {
        setAnalysis(data.analysis);
      } else {
        console.error('Analysis failed:', data.error);
        setAnalysis({
          riskScore: 50,
          regulations: ['Analysis failed - please try again'],
          costs: { licenses: 'N/A', legal: 'N/A', compliance: 'N/A' },
          competitors: ['Analysis unavailable'],
          timeline: 'Unable to determine',
          verdict: 'ANALYSIS FAILED - PLEASE RETRY'
        });
      }
    } catch (error) {
      console.error('Failed to analyze idea:', error);
      setAnalysis({
        riskScore: 50,
        regulations: ['Network error - please try again'],
        costs: { licenses: 'N/A', legal: 'N/A', compliance: 'N/A' },
        competitors: ['Analysis unavailable'],
        timeline: 'Unable to determine',
        verdict: 'CONNECTION FAILED - PLEASE RETRY'
      });
    } finally {
      setLoading(false);
    }
  };

  const saveToWatchlist = async () => {
    if (!analysis) return;
    
    try {
      // In production, this would save to a database
      const watchlistItem = {
        idea: idea,
        category: analysis.category,
        riskScore: analysis.riskScore,
        savedAt: new Date().toISOString()
      };
      
      // For now, save to localStorage
      const existingWatchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
      existingWatchlist.push(watchlistItem);
      localStorage.setItem('watchlist', JSON.stringify(existingWatchlist));
      
      setSavedToWatchlist(true);
      
      // Show success message
      setTimeout(() => setSavedToWatchlist(false), 3000);
    } catch (error) {
      console.error('Failed to save to watchlist:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
            <span>1/2</span> <span>아이디어 입력</span>
          </div>
        </div>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            어떤 걸 분석할까요?
          </h1>
          <p className="text-lg text-slate-600">
            클릭만 하면 바로 분석 시작!
          </p>
        </div>

        {/* VISUAL PICKER - No Thinking Required */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[
            { emoji: "💳", name: "Stripe", desc: "온라인 결제", risk: 75, text: "Stripe 같은 온라인 결제 서비스를 한국에서 운영하고 싶습니다. 개발자들이 쉽게 결제 시스템을 연동할 수 있는 API 서비스입니다." },
            { emoji: "🎮", name: "Discord", desc: "게이머 커뮤니티", risk: 35, text: "Discord 같은 게이머 커뮤니티 플랫폼을 한국에서 운영하고 싶습니다. 음성 채팅과 텍스트 채팅이 가능한 게임 커뮤니티 서비스입니다." },
            { emoji: "📝", name: "Notion", desc: "협업 도구", risk: 45, text: "Notion 같은 협업 도구를 한국에서 서비스하고 싶습니다. 문서 작성, 데이터베이스, 프로젝트 관리가 모두 가능한 올인원 워크스페이스입니다." },
            { emoji: "🛒", name: "Shopify", desc: "이커머스 플랫폼", risk: 55, text: "Shopify 같은 이커머스 플랫폼을 한국에서 운영하고 싶습니다. 누구나 쉽게 온라인 쇼핑몰을 만들 수 있는 서비스입니다." },
            { emoji: "🏠", name: "Airbnb", desc: "숙박 공유", risk: 85, text: "Airbnb 같은 숙박 공유 플랫폼을 한국에서 운영하고 싶습니다. 개인이 자신의 집이나 방을 여행객에게 대여하는 서비스입니다." },
            { emoji: "🚗", name: "Uber", desc: "차량 공유", risk: 90, text: "Uber 같은 차량 공유 서비스를 한국에서 운영하고 싶습니다. 일반인이 자신의 차량으로 승객을 태워주는 플랫폼입니다." }
          ].map((model, idx) => (
            <button
              key={idx}
              onClick={() => analyzePresetIdea(model.text)}
              className="group relative bg-white border-2 border-slate-200 rounded-2xl p-6 hover:border-blue-400 hover:shadow-lg transition-all duration-200 text-left"
            >
              <div className="text-center">
                <div className="text-4xl mb-3">{model.emoji}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">{model.name}</h3>
                <p className="text-slate-600 text-sm mb-4">{model.desc}</p>
                
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${ 
                  model.risk > 70 ? 'bg-red-100 text-red-700' :
                  model.risk > 50 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  예상 리스크: {model.risk}
                </div>
              </div>
              
              <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                <span className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold">
                  ⚡ 클릭해서 분석하기
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Simple Custom Input - Minimal */}
        <div className="text-center">
          <div className="inline-block bg-white rounded-2xl p-6 shadow-lg border border-slate-200 max-w-2xl">
            <h3 className="text-lg font-semibold mb-4">다른 아이디어가 있나요?</h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="예: Netflix 같은 동영상 스트리밍"
                className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={analyzeIdea}
                disabled={!idea.trim() || loading || idea.length < 10}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-all whitespace-nowrap"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "분석하기"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6">
            {/* Risk Score */}
            <div className={`p-6 rounded-lg border ${
              analysis.riskScore > 70 ? 'bg-red-50 border-red-200' :
              analysis.riskScore > 40 ? 'bg-yellow-50 border-yellow-200' :
              'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                {analysis.riskScore > 70 ? (
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                ) : (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                )}
                <h2 className="text-xl font-semibold">한국 진출 위험도: {analysis.riskScore}/100</h2>
              </div>
              <div className={`text-lg font-medium mb-3 ${
                analysis.riskScore > 70 ? 'text-red-800' :
                analysis.riskScore > 40 ? 'text-yellow-800' :
                'text-green-800'
              }`}>
                {analysis.verdict}
              </div>
              {analysis.riskScore > 70 && (
                <div className="text-sm text-red-700 bg-red-100 p-3 rounded">
                  ⚠️ 주의: 직접 진출한 해외 기업들 대부분이 실패했습니다. 한국 기업과의 파트너십이나 라이선스 모델을 고려하세요.
                </div>
              )}
            </div>

            {/* Regulatory Requirements */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold">관련 규제 및 법령</h3>
              </div>
              <ul className="space-y-2">
                {analysis.regulations.map((reg: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>{reg}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 text-sm text-slate-600">
                예상 승인 기간: {analysis.timeline}
              </div>
            </div>

            {/* Costs */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold">예상 한국 진출 비용</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>라이선스 및 허가:</span>
                  <span className="font-medium">{analysis.costs.licenses}</span>
                </div>
                <div className="flex justify-between">
                  <span>법무 및 설립:</span>
                  <span className="font-medium">{analysis.costs.legal}</span>
                </div>
                <div className="flex justify-between">
                  <span>월간 컴플라이언스:</span>
                  <span className="font-medium">{analysis.costs.compliance}</span>
                </div>
              </div>
            </div>

            {/* Competition */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Building className="w-6 h-6 text-purple-600" />
                <h3 className="text-lg font-semibold">기존 한국 경쟁사</h3>
              </div>
              <ul className="space-y-2">
                {analysis.competitors.map((comp: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>{comp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Korean Success Stories */}
            {analysis.successStories && analysis.successStories.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold">성공한 한국 기업 사례</h3>
                </div>
                <ul className="space-y-3">
                  {analysis.successStories.map((story: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-sm text-green-800">{story}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 p-3 bg-green-100 rounded text-sm text-green-800">
                  💡 <strong>핵심:</strong> 성공한 한국 기업들은 해외 모델을 그대로 복사하지 않고 한국 시장에 맞게 적응시켰습니다.
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">권장 다음 단계</h3>
              {analysis.riskScore > 70 ? (
                <div className="space-y-2 text-sm">
                  <div>1. 한국 규제 전문 변호사와 상담</div>
                  <div>2. 비즈니스 모델 대폭 수정 고려</div>
                  <div>3. 성공한 한국 기업들의 현지화 전략 연구</div>
                  <div>4. 라이선스 또는 파트너십 모델 검토</div>
                </div>
              ) : (
                <div className="space-y-2 text-sm">
                  <div>1. 필요 허가 신청 (3-6개월 예상)</div>
                  <div>2. 규제 준수 비용 ₩10-20M 확보</div>
                  <div>3. 한국 현지 기업과 파트너십 체결</div>
                  <div>4. 한국 법무법인과 즉시 계약</div>
                  <div>5. 성공 사례 벤치마킹 및 차별화 전략 수립</div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">다음 단계</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={saveToWatchlist}
                  disabled={savedToWatchlist}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                    savedToWatchlist 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                  {savedToWatchlist ? '관심목록에 저장됨' : '관심목록에 저장'}
                </button>
                
                <button className="flex items-center justify-center gap-2 px-4 py-3 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg font-medium hover:bg-yellow-100 transition-colors">
                  <Bell className="w-4 h-4" />
                  규제 변화 알림 설정
                </button>
                
                <button className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 text-slate-700 border border-slate-200 rounded-lg font-medium hover:bg-slate-100 transition-colors">
                  <FileText className="w-4 h-4" />
                  상세 분석 보고서 요청
                </button>
              </div>
              
              <div className="mt-4 p-3 bg-slate-50 rounded-lg text-sm text-slate-600">
                💡 <strong>다음에 확인해보세요:</strong> 관심목록에서 추적 중인 모델들의 업데이트, 새로운 트렌드 모델 발견, 규제 변화 알림
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}