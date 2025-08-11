'use client';
import { useState, useEffect } from 'react';
import { Sparkles, Upload, BarChart3, RefreshCw, CheckCircle, AlertCircle, Plus, Edit3, Save, X } from 'lucide-react';
import AdminGuard from '@/components/AdminGuard';

interface AdminStats {
  totalIdeas: number;
  enhancedIdeas: number;
  avgKoreaFit: number;
  avgTrendScore: number;
  recentActivity: string;
}

interface Idea {
  id: string;
  title: string;
  sourceUrl: string;
  sourceName?: string;
  summary3?: string;
  tags?: string[];
  koreaFit?: number;
  whyNow?: string;
  risks?: string[];
}

export default function AdminPage() {
  const [form, setForm] = useState({
    title: '', sourceUrl: '', sourceName: '',
    summary3: '', tags: '', koreaFit: 6, whyNow: '', risks: ''
  });

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Idea | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error' | 'info', text: string} | null>(null);

  // Load admin stats and ideas on component mount
  useEffect(() => {
    loadStats();
    loadIdeas();
  }, []);

  async function loadStats() {
    try {
      const res = await fetch('/api/ideas?stats=true');
      const data = await res.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  }

  async function loadIdeas() {
    try {
      const res = await fetch('/api/ideas');
      const data = await res.json();
      setIdeas(data.ideas || []);
    } catch (error) {
      console.error('Failed to load ideas:', error);
    }
  }

  function startEdit(idea: Idea) {
    setEditingId(idea.id);
    setEditForm({
      ...idea,
      tags: idea.tags || [],
      risks: idea.risks || []
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm(null);
  }

  async function saveEdit() {
    if (!editForm) return;
    
    setIsUpdating(true);
    setMessage(null);

    const payload = {
      ...editForm,
      tags: typeof editForm.tags === 'string' ? editForm.tags.split(',').map(s => s.trim()).filter(Boolean) : editForm.tags,
      risks: typeof editForm.risks === 'string' ? editForm.risks.split('\n').map(s => s.trim()).filter(Boolean) : editForm.risks,
    };

    try {
      const res = await fetch('/api/ingest-bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Ingest-Token': process.env.NEXT_PUBLIC_INGEST_TOKEN || 'local-dev',
        },
        body: JSON.stringify([payload]),
      });

      if (res.ok) {
        setMessage({type: 'success', text: '아이디어가 성공적으로 업데이트되었습니다.'});
        setEditingId(null);
        setEditForm(null);
        await loadIdeas();
        await loadStats();
      } else {
        setMessage({type: 'error', text: '업데이트 중 오류가 발생했습니다.'});
      }
    } catch (error) {
      setMessage({type: 'error', text: '네트워크 오류가 발생했습니다.'});
    } finally {
      setIsUpdating(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const payload = {
      ...form,
      tags: form.tags.split(',').map(s => s.trim()).filter(Boolean),
      risks: form.risks.split('\n').map(s => s.trim()).filter(Boolean),
    };

    try {
      const res = await fetch('/api/ingest-bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Ingest-Token': process.env.NEXT_PUBLIC_INGEST_TOKEN || 'local-dev',
        },
        body: JSON.stringify([payload]),
      });

      if (res.ok) {
        setMessage({type: 'success', text: '새 아이디어가 성공적으로 추가되었습니다.'});
        setForm({
          title: '', sourceUrl: '', sourceName: '',
          summary3: '', tags: '', koreaFit: 6, whyNow: '', risks: ''
        });
        await loadStats(); // Refresh stats
        await loadIdeas(); // Refresh ideas list
      } else {
        setMessage({type: 'error', text: '저장 중 오류가 발생했습니다.'});
      }
    } catch (error) {
      setMessage({type: 'error', text: '네트워크 오류가 발생했습니다.'});
    } finally {
      setIsSubmitting(false);
    }
  }

  async function enhanceAllIdeas() {
    setIsEnhancing(true);
    setMessage({type: 'info', text: '모든 아이디어를 AI로 분석 중입니다...'});

    try {
      const res = await fetch('/api/ideas/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.ok) {
        const data = await res.json();
        setMessage({
          type: 'success', 
          text: `${data.enhanced}개 아이디어가 향상되었습니다. (총 ${data.total}개)`
        });
        await loadStats(); // Refresh stats
        await loadIdeas(); // Refresh ideas list
      } else {
        setMessage({type: 'error', text: '분석 중 오류가 발생했습니다.'});
      }
    } catch (error) {
      setMessage({type: 'error', text: '네트워크 오류가 발생했습니다.'});
    } finally {
      setIsEnhancing(false);
    }
  }

  return (
    <AdminGuard>
      <main className="mx-auto max-w-6xl p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">관리자 대시보드</h1>
          <p className="text-slate-600 mt-2">아이디어 관리 및 AI 분석 도구</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={enhanceAllIdeas}
            disabled={isEnhancing}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isEnhancing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{isEnhancing ? '분석 중...' : 'AI 분석 실행'}</span>
          </button>
          
          <button 
            onClick={loadStats}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>새로고침</span>
          </button>
        </div>
      </div>

      {/* Message Alert */}
      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
          message.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
          'bg-blue-50 text-blue-800 border border-blue-200'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> :
           message.type === 'error' ? <AlertCircle className="w-5 h-5" /> :
           <RefreshCw className="w-5 h-5" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Stats Dashboard */}
      {stats && (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-blue-900">{stats.totalIdeas}</span>
            </div>
            <h3 className="font-semibold text-blue-900">전체 아이디어</h3>
            <p className="text-sm text-blue-700 mt-1">데이터베이스에 저장됨</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <Sparkles className="w-8 h-8 text-emerald-600" />
              <span className="text-2xl font-bold text-emerald-900">{stats.enhancedIdeas}</span>
            </div>
            <h3 className="font-semibold text-emerald-900">AI 분석 완료</h3>
            <p className="text-sm text-emerald-700 mt-1">향상된 데이터 보유</p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold text-sm">KF</div>
              <span className="text-2xl font-bold text-amber-900">{Math.round(stats.avgKoreaFit)}</span>
            </div>
            <h3 className="font-semibold text-amber-900">평균 적합도</h3>
            <p className="text-sm text-amber-700 mt-1">Korea Fit 점수</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">TR</div>
              <span className="text-2xl font-bold text-purple-900">{stats.avgTrendScore.toFixed(1)}</span>
            </div>
            <h3 className="font-semibold text-purple-900">평균 트렌드</h3>
            <p className="text-sm text-purple-700 mt-1">시장 관심도 점수</p>
          </div>
        </section>
      )}

      {/* Add New Idea Form */}
      <section className="bg-white border border-slate-200 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <Plus className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">새 아이디어 추가</h2>
            <p className="text-sm text-slate-600">수동으로 새로운 비즈니스 아이디어를 등록하세요</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">제목</label>
              <input 
                className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                placeholder="예: AI 기반 맞춤형 학습 플랫폼" 
                value={form.title} 
                onChange={e => setForm(f => ({...f, title: e.target.value}))} 
                required
              />
            </div>

            {/* Source URL */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">원문 URL</label>
              <input 
                className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                type="url"
                placeholder="https://..." 
                value={form.sourceUrl} 
                onChange={e => setForm(f => ({...f, sourceUrl: e.target.value}))} 
                required
              />
            </div>

            {/* Source Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">출처</label>
              <input 
                className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                placeholder="Product Hunt, TechCrunch 등" 
                value={form.sourceName} 
                onChange={e => setForm(f => ({...f, sourceName: e.target.value}))} 
                required
              />
            </div>

            {/* Summary */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">3문장 요약</label>
              <textarea 
                className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                rows={3} 
                placeholder="아이디어에 대한 간단한 설명을 3문장 이내로 작성하세요..." 
                value={form.summary3} 
                onChange={e => setForm(f => ({...f, summary3: e.target.value}))} 
                required
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">태그</label>
              <input 
                className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                placeholder="AI, 교육, SaaS (쉼표로 구분)" 
                value={form.tags} 
                onChange={e => setForm(f => ({...f, tags: e.target.value}))} 
              />
            </div>

            {/* Korea Fit */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Korea Fit (0-10)</label>
              <input 
                className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                type="number" 
                min={0} 
                max={10} 
                step={0.1}
                placeholder="6.0" 
                value={form.koreaFit} 
                onChange={e => setForm(f => ({...f, koreaFit: Number(e.target.value)}))} 
                required
              />
            </div>

            {/* Why Now */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Why Now</label>
              <textarea 
                className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                rows={3} 
                placeholder="왜 지금이 이 아이디어를 실행하기 좋은 시점인가요?" 
                value={form.whyNow} 
                onChange={e => setForm(f => ({...f, whyNow: e.target.value}))} 
              />
            </div>

            {/* Risks */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">주요 리스크</label>
              <textarea 
                className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                rows={3} 
                placeholder="각 리스크를 새 줄에 작성하세요" 
                value={form.risks} 
                onChange={e => setForm(f => ({...f, risks: e.target.value}))} 
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6 border-t border-slate-200">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              <span>{isSubmitting ? '저장 중...' : '아이디어 저장'}</span>
            </button>
          </div>
        </form>
      </section>

      {/* Existing Ideas List */}
      <section className="bg-white border border-slate-200 rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">기존 아이디어 관리</h2>
              <p className="text-sm text-slate-600">등록된 아이디어를 수정하거나 내용을 업데이트하세요</p>
            </div>
          </div>
          <button 
            onClick={loadIdeas}
            className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            새로고침
          </button>
        </div>

        <div className="space-y-4">
          {ideas.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>등록된 아이디어가 없습니다.</p>
            </div>
          ) : (
            ideas.map((idea) => (
              <div key={idea.id} className="border border-slate-200 rounded-xl p-6">
                {editingId === idea.id ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-slate-900">아이디어 수정</h3>
                      <div className="flex gap-2">
                        <button 
                          onClick={saveEdit}
                          disabled={isUpdating}
                          className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                        >
                          {isUpdating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          {isUpdating ? '저장 중...' : '저장'}
                        </button>
                        <button 
                          onClick={cancelEdit}
                          className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm"
                        >
                          <X className="w-4 h-4" />
                          취소
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">제목</label>
                        <input 
                          className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                          value={editForm?.title || ''} 
                          onChange={e => setEditForm(f => f ? {...f, title: e.target.value} : null)} 
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">원문 URL</label>
                        <input 
                          className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                          value={editForm?.sourceUrl || ''} 
                          onChange={e => setEditForm(f => f ? {...f, sourceUrl: e.target.value} : null)} 
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">출처</label>
                        <input 
                          className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                          value={editForm?.sourceName || ''} 
                          onChange={e => setEditForm(f => f ? {...f, sourceName: e.target.value} : null)} 
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">요약</label>
                        <textarea 
                          className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                          rows={3}
                          value={editForm?.summary3 || ''} 
                          onChange={e => setEditForm(f => f ? {...f, summary3: e.target.value} : null)} 
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">태그</label>
                        <input 
                          className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                          value={Array.isArray(editForm?.tags) ? editForm.tags.join(', ') : editForm?.tags || ''} 
                          onChange={e => setEditForm(f => f ? {...f, tags: e.target.value} : null)} 
                          placeholder="쉼표로 구분"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Korea Fit</label>
                        <input 
                          className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                          type="number" 
                          min={0} 
                          max={10} 
                          step={0.1}
                          value={editForm?.koreaFit || 0} 
                          onChange={e => setEditForm(f => f ? {...f, koreaFit: Number(e.target.value)} : null)} 
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Why Now</label>
                        <textarea 
                          className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                          rows={2}
                          value={editForm?.whyNow || ''} 
                          onChange={e => setEditForm(f => f ? {...f, whyNow: e.target.value} : null)} 
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">리스크</label>
                        <textarea 
                          className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                          rows={2}
                          value={Array.isArray(editForm?.risks) ? editForm.risks.join('\n') : editForm?.risks || ''} 
                          onChange={e => setEditForm(f => f ? {...f, risks: e.target.value} : null)} 
                          placeholder="각 리스크를 새 줄에 작성"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-900">{idea.title}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                          <span>출처: {idea.sourceName}</span>
                          {idea.koreaFit && <span>Korea Fit: {idea.koreaFit}</span>}
                        </div>
                      </div>
                      <button 
                        onClick={() => startEdit(idea)}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                      >
                        <Edit3 className="w-4 h-4" />
                        수정
                      </button>
                    </div>

                    {idea.summary3 && (
                      <p className="text-slate-700 text-sm">{idea.summary3}</p>
                    )}

                    {idea.tags && idea.tags.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {idea.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="text-xs text-slate-500">
                      ID: {idea.id}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* AI Enhancement Info */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">AI 분석 기능</h3>
            <p className="text-slate-700 mb-4">
              새로 추가된 아이디어는 자동으로 AI 분석을 통해 Korea Fit 점수, 트렌드 분석, 실행 로드맵이 생성됩니다.
              기존 아이디어들은 "AI 분석 실행" 버튼을 클릭하여 일괄 향상시킬 수 있습니다.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Korea Fit 5가지 요소 분석</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span>실시간 트렌드 점수 측정</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>6단계 실행 로드맵 생성</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    </AdminGuard>
  );
}
