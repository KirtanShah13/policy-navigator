import { MessageSquare, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
  messageCount: number;
}

interface ChatHistoryItemProps {
  session: ChatSession;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
}

export function ChatHistoryItem({ session, isActive, onClick, onDelete }: ChatHistoryItemProps) {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      className={cn(
        'group flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-all duration-200',
        'hover:bg-sidebar-accent/80',
        isActive && 'bg-gradient-to-r from-primary/20 to-primary/10 border-l-2 border-primary'
      )}
      onClick={onClick}
    >
      <MessageSquare className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0">
        <p className={cn(
          'text-xs truncate',
          isActive ? 'text-foreground font-medium' : 'text-sidebar-foreground'
        )}>
          {session.title}
        </p>
        <p className="text-2xs text-muted-foreground">
          {formatDate(session.timestamp)} · {session.messageCount} msgs
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
}
