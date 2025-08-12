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
  // Legacy fields for backward compatibility
  metrics?: {
    marketOpportunity: number;
    executionDifficulty: number;
    revenuePotential: number;
    timingScore: number;
    regulatoryRisk: number;
  };
  partnershipStrategy?: string[];
  koreaFitFactors?: KoreaFitFactors;
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

// ===== REGULATORY COMPLIANCE TYPES =====

export interface RegulatoryAnalysis {
  id: string;
  businessIdea: string;
  category: BusinessCategory;
  riskScore: number; // 0-100
  regulations: string[];
  costs: ComplianceCosts;
  competitors: string[];
  successStories?: string[];
  timeline: string;
  verdict: ComplianceVerdict;
  failureExamples?: string[];
  keyInsights: string[];
  recommendations: string[];
  analyzedAt: string;
  analysisVersion: string;
}

export type BusinessCategory = 
  | 'fintech'
  | 'ecommerce'
  | 'healthcare'
  | 'food'
  | 'transportation'
  | 'accommodation'
  | 'general';

export interface ComplianceCosts {
  licenses: string; // ₩X,XXX,XXX - ₩X,XXX,XXX
  legal: string;    // ₩X,XXX,XXX - ₩X,XXX,XXX
  compliance: string; // ₩X,XXX,XXX/월
}

export type ComplianceVerdict = 
  | 'LOW RISK - GOOD TO PROCEED'
  | 'PROCEED WITH CAUTION'
  | 'MODERATE RISK - SIGNIFICANT PREPARATION NEEDED'
  | 'HIGH RISK - CONSIDER MAJOR PIVOT';

// ===== BASIC LEGACY TYPES =====

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
