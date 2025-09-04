import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Contact, Interaction, Task, User, DashboardStats } from '../types'
import { contactsAPI, interactionsAPI, tasksAPI, userAPI, APIError } from '../services/api'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

interface CRMContextType {
  user: User | null;
  contacts: Contact[];
  interactions: Interaction[];
  tasks: Task[];
  stats: DashboardStats;
  loading: boolean;
  error: string | null;
  addContact: (contact: Omit<Contact, 'contactId' | 'createdAt' | 'userId' | 'totalInteractions'>) => Promise<void>;
  updateContact: (contactId: string, updates: Partial<Contact>) => Promise<void>;
  deleteContact: (contactId: string) => Promise<void>;
  addInteraction: (interaction: Omit<Interaction, 'interactionId' | 'createdAt' | 'userId'>) => Promise<void>;
  addTask: (task: Omit<Task, 'taskId' | 'createdAt' | 'userId'>) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export function CRMProvider({ children }: { children: ReactNode }) {
  const { user: authUser, isAuthenticated } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalContacts: 0,
    totalInteractions: 0,
    pendingTasks: 0,
    thisWeekInteractions: 0
  });

  // Load data when user is authenticated
  useEffect(() => {
    if (isAuthenticated && authUser) {
      refreshData();
    } else {
      // Clear data when user logs out
      setUser(null);
      setContacts([]);
      setInteractions([]);
      setTasks([]);
    }
  }, [isAuthenticated, authUser]);

  // Calculate stats whenever data changes
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

  const handleError = (error: unknown, action: string) => {
    const message = error instanceof APIError ? error.message : `Failed to ${action}`;
    setError(message);
    toast.error(message);
    console.error(`Error ${action}:`, error);
  };

  const refreshData = async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);

    try {
      const [userData, contactsData, interactionsData, tasksData] = await Promise.all([
        userAPI.getCurrentUser(),
        contactsAPI.getContacts(),
        interactionsAPI.getInteractions(),
        tasksAPI.getTasks()
      ]);

      setUser(userData);
      setContacts(contactsData);
      setInteractions(interactionsData);
      setTasks(tasksData);
    } catch (error) {
      handleError(error, 'load data');
    } finally {
      setLoading(false);
    }
  };

  const addContact = async (contactData: Omit<Contact, 'contactId' | 'createdAt' | 'userId' | 'totalInteractions'>) => {
    try {
      setError(null);
      const newContact = await contactsAPI.createContact(contactData);
      setContacts(prev => [newContact, ...prev]);
      toast.success('Contact added successfully');
    } catch (error) {
      handleError(error, 'add contact');
      throw error;
    }
  };

  const updateContact = async (contactId: string, updates: Partial<Contact>) => {
    try {
      setError(null);
      const updatedContact = await contactsAPI.updateContact(contactId, updates);
      setContacts(prev => prev.map(c => c.contactId === contactId ? updatedContact : c));
      toast.success('Contact updated successfully');
    } catch (error) {
      handleError(error, 'update contact');
      throw error;
    }
  };

  const deleteContact = async (contactId: string) => {
    try {
      setError(null);
      await contactsAPI.deleteContact(contactId);
      setContacts(prev => prev.filter(c => c.contactId !== contactId));
      setInteractions(prev => prev.filter(i => i.contactId !== contactId));
      setTasks(prev => prev.filter(t => t.contactId !== contactId));
      toast.success('Contact deleted successfully');
    } catch (error) {
      handleError(error, 'delete contact');
      throw error;
    }
  };

  const addInteraction = async (interactionData: Omit<Interaction, 'interactionId' | 'createdAt' | 'userId'>) => {
    try {
      setError(null);
      const newInteraction = await interactionsAPI.createInteraction(interactionData);
      setInteractions(prev => [newInteraction, ...prev]);
      
      // Update contact stats locally for immediate UI feedback
      setContacts(prev => prev.map(c => 
        c.contactId === interactionData.contactId 
          ? { 
              ...c, 
              lastInteraction: interactionData.dateTime,
              totalInteractions: c.totalInteractions + 1
            }
          : c
      ));
      
      toast.success('Interaction logged successfully');
    } catch (error) {
      handleError(error, 'add interaction');
      throw error;
    }
  };

  const addTask = async (taskData: Omit<Task, 'taskId' | 'createdAt' | 'userId'>) => {
    try {
      setError(null);
      const newTask = await tasksAPI.createTask(taskData);
      setTasks(prev => [newTask, ...prev]);
      toast.success('Task created successfully');
    } catch (error) {
      handleError(error, 'add task');
      throw error;
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      setError(null);
      const updatedTask = await tasksAPI.updateTask(taskId, updates);
      setTasks(prev => prev.map(t => t.taskId === taskId ? updatedTask : t));
      toast.success('Task updated successfully');
    } catch (error) {
      handleError(error, 'update task');
      throw error;
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      setError(null);
      await tasksAPI.deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.taskId !== taskId));
      toast.success('Task deleted successfully');
    } catch (error) {
      handleError(error, 'delete task');
      throw error;
    }
  };

  return (
    <CRMContext.Provider value={{
      user,
      contacts,
      interactions,
      tasks,
      stats,
      loading,
      error,
      addContact,
      updateContact,
      deleteContact,
      addInteraction,
      addTask,
      updateTask,
      deleteTask,
      refreshData
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
