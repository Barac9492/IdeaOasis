import { useState } from 'react';
import { ChevronDown, X, Filter } from 'lucide-react';

interface FilterProps {
  filters: {
    category: string;
    difficulty: string;
    access: string;
    source: string;
    sortBy: string;
  };
  onFilterChange: (filters: any) => void;
  totalIdeas: number;
}

export default function IdeaFilters({ filters, onFilterChange, totalIdeas }: FilterProps) {
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['헬스테크', '핀테크', '에듀테크', '푸드테크', '그린테크', '펫테크', '소셜커머스', '엔터테인먼트'];
  const difficulties = ['Low', 'Medium', 'High'];
  const accessTypes = ['public', 'paid'];
  const sources = ['Y Combinator', 'Kickstarter', 'Product Hunt', 'AngelList'];
  const sortOptions = [
    { value: 'latest', label: '최신순' },
    { value: 'popular', label: '인기순' },
    { value: 'opportunity', label: '시장기회순' }
  ];

  const difficultyLabels = {
    Low: '쉬움',
    Medium: '보통',
    High: '어려움'
  };

  const accessLabels = {
    public: '무료',
    paid: '프리미엄'
  };

  const clearFilters = () => {
    onFilterChange({
      category: '',
      difficulty: '',
      access: '',
      source: '',
      sortBy: 'latest'
    });
  };

  const hasActiveFilters = filters.category || filters.difficulty || filters.access || filters.source;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-semibold text-foreground">
            아이디어 탐색
          </h2>
          <div className="px-3 py-1 bg-muted rounded-full text-sm font-medium text-muted-foreground">
            {totalIdeas}개
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value })}
              className="appearance-none bg-muted hover:bg-muted/80 text-foreground px-4 py-2 pr-8 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" size={16} />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all font-medium ${
              showFilters 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted hover:bg-muted/80 text-foreground'
            }`}
          >
            <Filter size={16} />
            <span>필터</span>
            {hasActiveFilters && (
              <div className="w-2 h-2 bg-destructive rounded-full"></div>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center space-x-1 px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={16} />
              <span className="text-sm">초기화</span>
            </button>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.category && (
            <div className="flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm">
              <span>카테고리: {filters.category}</span>
              <button
                onClick={() => onFilterChange({ ...filters, category: '' })}
                className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          )}
          
          {filters.difficulty && (
            <div className="flex items-center space-x-2 bg-secondary/10 text-secondary px-3 py-1.5 rounded-full text-sm">
              <span>난이도: {difficultyLabels[filters.difficulty as keyof typeof difficultyLabels]}</span>
              <button
                onClick={() => onFilterChange({ ...filters, difficulty: '' })}
                className="hover:bg-secondary/20 rounded-full p-0.5 transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          )}

          {filters.access && (
            <div className="flex items-center space-x-2 bg-chart-3/10 text-chart-3 px-3 py-1.5 rounded-full text-sm">
              <span>접근: {accessLabels[filters.access as keyof typeof accessLabels]}</span>
              <button
                onClick={() => onFilterChange({ ...filters, access: '' })}
                className="hover:bg-chart-3/20 rounded-full p-0.5 transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          )}

          {filters.source && (
            <div className="flex items-center space-x-2 bg-chart-4/10 text-chart-4 px-3 py-1.5 rounded-full text-sm">
              <span>출처: {filters.source}</span>
              <button
                onClick={() => onFilterChange({ ...filters, source: '' })}
                className="hover:bg-chart-4/20 rounded-full p-0.5 transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Filter Panel */}
      {showFilters && (
        <div className="glass-light rounded-2xl p-6 lg:p-8 shadow-apple">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                카테고리
              </label>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category} className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="category"
                      value={category}
                      checked={filters.category === category}
                      onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
                      className="w-4 h-4 text-primary focus:ring-primary/20 border-muted-foreground"
                    />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      {category}
                    </span>
                  </label>
                ))}
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="category"
                    value=""
                    checked={filters.category === ''}
                    onChange={() => onFilterChange({ ...filters, category: '' })}
                    className="w-4 h-4 text-primary focus:ring-primary/20 border-muted-foreground"
                  />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    전체
                  </span>
                </label>
              </div>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                구현 난이도
              </label>
              <div className="space-y-2">
                {difficulties.map((difficulty) => (
                  <label key={difficulty} className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="difficulty"
                      value={difficulty}
                      checked={filters.difficulty === difficulty}
                      onChange={(e) => onFilterChange({ ...filters, difficulty: e.target.value })}
                      className="w-4 h-4 text-primary focus:ring-primary/20 border-muted-foreground"
                    />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      {difficultyLabels[difficulty as keyof typeof difficultyLabels]}
                    </span>
                  </label>
                ))}
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="difficulty"
                    value=""
                    checked={filters.difficulty === ''}
                    onChange={() => onFilterChange({ ...filters, difficulty: '' })}
                    className="w-4 h-4 text-primary focus:ring-primary/20 border-muted-foreground"
                  />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    전체
                  </span>
                </label>
              </div>
            </div>

            {/* Access Filter */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                접근 권한
              </label>
              <div className="space-y-2">
                {accessTypes.map((access) => (
                  <label key={access} className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="access"
                      value={access}
                      checked={filters.access === access}
                      onChange={(e) => onFilterChange({ ...filters, access: e.target.value })}
                      className="w-4 h-4 text-primary focus:ring-primary/20 border-muted-foreground"
                    />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      {accessLabels[access as keyof typeof accessLabels]}
                    </span>
                  </label>
                ))}
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="access"
                    value=""
                    checked={filters.access === ''}
                    onChange={() => onFilterChange({ ...filters, access: '' })}
                    className="w-4 h-4 text-primary focus:ring-primary/20 border-muted-foreground"
                  />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    전체
                  </span>
                </label>
              </div>
            </div>

            {/* Source Filter */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                출처
              </label>
              <div className="space-y-2">
                {sources.map((source) => (
                  <label key={source} className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="source"
                      value={source}
                      checked={filters.source === source}
                      onChange={(e) => onFilterChange({ ...filters, source: e.target.value })}
                      className="w-4 h-4 text-primary focus:ring-primary/20 border-muted-foreground"
                    />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      {source}
                    </span>
                  </label>
                ))}
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="source"
                    value=""
                    checked={filters.source === ''}
                    onChange={() => onFilterChange({ ...filters, source: '' })}
                    className="w-4 h-4 text-primary focus:ring-primary/20 border-muted-foreground"
                  />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    전체
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}