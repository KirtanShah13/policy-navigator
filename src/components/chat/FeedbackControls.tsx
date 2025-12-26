import { ThumbsUp, ThumbsDown, MessageSquareWarning } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type FeedbackType =
  | 'helpful'
  | 'incorrect'
  | 'needs_clarification';

interface FeedbackControlsProps {
  messageId: string;
  currentFeedback: FeedbackType | null;
  onFeedback: (messageId: string, feedback: FeedbackType) => void;
}

export function FeedbackControls({
  messageId,
  currentFeedback,
  onFeedback,
}: FeedbackControlsProps) {
  return (
    <div
      className="flex items-center gap-1"
      role="group"
      aria-label="Response feedback"
    >
      {/* Helpful */}
      <Button
        variant={currentFeedback === 'helpful' ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => onFeedback(messageId, 'helpful')}
        aria-pressed={currentFeedback === 'helpful'}
        className="h-7 px-2 text-xs"
        data-feedback="helpful"
      >
        <ThumbsUp
          className={`h-3.5 w-3.5 mr-1 ${
            currentFeedback === 'helpful' ? 'text-success' : ''
          }`}
          aria-hidden="true"
        />
        Helpful
      </Button>

      {/* Incorrect */}
      <Button
        variant={currentFeedback === 'incorrect' ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => onFeedback(messageId, 'incorrect')}
        aria-pressed={currentFeedback === 'incorrect'}
        className="h-7 px-2 text-xs"
        data-feedback="incorrect"
      >
        <ThumbsDown
          className={`h-3.5 w-3.5 mr-1 ${
            currentFeedback === 'incorrect' ? 'text-destructive' : ''
          }`}
          aria-hidden="true"
        />
        Incorrect
      </Button>

      {/* Needs clarification / escalation */}
      <Button
        variant={currentFeedback === 'needs_clarification' ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => onFeedback(messageId, 'needs_clarification')}
        aria-pressed={currentFeedback === 'needs_clarification'}
        className="h-7 px-2 text-xs"
        data-feedback="needs-clarification"
      >
        <MessageSquareWarning
          className={`h-3.5 w-3.5 mr-1 ${
            currentFeedback === 'needs_clarification'
              ? 'text-warning'
              : ''
          }`}
          aria-hidden="true"
        />
        Needs clarification
      </Button>
    </div>
  );
}
