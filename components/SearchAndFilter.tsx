// components/SearchAndFilter.tsx
'use client';
import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X, TrendingUp, Clock, Target, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Idea } from '@/lib/types';

interface SearchAndFilterProps {
  ideas: Idea[];
  onFilter: (filteredIdeas: Idea[]) => void;
  onSearchChange?: (query: string) => void;
}

export default function SearchAndFilter({ ideas, onFilter, onSearchChange }: SearchAndFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedScoreRange, setSelectedScoreRange] = useState<string>('all');
  const [selectedEffort, setSelectedEffort] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('koreaFit');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Extract unique sectors from ideas
  const sectors = Array.from(new Set(ideas.map(idea => idea.sector).filter(Boolean))) as string[];

  // Apply filters
  const applyFilters = useCallback(() => {
    let filtered = [...ideas];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(idea => 
        idea.title?.toLowerCase().includes(query) ||
        idea.summary3?.toLowerCase().includes(query) ||
        idea.tags?.some(tag => tag.toLowerCase().includes(query)) ||
        idea.sector?.toLowerCase().includes(query) ||
        idea.businessModel?.toLowerCase().includes(query) ||
        idea.targetUser?.toLowerCase().includes(query)
      );
    }

    // Sector filter
    if (selectedSector !== 'all') {
      filtered = filtered.filter(idea => idea.sector === selectedSector);
    }

    // Score range filter
    if (selectedScoreRange !== 'all') {
      const [min, max] = selectedScoreRange.split('-').map(Number);
      filtered = filtered.filter(idea => {
        const score = idea.koreaFit || 0;
        return score >= min && score <= max;
      });
    }

    // Effort filter
    if (selectedEffort !== 'all') {
      const effortLevel = parseInt(selectedEffort);
      filtered = filtered.filter(idea => idea.effort === effortLevel);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'koreaFit':
          return (b.koreaFit || 0) - (a.koreaFit || 0);
        case 'trending':
          const aGrowth = parseFloat(a.trendData?.growth?.replace(/[^0-9.-]/g, '') || '0');
          const bGrowth = parseFloat(b.trendData?.growth?.replace(/[^0-9.-]/g, '') || '0');
          return bGrowth - aGrowth;
        case 'effort':
          return (a.effort || 5) - (b.effort || 5);
        case 'newest':
          return new Date(b.publishedAt || b.createdAt || 0).getTime() - 
                 new Date(a.publishedAt || a.createdAt || 0).getTime();
        default:
          return 0;
      }
    });

    onFilter(filtered);
    if (onSearchChange) {
      onSearchChange(searchQuery);
    }
  }, [searchQuery, selectedSector, selectedScoreRange, selectedEffort, sortBy, ideas]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSector('all');
    setSelectedScoreRange('all');
    setSelectedEffort('all');
    setSortBy('koreaFit');
    setShowAdvanced(false);
  };

  const hasActiveFilters = searchQuery || selectedSector !== 'all' || 
                           selectedScoreRange !== 'all' || selectedEffort !== 'all';

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
      {/* Search Bar */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="아이디어, 섹터, 태그로 검색..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <Button
          variant={showAdvanced ? 'default' : 'outline'}
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="px-4"
        >
          <Filter className="w-4 h-4 mr-2" />
          고급 필터
        </Button>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <select
          value={selectedSector}
          onChange={(e) => setSelectedSector(e.target.value)}
          className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">모든 섹터</option>
          {sectors.map(sector => (
            <option key={sector} value={sector}>{sector}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="koreaFit">Korea Fit 높은순</option>
          <option value="trending">성장률 높은순</option>
          <option value="effort">노력도 낮은순</option>
          <option value="newest">최신순</option>
        </select>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X className="w-3.5 h-3.5 inline mr-1" />
            필터 초기화
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="pt-4 border-t border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Korea Fit Score Range */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Korea Fit 점수
              </label>
              <select
                value={selectedScoreRange}
                onChange={(e) => setSelectedScoreRange(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">전체</option>
                <option value="9-10">9-10 (최고)</option>
                <option value="7-8.9">7-8.9 (높음)</option>
                <option value="5-6.9">5-6.9 (보통)</option>
                <option value="0-4.9">0-4.9 (낮음)</option>
              </select>
            </div>

            {/* Effort Level */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                실행 노력도
              </label>
              <select
                value={selectedEffort}
                onChange={(e) => setSelectedEffort(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">전체</option>
                <option value="1">⚡ (매우 쉬움)</option>
                <option value="2">⚡⚡ (쉬움)</option>
                <option value="3">⚡⚡⚡ (보통)</option>
                <option value="4">⚡⚡⚡⚡ (어려움)</option>
                <option value="5">⚡⚡⚡⚡⚡ (매우 어려움)</option>
              </select>
            </div>

            {/* Quick Presets */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                빠른 선택
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedScoreRange('7-10');
                    setSelectedEffort('all');
                  }}
                  className="flex-1 px-3 py-2 text-sm bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors"
                >
                  <Star className="w-3.5 h-3.5 inline mr-1" />
                  추천
                </button>
                <button
                  onClick={() => {
                    setSelectedEffort('1');
                    setSelectedScoreRange('all');
                  }}
                  className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Clock className="w-3.5 h-3.5 inline mr-1" />
                  쉬운
                </button>
                <button
                  onClick={() => {
                    setSortBy('trending');
                    setSelectedScoreRange('all');
                  }}
                  className="flex-1 px-3 py-2 text-sm bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <TrendingUp className="w-3.5 h-3.5 inline mr-1" />
                  트렌드
                </button>
              </div>
            </div>
          </div>

          {/* Search Stats */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-sm text-slate-600">
              {ideas.length}개 중 <span className="font-semibold text-slate-900">{ideas.length}개</span> 아이디어 표시 중
            </p>
          </div>
        </div>
      )}
    </div>
  );
}