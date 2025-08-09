// components/IdeaCard.tsx
'use client';
import Link from 'next/link';
import type { Idea } from '@/lib/types';
import { formatDateKR } from '@/lib/format';

export default function IdeaCard({ idea }: { idea: Idea }) {
  return (
    <div className="rounded-2xl border p-4 hover:shadow transition">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold line-clamp-2">
          <Link href={`/ideas/${idea.id}`}>{idea.title}</Link>
        </h3>
        {typeof idea.koreaFit === 'number' && (
          <span className="text-xs rounded-full px-2 py-1 bg-zinc-100">
            {`Korea Fit ${idea.koreaFit}/10`}
          </span>
        )}
      </div>

      {idea.summary3 && <p className="mt-2 text-sm text-zinc-700 line-clamp-3">{idea.summary3}</p>}

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
        {idea.tags?.slice(0, 4).map(t => (
          <span key={t} className="rounded-full bg-zinc-100 px-2 py-0.5">
            {t}
          </span>
        ))}
        {idea.publishedAt && <span>· {formatDateKR(idea.publishedAt)}</span>}
        {idea.sourceName && <span>· {idea.sourceName}</span>}
      </div>

      <div className="mt-3 flex items-center gap-3 text-sm">
        <button className="rounded-full border px-3 py-1">공감</button>
        <button className="rounded-full border px-3 py-1">비공감</button>
        <button className="rounded-full border px-3 py-1">북마크</button>
        <a href={idea.sourceUrl} target="_blank" className="ml-auto underline">원문</a>
      </div>
    </div>
  );
}
