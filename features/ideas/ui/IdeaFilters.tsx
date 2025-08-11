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
          <SelectValue placeholder="카테고리" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">모두</SelectItem>
          <SelectItem value="헬스테크">헬스테크</SelectItem>
          <SelectItem value="그린테크">그린테크</SelectItem>
          <SelectItem value="푸드테크">푸드테크</SelectItem>
          <SelectItem value="펫테크">펫테크</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filters.difficulty} onValueChange={(v) => handleChange('difficulty', v)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="난이도" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">모두</SelectItem>
          <SelectItem value="Low">쉬움</SelectItem>
          <SelectItem value="Medium">중간</SelectItem>
          <SelectItem value="High">어려움</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filters.access} onValueChange={(v) => handleChange('access', v)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="접근성" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">모두</SelectItem>
          <SelectItem value="public">공개</SelectItem>
          <SelectItem value="paid">프리미엄</SelectItem>
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
          <SelectItem value="popular">인기순</SelectItem>
          <SelectItem value="opportunity">기회순</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-sm text-muted-foreground">총 {totalIdeas}개 아이디어</p>
    </div>
  );
}
