import { Policy, PolicyScope } from '@/types/policy';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { RefreshCw, Upload, ExternalLink, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PolicyTableProps {
  policies: Policy[];
  onReindex: (policyId: string) => void;
  onUpload: () => void;
}

const scopeLabels: Record<PolicyScope, string> = {
  hr: 'HR',
  it: 'IT',
  finance: 'Finance',
  security: 'Security',
};

const statusStyles: Record<Policy['status'], string> = {
  active: 'bg-success/10 text-success border-success/20',
  draft: 'bg-warning/10 text-warning border-warning/20',
  archived: 'bg-muted text-muted-foreground border-border',
};

export function PolicyTable({ policies, onReindex, onUpload }: PolicyTableProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Policy Documents</h2>
          <p className="text-sm text-muted-foreground">Manage and index company policy documents</p>
        </div>
        <Button onClick={onUpload}>
          <Upload className="h-4 w-4 mr-2" aria-hidden="true" />
          Upload Policy
        </Button>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-medium">Policy Name</TableHead>
              <TableHead className="font-medium">Scope</TableHead>
              <TableHead className="font-medium">Version</TableHead>
              <TableHead className="font-medium">Status</TableHead>
              <TableHead className="font-medium">Last Updated</TableHead>
              <TableHead className="font-medium">Indexed</TableHead>
              <TableHead className="w-[100px]">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {policies.map((policy) => (
              <TableRow key={policy.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{policy.name}</span>
                    <a
                      href={policy.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground"
                      aria-label={`Open ${policy.name} in new tab`}
                    >
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal">
                    {scopeLabels[policy.scope]}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">v{policy.version}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusStyles[policy.status]}>
                    {policy.status.charAt(0).toUpperCase() + policy.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {policy.lastUpdated.toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span
                      className={`status-dot ${policy.indexed ? 'bg-success' : 'bg-warning'}`}
                      aria-hidden="true"
                    />
                    <span className="text-sm text-muted-foreground">
                      {policy.indexed ? 'Yes' : 'Pending'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onReindex(policy.id)}>
                        <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
                        Re-index
                      </DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>View History</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Archive</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
