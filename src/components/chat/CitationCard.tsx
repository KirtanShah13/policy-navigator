import { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, FileText } from 'lucide-react';
import { PolicyCitation } from '@/types/policy';
import { Button } from '@/components/ui/button';

interface CitationCardProps {
  citation: PolicyCitation;
  index: number;
}

export function CitationCard({ citation, index }: CitationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="policy-card">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <span
            className="flex-shrink-0 w-6 h-6 rounded bg-primary/10 text-primary text-xs font-medium flex items-center justify-center"
            aria-hidden="true"
          >
            {index + 1}
          </span>
          <div className="min-w-0">
            <h4 className="text-sm font-medium text-foreground truncate">
              {citation.policyName}
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Section {citation.section} • Version {citation.version}
              {citation.pageNumber && ` • Page ${citation.pageNumber}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
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

      {isExpanded && (
        <div
          id={`citation-excerpt-${citation.id}`}
          className="mt-3 citation-highlight"
        >
          <div className="flex items-center gap-1.5 mb-1.5">
            <FileText className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
            <span className="text-2xs font-medium text-muted-foreground uppercase tracking-wide">
              Policy Excerpt
            </span>
          </div>
          <p className="text-sm text-foreground leading-relaxed">
            {citation.excerpt}
          </p>
        </div>
      )}
    </div>
  );
}
