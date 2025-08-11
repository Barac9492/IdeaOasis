'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter } from 'lucide-react';

interface IdeasFiltersProps {
  categories: string[];
}

export default function IdeasFilters({ categories }: IdeasFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentSearch = searchParams.get('search') || '';
  const currentCategory = searchParams.get('category') || 'all';
  const currentSort = searchParams.get('sort') || 'best';

  const updateFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    
    router.push(`/ideas?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get('search') as string;
    updateFilters({ search });
  };

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-slate-50 rounded-2xl">
      {/* Search */}
      <div className="flex-1 min-w-64">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            name="search"
            type="text"
            placeholder="아이디어 검색..."
            defaultValue={currentSearch}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form>
      </div>
      
      {/* Category Filter */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-slate-500" />
        <select 
          value={currentCategory}
          onChange={(e) => updateFilters({ category: e.target.value })}
          className="border border-slate-200 rounded-xl px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">모든 분야</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      
      {/* Sort */}
      <select 
        value={currentSort}
        onChange={(e) => updateFilters({ sort: e.target.value })}
        className="border border-slate-200 rounded-xl px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="best">종합 순위</option>
        <option value="koreafit">한국 적합도</option>
        <option value="trend">트렌드 점수</option>
        <option value="recent">최신 순</option>
      </select>
    </div>
  );
}