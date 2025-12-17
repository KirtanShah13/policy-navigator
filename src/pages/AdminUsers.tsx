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

interface ManagedUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: 'active' | 'pending' | 'disabled';
  lastActive: Date;
}

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

export default function AdminUsers() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [users] = useState<ManagedUser[]>(demoUsers);

  useEffect(() => {
    const storedUser = localStorage.getItem('policyrag_user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (parsed.role !== 'admin') {
        navigate('/chat');
        return;
      }
      setUser(parsed);
    } else {
      navigate('/auth');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('policyrag_user');
    navigate('/auth');
  };

  const handleInvite = () => {
    toast({
      title: 'Invite user',
      description: 'User invitation will be available when backend is connected.',
    });
  };

  if (!user) {
    return null;
  }

  return (
    <AppLayout userRole={user.role} userName={user.name} onLogout={handleLogout}>
      <div className="flex flex-col h-full">
        <header className="px-6 py-4 border-b border-border bg-background">
          <h2 className="text-lg font-semibold text-foreground">User Management</h2>
          <p className="text-sm text-muted-foreground">Manage user access and roles</p>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Users</h3>
                <p className="text-sm text-muted-foreground">
                  {users.filter((u) => u.status === 'active').length} active users
                </p>
              </div>
              <Button onClick={handleInvite}>
                <UserPlus className="h-4 w-4 mr-2" aria-hidden="true" />
                Invite User
              </Button>
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-medium">User</TableHead>
                    <TableHead className="font-medium">Role</TableHead>
                    <TableHead className="font-medium">Status</TableHead>
                    <TableHead className="font-medium">Last Active</TableHead>
                    <TableHead className="w-[100px]">
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((managedUser) => (
                    <TableRow key={managedUser.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{managedUser.name}</p>
                          <p className="text-sm text-muted-foreground">{managedUser.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={roleStyles[managedUser.role]}>
                          {managedUser.role.charAt(0).toUpperCase() + managedUser.role.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusStyles[managedUser.status]}>
                          {managedUser.status.charAt(0).toUpperCase() + managedUser.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {managedUser.lastActive.toLocaleDateString()}
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
                            <DropdownMenuItem>Edit Role</DropdownMenuItem>
                            <DropdownMenuItem>Reset Password</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Disable Account
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
