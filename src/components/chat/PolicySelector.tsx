import { PolicyScope } from '@/types/policy';
import { Building2, Shield, DollarSign, Lock } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PolicySelectorProps {
  value: PolicyScope | 'all';
  onChange: (value: PolicyScope | 'all') => void;
}

const scopeConfig: Record<PolicyScope | 'all', { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  all: { label: 'All Policies', icon: Building2 },
  hr: { label: 'HR Policies', icon: Building2 },
  it: { label: 'IT Policies', icon: Shield },
  finance: { label: 'Finance Policies', icon: DollarSign },
  security: { label: 'Security Policies', icon: Lock },
};

export function PolicySelector({ value, onChange }: PolicySelectorProps) {
  const currentScope = scopeConfig[value];
  const Icon = currentScope.icon;

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="policy-scope" className="text-sm text-muted-foreground sr-only">
        Policy Scope
      </label>
      <Select value={value} onValueChange={(v) => onChange(v as PolicyScope | 'all')}>
        <SelectTrigger id="policy-scope" className="w-[180px] h-9">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent>
          {(Object.keys(scopeConfig) as (PolicyScope | 'all')[]).map((scope) => {
            const config = scopeConfig[scope];
            const ScopeIcon = config.icon;
            return (
              <SelectItem key={scope} value={scope}>
                <div className="flex items-center gap-2">
                  <ScopeIcon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  {config.label}
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
