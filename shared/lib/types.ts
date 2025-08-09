export interface Idea {
  id: string;
  title: string;
  summary: string;
  category?: string;
  targetUser?: string;
  businessModel?: string;
  koreaFitScore?: number;
  sourceURL?: string;
  sourcePlatform?: string;
  uploadedAt?: string;
  adminReview?: string;
  status?: 'Pending' | 'Approved' | 'Rejected';
  offer?: string;
  badges?: string[];
  tags?: string[];
  useCases?: string[];
  techStack?: string[];
  scorecards?: {
    opportunity: number;
    problem: number;
    feasibility: number;
    whyNow: number;
  };
  evidence?: {
    keyword?: string;
    volume?: number;
    growthPct?: number;
    chartImg?: string;
  };
  pricing?: {
    model: string;
    tiers: string[];
  };
  koreanizationNotes?: string[];
  signals?: {
    bookmarks: number;
    last7dDelta: number;
  };
}

export interface Vote {
  ideaId: string;
  voterUid: string;
  voterEmail: string;
  vote: 'up' | 'down';
  votedAt: string;
}

export interface Bookmark {
  ideaId: string;
  userUid: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  ideaId: string;
  text: string;
  authorEmail: string;
  type?: string;
  createdAt: any;
}
