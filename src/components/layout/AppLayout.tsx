import { ReactNode, useEffect, useState } from 'react';
import { Sidebar } from './Sidebar';
import { User } from '@/types/policy';
import { cn } from '@/lib/utils';
import { UserProfileDrawer } from '@/components/profile/UserProfileDrawer';
import { chatService } from '@/services/chatService';

interface AppLayoutProps {
  children: ReactNode;
  user: User;
  onLogout: () => void;
}

export function AppLayout({
  children,
  user,
  onLogout,
}: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  /* Restore sidebar state */
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved) setSidebarCollapsed(saved === 'true');
  }, []);

  /* Sync active chat globally */
  useEffect(() => {
    const updateActiveChat = (e?: Event) => {
      if (e && e instanceof CustomEvent) {
        setActiveChatId(e.detail);
      } else {
        setActiveChatId(chatService.getActiveChat());
      }
    };

    updateActiveChat();

    window.addEventListener('active-chat-changed', updateActiveChat);
    return () => {
      window.removeEventListener('active-chat-changed', updateActiveChat);
    };
  }, []);

  const handleToggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      localStorage.setItem('sidebar-collapsed', String(!prev));
      return !prev;
    });
  };

  const handleClearAllChats = () => {
    localStorage.removeItem('policyrag_chat_sessions');
    localStorage.removeItem('policyrag_chat_messages');
    window.location.reload();
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        userRole={user.role}
        userName={user.name}
        onLogout={onLogout}
        collapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
        onOpenProfile={() => setProfileOpen(true)}
      />

      <UserProfileDrawer
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        user={user}
        onLogout={onLogout}
        onClearAllChats={handleClearAllChats}
        activeChatId={activeChatId}
      />

      <main
        className={cn(
          'flex-1 flex flex-col overflow-hidden transition-[margin] duration-300'
        )}
      >
        {children}
      </main>
    </div>
  );
}
