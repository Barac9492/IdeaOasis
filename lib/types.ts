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
  
  // ===== WORK-WHILE-YOU-BUILD EXECUTION FIELDS =====
  // Time & Money constraints for 40-50 직장인
  timeBudgetHoursPerWeek?: number;     // 5 | 8 | 12
  starterCapitalKRW?: number;          // e.g., 5000000 (5M won)
  paybackMonths?: number;              // e.g., 6-12 months
  automationPct?: number;              // 0-100 percentage
  toolStack?: string[];                // ["Make", "Gemini", "Firebase"]
  
  // Weekly execution breakdown
  weekdayMicrotasks?: string[];        // 5 bullets (≤20min each)
  weekendSprint?: string[];            // 3-5 bullets (3h total)
  
  // Customer acquisition playbook
  firstTenCustomersPlaybook?: FirstTenCustomersStep[];
  
  // 7-day validation gates
  validationSteps7Day?: ValidationStep[];
  
  // Risk management
  riskKillers?: RiskKiller[];          // top 2 risks to eliminate early
  
  // Quick start capability
  mondayStartable?: boolean;           // can start tonight flag
  
  // Light compliance (not regulatory intelligence)
  cautionNote?: string;                // one-liner warning if needed
  
  // Confidence building
  difficultyLevel?: 'beginner' | 'intermediate' | 'advanced';  // 초급/중급/고급
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

// ===== WORK-WHILE-YOU-BUILD TYPES =====

export interface FirstTenCustomersStep {
  channel: string;  // "LinkedIn DM", "Cold Email", "Facebook Groups"
  steps: string[];  // specific actions/scripts
  kpiGate?: string; // success metric
}

export interface ValidationStep {
  day: number;      // 1-7
  task: string;     // what to test
  passFailCriteria: string; // specific metric
  timeRequired: string; // "30분", "2시간"
}

export interface RiskKiller {
  risk: string;     // the risk
  cheapTest: string; // how to validate/eliminate quickly
  killThreshold: string; // when to abandon
}
