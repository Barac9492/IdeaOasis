import { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

interface User {
  id: string;
  email: string;
  isPremium: boolean;
  isAdmin: boolean;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Implement Firebase Auth
    // For now, simulate authentication
    setTimeout(() => {
      // Mock user data - in production this would come from Firebase Auth
      const mockUser: User = {
        id: 'user_' + Date.now(),
        email: formData.email,
        isPremium: formData.email.includes('premium'),
        isAdmin: formData.email.includes('admin')
      };
      
      onAuthSuccess(mockUser);
      setIsLoading(false);
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md mx-4">
        <div className="glass-light rounded-2xl shadow-apple-lg overflow-hidden">
          {/* Header */}
          <div className="relative px-6 py-6 border-b border-border/50">
            <button
              onClick={onClose}
              className="absolute right-6 top-6 w-8 h-8 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors"
            >
              <X size={16} className="text-muted-foreground" />
            </button>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
                  <span className="text-xs font-bold text-white">IO</span>
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-foreground">
                {mode === 'signin' ? '로그인' : '회원가입'}
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                {mode === 'signin' 
                  ? 'IdeaOasis에 다시 오신 것을 환영합니다'
                  : '새로운 아이디어의 세계로 떠나보세요'
                }
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="px-6 py-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    이름
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 bg-muted border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="홍길동"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  이메일
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 bg-muted border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  비밀번호
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-12 py-3 bg-muted border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-apple flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  mode === 'signin' ? '로그인' : '계정 만들기'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 h-px bg-border"></div>
              <span className="px-4 text-sm text-muted-foreground">또는</span>
              <div className="flex-1 h-px bg-border"></div>
            </div>

            {/* Social Login */}
            <button className="w-full bg-muted hover:bg-muted/80 text-foreground py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Google로 계속하기</span>
            </button>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-muted/30 border-t border-border/50 text-center">
            <p className="text-sm text-muted-foreground">
              {mode === 'signin' ? '계정이 없으신가요?' : '이미 계정이 있으신가요?'}
              {' '}
              <button
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                className="text-primary hover:underline font-medium"
              >
                {mode === 'signin' ? '회원가입' : '로그인'}
              </button>
            </p>

            {mode === 'signup' && (
              <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                회원가입을 진행하면 IdeaOasis의{' '}
                <a href="#" className="text-primary hover:underline">이용약관</a>과{' '}
                <a href="#" className="text-primary hover:underline">개인정보처리방침</a>에 동의하는 것으로 간주됩니다.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}