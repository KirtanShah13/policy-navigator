import { ConfidenceLevel } from '@/types/policy';

interface ConfidenceBadgeProps {
  level: ConfidenceLevel;
}

const confidenceConfig: Record<ConfidenceLevel, { label: string; className: string }> = {
  high: {
    label: 'High confidence',
    className: 'bg-success/10 text-success',
  },
  medium: {
    label: 'Medium confidence',
    className: 'bg-warning/10 text-warning',
  },
  low: {
    label: 'Low confidence',
    className: 'bg-destructive/10 text-destructive',
  },
};

export function ConfidenceBadge({ level }: ConfidenceBadgeProps) {
  const config = confidenceConfig[level];

  return (
    <span
      className={`confidence-badge ${config.className}`}
      role="status"
      aria-label={`Confidence level: ${config.label}`}
    >
      <span className={`status-dot mr-1.5 bg-current`} aria-hidden="true" />
      {config.label}
    </span>
  );
}
