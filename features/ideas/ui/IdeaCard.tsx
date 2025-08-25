'use client';
import Link from "next/link";
import { useState } from "react";

interface IdeaCardProps {
  idea: {
    id: string;
    title: string;
    summary: string;
    offer?: string;
    badges?: string[];
    tags?: string[];
    scorecards?: {
      opportunity?: number;
      problem?: number;
      feasibility?: number;
      whyNow?: number;
    };
    sourcePlatform?: string;
    sourceURL?: string;
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
          <Link href={`/idea/${idea.id}`} className="font-semibold text-lg hover:underline">
            {idea.title}
          </Link>
          <p className="text-sm text-zinc-600 mt-1">{idea.summary}</p>
          
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
          
          {/* 간이 점수 */}
          {idea.scorecards?.opportunity != null && (
            <div className="text-xs text-gray-500 mt-1">
              기회 점수: <span className="font-semibold">{idea.scorecards.opportunity}/10</span>
            </div>
          )}
          
          <div className="text-xs text-zinc-500 mt-2">
            <span className="mr-2">출처: {idea.sourcePlatform || "-"}</span>
            {idea.sourceURL && (
              <a className="underline mr-2" href={idea.sourceURL} target="_blank">
                원문 보기
              </a>
            )}
            <span className="mr-2">한국 적합도: {idea.koreaFitScore ?? "-"}/5</span>
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
