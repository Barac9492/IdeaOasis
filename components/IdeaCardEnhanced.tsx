// components/IdeaCardEnhanced.tsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import type { Idea } from '@/lib/types';
import { formatDateKR } from '@/lib/format';
import { ExternalLink, Heart, Bookmark, TrendingUp, Target, Users, Clock, ChevronRight } from 'lucide-react';

interface IdeaCardEnhancedProps {
  idea: Idea;
  showActions?: boolean;
  compact?: boolean;
}

export default function IdeaCardEnhanced({ 
  idea, 
  showActions = true,
  compact = false 
}: IdeaCardEnhancedProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        checkBookmarkStatus(user.uid);
      }
    });
    return unsubscribe;
  }, [idea.id]);

  const checkBookmarkStatus = async (userId: string) => {
    try {
      const response = await fetch(`/api/bookmark?userUid=${userId}&ideaId=${idea.id}`);
      const data = await response.json();
      setIsBookmarked(data.bookmarked);
      setBookmarkCount(data.bookmarkCount || 0);
    } catch (error) {
      console.error('Failed to check bookmark status:', error);
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      alert('로그인이 필요한 기능입니다.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/bookmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ideaId: idea.id,
          userUid: user.uid
        })
      });

      const data = await response.json();
      if (data.success) {
        setIsBookmarked(data.bookmarked);
        setBookmarkCount(data.bookmarkCount);
      }
    } catch (error) {
      console.error('Bookmark error:', error);
      alert('북마크 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate idea quality score
  const qualityScore = idea.koreaFit || 0;
  const scoreColor = qualityScore >= 8 ? 'text-emerald-600 bg-emerald-50' : 
                     qualityScore >= 6 ? 'text-blue-600 bg-blue-50' : 
                     'text-slate-600 bg-slate-50';

  if (compact) {
    // Compact view for lists
    return (
      <div className="bg-white rounded-xl p-4 hover:shadow-md transition-all duration-300 group">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <Link href={`/ideas/${idea.id}`}>
              <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                {idea.title}
              </h3>
            </Link>
            <div className="flex items-center gap-3 mt-2 text-sm text-slate-500">
              {idea.sector && <span className="font-medium">{idea.sector}</span>}
              {idea.trendData?.growth && (
                <span className={`font-medium ${idea.trendData.growth.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
                  {idea.trendData.growth}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-lg text-sm font-medium ${scoreColor}`}>
              {qualityScore.toFixed(1)}
            </span>
            {showActions && (
              <button
                onClick={handleBookmark}
                disabled={isLoading}
                className={`p-2 rounded-lg transition-colors ${
                  isBookmarked ? 'bg-blue-100 text-blue-600' : 'hover:bg-slate-100'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Full card view
  return (
    <div className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group h-full flex flex-col border border-slate-100">
      {/* Header with score badge */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1">
          <Link href={`/ideas/${idea.id}`}>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
              {idea.title}
            </h3>
          </Link>
          {idea.sector && (
            <span className="inline-block mt-2 text-xs font-medium px-2 py-1 bg-slate-100 text-slate-700 rounded-md">
              {idea.sector}
            </span>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className={`px-3 py-1.5 rounded-lg ${scoreColor}`}>
            <div className="text-xs font-medium opacity-75">Korea Fit</div>
            <div className="text-lg font-bold">{qualityScore.toFixed(1)}</div>
          </div>
        </div>
      </div>

      {/* Summary */}
      {idea.summary3 && (
        <p className="text-slate-600 line-clamp-3 mb-4 leading-relaxed text-sm">
          {idea.summary3}
        </p>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {idea.trendData && (
          <>
            <div className="bg-slate-50 rounded-lg p-2.5">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-xs text-slate-500">성장률</span>
              </div>
              <div className={`text-sm font-semibold ${
                idea.trendData.growth?.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {idea.trendData.growth || 'N/A'}
              </div>
            </div>
            <div className="bg-slate-50 rounded-lg p-2.5">
              <div className="flex items-center gap-1.5 mb-1">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-xs text-slate-500">월 검색량</span>
              </div>
              <div className="text-sm font-semibold text-slate-900">
                {idea.trendData.monthlySearches || 'N/A'}
              </div>
            </div>
          </>
        )}
        {idea.effort && (
          <div className="bg-slate-50 rounded-lg p-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-xs text-slate-500">노력도</span>
            </div>
            <div className="text-sm font-semibold text-slate-900">
              {'⚡'.repeat(idea.effort)}<span className="text-slate-300">{'⚡'.repeat(5 - idea.effort)}</span>
            </div>
          </div>
        )}
        {idea.targetUser && (
          <div className="bg-slate-50 rounded-lg p-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <Target className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-xs text-slate-500">타겟</span>
            </div>
            <div className="text-sm font-semibold text-slate-900 truncate">
              {idea.targetUser}
            </div>
          </div>
        )}
      </div>

      {/* Tags */}
      {idea.tags && idea.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {idea.tags.slice(0, 4).map(tag => (
            <span key={tag} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-md font-medium">
              #{tag}
            </span>
          ))}
          {idea.tags.length > 4 && (
            <span className="text-xs px-2 py-1 text-slate-500">
              +{idea.tags.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="mt-auto pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {showActions && (
              <>
                <button
                  onClick={handleBookmark}
                  disabled={isLoading}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isBookmarked 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  <span>{isBookmarked ? '저장됨' : '저장'}</span>
                  {bookmarkCount > 0 && (
                    <span className="text-xs opacity-75">({bookmarkCount})</span>
                  )}
                </button>
                {idea.sourceUrl && (
                  <a
                    href={idea.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-700"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </>
            )}
          </div>
          <Link
            href={`/ideas/${idea.id}`}
            className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            자세히 보기
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}