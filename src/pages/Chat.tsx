import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';
import { PolicySelector } from '@/components/chat/PolicySelector';
import {
  ChatMessage as ChatMessageType,
  PolicyScope,
  User,
  FeedbackType,
} from '@/types/policy';
import { chatService } from '@/services/chatService';
import { chatMessageService } from '@/services/chatMessageService';

/* ---------------- DEMO RESPONSE TEMPLATES ---------------- */

const demoResponses: Record<
  string,
  Omit<ChatMessageType, 'id' | 'timestamp' | 'scope'>
> = {
  default: {
    role: 'assistant',
    content:
      'Based on our company policies, I can help you with questions about HR, IT, Finance, and Security policies.',
    confidence: 'high',
    citations: [],
    feedback: null,
  },
  pto: {
    role: 'assistant',
    content:
      'Full-time employees receive 20 days of paid time off per year, accrued monthly. PTO requests must be submitted at least 2 weeks in advance.',
    confidence: 'high',
    citations: [],
    feedback: null,
  },
  password: {
    role: 'assistant',
    content:
      'Passwords must be at least 12 characters long, changed every 90 days, and MFA is mandatory.',
    confidence: 'high',
    citations: [],
    feedback: null,
  },
  expense: {
    role: 'assistant',
    content:
      'Expense reports must be submitted within 30 days. Receipts are required for expenses over $25.',
    confidence: 'medium',
    citations: [],
    feedback: null,
  },
};

/* ---------------- COMPONENT ---------------- */

export default function Chat() {
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [selectedScope, setSelectedScope] = useState<PolicyScope | 'all'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  /* ---------------- AUTH ---------------- */

  useEffect(() => {
    const storedUser = localStorage.getItem('policyrag_user');
    if (!storedUser) {
      navigate('/auth');
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  /* ---------------- LOAD ACTIVE CHAT & MESSAGES ---------------- */

  useEffect(() => {
    const loadChat = (chatId?: string) => {
      const id = chatId ?? chatService.getActiveChat();

      if (!id) {
        setActiveChatId(null);
        setMessages([]);
        return;
      }

      setActiveChatId(id);

      const storedMessages = chatMessageService
        .getMessages(id)
        .map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));

      setMessages(storedMessages);
    };

    // Initial load
    loadChat();

    // Listen for sidebar-triggered chat changes
    const handler = (e: Event) => {
      const chatId = (e as CustomEvent<string>).detail;
      loadChat(chatId);
    };

    window.addEventListener('active-chat-changed', handler);
    return () => {
      window.removeEventListener('active-chat-changed', handler);
    };
  }, []);

  /* ---------------- AUTO SCROLL ---------------- */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleLogout = () => {
    localStorage.removeItem('policyrag_user');
    navigate('/auth');
  };

  /* ---------------- SEND MESSAGE ---------------- */

  const handleSubmit = async (content: string) => {
    if (!activeChatId) return;

    const scope = selectedScope === 'all' ? undefined : selectedScope;

    const userMessage: ChatMessageType = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
      scope,
    };

    chatMessageService.appendMessage(activeChatId, userMessage);
    chatService.incrementMessageCount(activeChatId);

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 800));

    const lower = content.toLowerCase();
    let template = demoResponses.default;

    if (lower.includes('pto') || lower.includes('vacation')) {
      template = demoResponses.pto;
    } else if (lower.includes('password') || lower.includes('mfa')) {
      template = demoResponses.password;
    } else if (lower.includes('expense') || lower.includes('receipt')) {
      template = demoResponses.expense;
    }

    const assistantMessage: ChatMessageType = {
      ...template,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      scope,
    };

    chatMessageService.appendMessage(activeChatId, assistantMessage);
    chatService.incrementMessageCount(activeChatId);

    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  /* ---------------- FEEDBACK ---------------- */

  const handleFeedback = (messageId: string, feedback: FeedbackType) => {
    if (!activeChatId) return;

    const updated = messages.map((msg) =>
      msg.id === messageId
        ? { ...msg, feedback: msg.feedback === feedback ? null : feedback }
        : msg
    );

    setMessages(updated);
    chatMessageService.saveMessages(activeChatId, updated);
  };

  if (!user) return null;

  return (
    <AppLayout userRole={user.role} userName={user.name} onLogout={handleLogout}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-lg font-semibold">Policy Assistant</h2>
            <p className="text-sm text-muted-foreground">
              Ask questions about company policies
            </p>
          </div>
          <PolicySelector value={selectedScope} onChange={setSelectedScope} />
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto py-6 px-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                Try asking about PTO, passwords, or expenses
              </div>
            )}

            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                onFeedback={handleFeedback}
              />
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground p-4">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm">Searching policies…</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <ChatInput onSubmit={handleSubmit} disabled={isLoading} />
      </div>
    </AppLayout>
  );
}
