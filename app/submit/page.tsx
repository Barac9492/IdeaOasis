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
          Check Your Startup Idea Against Korean Reality
        </h1>

        {/* Input */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-slate-900 mb-2">
            Describe your business idea
          </label>
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="e.g., A food delivery app that connects users with local restaurants..."
            className="w-full h-32 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={analyzeIdea}
            disabled={!idea.trim() || loading}
            className="mt-4 bg-slate-900 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Analyzing against Korean regulations...' : 'Analyze Idea'}
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
                <h2 className="text-xl font-semibold">Risk Score: {analysis.riskScore}/100</h2>
              </div>
              <div className={`text-lg font-medium ${
                analysis.riskScore > 70 ? 'text-red-800' :
                analysis.riskScore > 40 ? 'text-yellow-800' :
                'text-green-800'
              }`}>
                {analysis.verdict}
              </div>
            </div>

            {/* Regulatory Requirements */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold">Regulatory Requirements</h3>
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
                Expected approval time: {analysis.timeline}
              </div>
            </div>

            {/* Costs */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold">Real Korean Costs</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Licenses & Permits:</span>
                  <span className="font-medium">{analysis.costs.licenses}</span>
                </div>
                <div className="flex justify-between">
                  <span>Legal Setup:</span>
                  <span className="font-medium">{analysis.costs.legal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Compliance:</span>
                  <span className="font-medium">{analysis.costs.compliance}</span>
                </div>
              </div>
            </div>

            {/* Competition */}
            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Building className="w-6 h-6 text-purple-600" />
                <h3 className="text-lg font-semibold">Korean Competition</h3>
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

            {/* Next Steps */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Recommended Next Steps</h3>
              {analysis.riskScore > 70 ? (
                <div className="space-y-2 text-sm">
                  <div>1. Consult with Korean regulatory lawyer</div>
                  <div>2. Consider pivoting business model</div>
                  <div>3. Research successful local alternatives</div>
                </div>
              ) : (
                <div className="space-y-2 text-sm">
                  <div>1. File for necessary permits (expect 3-6 months)</div>
                  <div>2. Set aside ₩10-20M for regulatory compliance</div>
                  <div>3. Partner with local Korean company</div>
                  <div>4. Hire Korean legal counsel immediately</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}