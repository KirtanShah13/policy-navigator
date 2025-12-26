import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { PolicyCitation } from '@/types/policy';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CitationCardProps {
  citation: PolicyCitation;
  index: number;
}

export function CitationCard({ citation, index }: CitationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isCurrent = citation.isCurrent ?? true;

  return (
    <div
      className={cn(
        'rounded-md border border-border p-3 bg-card',
        !isCurrent && 'border-warning/40 bg-warning/5'
      )}
      data-citation-id={citation.id}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          {/* Index */}
          <span
            className="flex-shrink-0 w-6 h-6 rounded bg-primary/10 text-primary text-xs font-medium flex items-center justify-center"
            aria-hidden="true"
          >
            {index + 1}
          </span>

          {/* Meta */}
          <div className="min-w-0">
            <h4 className="text-sm font-medium text-foreground truncate">
              {citation.policyName}
            </h4>

            <p className="text-xs text-muted-foreground mt-0.5">
              Section {citation.section}
              {citation.version && <> • Version {citation.version}</>}
              {citation.effectiveFrom && (
                <> • Effective {citation.effectiveFrom}</>
              )}
            </p>

            {!isCurrent && (
              <p className="text-2xs text-warning mt-0.5">
                This policy version may be outdated
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded((v) => !v)}
            aria-expanded={isExpanded}
            aria-controls={`citation-excerpt-${citation.id}`}
            className="h-8 px-2"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" aria-hidden="true" />
            ) : (
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            )}
            <span className="sr-only">
              {isExpanded ? 'Collapse' : 'Expand'} excerpt
            </span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            asChild
            className="h-8 px-2"
          >
            <a
              href={citation.documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${citation.policyName} in new tab`}
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </Button>
        </div>
      </div>

      {/* Excerpt */}
      {isExpanded && (
        <div
          id={`citation-excerpt-${citation.id}`}
          className="mt-3 rounded-md bg-muted/40 p-3"
        >
          <div className="flex items-center gap-1.5 mb-2">
            <FileText className="h-3 w-3 text-muted-foreground" />
            <span className="text-2xs font-medium text-muted-foreground uppercase tracking-wide">
              Policy excerpt
            </span>
            <ShieldCheck
              className="h-3 w-3 text-success ml-auto"
              aria-hidden="true"
            />
          </div>

          <p className="text-sm leading-relaxed">
            {citation.excerpt}
          </p>

          <p className="text-2xs text-muted-foreground mt-2">
            Excerpt shown for reference. Refer to the full policy for complete
            and authoritative wording.
          </p>
        </div>
      )}
    </div>
  );
}
