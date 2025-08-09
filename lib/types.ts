// lib/types.ts
export type Idea = {
  id: string;
  title: string;
  sourceUrl: string;
  sourceName?: string;
  publishedAt?: string; // ISO
  summary3?: string;    // 3문장 요약 (ko)
  longSummary?: string;
  tags?: string[];
  sector?: string;
  koreaFit?: number;    // 0~10
  whyNow?: string;
  risks?: string[];     // 최대 3개
  effort?: number;      // 1~5
  createdAt?: string;
  updatedAt?: string;
  visible?: boolean;
  votesUp?: number;
  votesDown?: number;
};
