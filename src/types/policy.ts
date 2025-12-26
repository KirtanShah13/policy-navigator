export type PolicyScope = 'hr' | 'it' | 'finance' | 'security';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export type UserRole = 'employee' | 'hr' | 'admin';

export type FeedbackType =
  | 'helpful'
  | 'incorrect'
  | 'needs_clarification';

export interface PolicyCitation {
  id: string;
  policyName: string;
  section: string;
  version?: string;
  excerpt: string;
  documentUrl: string;

  effectiveFrom?: string;
  isCurrent?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date | string;

  citations?: PolicyCitation[];
  confidence?: ConfidenceLevel;
  scope?: PolicyScope;

  feedback?: FeedbackType | null;
}

export interface Policy {
  id: string;
  name: string;
  scope: PolicyScope;
  version: string;
  lastUpdated: Date;
  status: 'active' | 'draft' | 'archived';
  documentUrl: string;
  indexed: boolean;

  effectiveFrom?: string;
  isCurrent?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface ChatSession {
  id: string;
  title: string;
  timestamp: Date | string;
  messageCount: number;
  isPinned?: boolean;
  lastUpdated?: Date | string;
}
