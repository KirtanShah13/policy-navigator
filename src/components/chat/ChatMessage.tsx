import { ChatMessage as ChatMessageType } from '@/types/policy';
import { ConfidenceBadge } from './ConfidenceBadge';
import { CitationCard } from './CitationCard';
import { FeedbackControls } from './FeedbackControls';
import { User, Bot, AlertTriangle } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
  onFeedback: (messageId: string, feedback: 'helpful' | 'incorrect') => void;
}

export function ChatMessage({ message, onFeedback }: ChatMessageProps) {
  const isAssistant = message.role === 'assistant';

  const hasCitations = Boolean(message.citations && message.citations.length > 0);
  const confidence = message.confidence ?? 'low';

  return (
    <article
      className={`flex gap-4 p-4 rounded-lg ${
        isAssistant ? 'bg-muted/30' : ''
      }`}
      aria-label={`${isAssistant ? 'Assistant' : 'User'} message`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center ${
          isAssistant
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground'
        }`}
        aria-hidden="true"
      >
        {isAssistant ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-3">
        {/* Header */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium">
            {isAssistant ? 'Policy Assistant' : 'You'}
          </span>

          <time className="text-xs text-muted-foreground">
  {new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })}
</time>


          {isAssistant && (
            <ConfidenceBadge level={confidence} />
          )}
        </div>

        {/* Answer */}
        <div className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </div>

        {/* Low-confidence warning */}
        {isAssistant && confidence === 'low' && (
          <div className="flex gap-2 items-start text-xs text-amber-600 bg-amber-500/10 border border-amber-500/20 rounded-md p-2">
            <AlertTriangle className="h-4 w-4 mt-0.5" />
            <p>
              This answer may be incomplete or context-dependent. Please verify
              with official policy or contact HR for confirmation.
            </p>
          </div>
        )}

        {/* Sources */}
        {isAssistant && (
          <div className="space-y-2 mt-4">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Sources
            </h3>

            {hasCitations ? (
              <div className="space-y-2">
                {message.citations!.map((citation, index) => (
                  <CitationCard
                    key={citation.id}
                    citation={citation}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                No authoritative policy source found for this answer.
              </p>
            )}
          </div>
        )}

        {/* Feedback */}
        {isAssistant && (
          <div className="pt-3 border-t border-border mt-4">
            <FeedbackControls
              messageId={message.id}
              currentFeedback={message.feedback ?? null}
              onFeedback={onFeedback}
            />
          </div>
        )}
      </div>
    </article>
  );
}
