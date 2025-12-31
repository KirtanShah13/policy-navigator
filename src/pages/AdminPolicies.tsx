import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { PolicyTable } from '@/components/admin/PolicyTable';
import { UploadPolicyDialog } from '@/components/admin/UploadPolicyDialog';
import { Policy, User } from '@/types/policy';
import { useToast } from '@/hooks/use-toast';

/* ---------------- DEMO POLICIES ---------------- */

const demoPolicies: Policy[] = [
  {
    id: '1',
    name: 'Employee Time Off Policy',
    scope: 'hr',
    version: '2.1',
    lastUpdated: new Date('2024-01-15'),
    status: 'active',
    documentUrl: '#',
    indexed: true,
  },
  {
    id: '2',
    name: 'Information Security Policy',
    scope: 'security',
    version: '3.0',
    lastUpdated: new Date('2024-02-01'),
    status: 'active',
    documentUrl: '#',
    indexed: true,
  },
  {
    id: '3',
    name: 'Travel and Expense Policy',
    scope: 'finance',
    version: '1.8',
    lastUpdated: new Date('2024-01-20'),
    status: 'active',
    documentUrl: '#',
    indexed: true,
  },
  {
    id: '4',
    name: 'Remote Work Policy',
    scope: 'hr',
    version: '1.5',
    lastUpdated: new Date('2024-03-01'),
    status: 'active',
    documentUrl: '#',
    indexed: true,
  },
  {
    id: '5',
    name: 'IT Equipment Policy',
    scope: 'it',
    version: '2.0',
    lastUpdated: new Date('2024-02-15'),
    status: 'active',
    documentUrl: '#',
    indexed: false,
  },
  {
    id: '6',
    name: 'Data Privacy Policy',
    scope: 'security',
    version: '2.2',
    lastUpdated: new Date('2024-01-10'),
    status: 'draft',
    documentUrl: '#',
    indexed: false,
  },
];

/* ---------------- COMPONENT ---------------- */

export default function AdminPolicies() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [user, setUser] = useState<User | null>(null);
  const [policies, setPolicies] = useState<Policy[]>(demoPolicies);
  const [uploadOpen, setUploadOpen] = useState(false);

  /* ---------------- AUTH / ROLE GUARD ---------------- */

  useEffect(() => {
    const storedUser = localStorage.getItem('policyrag_user');

    if (!storedUser) {
      navigate('/auth');
      return;
    }

    const parsed: User = JSON.parse(storedUser);

    if (parsed.role === 'employee') {
      navigate('/chat');
      return;
    }

    setUser(parsed);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('policyrag_user');
    navigate('/auth');
  };

  /* ---------------- ACTIONS ---------------- */

  const handleUploadPolicy = (policy: {
    name: string;
    scope: 'hr' | 'it' | 'security' | 'finance';
    version: string;
  }) => {
    const newPolicy: Policy = {
      id: crypto.randomUUID(),
      name: policy.name,
      scope: policy.scope,
      version: policy.version,
      lastUpdated: new Date(),
      status: 'draft',
      documentUrl: '#',
      indexed: false,
    };

    setPolicies((prev) => [newPolicy, ...prev]);

    toast({
      title: 'Policy uploaded',
      description: `${policy.name} has been added as a draft.`,
    });
  };

  const handleReindex = (policyId: string) => {
    const policy = policies.find((p) => p.id === policyId);

    toast({
      title: 'Re-indexing started',
      description: `${policy?.name} is being re-indexed.`,
    });

    setTimeout(() => {
      setPolicies((prev) =>
        prev.map((p) =>
          p.id === policyId ? { ...p, indexed: true } : p
        )
      );

      toast({
        title: 'Re-indexing complete',
        description: `${policy?.name} is now indexed.`,
      });
    }, 2000);
  };

  if (!user) return null;

  /* ---------------- RENDER ---------------- */

  return (
    <AppLayout user={user} onLogout={handleLogout}>
      <UploadPolicyDialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={handleUploadPolicy}
      />

      <div className="flex flex-col h-full">
        <header className="px-6 py-4 border-b border-border bg-background">
          <h2 className="text-lg font-semibold">Policy Management</h2>
          <p className="text-sm text-muted-foreground">
            Upload, update, and manage policy documents
          </p>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <PolicyTable
            policies={policies}
            onReindex={handleReindex}
            onUpload={() => setUploadOpen(true)}
          />
        </div>
      </div>
    </AppLayout>
  );
}
  