// app/ideas/enhanced/page.tsx
'use client';
import { useState, useEffect } from 'react';
import IdeaCardEnhanced from '@/components/IdeaCardEnhanced';
import SearchAndFilter from '@/components/SearchAndFilter';
import ExportModal from '@/components/ExportModal';
import { TrendingUp, Lightbulb, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Idea } from '@/lib/types';

const ITEMS_PER_PAGE = 12;

export default function EnhancedIdeasPage() {
  const [allIdeas, setAllIdeas] = useState<Idea[]>([]);
  const [filteredIdeas, setFilteredIdeas] = useState<Idea[]>([]);
  const [displayedIdeas, setDisplayedIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showExportModal, setShowExportModal] = useState(false);

  // Load ideas on mount
  useEffect(() => {
    loadIdeas();
  }, []);

  const loadIdeas = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ideas');
      const data = await response.json();
      const ideas = data.ideas || [];
      setAllIdeas(ideas);
      setFilteredIdeas(ideas);
    } catch (error) {
      console.error('Failed to load ideas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle pagination
  useEffect(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setDisplayedIdeas(filteredIdeas.slice(startIndex, endIndex));
  }, [filteredIdeas, currentPage]);

  const handleFilter = (filtered: Idea[]) => {
    setFilteredIdeas(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const totalPages = Math.ceil(filteredIdeas.length / ITEMS_PER_PAGE);

  // Statistics
  const stats = {
    total: filteredIdeas.length,
    avgKoreaFit: filteredIdeas.reduce((sum, idea) => sum + (idea.koreaFit || 0), 0) / Math.max(filteredIdeas.length, 1),
    highScore: filteredIdeas.filter(idea => (idea.koreaFit || 0) >= 8).length,
    trending: filteredIdeas.filter(idea => idea.trendData?.growth?.startsWith('+')).length
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">아이디어를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">비즈니스 아이디어 탐색</h1>
              <p className="text-slate-600">한국 시장에 최적화된 {allIdeas.length}개의 비즈니스 기회를 탐색해보세요</p>
            </div>
            <Button 
              variant="outline"
              onClick={() => {
                console.log('Export button clicked!');
                setShowExportModal(true);
              }}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              내보내기
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-1">
              <Lightbulb className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-slate-600">총 아이디어</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span className="text-sm text-slate-600">성장 중</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats.trending}</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm text-slate-600">평균 Korea Fit</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats.avgKoreaFit.toFixed(1)}</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm text-slate-600">고득점 (8+)</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats.highScore}</div>
          </div>
        </div>

        {/* Search and Filters */}
        <SearchAndFilter 
          ideas={allIdeas}
          onFilter={handleFilter}
        />

        {/* View Mode Toggle */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-slate-600">
            {filteredIdeas.length}개 결과 중 {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredIdeas.length)}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredIdeas.length)} 표시
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-white text-slate-600'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-white text-slate-600'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Ideas Grid/List */}
        {displayedIdeas.length > 0 ? (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {displayedIdeas.map((idea) => (
                  <IdeaCardEnhanced key={idea.id} idea={idea} />
                ))}
              </div>
            ) : (
              <div className="space-y-3 mb-8">
                {displayedIdeas.map((idea) => (
                  <IdeaCardEnhanced key={idea.id} idea={idea} compact />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  이전
                </Button>
                
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  다음
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Lightbulb className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 text-lg">검색 결과가 없습니다</p>
            <p className="text-slate-500 text-sm mt-2">다른 검색어나 필터를 시도해보세요</p>
          </div>
        )}

        {/* Export Modal */}
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          ideas={filteredIdeas}
        />
      </div>
    </div>
  );
}