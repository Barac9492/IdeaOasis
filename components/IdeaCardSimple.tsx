// components/IdeaCardSimple.tsx
'use client';
import Link from 'next/link';
import type { Idea } from '@/lib/types';

export default function IdeaCardSimple({ idea }: { idea: Idea }) {
  return (
    <Link href={`/ideas/${idea.id}`}>
      <div className="p-6 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors">
        {/* Title */}
        <h3 className="font-medium text-slate-900 mb-2 line-clamp-2">
          {idea.title}
        </h3>
        
        {/* Summary */}
        <p className="text-sm text-slate-600 mb-4 line-clamp-2">
          {idea.summary3}
        </p>
        
        {/* Bottom Row */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            {/* Korea Fit */}
            {typeof idea.koreaFit === 'number' && (
              <span className="text-slate-900 font-medium">
                {idea.koreaFit.toFixed(1)}
              </span>
            )}
            
            {/* Sector */}
            {idea.sector && (
              <span className="text-slate-500">
                {idea.sector}
              </span>
            )}
          </div>
          
          {/* Date */}
          {idea.updatedAt && (
            <span className="text-slate-500">
              {new Date(idea.updatedAt).toLocaleDateString('ko-KR', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}