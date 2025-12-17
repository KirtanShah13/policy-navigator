export type PolicyScope = 'hr' | 'it' | 'finance' | 'security';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export type UserRole = 'employee' | 'hr' | 'admin';

export interface PolicyCitation {
  id: string;
  policyName: string;
  section: string;
  version: string;
  pageNumber?: number;
  excerpt: string;
  documentUrl: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  citations?: PolicyCitation[];
  confidence?: ConfidenceLevel;
  scope?: PolicyScope;
  feedback?: 'helpful' | 'incorrect' | null;
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
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}
