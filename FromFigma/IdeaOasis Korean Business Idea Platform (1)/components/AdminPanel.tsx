import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { useState } from "react";
import { Plus, Check, X, MessageSquare, BarChart3 } from "lucide-react";

interface AdminPanelProps {
  onNavigate: (page: string) => void;
}

interface PendingComment {
  id: string;
  ideaId: string;
  ideaTitle: string;
  userName: string;
  userEmail: string;
  text: string;
  timestamp: Date;
}

const mockPendingComments: PendingComment[] = [
  {
    id: '1',
    ideaId: '1',
    ideaTitle: 'AI 기반 언어 학습 튜터 앱',
    userName: '박지은',
    userEmail: 'jieun@example.com',
    text: '이 아이디어 정말 좋네요! 하지만 경쟁사 대비 차별화 요소가 더 필요할 것 같습니다.',
    timestamp: new Date('2024-01-17')
  },
  {
    id: '2',
    ideaId: '2',
    ideaTitle: '친환경 배송 포장재 구독 서비스',
    userName: '김태훈',
    userEmail: 'taehoon@example.com',
    text: '환경친화적인 접근이 좋지만, 비용 구조가 어떻게 될지 궁금합니다.',
    timestamp: new Date('2024-01-18')
  }
];

export default function AdminPanel({ onNavigate }: AdminPanelProps) {
  const [pendingComments, setPendingComments] = useState<PendingComment[]>(mockPendingComments);
  const [newIdea, setNewIdea] = useState({
    source: '',
    oneLineSummary: '',
    localizePoint: '',
    difficulty: '',
    category: '',
    access: 'public',
    moatHypothesis: '',
    premiumSummary: '',
    premiumChecklist: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setNewIdea(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitIdea = async () => {
    setIsSubmitting(true);
    
    // Mock idea submission - In real app, this would save to Firestore
    setTimeout(() => {
      setSubmitSuccess(true);
      setNewIdea({
        source: '',
        oneLineSummary: '',
        localizePoint: '',
        difficulty: '',
        category: '',
        access: 'public',
        moatHypothesis: '',
        premiumSummary: '',
        premiumChecklist: ''
      });
      setIsSubmitting(false);
      
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    }, 1500);
  };

  const handleCommentAction = (commentId: string, action: 'approve' | 'reject') => {
    setPendingComments(prev => prev.filter(comment => comment.id !== commentId));
    
    // In real app, this would update the comment status in Firestore
    console.log(`Comment ${commentId} ${action}d`);
  };

  const categories = [
    { value: 'tech', label: '기술' },
    { value: 'retail', label: '소매업' },
    { value: 'service', label: '서비스' },
    { value: 'education', label: '교육' },
    { value: 'healthcare', label: '헬스케어' },
    { value: 'finance', label: '금융' }
  ];

  const difficulties = [
    { value: 'Low', label: '낮음' },
    { value: 'Medium', label: '보통' },
    { value: 'High', label: '높음' }
  ];

  const sources = [
    'Kickstarter', 'ProductHunt', 'Y Combinator', 'AngelList', 
    'TechCrunch', 'Crunchbase', 'Hacker News', 'Reddit'
  ];

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl">관리자 패널</h1>
        <Button variant="outline" onClick={() => onNavigate('home')}>
          홈으로 돌아가기
        </Button>
      </div>

      <Tabs defaultValue="add-idea" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="add-idea" className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>아이디어 추가</span>
          </TabsTrigger>
          <TabsTrigger value="moderate-comments" className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>댓글 승인 ({pendingComments.length})</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>통계</span>
          </TabsTrigger>
        </TabsList>

        {/* Add Idea Tab */}
        <TabsContent value="add-idea">
          <Card>
            <CardHeader>
              <CardTitle>새 아이디어 추가</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {submitSuccess && (
                <div className="p-4 bg-green-50 border border-green-200 rounded text-green-800">
                  아이디어가 성공적으로 추가되었습니다!
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="source">출처</Label>
                  <Select value={newIdea.source} onValueChange={(value: string) => handleInputChange('source', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="출처 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {sources.map((source) => (
                        <SelectItem key={source} value={source}>
                          {source}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="difficulty">난이도</Label>
                  <Select value={newIdea.difficulty} onValueChange={(value: string) => handleInputChange('difficulty', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="난이도 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulties.map((difficulty) => (
                        <SelectItem key={difficulty.value} value={difficulty.value}>
                          {difficulty.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">카테고리</Label>
                  <Select value={newIdea.category} onValueChange={(value: string) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="access">접근 권한</Label>
                  <Select value={newIdea.access} onValueChange={(value: string) => handleInputChange('access', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="접근 권한 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">공개</SelectItem>
                      <SelectItem value="paid">프리미엄</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="summary">한 줄 요약</Label>
                <Input
                  id="summary"
                  value={newIdea.oneLineSummary}
                  onChange={(e) => handleInputChange('oneLineSummary', e.target.value)}
                  placeholder="아이디어를 한 줄로 요약해주세요"
                />
              </div>

              <div>
                <Label htmlFor="localize">한국 시장 적용 포인트</Label>
                <Textarea
                  id="localize"
                  value={newIdea.localizePoint}
                  onChange={(e) => handleInputChange('localizePoint', e.target.value)}
                  placeholder="한국 시장에 어떻게 적용할 수 있는지 설명해주세요"
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="moat">경쟁 우위 확보 방안</Label>
                <Textarea
                  id="moat"
                  value={newIdea.moatHypothesis}
                  onChange={(e) => handleInputChange('moatHypothesis', e.target.value)}
                  placeholder="어떻게 경쟁 우위를 확보할 수 있는지 설명해주세요"
                  className="min-h-[100px]"
                />
              </div>

              {newIdea.access === 'paid' && (
                <>
                  <Separator />
                  <h4 className="text-lg font-semibold">프리미엄 콘텐츠</h4>
                  
                  <div>
                    <Label htmlFor="premium-summary">상세 분석</Label>
                    <Textarea
                      id="premium-summary"
                      value={newIdea.premiumSummary}
                      onChange={(e) => handleInputChange('premiumSummary', e.target.value)}
                      placeholder="프리미엄 사용자를 위한 상세 분석을 작성해주세요"
                      className="min-h-[120px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="premium-checklist">실행 체크리스트</Label>
                    <Textarea
                      id="premium-checklist"
                      value={newIdea.premiumChecklist}
                      onChange={(e) => handleInputChange('premiumChecklist', e.target.value)}
                      placeholder="각 항목을 새 줄로 구분하여 작성해주세요"
                      className="min-h-[120px]"
                    />
                  </div>
                </>
              )}

              <Button
                onClick={handleSubmitIdea}
                disabled={
                  isSubmitting || 
                  !newIdea.source || 
                  !newIdea.oneLineSummary || 
                  !newIdea.difficulty || 
                  !newIdea.category
                }
                className="w-full"
              >
                {isSubmitting ? '추가 중...' : '아이디어 추가'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Moderate Comments Tab */}
        <TabsContent value="moderate-comments">
          <Card>
            <CardHeader>
              <CardTitle>댓글 승인 대기 중 ({pendingComments.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingComments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  승인 대기 중인 댓글이 없습니다.
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingComments.map((comment) => (
                    <div key={comment.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{comment.ideaTitle}</h4>
                          <p className="text-sm text-muted-foreground">
                            {comment.userName} ({comment.userEmail}) • 
                            {comment.timestamp.toLocaleDateString('ko-KR')}
                          </p>
                        </div>
                        <Badge variant="outline">대기 중</Badge>
                      </div>
                      
                      <p className="text-muted-foreground mb-4 p-3 bg-muted rounded">
                        {comment.text}
                      </p>
                      
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleCommentAction(comment.id, 'approve')}
                          className="flex items-center space-x-1"
                        >
                          <Check className="h-4 w-4" />
                          <span>승인</span>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleCommentAction(comment.id, 'reject')}
                          className="flex items-center space-x-1"
                        >
                          <X className="h-4 w-4" />
                          <span>거부</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold">42</div>
                <p className="text-sm text-muted-foreground">총 아이디어 수</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-sm text-muted-foreground">총 투표 수</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold">89</div>
                <p className="text-sm text-muted-foreground">등록된 사용자</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold">12</div>
                <p className="text-sm text-muted-foreground">프리미엄 구독자</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>상세 통계</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted rounded">
                  <span>가장 인기 있는 카테고리</span>
                  <Badge>기술 (18개)</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded">
                  <span>평균 아이디어당 투표 수</span>
                  <Badge>29.7개</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded">
                  <span>이번 주 신규 사용자</span>
                  <Badge>7명</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded">
                  <span>승인 대기 중인 댓글</span>
                  <Badge>{pendingComments.length}개</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}