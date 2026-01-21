import { useState } from 'react';
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
import {
  RefreshCw,
  Upload,
  ExternalLink,
  MoreHorizontal,
  Archive,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface PolicyTableProps {
  policies: Policy[];
  onReindex: (policyId: string) => void;
  onUpload: () => void;
  onArchive?: (policyId: string) => void; // optional for now
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

export function PolicyTable({
  policies,
  onReindex,
  onUpload,
  onArchive,
}: PolicyTableProps) {
  const [archivingId, setArchivingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const handleConfirmArchive = async () => {
    if (!confirmId) return;

    setArchivingId(confirmId);

    // simulate async backend call
    await new Promise((r) => setTimeout(r, 800));

    onArchive?.(confirmId);

    setArchivingId(null);
    setConfirmId(null);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Policy Documents</h2>
          <p className="text-sm text-muted-foreground">
            Manage and index company policy documents
          </p>
        </div>
        <Button onClick={onUpload}>
          <Upload className="h-4 w-4 mr-2" />
          Upload Policy
        </Button>
      </div>

      {/* Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Policy Name</TableHead>
              <TableHead>Scope</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Indexed</TableHead>
              <TableHead className="w-[80px]" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {policies.map((policy) => (
              <TableRow key={policy.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{policy.name}</span>
                    <a
                      href={policy.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge variant="outline">
                    {scopeLabels[policy.scope]}
                  </Badge>
                </TableCell>

                <TableCell className="text-muted-foreground">
                  v{policy.version}
                </TableCell>

                <TableCell>
                  <Badge
                    variant="outline"
                    className={statusStyles[policy.status]}
                  >
                    {policy.status}
                  </Badge>
                </TableCell>

                <TableCell className="text-muted-foreground">
                  {policy.lastUpdated.toLocaleDateString()}
                </TableCell>

                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {policy.indexed ? 'Yes' : 'Pending'}
                  </span>
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        disabled={archivingId === policy.id}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onReindex(policy.id)}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Re-index
                      </DropdownMenuItem>

                      {policy.status !== 'archived' && (
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setConfirmId(policy.id)}
                        >
                          <Archive className="h-4 w-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Confirm Archive Dialog */}
      <Dialog open={!!confirmId} onOpenChange={() => setConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archive Policy</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            This policy will be archived and removed from active use. You can
            restore it later.
          </p>

          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmArchive}
              disabled={!!archivingId}
            >
              Archive
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
