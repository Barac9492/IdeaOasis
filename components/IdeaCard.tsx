// components/IdeaCard.tsx
'use client';
import Link from 'next/link';
import type { Idea } from '@/lib/types';
import { formatDateKR } from '@/lib/format';
import { ExternalLink, Heart, Bookmark } from 'lucide-react';

export default function IdeaCard({ idea }: { idea: Idea }) {
  return (
    <div className="rounded-2xl p-6 hover:shadow-md transition-all duration-300 group">
      <div className="flex items-start justify-between gap-3 mb-4">
        <h3 className="text-xl font-semibold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
          <Link href={`/ideas/${idea.id}`}>{idea.title}</Link>
        </h3>
        {typeof idea.koreaFit === 'number' && (
          <span className="text-xs font-medium rounded-full px-3 py-1 bg-blue-100 text-blue-700 whitespace-nowrap">
            {`한국 적합도 ${idea.koreaFit}/10`}
          </span>
        )}
      </div>

      {idea.summary3 && (
        <p className="text-slate-600 line-clamp-3 mb-4 leading-relaxed">
          {idea.summary3}
        </p>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {idea.tags?.slice(0, 3).map(tag => (
          <span key={tag} className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded-md font-medium">
            {tag}
          </span>
        ))}
      </div>

      {/* Meta info */}
      <div className="flex items-center gap-3 text-sm text-slate-500 mb-4">
        {idea.publishedAt && <span>{formatDateKR(idea.publishedAt)}</span>}
        {idea.sourceName && (
          <>
            <span>•</span>
            <span>{idea.sourceName}</span>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 text-sm text-slate-600 hover:text-red-500 transition-colors">
            <Heart className="w-4 h-4" />
            <span>공감</span>
          </button>
          <button className="flex items-center gap-1 text-sm text-slate-600 hover:text-blue-500 transition-colors">
            <Bookmark className="w-4 h-4" />
            <span>저장</span>
          </button>
        </div>
        <a 
          href={idea.sourceUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 transition-colors"
        >
          <span>원문 보기</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
