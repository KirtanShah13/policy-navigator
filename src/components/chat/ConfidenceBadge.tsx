import { ConfidenceLevel } from '@/types/policy';
import { CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfidenceBadgeProps {
  level: ConfidenceLevel;
}

type ConfidenceMeta = {
  label: string;
  intent: 'safe' | 'caution' | 'risk';
  className: string;
  icon: React.ElementType;
};

const confidenceConfig: Record<ConfidenceLevel, ConfidenceMeta> = {
  high: {
    label: 'High confidence',
    intent: 'safe',
    className: 'bg-success/10 text-success border border-success/20',
    icon: CheckCircle,
  },
  medium: {
    label: 'Medium confidence',
    intent: 'caution',
    className: 'bg-warning/10 text-warning border border-warning/20',
    icon: HelpCircle,
  },
  low: {
    label: 'Low confidence',
    intent: 'risk',
    className: 'bg-destructive/10 text-destructive border border-destructive/20',
    icon: AlertTriangle,
  },
};

export function ConfidenceBadge({ level }: ConfidenceBadgeProps) {
  const { label, intent, className, icon: Icon } = confidenceConfig[level];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-2xs font-medium',
        className
      )}
      role="status"
      aria-label={`Confidence level: ${label}`}
      data-confidence={level}
      data-intent={intent}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}
