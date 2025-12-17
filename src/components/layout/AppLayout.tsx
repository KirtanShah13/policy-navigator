import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { UserRole } from '@/types/policy';

interface AppLayoutProps {
  children: ReactNode;
  userRole: UserRole;
  userName: string;
  onLogout: () => void;
}

export function AppLayout({ children, userRole, userName, onLogout }: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Sidebar userRole={userRole} userName={userName} onLogout={onLogout} />
      <main id="main-content" className="flex-1 flex flex-col overflow-hidden" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
