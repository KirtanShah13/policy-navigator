import { ChatSession } from '@/types/policy';
import { chatMessageService } from '@/services/chatMessageService';

/**
 * LocalStorage keys
 */
const SESSIONS_KEY = 'policyrag_chat_sessions';
const ACTIVE_CHAT_KEY = 'policyrag_active_chat';

/* ───────────────────────── Helpers ───────────────────────── */

function loadSessions(): ChatSession[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    if (!raw) return [];

    const parsed: ChatSession[] = JSON.parse(raw);

    // Normalize date fields (important after refresh)
    return parsed.map((s) => ({
      ...s,
      timestamp: new Date(s.timestamp),
      lastUpdated: s.lastUpdated ? new Date(s.lastUpdated) : undefined,
    }));
  } catch {
    return [];
  }
}

function saveSessions(sessions: ChatSession[]) {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

function getActiveChatId(): string | null {
  return localStorage.getItem(ACTIVE_CHAT_KEY);
}

function setActiveChatId(chatId: string | null) {
  if (chatId) {
    localStorage.setItem(ACTIVE_CHAT_KEY, chatId);
  } else {
    localStorage.removeItem(ACTIVE_CHAT_KEY);
  }
}

/* ───────────────────────── Service ───────────────────────── */

export const chatService = {
  /**
   * Get all chat sessions
   * - pinned chats first
   * - then sorted by lastUpdated / timestamp (desc)
   */
  getChats(): ChatSession[] {
    const sessions = loadSessions();

    return sessions.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      const aTime = new Date(a.lastUpdated ?? a.timestamp).getTime();
      const bTime = new Date(b.lastUpdated ?? b.timestamp).getTime();

      return bTime - aTime;
    });
  },

  /**
   * Create a new chat session
   */
  createChat(): ChatSession {
    const newChat: ChatSession = {
      id: crypto.randomUUID(),
      title: 'New Chat',
      timestamp: new Date(),
      lastUpdated: new Date(),
      messageCount: 0,
      isPinned: false,
    };

    const sessions = loadSessions();
    const updated = [newChat, ...sessions];

    saveSessions(updated);
    setActiveChatId(newChat.id);

    return newChat;
  },

  /**
   * Delete a chat session AND its messages
   */
  deleteChat(chatId: string) {
    const sessions = loadSessions().filter((c) => c.id !== chatId);
    saveSessions(sessions);

    // 🔴 Critical: also delete messages for this chat
    chatMessageService.deleteMessages(chatId);

    const active = getActiveChatId();
    if (active === chatId) {
      setActiveChatId(sessions[0]?.id ?? null);
    }
  },

  /**
   * Rename a chat session
   */
  renameChat(chatId: string, title: string) {
    const sessions = loadSessions().map((c) =>
      c.id === chatId
        ? {
            ...c,
            title,
            lastUpdated: new Date(),
          }
        : c
    );

    saveSessions(sessions);
  },

    /**
   * Pin / unpin a chat session
   */
  togglePin(chatId: string) {
    const sessions = loadSessions().map((c) =>
      c.id === chatId
        ? {
            ...c,
            isPinned: !c.isPinned,
            lastUpdated: new Date(), // 🔥 REQUIRED
          }
        : c
    );

    saveSessions(sessions);
  },



  /**
   * Increment message count
   * (call once per user/assistant message)
   */
  incrementMessageCount(chatId: string) {
    const sessions = loadSessions().map((c) =>
      c.id === chatId
        ? {
            ...c,
            messageCount: c.messageCount + 1,
            lastUpdated: new Date(),
          }
        : c
    );

    saveSessions(sessions);
  },

  /**
   * Active chat helpers
   */
  getActiveChat(): string | null {
    return getActiveChatId();
  },

  setActiveChat(chatId: string) {
    setActiveChatId(chatId);
  },
};
