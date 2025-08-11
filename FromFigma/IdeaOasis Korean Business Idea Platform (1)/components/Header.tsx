import { Button } from './ui/button';

interface HeaderProps {
  currentPage: string;
  isLoggedIn: boolean;
  isPremium: boolean;
  isAdmin: boolean;
  onNavigate: (page: string) => void;
  onAuth: () => void;
}

export default function Header({ 
  currentPage, 
  isLoggedIn, 
  isPremium, 
  isAdmin,
  onNavigate, 
  onAuth 
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full glass-light border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-white">IO</span>
            </div>
            <span className="text-xl font-semibold text-foreground">
              IdeaOasis
            </span>
          </button>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => onNavigate('home')}
              className={`relative px-3 py-2 text-sm transition-all duration-200 hover:text-primary ${
                currentPage === 'home' 
                  ? 'text-primary font-medium' 
                  : 'text-muted-foreground'
              }`}
            >
              아이디어
              {currentPage === 'home' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
            
            <button
              onClick={() => onNavigate('about')}
              className={`relative px-3 py-2 text-sm transition-all duration-200 hover:text-primary ${
                currentPage === 'about' 
                  ? 'text-primary font-medium' 
                  : 'text-muted-foreground'
              }`}
            >
              소개
              {currentPage === 'about' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>

            {/* Admin menu - only shown to logged in admins */}
            {isLoggedIn && isAdmin && (
              <button
                onClick={() => onNavigate('admin')}
                className={`relative px-3 py-2 text-sm transition-all duration-200 hover:text-primary ${
                  currentPage === 'admin' 
                    ? 'text-primary font-medium' 
                    : 'text-muted-foreground'
                }`}
              >
                관리자
                {currentPage === 'admin' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            {isLoggedIn && isPremium && (
              <div className="hidden sm:flex items-center space-x-2 bg-secondary/10 text-secondary px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <span className="text-sm font-medium">프리미엄</span>
              </div>
            )}
            
            {isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-muted-foreground">U</span>
                </div>
              </div>
            ) : (
              <Button
                onClick={onAuth}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-full transition-all duration-200 hover:shadow-apple"
              >
                로그인
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}