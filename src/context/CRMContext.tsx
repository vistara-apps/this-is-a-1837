import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Contact, Interaction, Task, User, DashboardStats } from '../types'
import { mockData } from '../data/mockData'

interface CRMContextType {
  user: User | null;
  contacts: Contact[];
  interactions: Interaction[];
  tasks: Task[];
  stats: DashboardStats;
  addContact: (contact: Omit<Contact, 'contactId' | 'createdAt'>) => void;
  updateContact: (contactId: string, updates: Partial<Contact>) => void;
  deleteContact: (contactId: string) => void;
  addInteraction: (interaction: Omit<Interaction, 'interactionId' | 'createdAt'>) => void;
  addTask: (task: Omit<Task, 'taskId' | 'createdAt'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export function CRMProvider({ children }: { children: ReactNode }) {
  const [user] = useState<User>(mockData.user);
  const [contacts, setContacts] = useState<Contact[]>(mockData.contacts);
  const [interactions, setInteractions] = useState<Interaction[]>(mockData.interactions);
  const [tasks, setTasks] = useState<Task[]>(mockData.tasks);
  const [stats, setStats] = useState<DashboardStats>({
    totalContacts: 0,
    totalInteractions: 0,
    pendingTasks: 0,
    thisWeekInteractions: 0
  });

  useEffect(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    setStats({
      totalContacts: contacts.length,
      totalInteractions: interactions.length,
      pendingTasks: tasks.filter(t => !t.completed).length,
      thisWeekInteractions: interactions.filter(i => i.dateTime >= weekAgo).length
    });
  }, [contacts, interactions, tasks]);

  const addContact = (contactData: Omit<Contact, 'contactId' | 'createdAt'>) => {
    const newContact: Contact = {
      ...contactData,
      contactId: `contact_${Date.now()}`,
      createdAt: new Date(),
      totalInteractions: 0
    };
    setContacts(prev => [...prev, newContact]);
  };

  const updateContact = (contactId: string, updates: Partial<Contact>) => {
    setContacts(prev => prev.map(c => c.contactId === contactId ? { ...c, ...updates } : c));
  };

  const deleteContact = (contactId: string) => {
    setContacts(prev => prev.filter(c => c.contactId !== contactId));
    setInteractions(prev => prev.filter(i => i.contactId !== contactId));
    setTasks(prev => prev.filter(t => t.contactId !== contactId));
  };

  const addInteraction = (interactionData: Omit<Interaction, 'interactionId' | 'createdAt'>) => {
    const newInteraction: Interaction = {
      ...interactionData,
      interactionId: `interaction_${Date.now()}`,
      createdAt: new Date()
    };
    setInteractions(prev => [...prev, newInteraction]);
    
    // Update contact's last interaction and total count
    updateContact(interactionData.contactId, {
      lastInteraction: interactionData.dateTime,
      totalInteractions: contacts.find(c => c.contactId === interactionData.contactId)?.totalInteractions + 1 || 1
    });
  };

  const addTask = (taskData: Omit<Task, 'taskId' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      taskId: `task_${Date.now()}`,
      createdAt: new Date()
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.taskId === taskId ? { ...t, ...updates } : t));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.taskId !== taskId));
  };

  return (
    <CRMContext.Provider value={{
      user,
      contacts,
      interactions,
      tasks,
      stats,
      addContact,
      updateContact,
      deleteContact,
      addInteraction,
      addTask,
      updateTask,
      deleteTask
    }}>
      {children}
    </CRMContext.Provider>
  );
}

export function useCRM() {
  const context = useContext(CRMContext);
  if (context === undefined) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
}