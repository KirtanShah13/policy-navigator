import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { User, UserRole } from '@/types/policy';
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
import { UserPlus, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { InviteUserDialog } from '@/components/admin/InviteUserDialog';

/* ---------------- TYPES ---------------- */

interface ManagedUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: 'active' | 'pending' | 'disabled';
  lastActive: Date;
}

/* ---------------- DEMO USERS ---------------- */

const demoUsers: ManagedUser[] = [
  {
    id: '1',
    email: 'admin@company.com',
    name: 'Admin User',
    role: 'admin',
    status: 'active',
    lastActive: new Date(),
  },
  {
    id: '2',
    email: 'hr@company.com',
    name: 'HR Manager',
    role: 'hr',
    status: 'active',
    lastActive: new Date(Date.now() - 3600000),
  },
  {
    id: '3',
    email: 'employee@company.com',
    name: 'Employee User',
    role: 'employee',
    status: 'active',
    lastActive: new Date(Date.now() - 86400000),
  },
  {
    id: '4',
    email: 'newuser@company.com',
    name: 'New User',
    role: 'employee',
    status: 'pending',
    lastActive: new Date(),
  },
];

/* ---------------- STYLES ---------------- */

const roleStyles: Record<UserRole, string> = {
  admin: 'bg-role-admin/10 text-role-admin border-role-admin/20',
  hr: 'bg-role-hr/10 text-role-hr border-role-hr/20',
  employee: 'bg-muted text-muted-foreground border-border',
};

const statusStyles: Record<ManagedUser['status'], string> = {
  active: 'bg-success/10 text-success border-success/20',
  pending: 'bg-warning/10 text-warning border-warning/20',
  disabled: 'bg-muted text-muted-foreground border-border',
};

/* ---------------- COMPONENT ---------------- */

export default function AdminUsers() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<ManagedUser[]>(demoUsers);
  const [inviteOpen, setInviteOpen] = useState(false);

  /* ---------------- AUTH / ROLE GUARD ---------------- */

  useEffect(() => {
    const storedUser = localStorage.getItem('policyrag_user');

    if (!storedUser) {
      navigate('/auth');
      return;
    }

    const parsed: User = JSON.parse(storedUser);

    if (parsed.role !== 'admin') {
      navigate('/chat');
      return;
    }

    setUser(parsed);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('policyrag_user');
    navigate('/auth');
  };

  /* ---------------- INVITE USER ---------------- */

  const handleInviteUser = (invite: {
    email: string;
    name: string;
    role: UserRole;
  }) => {
    const newUser: ManagedUser = {
      id: crypto.randomUUID(),
      email: invite.email,
      name: invite.name,
      role: invite.role,
      status: 'pending',
      lastActive: new Date(),
    };

    setUsers((prev) => [newUser, ...prev]);

    toast({
      title: 'Invitation sent',
      description: `Invite sent to ${invite.email}`,
    });
  };

  if (!user) return null;

  /* ---------------- RENDER ---------------- */

  return (
    <AppLayout user={user} onLogout={handleLogout}>
      <InviteUserDialog
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onInvite={handleInviteUser}
      />

      <div className="flex flex-col h-full">
        <header className="px-6 py-4 border-b border-border bg-background">
          <h2 className="text-lg font-semibold">User Management</h2>
          <p className="text-sm text-muted-foreground">
            Manage user access and roles
          </p>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Users</h3>
                <p className="text-sm text-muted-foreground">
                  {users.filter((u) => u.status === 'active').length} active users
                </p>
              </div>

              <Button onClick={() => setInviteOpen(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Invite User
              </Button>
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="w-[100px]">
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>
                        <p className="font-medium">{u.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {u.email}
                        </p>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant="outline"
                          className={roleStyles[u.role]}
                        >
                          {u.role}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant="outline"
                          className={statusStyles[u.status]}
                        >
                          {u.status}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-muted-foreground">
                        {u.lastActive.toLocaleDateString()}
                      </TableCell>

                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuItem disabled>
                              Backend actions coming soon
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
