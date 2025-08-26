'use client';
import Link from "next/link";
import { useState } from "react";

import type { Idea } from '@/lib/types';

interface IdeaCardProps {
  idea: Idea & {
    offer?: string;
    badges?: string[];
    scorecards?: {
      opportunity?: number;
      problem?: number;
      feasibility?: number;
      whyNow?: number;
    };
    koreaFitScore?: number;
    signals?: {
      last7dDelta?: number;
    };
  };
  onVote: (ideaId: string, up: boolean) => Promise<void>;
  onBookmark: (ideaId: string) => Promise<void>;
  isBookmarked?: boolean;
  className?: string;
}

export default function IdeaCard({ 
  idea, 
  onVote, 
  onBookmark, 
  isBookmarked = false,
  className = "" 
}: IdeaCardProps) {
  const delta = (idea?.signals?.last7dDelta ?? 0);
  
  return (
    <article className={`p-4 border rounded-lg ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Link href={`/idea/${idea.id}`} className="font-semibold text-lg hover:underline flex-1">
              {idea.title}
            </Link>
            {idea.difficultyLevel && (
              <span className={`px-2 py-1 text-xs rounded-full ${
                idea.difficultyLevel === 'beginner' 
                  ? 'bg-green-100 text-green-800' 
                  : idea.difficultyLevel === 'intermediate'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {idea.difficultyLevel === 'beginner' ? '초급' 
                  : idea.difficultyLevel === 'intermediate' ? '중급' : '고급'}
              </span>
            )}
          </div>
          <p className="text-sm text-zinc-600 mt-1">{idea.summary3}</p>
          
          {/* offer 한 줄 */}
          {idea.offer && (
            <p className="text-sm text-gray-800 mt-1">{idea.offer}</p>
          )}
          
          {/* 배지 3개 */}
          <div className="flex flex-wrap gap-1 mt-2">
            {(idea.badges ?? []).slice(0, 3).map((b, idx) => (
              <span key={`badge-${idx}`} className="px-2 py-0.5 text-xs rounded-full bg-gray-100 border">
                {b}
              </span>
            ))}
            {(idea.tags ?? []).slice(0, 3).map((t, idx) => (
              <span key={`tag-${idx}`} className="px-2 py-0.5 text-xs rounded-full bg-blue-50 border border-blue-200">
                #{t}
              </span>
            ))}
          </div>
          
          {/* Work-While-You-Build 실행 지표 */}
          {(idea.timeBudgetHoursPerWeek || idea.starterCapitalKRW || idea.automationPct) && (
            <div className="bg-slate-50 p-3 rounded-lg mt-3">
              <div className="grid grid-cols-3 gap-4 text-center">
                {idea.timeBudgetHoursPerWeek && (
                  <div>
                    <div className="text-sm font-semibold text-slate-900">≤{idea.timeBudgetHoursPerWeek}시간</div>
                    <div className="text-xs text-slate-600">주간 투자</div>
                  </div>
                )}
                {idea.starterCapitalKRW && (
                  <div>
                    <div className="text-sm font-semibold text-slate-900">≤₩{(idea.starterCapitalKRW/1000000).toFixed(0)}M</div>
                    <div className="text-xs text-slate-600">시작 자본</div>
                  </div>
                )}
                {idea.automationPct && (
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{idea.automationPct}%</div>
                    <div className="text-xs text-slate-600">자동화</div>
                  </div>
                )}
              </div>
              
              {idea.paybackMonths && (
                <div className="text-center mt-2">
                  <span className="text-xs text-slate-600">회수기간: </span>
                  <span className="text-xs font-semibold">{idea.paybackMonths}개월</span>
                </div>
              )}
              
              {idea.toolStack && idea.toolStack.length > 0 && (
                <div className="mt-2">
                  <div className="text-xs text-slate-600 mb-1">툴스택:</div>
                  <div className="flex flex-wrap gap-1">
                    {idea.toolStack.slice(0, 3).map((tool, idx) => (
                      <span key={idx} className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {idea.mondayStartable && (
                <div className="mt-2">
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    ✅ 오늘 시작 가능
                  </span>
                </div>
              )}
            </div>
          )}
          
          {idea.cautionNote && (
            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
              ⚠️ {idea.cautionNote}
            </div>
          )}
          
          <div className="text-xs text-zinc-500 mt-2">
            <span className="mr-2">출처: {idea.sourceName || "-"}</span>
            {idea.sourceUrl && (
              <a className="underline mr-2" href={idea.sourceUrl} target="_blank">
                원문 보기
              </a>
            )}
            <span>최근 7일 변화: {delta >= 0 ? "+" : ""}{delta}</span>
          </div>
        </div>
        
        <div className="flex flex-col gap-2 items-end">
          <div className="flex gap-2">
            <button 
              onClick={() => onVote(idea.id, true)} 
              className="px-3 py-1 rounded-lg border"
            >
              ▲
            </button>
            <button 
              onClick={() => onVote(idea.id, false)} 
              className="px-3 py-1 rounded-lg border"
            >
              ▼
            </button>
          </div>
          <button 
            onClick={() => onBookmark(idea.id)} 
            className="text-xs underline"
          >
            {isBookmarked ? "★ 북마크됨" : "☆ 북마크"}
          </button>
        </div>
      </div>
    </article>
  );
}
