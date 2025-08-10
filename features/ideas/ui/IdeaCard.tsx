'use client';
import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';
import type { Idea } from '@/lib/types';
import { formatDateKR } from '@/lib/format';

function scoreBadgeColor(score: number): string {
  if (score >= 10) return 'bg-green-100 text-green-700 border-green-200';
  if (score >= 1) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (score <= -10) return 'bg-red-100 text-red-700 border-red-200';
  if (score < 0) return 'bg-rose-50 text-rose-700 border-rose-200';
  return 'bg-zinc-100 text-zinc-700 border-zinc-200';
}

function koreaFitColor(fit: number): string {
  if (fit >= 8) return 'bg-green-600';
  if (fit >= 5) return 'bg-yellow-500';
  return 'bg-red-500';
}

export default function IdeaCard({
  idea,
  className = '',
  ...props
}: { idea: Idea } & React.HTMLAttributes<HTMLDivElement>) {
  const [showTranslated, setShowTranslated] = useState(true);
  const [shareOpen, setShareOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const netScore = useMemo(() => {
    const up = idea.votesUp ?? 0;
    const down = idea.votesDown ?? 0;
    return up - down;
  }, [idea.votesUp, idea.votesDown]);

  const tags = idea.tags ?? [];
  const visibleTags = tags.slice(0, 3);
  const extraTags = Math.max(0, tags.length - visibleTags.length);

  const imgSrc = idea.sourceUrl ? `/api/og?url=${encodeURIComponent(idea.sourceUrl)}` : undefined;

  function copyLink() {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/idea/${idea.id}` : '';
    if (!url) return;
    navigator.clipboard.writeText(url);
    setShareOpen(false);
  }

  function openTwitter() {
    const text = encodeURIComponent(idea.title || 'Idea');
    const url = typeof window !== 'undefined' ? encodeURIComponent(`${window.location.origin}/idea/${idea.id}`) : '';
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
    setShareOpen(false);
  }

  function onRipple(e: React.MouseEvent) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'absolute inset-0 pointer-events-none overflow-hidden rounded-2xl';
    const dot = document.createElement('span');
    dot.className = 'absolute rounded-full bg-zinc-300 opacity-40 scale-0';
    const size = Math.max(rect.width, rect.height) * 1.2;
    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    dot.style.transition = 'transform 500ms ease-out, opacity 700ms ease-out';
    ripple.appendChild(dot);
    el.appendChild(ripple);
    requestAnimationFrame(() => {
      dot.style.transform = 'scale(1)';
      dot.style.opacity = '0';
    });
    setTimeout(() => {
      el.removeChild(ripple);
    }, 800);
  }

  return (
    <div
      ref={cardRef}
      onClick={onRipple}
      className={`relative rounded-2xl border p-4 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg bg-white ${className}`}
      {...props}
    >
      <div className="flex items-start gap-3">
        {imgSrc && (
          <div className="relative shrink-0 w-16 h-16 rounded-xl overflow-hidden border bg-zinc-50">
            <img src={imgSrc} alt="thumbnail" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-semibold line-clamp-2">
              <Link href={`/idea/${idea.id}`}>{idea.title}</Link>
            </h3>
            <span
              className={`text-xs rounded-full px-2 py-1 border ${scoreBadgeColor(netScore)}`}
              title="Net votes"
            >
              {netScore >= 0 ? `+${netScore}` : `${netScore}`}
            </span>
          </div>

          {idea.offer && (
            <p className="mt-2 text-sm text-zinc-900 font-medium line-clamp-2">{idea.offer}</p>
          )}

          {idea.summary3 && (
            <p className="mt-1 text-sm text-zinc-700 line-clamp-3">
              {showTranslated ? idea.summary3 : idea.longSummary || idea.summary3}
            </p>
          )}

          {idea.whyNow && (
            <div className="mt-2 flex items-start gap-1.5 text-xs text-zinc-600">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              <span className="line-clamp-2">{idea.whyNow}</span>
            </div>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-zinc-600">
            {visibleTags.map((t) => (
              <span key={t} className="rounded-full bg-zinc-100 px-2 py-0.5 border border-zinc-200">{t}</span>
            ))}
            {extraTags > 0 && (
              <span className="rounded-full bg-zinc-50 px-2 py-0.5 border border-zinc-200">+{extraTags}</span>
            )}
            {idea.publishedAt && <span className="ml-auto">{formatDateKR(idea.publishedAt)}</span>}
            <span>
              · {(idea.sourceUrl ? (() => { try { return new URL(idea.sourceUrl).hostname.replace(/^www\./,''); } catch { return idea.sourceName || ''; } })() : (idea.sourceName || ''))}
            </span>
          </div>

          <div className="mt-2 flex items-center gap-2 text-xs text-zinc-700">
            {typeof idea.effort === 'number' && (
              <span className="inline-flex items-center gap-1 rounded-full border bg-zinc-50 px-2 py-0.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3v12"/><path d="M18 3v18"/><path d="M12 3v8"/></svg>
                Effort {Math.max(1, Math.min(5, idea.effort))}/5
              </span>
            )}
            {Array.isArray(idea.risks) && idea.risks.length > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full border bg-zinc-50 px-2 py-0.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                Risks {idea.risks.length}
              </span>
            )}
          </div>

          {typeof idea.koreaFit === 'number' && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 border border-zinc-200">Korea Fit</span>
                <span className="text-zinc-700 font-medium">{idea.koreaFit}/10</span>
              </div>
              <div className="h-2 rounded-full bg-zinc-100 overflow-hidden">
                <div
                  className={`h-full ${koreaFitColor(idea.koreaFit)}`}
                  style={{ width: `${Math.max(0, Math.min(10, idea.koreaFit)) * 10}%` }}
                />
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center gap-2 text-sm">
            <Link href={`/idea/${idea.id}`} className="rounded-full bg-black text-white px-3 py-1">자세히 보기</Link>
            <button className="rounded-full border px-3 py-1 flex items-center gap-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9l-5 5-3-3"/><path d="M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0"/></svg>
              공감
            </button>
            <button className="rounded-full border px-3 py-1 flex items-center gap-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 15l5-5 3 3"/><path d="M4 12a8 8 0 1 0 16 0 8 8 0 0 0-16 0"/></svg>
              비공감
            </button>
            <button className="rounded-full border px-3 py-1 flex items-center gap-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
              북마크
            </button>
            <div className="relative ml-auto">
              <button onClick={() => setShareOpen((v) => !v)} className="rounded-full border px-3 py-1 flex items-center gap-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98"/><path d="M15.41 6.51L8.59 10.49"/></svg>
                공유
              </button>
              {shareOpen && (
                <div className="absolute right-0 mt-1 w-40 rounded-lg border bg-white shadow-lg z-10">
                  <button onClick={openTwitter} className="w-full text-left px-3 py-2 hover:bg-zinc-50">X (Twitter)</button>
                  <a className="block px-3 py-2 hover:bg-zinc-50" href={`https://story.kakao.com/share?url=${typeof window !== 'undefined' ? encodeURIComponent(`${window.location.origin}/idea/${idea.id}`) : ''}`} target="_blank">Kakao</a>
                  <button onClick={copyLink} className="w-full text-left px-3 py-2 hover:bg-zinc-50">링크 복사</button>
                </div>
              )}
            </div>
            <label className="ml-2 flex items-center gap-1 text-xs cursor-pointer select-none">
              <input type="checkbox" className="accent-black" checked={showTranslated} onChange={(e) => setShowTranslated(e.target.checked)} /> 번역
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
