import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import { Heart, Lock, ArrowLeft, Send, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: Date;
  status: 'approved' | 'pending' | 'rejected';
}

interface IdeaDetailPageProps {
  ideaId: string;
  isLoggedIn: boolean;
  isPremium: boolean;
  onNavigate: (page: string) => void;
  onVote: (ideaId: string) => void;
}

// Mock data - In real app, this would come from Firestore
const mockIdeaDetails = {
  '1': {
    id: '1',
    source: 'Kickstarter',
    oneLineSummary: 'AI 기반 언어 학습 튜터 앱',
    localizePoint: '한국어 학습자를 위한 발음 교정 기능을 추가하고, 한국의 교육 시스템과 연계된 커리큘럼을 제공합니다.',
    difficulty: 'Medium' as const,
    category: 'tech',
    access: 'public' as const,
    voteCount: 42,
    userHasVoted: false,
    moatHypothesis: '독점적인 한국어 발음 AI 모델을 개발하고, 주요 대학교와의 파트너십을 통해 진입장벽을 구축할 수 있습니다.',
    premiumContent: {
      summary: '이 아이디어는 기존 언어 학습 앱의 한계를 극복하기 위해 AI 기반 개인화 학습을 제공합니다. 특히 한국 시장에서는 발음 교정과 문화적 맥락을 고려한 학습 방식이 핵심입니다.',
      checklist: [
        'AI 음성 인식 기술 확보',
        '언어학 전문가 팀 구성',
        '한국 교육부 승인 커리큘럼 개발',
        '대학교 파트너십 구축',
        '초기 베타 테스터 모집 (500명)',
        'MVP 개발 및 테스트',
        '투자 유치 ($500K 시드)',
        '마케팅 전략 수립'
      ]
    }
  }
  // Add more mock data as needed
};

const mockComments: Comment[] = [
  {
    id: '1',
    userId: 'user1',
    userName: '김영수',
    text: '이 아이디어 정말 흥미롭네요! 특히 발음 교정 기능이 차별화 포인트가 될 수 있을 것 같습니다.',
    timestamp: new Date('2024-01-15'),
    status: 'approved'
  },
  {
    id: '2',
    userId: 'user2',
    userName: '이민정',
    text: '기술적으로 구현이 쉽지 않을 것 같은데, AI 모델 학습에 필요한 데이터는 어떻게 확보할 계획인가요?',
    timestamp: new Date('2024-01-16'),
    status: 'approved'
  }
];

export default function IdeaDetailPage({ 
  ideaId, 
  isLoggedIn, 
  isPremium, 
  onNavigate, 
  onVote 
}: IdeaDetailPageProps) {
  const [idea, setIdea] = useState(mockIdeaDetails[ideaId as keyof typeof mockIdeaDetails]);
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentSubmitted, setCommentSubmitted] = useState(false);

  useEffect(() => {
    // In real app, fetch idea details from Firestore
    // const fetchIdeaDetails = async () => {
    //   const ideaDoc = await db.collection('ideas_io').doc(ideaId).get();
    //   setIdea(ideaDoc.data());
    // };
    // fetchIdeaDetails();
  }, [ideaId]);

  const handleVote = async () => {
    if (!isLoggedIn || !idea || idea.userHasVoted) return;
    
    // Mock vote functionality
    setIdea(prev => prev ? {
      ...prev,
      voteCount: prev.voteCount + 1,
      userHasVoted: true
    } : prev);
    
    onVote(ideaId);
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !isLoggedIn) return;
    
    setIsSubmittingComment(true);
    
    // Mock comment submission - In real app, this would save to Firestore
    setTimeout(() => {
      setIsSubmittingComment(false);
      setCommentSubmitted(true);
      setNewComment('');
      
      setTimeout(() => {
        setCommentSubmitted(false);
      }, 3000);
    }, 1000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!idea) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-muted-foreground">아이디어를 찾을 수 없습니다.</p>
          <Button onClick={() => onNavigate('home')} className="mt-4">
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  const hasAccess = idea.access === 'public' || (idea.access === 'paid' && isPremium);

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => onNavigate('home')}
        className="mb-6 flex items-center space-x-2"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>아이디어 목록으로</span>
      </Button>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{idea.source}</Badge>
                  {idea.access === 'paid' && !isPremium && (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <Badge className={getDifficultyColor(idea.difficulty)}>
                  {idea.difficulty}
                </Badge>
              </div>
              <CardTitle className="text-xl md:text-2xl">
                {hasAccess ? idea.oneLineSummary : '프리미엄 콘텐츠입니다'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {hasAccess ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="mb-2">한국 시장 적용 포인트</h4>
                    <p className="text-muted-foreground">{idea.localizePoint}</p>
                  </div>
                  
                  <div>
                    <h4 className="mb-2">경쟁 우위 확보 방안</h4>
                    <p className="text-muted-foreground">{idea.moatHypothesis}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    프리미엄 구독으로 전체 내용을 확인하세요
                  </p>
                  <Button>프리미엄 구독 $9/월</Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Premium Content */}
          {hasAccess && idea.premiumContent && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>프리미엄 분석</span>
                  <Badge className="bg-secondary">Premium</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="mb-2">상세 분석</h4>
                  <p className="text-muted-foreground">{idea.premiumContent.summary}</p>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="mb-4">실행 체크리스트</h4>
                  <div className="space-y-2">
                    {idea.premiumContent.checklist.map((item, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-secondary mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Comments Section */}
          <Card>
            <CardHeader>
              <CardTitle>댓글 ({comments.filter(c => c.status === 'approved').length})</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Comment Input */}
              {isLoggedIn ? (
                <div className="mb-6 space-y-4">
                  <Textarea
                    placeholder="이 아이디어에 대한 의견을 공유해주세요..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      댓글은 관리자 승인 후 표시됩니다
                    </p>
                    <Button
                      onClick={handleSubmitComment}
                      disabled={!newComment.trim() || isSubmittingComment}
                      className="flex items-center space-x-2"
                    >
                      {isSubmittingComment ? (
                        <span>전송 중...</span>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          <span>댓글 작성</span>
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {commentSubmitted && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded text-green-800 text-sm">
                      댓글이 제출되었습니다. 관리자 승인 후 표시됩니다.
                    </div>
                  )}
                </div>
              ) : (
                <div className="mb-6 p-4 bg-muted rounded text-center">
                  <p className="text-muted-foreground mb-2">댓글을 작성하려면 로그인이 필요합니다</p>
                  <Button size="sm">로그인</Button>
                </div>
              )}

              <Separator className="mb-6" />

              {/* Comments List */}
              <div className="space-y-4">
                {comments.filter(comment => comment.status === 'approved').map((comment) => (
                  <div key={comment.id} className="border-l-2 border-primary/20 pl-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm">{comment.userName}</span>
                      <span className="text-xs text-muted-foreground">
                        {comment.timestamp.toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{comment.text}</p>
                  </div>
                ))}
              </div>

              {comments.filter(c => c.status === 'approved').length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  아직 승인된 댓글이 없습니다.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Vote Card */}
          <Card>
            <CardContent className="p-6 text-center">
              <Button
                onClick={handleVote}
                disabled={!isLoggedIn || idea.userHasVoted}
                variant={idea.userHasVoted ? "default" : "outline"}
                size="lg"
                className="w-full flex items-center justify-center space-x-2"
              >
                <Heart 
                  className={`h-5 w-5 ${
                    idea.userHasVoted ? 'fill-red-500 text-red-500' : ''
                  }`} 
                />
                <span>{idea.voteCount}</span>
              </Button>
              
              <p className="text-sm text-muted-foreground mt-2">
                {!isLoggedIn 
                  ? '로그인하여 투표하세요' 
                  : idea.userHasVoted 
                    ? '투표해주셔서 감사합니다!' 
                    : '이 아이디어에 투표하세요'
                }
              </p>
            </CardContent>
          </Card>

          {/* Category Info */}
          <Card>
            <CardContent className="p-6">
              <h4 className="mb-4">아이디어 정보</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">카테고리</span>
                  <Badge variant="secondary">{idea.category}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">난이도</span>
                  <Badge className={getDifficultyColor(idea.difficulty)}>
                    {idea.difficulty}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">출처</span>
                  <Badge variant="outline">{idea.source}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}