import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type PolicyScope = 'hr' | 'it' | 'security' | 'finance';

interface UploadPolicyDialogProps {
  open: boolean;
  onClose: () => void;
  onUpload: (policy: {
    name: string;
    scope: PolicyScope;
    version: string;
  }) => void;
}

export function UploadPolicyDialog({
  open,
  onClose,
  onUpload,
}: UploadPolicyDialogProps) {
  const [name, setName] = useState('');
  const [scope, setScope] = useState<PolicyScope>('hr');
  const [version, setVersion] = useState('1.0');

  const isValid = name.trim().length > 0 && version.trim().length > 0;

  const handleSubmit = () => {
    if (!isValid) return;

    onUpload({
      name: name.trim(),
      scope,
      version: version.trim(),
    });

    // Reset state AFTER successful upload
    setName('');
    setVersion('1.0');
    setScope('hr');

    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Policy</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Policy Name */}
          <div className="space-y-1">
            <Label htmlFor="policy-name">Policy Name</Label>
            <Input
              id="policy-name"
              placeholder="Information Security Policy"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          {/* Scope */}
          <div className="space-y-1">
            <Label>Scope</Label>
            <Select value={scope} onValueChange={(v) => setScope(v as PolicyScope)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hr">HR</SelectItem>
                <SelectItem value="it">IT</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Version */}
          <div className="space-y-1">
            <Label htmlFor="policy-version">Version</Label>
            <Input
              id="policy-version"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="1.0"
            />
          </div>

          {/* File Upload (future) */}
          <div className="space-y-1">
            <Label>Policy Document</Label>
            <Input type="file" disabled />
            <p className="text-xs text-muted-foreground">
              File upload will be enabled when backend is connected
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid}>
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
