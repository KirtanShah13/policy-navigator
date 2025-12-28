import {
  MessageSquare,
  FileText,
  Settings,
  LogOut,
  Users,
  Plus,
  History,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink } from '@/components/NavLink';
import { UserRole, ChatSession } from '@/types/policy';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { ChatHistoryItem } from '@/components/chat/ChatHistoryItem';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { chatService } from '@/services/chatService';

interface SidebarProps {
  userRole: UserRole;
  userName: string;
  onLogout: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenProfile: () => void; // ✅ REQUIRED
}

export function Sidebar({
  userRole,
  userName,
  onLogout,
  collapsed,
  onToggleCollapse,
  onOpenProfile, // ✅ ACCEPTED
}: SidebarProps) {
  const isAdmin = userRole === 'admin';
  const isHRorAdmin = userRole === 'hr' || userRole === 'admin';

  const [historyOpen, setHistoryOpen] = useState(true);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);

  const refreshChats = () => {
    setChatHistory(chatService.getChats());
  };

  useEffect(() => {
    let chats = chatService.getChats();

    if (chats.length === 0) {
      const initialChat = chatService.createChat();
      chats = [initialChat];
    }

    const active = chatService.getActiveChat() ?? chats[0].id;
    setChatHistory(chats);
    setActiveChatId(active);

    window.dispatchEvent(
      new CustomEvent('active-chat-changed', { detail: active })
    );
  }, []);

  const pinnedChats = chatHistory.filter((c) => c.isPinned);
  const recentChats = chatHistory.filter((c) => !c.isPinned);

  const roleLabels: Record<UserRole, string> = {
    admin: 'Administrator',
    hr: 'HR Manager',
    employee: 'Employee',
  };

  const roleColors: Record<UserRole, string> = {
    admin: 'bg-role-admin/15 text-role-admin border border-role-admin/30',
    hr: 'bg-role-hr/15 text-role-hr border border-role-hr/30',
    employee: 'bg-muted text-muted-foreground border border-border',
  };

  const activateChat = (chatId: string) => {
    setActiveChatId(chatId);
    chatService.setActiveChat(chatId);

    window.dispatchEvent(
      new CustomEvent('active-chat-changed', { detail: chatId })
    );
  };

  const handleNewChat = () => {
    const newChat = chatService.createChat();
    refreshChats();
    activateChat(newChat.id);
  };

  const handleDeleteChat = (chatId: string) => {
    chatService.deleteChat(chatId);
    const updated = chatService.getChats();
    setChatHistory(updated);

    if (updated.length > 0) {
      activateChat(updated[0].id);
    } else {
      setActiveChatId(null);
    }
  };

  return (
    <aside
      className={cn(
        'h-screen flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300',
        collapsed ? 'w-16' : 'w-72'
      )}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between p-3 border-b border-sidebar-border">
        {!collapsed && (
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              PolicyRAG
            </h1>
            <p className="text-2xs text-muted-foreground">
              Enterprise Policy Assistant
            </p>
          </div>
        )}

        <div className="flex items-center gap-2">
          {!collapsed && <ThemeSwitcher />}
          <Button variant="ghost" size="icon" onClick={onToggleCollapse}>
            {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
          </Button>
        </div>
      </div>

      {/* NEW CHAT */}
      <div className="p-3 border-b border-sidebar-border">
        <Button
          variant="outline"
          size="sm"
          onClick={handleNewChat}
          className={cn(
            'w-full gap-2',
            collapsed ? 'justify-center px-0' : 'justify-start'
          )}
        >
          <Plus className="h-4 w-4" />
          {!collapsed && 'New Chat'}
        </Button>
      </div>

      {/* CHAT HISTORY */}
      {!collapsed && (
        <div className="flex-1 min-h-0">
          <button
            onClick={() => setHistoryOpen((v) => !v)}
            className="flex items-center justify-between w-full px-4 py-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <div className="flex items-center gap-2">
              <History size={14} />
              Chat History ({chatHistory.length})
            </div>
            <ChevronRight
              size={14}
              className={cn(historyOpen && 'rotate-90')}
            />
          </button>

          {historyOpen && (
            <ScrollArea className="h-full px-2">
              <div className="space-y-2 pb-2">
                {[...pinnedChats, ...recentChats].map((session) => (
                  <ChatHistoryItem
                    key={session.id}
                    session={session}
                    isActive={activeChatId === session.id}
                    onClick={() => activateChat(session.id)}
                    onDelete={() => handleDeleteChat(session.id)}
                    onTogglePin={() => {
                      chatService.togglePin(session.id);
                      refreshChats();
                    }}
                    onRename={(title) => {
                      chatService.renameChat(session.id, title);
                      refreshChats();
                    }}
                  />
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      )}

      {/* NAVIGATION */}
      <nav className="p-2 space-y-1 border-t border-sidebar-border">
        <SidebarLink
          to="/chat"
          icon={<MessageSquare size={18} />}
          label="Policy Chat"
          collapsed={collapsed}
        />

        {isHRorAdmin && (
          <SidebarLink
            to="/admin/policies"
            icon={<FileText size={18} />}
            label="Manage Policies"
            collapsed={collapsed}
          />
        )}

        {isAdmin && (
          <>
            <SidebarLink
              to="/admin/users"
              icon={<Users size={18} />}
              label="User Management"
              collapsed={collapsed}
            />
            <SidebarLink
              to="/admin/settings"
              icon={<Settings size={18} />}
              label="Settings"
              collapsed={collapsed}
            />
          </>
        )}
      </nav>

      {/* USER FOOTER */}
      <div className="p-3 border-t border-sidebar-border">
        {!collapsed && (
          <div
            onClick={onOpenProfile} // ✅ THIS WAS MISSING
            className="mb-2 px-3 py-2 rounded-lg bg-card/50 cursor-pointer hover:bg-card"
          >
            <p className="text-sm font-medium truncate">{userName}</p>
            <span
              className={cn(
                'mt-1 inline-flex px-2 py-0.5 text-2xs rounded-full',
                roleColors[userRole]
              )}
            >
              {roleLabels[userRole]}
            </span>
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          className={cn(
            'w-full',
            collapsed ? 'justify-center' : 'justify-start'
          )}
        >
          <LogOut size={16} />
          {!collapsed && <span className="ml-2">Sign out</span>}
        </Button>
      </div>
    </aside>
  );
}

function SidebarLink({
  to,
  icon,
  label,
  collapsed,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}) {
  return (
    <NavLink
      to={to}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-sidebar-accent"
      activeClassName="bg-gradient-to-r from-primary/20 to-transparent text-primary font-medium"
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </NavLink>
  );
}
