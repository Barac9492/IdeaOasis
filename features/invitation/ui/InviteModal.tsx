'use client';

import { useState } from 'react';
import { X, Copy, Check, Users, Gift, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  ideaId: string;
  ideaTitle: string;
  userId?: string;
}

export function InviteModal({ 
  isOpen, 
  onClose, 
  ideaId, 
  ideaTitle,
  userId 
}: InviteModalProps) {
  const [inviteLink, setInviteLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const generateInviteLink = async () => {
    if (!userId) {
      toast.error('로그인이 필요합니다');
      return;
    }
    
    setIsGenerating(true);
    try {
      // Generate unique invite code
      const inviteCode = Math.random().toString(36).substring(2, 15);
      const link = `${window.location.origin}/invite/${inviteCode}?idea=${ideaId}`;
      
      // TODO: Save invitation to database
      // await createInvitation({ inviteCode, ideaId, userId });
      
      setInviteLink(link);
      toast.success('초대 링크가 생성되었습니다!');
    } catch (error) {
      toast.error('초대 링크 생성에 실패했습니다');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast.success('링크가 복사되었습니다!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('복사에 실패했습니다');
    }
  };
  
  const shareViaKakao = () => {
    // Kakao share implementation
    window.open(`https://accounts.kakao.com/login?continue=https://sharer.kakao.com/talk/friends/picker/shortlink/${encodeURIComponent(inviteLink)}`);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-purple-600" />
            친구 초대로 Execution Pack 해제
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Idea Info */}
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600 mb-1">해제할 아이디어</p>
            <p className="font-medium text-gray-900">{ideaTitle}</p>
          </div>
          
          {/* Benefits */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <p className="font-semibold text-gray-900">초대 혜택</p>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">✓</span>
                <span>친구가 가입하면 <strong>둘 다</strong> Execution Pack 해제</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">✓</span>
                <span>실제 실행 데이터와 템플릿 즉시 이용 가능</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">✓</span>
                <span>같은 아이디어 실행자들과 자동 연결</span>
              </li>
            </ul>
          </div>
          
          {/* Invite Link Generation */}
          {!inviteLink ? (
            <Button
              onClick={generateInviteLink}
              disabled={isGenerating}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>링크 생성 중...</>
              ) : (
                <>
                  <Users className="w-4 h-4 mr-2" />
                  초대 링크 생성하기
                </>
              )}
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={inviteLink}
                  readOnly
                  className="flex-1"
                />
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="icon"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              
              {/* Share Options */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={shareViaKakao}
                  variant="outline"
                  className="w-full"
                >
                  카카오톡 공유
                </Button>
                <Button
                  onClick={copyToClipboard}
                  variant="default"
                  className="w-full"
                >
                  링크 복사
                </Button>
              </div>
            </div>
          )}
          
          {/* Status */}
          <div className="text-center text-sm text-gray-500">
            친구가 이 링크로 가입하면 자동으로 해제됩니다
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}