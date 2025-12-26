import { useEffect, useRef, useState } from 'react';
import {
  MessageSquare,
  Trash2,
  Pin,
  PinOff,
  Pencil,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChatSession } from '@/types/policy';

interface ChatHistoryItemProps {
  session: ChatSession;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
  onTogglePin: () => void;
  onRename: (title: string) => void;
  onClear?: () => void;

}

export function ChatHistoryItem({
  session,
  isActive,
  onClick,
  onDelete,
  onTogglePin,
  onRename,
  onClear,
}: ChatHistoryItemProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(session.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      setValue(session.title);
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing, session.title]);

  const commit = () => {
    const trimmed = value.trim() || 'Untitled Chat';
    if (trimmed !== session.title) {
      onRename(trimmed);
    }
    setEditing(false);
  };

  const cancel = () => {
    setValue(session.title);
    setEditing(false);
  };

  return (
    <div
      className={cn(
        'group flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition',
        'hover:bg-sidebar-accent/80',
        isActive && 'bg-primary/10 border-l-2 border-primary'
      )}
      onClick={!editing ? onClick : undefined}
    >
      <MessageSquare className="h-3.5 w-3.5 text-muted-foreground shrink-0" />

      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commit();
              if (e.key === 'Escape') cancel();
            }}
            className="w-full bg-background text-xs px-1 py-0.5 rounded border border-border outline-none"
          />
        ) : (
          <p
            className={cn(
              'text-xs truncate',
              isActive ? 'font-medium text-foreground' : 'text-sidebar-foreground'
            )}
            onDoubleClick={() => setEditing(true)}
          >
            {session.title}
          </p>
        )}

        <p className="text-2xs text-muted-foreground">
          {session.messageCount} messages
        </p>
      </div>

      {/* PIN */}
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          onTogglePin();
        }}
        className="h-6 w-6 opacity-0 group-hover:opacity-100"
        title={session.isPinned ? 'Unpin chat' : 'Pin chat'}
      >
        {session.isPinned ? (
          <PinOff className="h-3 w-3 text-primary" />
        ) : (
          <Pin className="h-3 w-3" />
        )}
      </Button>

      {/* CLEAR MESSAGES */}
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          onClear();
        }}
        className="h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground"
        title="Clear messages"
      >
        <RotateCcw className="h-3 w-3" />
      </Button>

      {/* RENAME */}
      {!editing && (
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            setEditing(true);
          }}
          className="h-6 w-6 opacity-0 group-hover:opacity-100"
          title="Rename chat"
        >
          <Pencil className="h-3 w-3" />
        </Button>
      )}

      {/* DELETE */}
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
        title="Delete chat"
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
}
