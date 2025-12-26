import { ChatMessage } from '@/types/policy';

const STORAGE_KEY = 'policyrag_chat_messages';

/* ───────────── helpers ───────────── */

function loadAllMessages(): Record<string, ChatMessage[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAllMessages(data: Record<string, ChatMessage[]>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/* ───────────── service ───────────── */

export const chatMessageService = {
  /* Load messages for a specific chat */
  getMessages(chatId: string): ChatMessage[] {
    const all = loadAllMessages();
    return all[chatId] ?? [];
  },

  /* Save messages for a chat */
  saveMessages(chatId: string, messages: ChatMessage[]) {
    const all = loadAllMessages();
    all[chatId] = messages;
    saveAllMessages(all);
  },

  /* Append a single message */
  appendMessage(chatId: string, message: ChatMessage) {
    const all = loadAllMessages();
    const existing = all[chatId] ?? [];
    all[chatId] = [...existing, message];
    saveAllMessages(all);
  },

  /* Clear messages but keep chat */
  clearMessages(chatId: string) {
    const all = loadAllMessages();
    all[chatId] = [];
    saveAllMessages(all);
  },

  /* Remove all messages for a deleted chat */
  deleteMessages(chatId: string) {
    const all = loadAllMessages();
    delete all[chatId];
    saveAllMessages(all);
  },
};
