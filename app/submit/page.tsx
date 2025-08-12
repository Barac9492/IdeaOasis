'use client';
import { useState } from 'react';
import { AlertTriangle, CheckCircle, DollarSign, Building, FileText } from 'lucide-react';

export default function SubmitIdeaPage() {
  const [idea, setIdea] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">
          해외 비즈니스 모델 한국 적합성 검증
        </h1>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-blue-800 text-sm">
            💡 <strong>예시:</strong> "Stripe 같은 온라인 결제 서비스", "Discord 같은 게이머 커뮤니티 플랫폼", "Notion 같은 협업 도구"
          </p>
        </div>

        {/* Input */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-slate-900 mb-2">
            한국에 도입하고 싶은 해외 비즈니스 모델을 설명해주세요
          </label>
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="예: 미국의 DoorDash 같은 음식 배달 플랫폼을 한국에서 런칭하고 싶습니다. 레스토랑과 고객을 연결하고 배달 기사들이 음식을 배달하는 서비스입니다..."
            className="w-full h-32 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={analyzeIdea}
            disabled={!idea.trim() || loading}
            className="mt-4 bg-slate-900 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '한국 규제 환경 분석 중...' : '한국 적합성 분석하기'}
          </button>
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
          </div>
        )}
      </div>
    </div>
  );
}