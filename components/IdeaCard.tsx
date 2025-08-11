// components/IdeaCard.tsx
'use client';
import Link from 'next/link';
import type { Idea } from '@/lib/types';
import { formatDateKR } from '@/lib/format';
import { ExternalLink, Heart, Bookmark, TrendingUp, Target } from 'lucide-react';

export default function IdeaCard({ idea }: { idea: Idea }) {
  return (
    <div className="rounded-2xl p-6 hover:shadow-md transition-all duration-300 group h-full flex flex-col">
      {/* Header with title and badge */}
      <div className="mb-4">
        {typeof idea.koreaFit === 'number' && (
          <div className="flex justify-end mb-2">
            <span className="text-xs font-medium rounded-full px-3 py-1 bg-blue-100 text-blue-700">
              한국 적합도 {Math.round(idea.koreaFit * 10) / 10}/10
            </span>
          </div>
        )}
        <h3 className="text-xl font-semibold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
          <Link href={`/ideas/${idea.id}`} className="block">
            {idea.title}
          </Link>
        </h3>
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

      {/* Enhanced metrics */}
      {(idea.trendData?.trendScore || idea.metrics) && (
        <div className="mb-4 p-3 bg-slate-50 rounded-lg">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600">
            {idea.trendData?.trendScore && (
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                <span className="whitespace-nowrap">트렌드 {idea.trendData.trendScore}/100</span>
              </div>
            )}
            {idea.trendData?.growth && (
              <div className="flex items-center gap-1">
                <span className={`font-medium whitespace-nowrap ${idea.trendData.growth.startsWith('+') ? 'text-emerald-600' : 'text-red-500'}`}>
                  {idea.trendData.growth}
                </span>
                <span>성장</span>
              </div>
            )}
            {idea.metrics?.marketOpportunity && (
              <div className="flex items-center gap-1">
                <Target className="w-3 h-3 text-blue-600 flex-shrink-0" />
                <span className="whitespace-nowrap">기회도 {Math.round(idea.metrics.marketOpportunity)}/10</span>
              </div>
            )}
          </div>
        </div>
      )}

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

      {/* Actions - pushed to bottom with mt-auto */}
      <div className="mt-auto pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1 text-sm text-slate-600 hover:text-red-500 transition-colors p-1">
              <Heart className="w-4 h-4" />
              <span>공감</span>
            </button>
            <button className="flex items-center gap-1 text-sm text-slate-600 hover:text-blue-500 transition-colors p-1">
              <Bookmark className="w-4 h-4" />
              <span>저장</span>
            </button>
          </div>
          <a 
            href={idea.sourceUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 transition-colors p-1"
          >
            <span>원문</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
