import { Heart, Lock, ChevronRight, Calendar, TrendingUp, Target, BarChart3, AlertTriangle, Users } from 'lucide-react';

interface Idea {
  id: string;
  source: string;
  oneLineSummary: string;
  localizePoint: string;
  difficulty: 'Low' | 'Medium' | 'High';
  category: string;
  access: 'public' | 'paid';
  moatHypothesis: string;
  votes: number;
  hasVoted: boolean;
  createdAt: string;
  // New fields
  metrics: {
    marketOpportunity: number;
    executionDifficulty: number;
    revenueHidden: number;
    timingScore: number;
    regulatoryRisk: number;
  };
  whyNow: string[];
  partnershipStrategy: string[];
  trendData: {
    keyword: string;
    growth: string;
    monthlySearches: string;
  };
}

interface IdeaCardProps {
  idea: Idea;
  isLoggedIn: boolean;
  isPremium: boolean;
  onNavigate: (page: string, ideaId: string) => void;
  onVote: (ideaId: string) => void;
  priority?: boolean;
  featured?: boolean;
}

export default function IdeaCard({ 
  idea, 
  isLoggedIn, 
  isPremium, 
  onNavigate, 
  onVote, 
  priority = false,
  featured = false
}: IdeaCardProps) {
  const canAccessIdea = idea.access === 'public' || (isLoggedIn && isPremium);
  
  const difficultyColors = {
    Low: 'bg-secondary/10 text-secondary border-secondary/20',
    Medium: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
    High: 'bg-destructive/10 text-destructive border-destructive/20'
  };

  const difficultyLabels = {
    Low: '쉬움',
    Medium: '보통', 
    High: '어려움'
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-secondary';
    if (score >= 6) return 'text-chart-3';
    return 'text-muted-foreground';
  };

  const getScoreBg = (score: number) => {
    if (score >= 8) return 'bg-secondary/10';
    if (score >= 6) return 'bg-chart-3/10';
    return 'bg-muted/50';
  };

  return (
    <article className={`group relative glass-light rounded-2xl shadow-apple hover:shadow-apple-lg transition-all duration-300 hover:-translate-y-1 ${
      featured ? 'p-10 lg:p-12' : 'p-8 lg:p-10'
    }`}>
      {/* Premium Badge */}
      {idea.access === 'paid' && (
        <div className="absolute top-6 right-6 z-10">
          <div className="flex items-center space-x-1.5 bg-gradient-to-r from-chart-4 to-chart-5 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg">
            <Lock size={12} />
            <span>프리미엄</span>
          </div>
        </div>
      )}

      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-6 left-6 z-10">
          <div className="flex items-center space-x-1.5 bg-gradient-to-r from-primary to-secondary text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg">
            <TrendingUp size={12} />
            <span>오늘의 픽</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="px-3 py-1.5 bg-muted rounded-full text-sm font-medium text-muted-foreground">
              {idea.source}
            </div>
            <div className={`px-3 py-1.5 rounded-full text-sm font-medium border ${difficultyColors[idea.difficulty]}`}>
              {difficultyLabels[idea.difficulty]}
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground flex items-center space-x-1">
            <Calendar size={14} />
            <span>{formatDate(idea.createdAt)}</span>
          </div>
        </div>

        <div className="flex items-center space-x-3 mb-4">
          <h2 className="text-2xl lg:text-3xl font-semibold text-foreground leading-tight group-hover:text-primary transition-colors">
            {idea.oneLineSummary}
          </h2>
        </div>

        <div className="inline-flex items-center px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
          <span className="mr-2">#</span>
          {idea.category}
        </div>
      </header>

      {/* Evaluation Metrics */}
      <div className="mb-6">
        <h4 className="font-semibold text-foreground mb-4 flex items-center space-x-2">
          <BarChart3 size={18} className="text-primary" />
          <span>시장 분석 점수</span>
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className={`${getScoreBg(idea.metrics.marketOpportunity)} rounded-lg p-3 text-center`}>
            <div className={`text-lg font-bold ${getScoreColor(idea.metrics.marketOpportunity)}`}>
              {idea.metrics.marketOpportunity}
            </div>
            <div className="text-xs text-muted-foreground">시장기회</div>
          </div>
          <div className={`${getScoreBg(10 - idea.metrics.executionDifficulty)} rounded-lg p-3 text-center`}>
            <div className={`text-lg font-bold ${getScoreColor(10 - idea.metrics.executionDifficulty)}`}>
              {(10 - idea.metrics.executionDifficulty).toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground">실행용이성</div>
          </div>
          <div className={`${getScoreBg(idea.metrics.revenueHidden)} rounded-lg p-3 text-center`}>
            <div className={`text-lg font-bold ${getScoreColor(idea.metrics.revenueHidden)}`}>
              {idea.metrics.revenueHidden}
            </div>
            <div className="text-xs text-muted-foreground">수익잠재력</div>
          </div>
          <div className={`${getScoreBg(idea.metrics.timingScore)} rounded-lg p-3 text-center`}>
            <div className={`text-lg font-bold ${getScoreColor(idea.metrics.timingScore)}`}>
              {idea.metrics.timingScore}
            </div>
            <div className="text-xs text-muted-foreground">타이밍</div>
          </div>
          <div className={`${getScoreBg(10 - idea.metrics.regulatoryRisk)} rounded-lg p-3 text-center`}>
            <div className={`text-lg font-bold ${getScoreColor(10 - idea.metrics.regulatoryRisk)}`}>
              {(10 - idea.metrics.regulatoryRisk).toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground">규제안정성</div>
          </div>
        </div>
      </div>

      {/* Search Trend Data */}
      <div className="mb-6 bg-gradient-to-r from-secondary/5 to-primary/5 rounded-xl p-4">
        <h4 className="font-semibold text-foreground mb-3 flex items-center space-x-2">
          <TrendingUp size={16} className="text-secondary" />
          <span>검색 트렌드</span>
        </h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-sm text-muted-foreground">키워드</div>
            <div className="font-medium">{idea.trendData.keyword}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">성장률</div>
            <div className="font-bold text-secondary">{idea.trendData.growth}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">월 검색수</div>
            <div className="font-medium">{idea.trendData.monthlySearches}</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6 mb-8">
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Target className="text-primary mt-1 flex-shrink-0" size={18} />
            <div>
              <h4 className="font-semibold text-foreground mb-2">한국 시장 기회</h4>
              <p className="text-muted-foreground leading-relaxed">
                {idea.localizePoint}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <AlertTriangle className="text-chart-3 mt-1 flex-shrink-0" size={18} />
            <div>
              <h4 className="font-semibold text-foreground mb-2">경쟁 우위 전략</h4>
              <p className="text-muted-foreground leading-relaxed">
                {idea.moatHypothesis}
              </p>
            </div>
          </div>

          {/* Why Now - Premium Content Preview */}
          {(canAccessIdea || !idea.access) && (
            <div className="flex items-start space-x-3">
              <TrendingUp className="text-secondary mt-1 flex-shrink-0" size={18} />
              <div>
                <h4 className="font-semibold text-foreground mb-2">왜 지금인가?</h4>
                <ul className="space-y-1">
                  {idea.whyNow.slice(0, canAccessIdea ? 3 : 1).map((reason, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start space-x-2">
                      <span className="text-secondary mt-1">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                  {!canAccessIdea && idea.whyNow.length > 1 && (
                    <li className="text-sm text-muted-foreground italic">
                      +{idea.whyNow.length - 1}개 더... (프리미엄 필요)
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <footer className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Vote Button */}
          <button
            onClick={() => onVote(idea.id)}
            disabled={!isLoggedIn}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
              idea.hasVoted
                ? 'bg-destructive/10 text-destructive border border-destructive/20'
                : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
            } ${!isLoggedIn ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
          >
            <Heart 
              size={16} 
              className={idea.hasVoted ? 'fill-current' : ''} 
            />
            <span className="font-medium">{idea.votes}</span>
          </button>

          {!isLoggedIn && (
            <span className="text-sm text-muted-foreground">
              로그인하여 투표하기
            </span>
          )}
        </div>

        <button
          onClick={() => onNavigate('idea-detail', idea.id)}
          className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-200 ${
            canAccessIdea
              ? 'bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-apple'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
          disabled={!canAccessIdea}
        >
          <span>
            {canAccessIdea ? '자세히 보기' : '프리미엄 필요'}
          </span>
          <ChevronRight size={16} />
        </button>
      </footer>

      {/* Premium overlay for restricted content */}
      {!canAccessIdea && (
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent rounded-2xl pointer-events-none" />
      )}
    </article>
  );
}