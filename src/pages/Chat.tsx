import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';
import { PolicySelector } from '@/components/chat/PolicySelector';
import { ChatMessage as ChatMessageType, PolicyScope, User } from '@/types/policy';

// Demo responses with citations
const demoResponses: Record<string, ChatMessageType> = {
  default: {
    id: '',
    role: 'assistant',
    content: 'Based on our company policies, I can help you with questions about HR, IT, Finance, and Security policies. Please ask a specific question about any policy area.',
    timestamp: new Date(),
    confidence: 'high',
    citations: [],
    feedback: null,
  },
  pto: {
    id: '',
    role: 'assistant',
    content: 'According to our PTO policy, full-time employees receive 20 days of paid time off per year, accrued monthly at 1.67 days per month. PTO requests should be submitted at least 2 weeks in advance for approval by your direct manager. Unused PTO can be carried over up to a maximum of 5 days into the following year.',
    timestamp: new Date(),
    confidence: 'high',
    citations: [
      {
        id: '1',
        policyName: 'Employee Time Off Policy',
        section: '3.2',
        version: '2.1',
        excerpt: 'Full-time employees are entitled to twenty (20) days of paid time off per calendar year. PTO accrues at a rate of 1.67 days per month of active employment.',
        documentUrl: '#',
      },
      {
        id: '2',
        policyName: 'Employee Time Off Policy',
        section: '4.1',
        version: '2.1',
        excerpt: 'PTO requests must be submitted through the HR system at least fourteen (14) calendar days prior to the requested start date. Manager approval is required for all PTO requests.',
        documentUrl: '#',
      },
    ],
    feedback: null,
  },
  password: {
    id: '',
    role: 'assistant',
    content: 'Our password policy requires passwords to be at least 12 characters long, containing uppercase, lowercase, numbers, and special characters. Passwords must be changed every 90 days and cannot be reused within the last 12 password cycles. Multi-factor authentication is mandatory for all systems containing sensitive data.',
    timestamp: new Date(),
    confidence: 'high',
    citations: [
      {
        id: '3',
        policyName: 'Information Security Policy',
        section: '5.3.1',
        version: '3.0',
        excerpt: 'All user passwords must meet the following complexity requirements: minimum 12 characters, at least one uppercase letter, one lowercase letter, one numeric digit, and one special character.',
        documentUrl: '#',
      },
    ],
    feedback: null,
  },
  expense: {
    id: '',
    role: 'assistant',
    content: 'Expense reports must be submitted within 30 days of incurring the expense. Receipts are required for any expense over $25. Manager approval is required for expenses under $500, while expenses over $500 require VP approval. Travel expenses should be pre-approved when possible.',
    timestamp: new Date(),
    confidence: 'medium',
    citations: [
      {
        id: '4',
        policyName: 'Travel and Expense Policy',
        section: '2.4',
        version: '1.8',
        excerpt: 'All expense reports must be submitted within thirty (30) days of the date the expense was incurred. Original receipts or digital copies must be attached for any individual expense exceeding $25.',
        documentUrl: '#',
      },
    ],
    feedback: null,
  },
};

export default function Chat() {
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [selectedScope, setSelectedScope] = useState<PolicyScope | 'all'>('all');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('policyrag_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/auth');
    }
  }, [navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLogout = () => {
    localStorage.removeItem('policyrag_user');
    navigate('/auth');
  };

  const handleSubmit = async (content: string) => {
    const userMessage: ChatMessageType = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
      scope: selectedScope === 'all' ? undefined : selectedScope,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Demo: Match keywords to responses
    const lowerContent = content.toLowerCase();
    let response: ChatMessageType;

    if (lowerContent.includes('pto') || lowerContent.includes('vacation') || lowerContent.includes('time off')) {
      response = { ...demoResponses.pto };
    } else if (lowerContent.includes('password') || lowerContent.includes('security') || lowerContent.includes('mfa')) {
      response = { ...demoResponses.password };
    } else if (lowerContent.includes('expense') || lowerContent.includes('travel') || lowerContent.includes('receipt')) {
      response = { ...demoResponses.expense };
    } else {
      response = { ...demoResponses.default };
    }

    response.id = crypto.randomUUID();
    response.timestamp = new Date();

    setMessages((prev) => [...prev, response]);
    setIsLoading(false);
  };

  const handleFeedback = (messageId: string, feedback: 'helpful' | 'incorrect') => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, feedback: msg.feedback === feedback ? null : feedback } : msg
      )
    );
  };

  if (!user) {
    return null;
  }

  return (
    <AppLayout userRole={user.role} userName={user.name} onLogout={handleLogout}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-background">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Policy Assistant</h2>
            <p className="text-sm text-muted-foreground">Ask questions about company policies</p>
          </div>
          <PolicySelector value={selectedScope} onChange={setSelectedScope} />
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto py-6 px-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Ask a question about company policies to get started.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Try: "What is the PTO policy?" or "How do I submit expenses?"
                </p>
              </div>
            )}
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} onFeedback={handleFeedback} />
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground p-4">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm">Searching policies...</span>
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
