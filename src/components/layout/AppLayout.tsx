import { ReactNode, useEffect, useState } from 'react';
import { Sidebar } from './Sidebar';
import { UserRole } from '@/types/policy';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: ReactNode;
  userRole: UserRole;
  userName: string;
  onLogout: () => void;
}

export function AppLayout({
  children,
  userRole,
  userName,
  onLogout,
}: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  /* restore persisted state */
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved) setSidebarCollapsed(saved === 'true');
  }, []);

  const handleToggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      localStorage.setItem('sidebar-collapsed', String(!prev));
      return !prev;
    });
  };

  return (
    <div className="flex h-screen bg-background">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <Sidebar
        userRole={userRole}
        userName={userName}
        onLogout={onLogout}
        collapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
      />

      <main
        id="main-content"
        tabIndex={-1}
        className={cn(
          'flex-1 flex flex-col overflow-hidden transition-[margin] duration-300 ease-in-out'
        )}
      >
        {children}
      </main>
    </div>
  );
}
