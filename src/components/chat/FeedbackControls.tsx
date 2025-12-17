import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FeedbackControlsProps {
  messageId: string;
  currentFeedback: 'helpful' | 'incorrect' | null;
  onFeedback: (messageId: string, feedback: 'helpful' | 'incorrect') => void;
}

export function FeedbackControls({ messageId, currentFeedback, onFeedback }: FeedbackControlsProps) {
  return (
    <div className="flex items-center gap-1" role="group" aria-label="Response feedback">
      <Button
        variant={currentFeedback === 'helpful' ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => onFeedback(messageId, 'helpful')}
        aria-pressed={currentFeedback === 'helpful'}
        className="h-7 px-2 text-xs"
      >
        <ThumbsUp
          className={`h-3.5 w-3.5 mr-1 ${currentFeedback === 'helpful' ? 'text-success' : ''}`}
          aria-hidden="true"
        />
        Helpful
      </Button>
      <Button
        variant={currentFeedback === 'incorrect' ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => onFeedback(messageId, 'incorrect')}
        aria-pressed={currentFeedback === 'incorrect'}
        className="h-7 px-2 text-xs"
      >
        <ThumbsDown
          className={`h-3.5 w-3.5 mr-1 ${currentFeedback === 'incorrect' ? 'text-destructive' : ''}`}
          aria-hidden="true"
        />
        Incorrect
      </Button>
    </div>
  );
}
