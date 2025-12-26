import { PolicyScope } from '@/types/policy';
import { Building2, Shield, DollarSign, Lock, Layers } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface PolicySelectorProps {
  value: PolicyScope | 'all';
  onChange: (value: PolicyScope | 'all') => void;
  disabledScopes?: (PolicyScope | 'all')[];
}

type ScopeConfig = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
};

const scopeConfig: Record<PolicyScope | 'all', ScopeConfig> = {
  all: {
    label: 'All Policies',
    icon: Layers,
    description: 'Search across all available policy domains',
  },
  hr: {
    label: 'HR Policies',
    icon: Building2,
    description: 'Leave, benefits, conduct, employment policies',
  },
  it: {
    label: 'IT Policies',
    icon: Shield,
    description: 'Systems, access, acceptable use policies',
  },
  finance: {
    label: 'Finance Policies',
    icon: DollarSign,
    description: 'Expenses, reimbursements, approvals',
  },
  security: {
    label: 'Security Policies',
    icon: Lock,
    description: 'Information security and data protection',
  },
};

export function PolicySelector({
  value,
  onChange,
  disabledScopes = [],
}: PolicySelectorProps) {
  const current = scopeConfig[value];
  const CurrentIcon = current.icon;

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="policy-scope" className="sr-only">
        Policy scope
      </label>

      <Select
        value={value}
        onValueChange={(v) => onChange(v as PolicyScope | 'all')}
      >
        <SelectTrigger
          id="policy-scope"
          className="w-[200px] h-9"
          aria-label="Select policy scope"
        >
          <div className="flex items-center gap-2">
            <CurrentIcon className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>{current.label}</span>
          </div>
        </SelectTrigger>

        <SelectContent className="bg-popover border border-border shadow-lg">
          {(Object.keys(scopeConfig) as (PolicyScope | 'all')[]).map((scope) => {
            const config = scopeConfig[scope];
            const Icon = config.icon;
            const isDisabled = disabledScopes.includes(scope);

            return (
              <SelectItem
                key={scope}
                value={scope}
                disabled={isDisabled}
                className={cn(
                  'cursor-pointer',
                  isDisabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                <div className="flex items-start gap-2">
                  <Icon
                    className="h-4 w-4 text-muted-foreground mt-0.5"
                    aria-hidden="true"
                  />
                  <div className="flex flex-col">
                    <span>{config.label}</span>
                    {config.description && (
                      <span className="text-2xs text-muted-foreground">
                        {config.description}
                      </span>
                    )}
                  </div>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
