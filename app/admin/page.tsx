'use client';
import { useState } from 'react';

export default function AdminPage() {
  const [form, setForm] = useState({
    title: '', sourceUrl: '', sourceName: '',
    summary3: '', tags: '', koreaFit: 6, whyNow: '', risks: ''
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      ...form,
      tags: form.tags.split(',').map(s => s.trim()).filter(Boolean),
      risks: form.risks.split('\n').map(s => s.trim()).filter(Boolean),
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

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h2 className="text-xl font-semibold mb-4">Admin · 수동 업로드</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border rounded p-2" placeholder="제목" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} />
        <input className="w-full border rounded p-2" placeholder="원문 URL" value={form.sourceUrl} onChange={e => setForm(f => ({...f, sourceUrl: e.target.value}))} />
        <input className="w-full border rounded p-2" placeholder="출처 이름 (예: Product Hunt)" value={form.sourceName} onChange={e => setForm(f => ({...f, sourceName: e.target.value}))} />
        <textarea className="w-full border rounded p-2" rows={3} placeholder="3문장 요약" value={form.summary3} onChange={e => setForm(f => ({...f, summary3: e.target.value}))} />
        <input className="w-full border rounded p-2" placeholder="태그 (쉼표로 구분)" value={form.tags} onChange={e => setForm(f => ({...f, tags: e.target.value}))} />
        <input className="w-full border rounded p-2" type="number" min={0} max={10} placeholder="Korea Fit (0~10)" value={form.koreaFit} onChange={e => setForm(f => ({...f, koreaFit: Number(e.target.value)}))} />
        <textarea className="w-full border rounded p-2" rows={3} placeholder="Why Now" value={form.whyNow} onChange={e => setForm(f => ({...f, whyNow: e.target.value}))} />
        <textarea className="w-full border rounded p-2" rows={3} placeholder="리스크 (줄바꿈으로 구분)" value={form.risks} onChange={e => setForm(f => ({...f, risks: e.target.value}))} />
        <button className="rounded-xl bg-black text-white px-4 py-2">저장</button>
      </form>
    </main>
  );
}
