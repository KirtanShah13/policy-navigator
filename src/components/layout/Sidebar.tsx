import { MessageSquare, FileText, Settings, LogOut, Users } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { UserRole } from '@/types/policy';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  userRole: UserRole;
  userName: string;
  onLogout: () => void;
}

export function Sidebar({ userRole, userName, onLogout }: SidebarProps) {
  const isAdmin = userRole === 'admin';
  const isHRorAdmin = userRole === 'hr' || userRole === 'admin';

  const roleLabels: Record<UserRole, string> = {
    admin: 'Administrator',
    hr: 'HR Manager',
    employee: 'Employee',
  };

  const roleColors: Record<UserRole, string> = {
    admin: 'bg-role-admin/10 text-role-admin',
    hr: 'bg-role-hr/10 text-role-hr',
    employee: 'bg-muted text-muted-foreground',
  };

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-screen">
      <div className="p-4 border-b border-sidebar-border">
        <h1 className="text-lg font-semibold text-sidebar-foreground">PolicyRAG</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Enterprise Policy Assistant</p>
      </div>

      <nav className="flex-1 p-3 space-y-1" aria-label="Main navigation">
        <NavLink
          to="/chat"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent"
          activeClassName="bg-sidebar-accent font-medium"
        >
          <MessageSquare className="h-4 w-4" aria-hidden="true" />
          Policy Chat
        </NavLink>

        {isHRorAdmin && (
          <NavLink
            to="/admin/policies"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent"
            activeClassName="bg-sidebar-accent font-medium"
          >
            <FileText className="h-4 w-4" aria-hidden="true" />
            Manage Policies
          </NavLink>
        )}

        {isAdmin && (
          <NavLink
            to="/admin/users"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent"
            activeClassName="bg-sidebar-accent font-medium"
          >
            <Users className="h-4 w-4" aria-hidden="true" />
            User Management
          </NavLink>
        )}

        {isAdmin && (
          <NavLink
            to="/admin/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent"
            activeClassName="bg-sidebar-accent font-medium"
          >
            <Settings className="h-4 w-4" aria-hidden="true" />
            Settings
          </NavLink>
        )}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <div className="px-3 py-2 mb-2">
          <p className="text-sm font-medium text-sidebar-foreground truncate">{userName}</p>
          <span className={`inline-flex items-center mt-1 px-2 py-0.5 text-2xs font-medium rounded ${roleColors[userRole]}`}>
            {roleLabels[userRole]}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          className="w-full justify-start text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-4 w-4 mr-2" aria-hidden="true" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
