import { ChatMessage as ChatMessageType } from '@/types/policy';
import { ConfidenceBadge } from './ConfidenceBadge';
import { CitationCard } from './CitationCard';
import { FeedbackControls } from './FeedbackControls';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
  onFeedback: (messageId: string, feedback: 'helpful' | 'incorrect') => void;
}

export function ChatMessage({ message, onFeedback }: ChatMessageProps) {
  const isAssistant = message.role === 'assistant';

  return (
    <article
      className={`flex gap-4 ${isAssistant ? 'bg-muted/30' : ''} p-4 rounded-lg`}
      aria-label={`${message.role === 'user' ? 'Your' : 'Assistant'} message`}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center ${
          isAssistant ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
        }`}
        aria-hidden="true"
      >
        {isAssistant ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
      </div>

      <div className="flex-1 min-w-0 space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium text-foreground">
            {isAssistant ? 'Policy Assistant' : 'You'}
          </span>
          <time className="text-xs text-muted-foreground">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </time>
          {isAssistant && message.confidence && (
            <ConfidenceBadge level={message.confidence} />
          )}
        </div>

        <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
          {message.content}
        </div>

        {isAssistant && message.citations && message.citations.length > 0 && (
          <div className="space-y-2 mt-4">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Sources ({message.citations.length})
            </h3>
            <div className="space-y-2">
              {message.citations.map((citation, index) => (
                <CitationCard key={citation.id} citation={citation} index={index} />
              ))}
            </div>
          </div>
        )}

        {isAssistant && (
          <div className="pt-2 border-t border-border mt-4">
            <FeedbackControls
              messageId={message.id}
              currentFeedback={message.feedback || null}
              onFeedback={onFeedback}
            />
          </div>
        )}
      </div>
    </article>
  );
}
