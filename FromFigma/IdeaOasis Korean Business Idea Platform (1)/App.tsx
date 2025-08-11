import { useState } from 'react';
import Header from './components/Header';
import HomePage from './components/HomePage';
import IdeaDetailPage from './components/IdeaDetailPage';
import AdminPanel from './components/AdminPanel';
import AuthModal from './components/AuthModal';

interface User {
  id: string;
  email: string;
  isPremium: boolean;
  isAdmin: boolean;
}

type Page = 'home' | 'idea-detail' | 'admin' | 'about';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedIdeaId, setSelectedIdeaId] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleNavigate = (page: string, ideaId?: string) => {
    if (page === 'admin' && (!user || !user.isAdmin)) {
      setIsAuthModalOpen(true);
      return;
    }
    
    setCurrentPage(page as Page);
    if (ideaId) {
      setSelectedIdeaId(ideaId);
    }
  };

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    setIsAuthModalOpen(false);
    
    // Redirect to admin if they were trying to access it
    if (userData.isAdmin && currentPage !== 'admin') {
      setCurrentPage('admin');
    }
  };

  const handleVote = (ideaId: string) => {
    // TODO: Implement Firebase Firestore vote functionality
    // await db.collection('ideas_io').doc(ideaId).collection('votes').add({
    //   userId: user.id,
    //   timestamp: new Date()
    // });
    console.log(`User ${user?.id} voted for idea ${ideaId}`);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            isLoggedIn={!!user}
            isPremium={user?.isPremium || false}
            onNavigate={handleNavigate}
            onVote={handleVote}
          />
        );
      
      case 'idea-detail':
        return (
          <IdeaDetailPage
            ideaId={selectedIdeaId}
            isLoggedIn={!!user}
            isPremium={user?.isPremium || false}
            onNavigate={handleNavigate}
            onVote={handleVote}
          />
        );
      
      case 'admin':
        return user?.isAdmin ? (
          <AdminPanel onNavigate={handleNavigate} />
        ) : (
          <div className="container mx-auto px-4 py-8 text-center">
            <h2 className="text-2xl mb-4">접근 권한이 없습니다</h2>
            <p className="text-muted-foreground mb-4">
              관리자 권한이 필요합니다.
            </p>
            <button
              onClick={() => handleNavigate('home')}
              className="text-primary hover:underline"
            >
              홈으로 돌아가기
            </button>
          </div>
        );
      
      case 'about':
        return (
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl mb-6">IdeaOasis 소개</h1>
            
            <div className="prose prose-lg max-w-none space-y-6">
              <div className="bg-card p-6 rounded-lg border">
                <h2 className="text-2xl mb-4">우리의 미션</h2>
                <p className="text-muted-foreground">
                  IdeaOasis는 전 세계에서 검증된 혁신적인 비즈니스 아이디어를 
                  한국 시장에 맞게 큐레이션하여 제공하는 플랫폼입니다. 
                  한국의 창업가와 혁신가들이 글로벌 트렌드를 빠르게 파악하고, 
                  현지화된 인사이트를 얻을 수 있도록 돕습니다.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg border">
                <h2 className="text-2xl mb-4">제공 서비스</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Kickstarter, Y Combinator 등에서 검증된 아이디어 큐레이션</li>
                  <li>• 한국 시장 적용 방안 및 현지화 포인트 분석</li>
                  <li>• 경쟁 우위 확보 전략 및 진입장벽 분석</li>
                  <li>• 커뮤니티 기반 아이디어 평가 및 토론</li>
                  <li>• 프리미엄 회원을 위한 상세 분석 및 실행 체크리스트</li>
                </ul>
              </div>

              <div className="bg-card p-6 rounded-lg border">
                <h2 className="text-2xl mb-4">프리미엄 구독</h2>
                <p className="text-muted-foreground mb-4">
                  월 $9로 프리미엄 콘텐츠에 액세스하여 더 깊이 있는 분석과 
                  실행 가능한 인사이트를 얻으세요.
                </p>
                <div className="bg-secondary/10 p-4 rounded">
                  <h4 className="font-medium mb-2">프리미엄 혜택</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 독점 아이디어 및 심층 분석</li>
                    <li>• 단계별 실행 체크리스트</li>
                    <li>• 시장 조사 및 경쟁사 분석</li>
                    <li>• 우선 댓글 승인</li>
                  </ul>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => handleNavigate('home')}
                  className="text-primary hover:underline"
                >
                  아이디어 둘러보기 →
                </button>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        currentPage={currentPage}
        isLoggedIn={!!user}
        isPremium={user?.isPremium || false}
        isAdmin={user?.isAdmin || false}
        onNavigate={handleNavigate}
        onAuth={() => setIsAuthModalOpen(true)}
      />

      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Firebase Integration Comments */}
      {/* 
      TODO: Integrate Firebase Firestore
      
      Firestore Collections Structure:
      
      1. ideas_io collection:
      {
        id: string,
        source: string,
        oneLineSummary: string,
        localizePoint: string,
        difficulty: 'Low' | 'Medium' | 'High',
        category: string,
        access: 'public' | 'paid',
        moatHypothesis: string,
        premiumContent: {
          summary: string,
          checklist: string[]
        },
        createdAt: timestamp,
        updatedAt: timestamp
      }

      2. votes subcollection (ideas_io/{ideaId}/votes):
      {
        userId: string,
        timestamp: timestamp
      }

      3. comments subcollection (ideas_io/{ideaId}/comments):
      {
        userId: string,
        userName: string,
        text: string,
        status: 'pending' | 'approved' | 'rejected',
        timestamp: timestamp
      }

      Firebase Auth Integration:
      - Email/Password authentication
      - Google OAuth
      - Custom claims for premium/admin users

      Example Firebase functions to implement:
      
      // Fetch ideas
      const fetchIdeas = async () => {
        const snapshot = await db.collection('ideas_io').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      };

      // Vote for idea
      const voteForIdea = async (ideaId: string, userId: string) => {
        await db.collection('ideas_io').doc(ideaId).collection('votes').add({
          userId,
          timestamp: new Date()
        });
      };

      // Add comment
      const addComment = async (ideaId: string, userId: string, text: string) => {
        await db.collection('ideas_io').doc(ideaId).collection('comments').add({
          userId,
          text,
          status: 'pending',
          timestamp: new Date()
        });
      };

      TODO: Integrate AI (e.g., Grok API) for auto-generating ideas and summaries post-MVP
      */}
    </div>
  );
}