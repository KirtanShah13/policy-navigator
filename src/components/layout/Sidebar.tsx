import { useState } from 'react';
import { MessageSquare, FileText, Settings, LogOut, Users, Plus, History, ChevronRight } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { UserRole } from '@/types/policy';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { ChatHistoryItem, ChatSession } from '@/components/chat/ChatHistoryItem';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SidebarProps {
  userRole: UserRole;
  userName: string;
  onLogout: () => void;
}

// Mock chat history data - in production this would come from API
const mockChatHistory: ChatSession[] = [
  { id: '1', title: 'PTO policy questions', timestamp: new Date(), messageCount: 4 },
  { id: '2', title: 'Password requirements', timestamp: new Date(Date.now() - 86400000), messageCount: 6 },
  { id: '3', title: 'Expense report help', timestamp: new Date(Date.now() - 172800000), messageCount: 3 },
  { id: '4', title: 'Remote work guidelines', timestamp: new Date(Date.now() - 432000000), messageCount: 8 },
  { id: '5', title: 'Benefits enrollment', timestamp: new Date(Date.now() - 604800000), messageCount: 5 },
];

export function Sidebar({ userRole, userName, onLogout }: SidebarProps) {
  const isAdmin = userRole === 'admin';
  const isHRorAdmin = userRole === 'hr' || userRole === 'admin';
  const [chatHistory, setChatHistory] = useState<ChatSession[]>(mockChatHistory);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(true);

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

  const handleDeleteChat = (id: string) => {
    setChatHistory((prev) => prev.filter((chat) => chat.id !== id));
    if (activeChatId === id) setActiveChatId(null);
  };

  const handleNewChat = () => {
    setActiveChatId(null);
  };

  const toggleHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHistoryOpen(!historyOpen);
  };

  return (
    <aside className="w-72 bg-sidebar border-r border-sidebar-border flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              PolicyRAG
            </h1>
            <p className="text-2xs text-muted-foreground">Enterprise Policy Assistant</p>
          </div>
          <ThemeSwitcher />
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-3 border-b border-sidebar-border">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2 bg-gradient-to-r from-primary/10 to-transparent border-primary/30 hover:border-primary/50 hover:bg-primary/20 transition-all"
          onClick={handleNewChat}
        >
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      {/* Chat History Section */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <button
          type="button"
          onClick={toggleHistory}
          className="flex items-center justify-between px-4 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50 transition-colors w-full text-left"
        >
          <div className="flex items-center gap-2">
            <History className="h-3.5 w-3.5" />
            <span>Chat History</span>
            <span className="text-2xs bg-muted px-1.5 py-0.5 rounded-full">{chatHistory.length}</span>
          </div>
          <ChevronRight className={cn(
            "h-3.5 w-3.5 transition-transform duration-200",
            historyOpen && "rotate-90"
          )} />
        </button>
        
        <div className={cn(
          "overflow-hidden transition-all duration-200",
          historyOpen ? "flex-1" : "h-0"
        )}>
          <ScrollArea className="h-full px-2">
            <div className="space-y-1 py-1 pr-2">
              {chatHistory.length === 0 ? (
                <p className="text-2xs text-muted-foreground px-3 py-4 text-center">
                  No chat history yet
                </p>
              ) : (
                chatHistory.map((session) => (
                  <ChatHistoryItem
                    key={session.id}
                    session={session}
                    isActive={activeChatId === session.id}
                    onClick={() => setActiveChatId(session.id)}
                    onDelete={() => handleDeleteChat(session.id)}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1 border-t border-sidebar-border" aria-label="Main navigation">
        <p className="px-3 py-1 text-2xs font-medium text-muted-foreground uppercase tracking-wider">Navigation</p>
        <NavLink
          to="/chat"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-all"
          activeClassName="bg-gradient-to-r from-primary/20 to-transparent text-primary font-medium shadow-sm"
        >
          <MessageSquare className="h-4 w-4" aria-hidden="true" />
          Policy Chat
        </NavLink>

        {isHRorAdmin && (
          <NavLink
            to="/admin/policies"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-all"
            activeClassName="bg-gradient-to-r from-primary/20 to-transparent text-primary font-medium shadow-sm"
          >
            <FileText className="h-4 w-4" aria-hidden="true" />
            Manage Policies
          </NavLink>
        )}

        {isAdmin && (
          <NavLink
            to="/admin/users"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-all"
            activeClassName="bg-gradient-to-r from-primary/20 to-transparent text-primary font-medium shadow-sm"
          >
            <Users className="h-4 w-4" aria-hidden="true" />
            User Management
          </NavLink>
        )}

        {isAdmin && (
          <NavLink
            to="/admin/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-all"
            activeClassName="bg-gradient-to-r from-primary/20 to-transparent text-primary font-medium shadow-sm"
          >
            <Settings className="h-4 w-4" aria-hidden="true" />
            Settings
          </NavLink>
        )}
      </nav>

      {/* User Info */}
      <div className="p-3 border-t border-sidebar-border bg-gradient-to-t from-sidebar-accent/50 to-transparent">
        <div className="px-3 py-2 mb-2 rounded-lg bg-card/50 backdrop-blur-sm">
          <p className="text-sm font-medium text-sidebar-foreground truncate">{userName}</p>
          <span className={cn(
            "inline-flex items-center mt-1.5 px-2 py-0.5 text-2xs font-medium rounded-full",
            roleColors[userRole]
          )}>
            {roleLabels[userRole]}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
        >
          <LogOut className="h-4 w-4 mr-2" aria-hidden="true" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
