import { useState, KeyboardEvent, useRef } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSubmit: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
}

export function ChatInput({
  onSubmit,
  disabled = false,
  placeholder = 'Ask a question about company policies…',
  maxLength = 1000,
}: ChatInputProps) {
  const [input, setInput] = useState('');
  const isComposingRef = useRef(false);

  const trimmed = input.trim();
  const used = input.length;
  const remaining = maxLength - used;

  const isNearLimit = used >= maxLength * 0.8;
  const isAtLimit = used >= maxLength;

  const handleSubmit = () => {
    if (!trimmed || disabled || isAtLimit) return;
    onSubmit(trimmed);
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposingRef.current) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      className={cn(
        'border-t border-border bg-background p-4 transition-opacity',
        disabled && 'opacity-70'
      )}
    >
      <div className="max-w-3xl mx-auto">
        <label htmlFor="chat-input" className="sr-only">
          Your question
        </label>

        <div className="flex gap-3 items-end">
          <Textarea
            id="chat-input"
            value={input}
            onChange={(e) =>
              setInput(e.target.value.slice(0, maxLength))
            }
            onKeyDown={handleKeyDown}
            onCompositionStart={() => (isComposingRef.current = true)}
            onCompositionEnd={() => (isComposingRef.current = false)}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="min-h-[44px] max-h-32 resize-none"
            aria-describedby="chat-input-hint chat-input-count"
          />

          <Button
            onClick={handleSubmit}
            disabled={disabled || !trimmed || isAtLimit}
            size="default"
            className="h-11 px-4"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>

        <div className="flex justify-between items-center mt-2">
          <p
            id="chat-input-hint"
            className="text-xs text-muted-foreground"
          >
            Enter to send · Shift+Enter for new line
          </p>

          <p
            id="chat-input-count"
            aria-live="polite"
            className={cn(
              'text-xs tabular-nums',
              isAtLimit && 'text-destructive',
              !isAtLimit && isNearLimit && 'text-warning',
              !isNearLimit && 'text-muted-foreground'
            )}
          >
            {used} / {maxLength}
          </p>
        </div>
      </div>
    </div>
  );
}
