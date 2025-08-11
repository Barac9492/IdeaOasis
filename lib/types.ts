// lib/types.ts
export interface Idea {
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
  metrics?: {
    marketOpportunity: number;
    executionDifficulty: number;
    revenuePotential: number;
    timingScore: number;
    regulatoryRisk: number;
  };
  partnershipStrategy?: string[];
  trendData?: {
    keyword: string;
    growth: string;
    monthlySearches: string;
    trendScore?: number;
    lastUpdated?: string;
  };
  executionRoadmap?: ExecutionStep[];
  businessModel?: string;
  targetUser?: string;
}

export interface ExecutionStep {
  id: string;
  title: string;
  description: string;
  category: 'validation' | 'legal' | 'partnership' | 'funding' | 'technical' | 'marketing';
  timeframe: string; // "1-2주", "1개월" 등
  priority: 'high' | 'medium' | 'low';
  resources?: string[];
  estimatedCost?: string;
}

export interface TrendAnalysis {
  keyword: string;
  searchVolume: number;
  growthRate: number; // percentage
  seasonality?: string;
  competitionLevel: 'low' | 'medium' | 'high';
  relatedKeywords: string[];
  lastAnalyzed: string;
}

export interface Vote {
  ideaId: string;
  voterUid: string;
  voterEmail?: string;
  vote: 'up' | 'down';
  votedAt: string;
}

export interface Bookmark {
  ideaId: string;
  userUid: string;
  createdAt: string;
}

export interface KoreaFitFactors {
  regulatoryFriendliness: number;  // 0-10
  culturalAlignment: number;       // 0-10  
  marketReadiness: number;         // 0-10
  competitiveLandscape: number;    // 0-10
  businessInfrastructure: number;  // 0-10
}
