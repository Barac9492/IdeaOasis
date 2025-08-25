// features/ideas/ui/IdeaFilters.tsx
'use client';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface IdeaFiltersProps {
  initialFilters: { category: string; difficulty: string; access: string; source: string; sortBy: string };
  onFilterChange: (filters: IdeaFiltersProps['initialFilters']) => void;
  totalIdeas: number;
}

export default function IdeaFilters({ initialFilters, onFilterChange, totalIdeas }: IdeaFiltersProps) {
  const [filters, setFilters] = useState(initialFilters);

  const handleChange = (key: keyof typeof filters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
      <Select value={filters.category} onValueChange={(v) => handleChange('category', v)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="시간 예산" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">모든 시간</SelectItem>
          <SelectItem value="time-5">≤5시간/주</SelectItem>
          <SelectItem value="time-8">≤8시간/주</SelectItem>
          <SelectItem value="time-12">≤12시간/주</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filters.difficulty} onValueChange={(v) => handleChange('difficulty', v)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="시작 자본" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">모든 자본</SelectItem>
          <SelectItem value="capital-5">≤₩5M</SelectItem>
          <SelectItem value="capital-15">≤₩15M</SelectItem>
          <SelectItem value="capital-50">≤₩50M</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filters.access} onValueChange={(v) => handleChange('access', v)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="자동화 수준" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">모든 수준</SelectItem>
          <SelectItem value="automation-50">≥50% 자동화</SelectItem>
          <SelectItem value="automation-70">≥70% 자동화</SelectItem>
          <SelectItem value="automation-90">≥90% 자동화</SelectItem>
        </SelectContent>
      </Select>
      <Input
        placeholder="출처 검색"
        value={filters.source}
        onChange={(e) => handleChange('source', e.target.value)}
        className="w-[180px]"
      />
      <Select value={filters.sortBy} onValueChange={(v) => handleChange('sortBy', v)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="정렬" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="latest">최신순</SelectItem>
          <SelectItem value="automation">자동화순</SelectItem>
          <SelectItem value="payback">회수기간순</SelectItem>
          <SelectItem value="monday-startable">오늘시작가능</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-sm text-muted-foreground">총 {totalIdeas}개 아이디어</p>
    </div>
  );
}
