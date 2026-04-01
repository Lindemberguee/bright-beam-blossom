export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  avatar?: string;
  tags: string[];
  score: number;
  status: 'active' | 'inactive' | 'lead' | 'customer';
  source: string;
  assignedTo?: string;
  lastInteraction?: string;
  createdAt: string;
  notes?: string;
  customFields?: Record<string, string>;
}

export interface Conversation {
  id: string;
  contactId: string;
  contactName: string;
  contactAvatar?: string;
  contactPhone: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status: 'open' | 'pending' | 'resolved' | 'closed';
  channel: 'whatsapp' | 'webchat' | 'instagram' | 'email';
  assignedTo?: string;
  assignedName?: string;
  department?: string;
  tags: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isPinned?: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  content: string;
  type: 'text' | 'image' | 'audio' | 'document' | 'internal_note' | 'system';
  sender: 'contact' | 'agent' | 'bot' | 'system';
  senderName?: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read' | 'failed';
}

export interface KanbanCard {
  id: string;
  title: string;
  contactName: string;
  contactId?: string;
  value?: number;
  assignedTo?: string;
  assignedAvatar?: string;
  tags: string[];
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  createdAt: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  cards: KanbanCard[];
}

export interface Pipeline {
  id: string;
  name: string;
  columns: KanbanColumn[];
}

export interface Flow {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'draft' | 'paused';
  nodesCount: number;
  executionCount: number;
  successRate: number;
  updatedAt: string;
  createdAt: string;
  folder?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'manager' | 'operator' | 'analyst';
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  department?: string;
  activeChats: number;
  resolvedToday: number;
  avgResponseTime?: string;
}

export interface Campaign {
  id: string;
  name: string;
  status: 'draft' | 'scheduled' | 'running' | 'completed' | 'paused';
  type: 'mass' | 'segmented' | 'reactivation';
  targetCount: number;
  sentCount: number;
  deliveredCount: number;
  responseCount: number;
  failedCount: number;
  scheduledAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface Connection {
  id: string;
  name: string;
  type: 'whatsapp' | 'webchat' | 'api' | 'instagram' | 'messenger' | 'email';
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  phone?: string;
  lastSync?: string;
  assignedFlow?: string;
  queue?: string;
}

export interface Webhook {
  id: string;
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT';
  status: 'active' | 'inactive';
  lastCalled?: string;
  callCount: number;
  errorCount: number;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  module: string;
  user: string;
  details: string;
  timestamp: string;
  ip?: string;
}

export interface DashboardMetric {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: string;
}
