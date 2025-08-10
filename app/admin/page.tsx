'use client';
import { useEffect, useState } from 'react';

export default function AdminPage() {
  const [form, setForm] = useState<any>({
    title: '', sourceUrl: '', sourceName: '',
    summary3: '', tags: '', koreaFit: 6, whyNow: '', risks: '',
    ogImage: '', domain: ''
  });
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [loadingMeta, setLoadingMeta] = useState(false);

  useEffect(() => {
    async function run() {
      const url = (form.sourceUrl || '').trim();
      if (!url || !/^https?:\/\//i.test(url)) return;
      setLoadingMeta(true);
      try {
        const metaRes = await fetch(`/api/meta?url=${encodeURIComponent(url)}`);
        const meta = await metaRes.json();
        let domain = '';
        try { domain = new URL(url).hostname; } catch {}
        setForm((f: any) => ({
          ...f,
          title: f.title || meta.title || f.title,
          summary3: f.summary3 || meta.description || f.summary3,
          ogImage: meta.ogImage || f.ogImage,
          sourceName: f.sourceName || (domain ? domain.split('.').slice(-2).join('.') : f.sourceName),
          domain
        }));
        setSuggestedTags(Array.isArray(meta.tags) ? meta.tags : []);
      } finally {
        setLoadingMeta(false);
      }
    }
    run();
  }, [form.sourceUrl]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: any = {
      ...form,
      tags: String(form.tags || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      risks: String(form.risks || '')
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
    };
    const res = await fetch('/api/ingest-bulk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Ingest-Token': process.env.NEXT_PUBLIC_INGEST_TOKEN || 'local-dev',
      },
      body: JSON.stringify([payload]),
    });
    alert(res.ok ? '저장되었습니다' : '실패');
  }

  function addTag(t: string) {
    setForm((f: any) => {
      const existing = String(f.tags || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      if (existing.includes(t)) return f;
      const next = existing.concat([t]).join(', ');
      return { ...f, tags: next };
    });
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h2 className="text-xl font-semibold mb-4">Admin - 수동 업로드</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border rounded p-2" placeholder="제목" value={form.title} onChange={e => setForm((f: any) => ({...f, title: e.target.value}))} />
        <input className="w-full border rounded p-2" placeholder="원문 URL" value={form.sourceUrl} onChange={e => setForm((f: any) => ({...f, sourceUrl: e.target.value}))} />
        <input className="w-full border rounded p-2" placeholder="출처 이름 (예: Product Hunt)" value={form.sourceName} onChange={e => setForm((f: any) => ({...f, sourceName: e.target.value}))} />
        <div className="flex items-center gap-3">
          {form.sourceUrl ? (
            <img src={`/api/og?url=${encodeURIComponent(form.sourceUrl)}`} alt="og" className="w-10 h-10 rounded border" />
          ) : null}
          <input className="flex-1 border rounded p-2" placeholder="OG 이미지 URL" value={form.ogImage} onChange={e => setForm((f: any) => ({...f, ogImage: e.target.value}))} />
        </div>
        <textarea className="w-full border rounded p-2" rows={3} placeholder="3문장 요약" value={form.summary3} onChange={e => setForm((f: any) => ({...f, summary3: e.target.value}))} />
        <div>
          <input className="w-full border rounded p-2" placeholder="태그 (쉼표로 구분)" value={form.tags} onChange={e => setForm((f: any) => ({...f, tags: e.target.value}))} />
          {loadingMeta ? (
            <p className="text-xs text-zinc-500 mt-1">메타 데이터 불러오는 중...</p>
          ) : suggestedTags.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-2">
              {suggestedTags.map((t) => (
                <button key={t} type="button" onClick={() => addTag(t)} className="px-2 py-0.5 text-xs rounded-full border bg-zinc-50">
                  {t}
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <input className="w-full border rounded p-2" type="number" min={0} max={10} placeholder="Korea Fit (0~10)" value={form.koreaFit} onChange={e => setForm((f: any) => ({...f, koreaFit: Number(e.target.value)}))} />
        <textarea className="w-full border rounded p-2" rows={3} placeholder="Why Now" value={form.whyNow} onChange={e => setForm((f: any) => ({...f, whyNow: e.target.value}))} />
        <textarea className="w-full border rounded p-2" rows={3} placeholder="리스크 (줄바꿈으로 구분)" value={form.risks} onChange={e => setForm((f: any) => ({...f, risks: e.target.value}))} />
        <button className="rounded-xl bg-black text-white px-4 py-2">저장</button>
      </form>
    </main>
  );
}
