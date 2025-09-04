export interface User {
  userId: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface Contact {
  contactId: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  tags: string[];
  createdAt: Date;
  lastInteraction?: Date;
  totalInteractions: number;
}

export interface Interaction {
  interactionId: string;
  contactId: string;
  userId: string;
  type: 'call' | 'email' | 'meeting' | 'note';
  dateTime: Date;
  notes: string;
  followUpRequired: boolean;
  createdAt: Date;
}

export interface Task {
  taskId: string;
  userId: string;
  contactId?: string;
  description: string;
  dueDate: Date;
  completed: boolean;
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
}

export interface DashboardStats {
  totalContacts: number;
  totalInteractions: number;
  pendingTasks: number;
  thisWeekInteractions: number;
}