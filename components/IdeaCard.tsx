// components/IdeaCard.tsx
'use client';
import Link from 'next/link';
import type { Idea } from '@/lib/types';
import { formatDateKR } from '@/lib/format';
import { ExternalLink, Heart, Bookmark, TrendingUp, Target } from 'lucide-react';

export default function IdeaCard({ idea }: { idea: Idea }) {
  return (
    <div className="rounded-2xl p-5 hover:shadow-md transition-all duration-300 group h-full flex flex-col">
      {/* Compact header with title and badge in one row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-lg font-semibold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors flex-1">
          <Link href={`/ideas/${idea.id}`}>
            {idea.title}
          </Link>
        </h3>
        {typeof idea.koreaFit === 'number' && (
          <span className="text-xs font-medium rounded-full px-2 py-1 bg-blue-100 text-blue-700 whitespace-nowrap">
            {Math.round(idea.koreaFit * 10) / 10}/10
          </span>
        )}
      </div>

      {idea.summary3 && (
        <p className="text-slate-600 line-clamp-2 mb-3 leading-relaxed text-sm">
          {idea.summary3}
        </p>
      )}

      {/* Compact tags and metrics in one row */}
      <div className="mb-3">
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-2">
          {idea.tags?.slice(0, 3).map(tag => (
            <span key={tag} className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
              {tag}
            </span>
          ))}
        </div>

        {/* Enhanced metrics - more compact */}
        {(idea.trendData?.trendScore || idea.metrics) && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
            {idea.trendData?.trendScore && (
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-600" />
                <span>{idea.trendData.trendScore}</span>
              </div>
            )}
            {idea.trendData?.growth && (
              <span className={`font-medium ${idea.trendData.growth.startsWith('+') ? 'text-emerald-600' : 'text-red-500'}`}>
                {idea.trendData.growth}
              </span>
            )}
            {idea.metrics?.marketOpportunity && (
              <div className="flex items-center gap-1">
                <Target className="w-3 h-3 text-blue-600" />
                <span>{Math.round(idea.metrics.marketOpportunity)}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Compact actions at bottom */}
      <div className="mt-auto pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs">
          {/* Source info */}
          <div className="text-slate-500">
            {idea.sourceName && <span>{idea.sourceName}</span>}
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 text-slate-500 hover:text-red-500 transition-colors">
              <Heart className="w-3 h-3" />
            </button>
            <button className="flex items-center gap-1 text-slate-500 hover:text-blue-500 transition-colors">
              <Bookmark className="w-3 h-3" />
            </button>
            <a 
              href={idea.sourceUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
