import {
  X,
  LogOut,
  Trash2,
  ShieldCheck,
  Share2,
  FileText,
  Copy,
  Download,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { User } from '@/types/policy';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { chatMessageService } from '@/services/chatMessageService';

export interface UserProfileDrawerProps {
  open: boolean;
  onClose: () => void;
  user: User;
  onLogout: () => void;
  onClearAllChats: () => void;
  activeChatId: string | null;
}

export function UserProfileDrawer({
  open,
  onClose,
  user,
  onLogout,
  onClearAllChats,
  activeChatId,
}: UserProfileDrawerProps) {
  const navigate = useNavigate();

  if (!open) return null;

  const getChatMessages = () => {
    if (!activeChatId) return [];
    return chatMessageService.getMessages(activeChatId);
  };

  /* ---------- SHARE: COPY TEXT ---------- */
  const handleCopyChat = async () => {
    const messages = getChatMessages();
    if (!messages.length) return;

    const text = messages
      .map((m) => `${m.role.toUpperCase()}:\n${m.content}`)
      .join('\n\n');

    await navigator.clipboard.writeText(text);
    alert('Chat copied to clipboard');
  };

  /* ---------- SHARE: DOWNLOAD JSON ---------- */
  const handleDownloadChat = () => {
    const messages = getChatMessages();
    if (!messages.length) return;

    const exportData = messages.map((m) => ({
      role: m.role,
      content: m.content,
      timestamp: m.timestamp,
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'policy-chat.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ---------- SHARE: NATIVE SHARE (MOBILE) ---------- */
  const handleNativeShare = async () => {
    const messages = getChatMessages();
    if (!messages.length || !navigator.share) return;

    const text = messages
      .slice(-5)
      .map((m) => `${m.role}: ${m.content}`)
      .join('\n');

    await navigator.share({
      title: 'Policy Chat',
      text,
    });
  };

  const handleOpenTerms = () => {
    onClose();
    navigate('/terms');
  };

  const hasChat = Boolean(activeChatId);

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Drawer */}
      <div
        className={cn(
          'absolute right-0 top-0 h-full w-80 bg-background',
          'border-l border-border shadow-xl flex flex-col'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-sm font-semibold">Account</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Profile */}
        <div className="px-4 py-5 border-b">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>

          <div className="mt-3">
            <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-2xs">
              <ShieldCheck className="h-3 w-3" />
              {user.role.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex-1 px-4 py-4 space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={handleCopyChat}
            disabled={!hasChat}
          >
            <Copy className="h-4 w-4" />
            Copy Chat
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={handleDownloadChat}
            disabled={!hasChat}
          >
            <Download className="h-4 w-4" />
            Download Chat (JSON)
          </Button>

          {navigator.share && (
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={handleNativeShare}
              disabled={!hasChat}
            >
              <Share2 className="h-4 w-4" />
              Share via Device
            </Button>
          )}

          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={handleOpenTerms}
          >
            <FileText className="h-4 w-4" />
            Terms & Conditions
          </Button>

          <Button
            variant="destructive"
            className="w-full justify-start gap-2"
            onClick={onClearAllChats}
          >
            <Trash2 className="h-4 w-4" />
            Clear All Chats
          </Button>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-destructive"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}
