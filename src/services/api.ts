import { supabase } from '../lib/supabase'
import { Contact, Interaction, Task, User } from '../types'

export class APIError extends Error {
  constructor(message: string, public code?: string) {
    super(message)
    this.name = 'APIError'
  }
}

// User API
export const userAPI = {
  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      throw new APIError(`Failed to fetch user: ${error.message}`, error.code)
    }

    return {
      userId: data.id,
      name: data.name,
      email: data.email,
      createdAt: new Date(data.created_at)
    }
  },

  async updateUser(updates: Partial<Omit<User, 'userId' | 'createdAt'>>): Promise<User> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new APIError('User not authenticated')

    const { data, error } = await supabase
      .from('users')
      .update({
        name: updates.name,
        email: updates.email
      })
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      throw new APIError(`Failed to update user: ${error.message}`, error.code)
    }

    return {
      userId: data.id,
      name: data.name,
      email: data.email,
      createdAt: new Date(data.created_at)
    }
  }
}

// Contacts API
export const contactsAPI = {
  async getContacts(): Promise<Contact[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new APIError('User not authenticated')

    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      throw new APIError(`Failed to fetch contacts: ${error.message}`, error.code)
    }

    return data.map(contact => ({
      contactId: contact.id,
      userId: contact.user_id,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      company: contact.company,
      tags: contact.tags || [],
      createdAt: new Date(contact.created_at),
      lastInteraction: contact.last_interaction ? new Date(contact.last_interaction) : undefined,
      totalInteractions: contact.total_interactions
    }))
  },

  async createContact(contactData: Omit<Contact, 'contactId' | 'createdAt' | 'userId' | 'totalInteractions'>): Promise<Contact> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new APIError('User not authenticated')

    const { data, error } = await supabase
      .from('contacts')
      .insert({
        user_id: user.id,
        name: contactData.name,
        email: contactData.email,
        phone: contactData.phone,
        company: contactData.company,
        tags: contactData.tags
      })
      .select()
      .single()

    if (error) {
      throw new APIError(`Failed to create contact: ${error.message}`, error.code)
    }

    return {
      contactId: data.id,
      userId: data.user_id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      tags: data.tags || [],
      createdAt: new Date(data.created_at),
      lastInteraction: data.last_interaction ? new Date(data.last_interaction) : undefined,
      totalInteractions: data.total_interactions
    }
  },

  async updateContact(contactId: string, updates: Partial<Contact>): Promise<Contact> {
    const { data, error } = await supabase
      .from('contacts')
      .update({
        name: updates.name,
        email: updates.email,
        phone: updates.phone,
        company: updates.company,
        tags: updates.tags
      })
      .eq('id', contactId)
      .select()
      .single()

    if (error) {
      throw new APIError(`Failed to update contact: ${error.message}`, error.code)
    }

    return {
      contactId: data.id,
      userId: data.user_id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      tags: data.tags || [],
      createdAt: new Date(data.created_at),
      lastInteraction: data.last_interaction ? new Date(data.last_interaction) : undefined,
      totalInteractions: data.total_interactions
    }
  },

  async deleteContact(contactId: string): Promise<void> {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', contactId)

    if (error) {
      throw new APIError(`Failed to delete contact: ${error.message}`, error.code)
    }
  }
}

// Interactions API
export const interactionsAPI = {
  async getInteractions(): Promise<Interaction[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new APIError('User not authenticated')

    const { data, error } = await supabase
      .from('interactions')
      .select('*')
      .eq('user_id', user.id)
      .order('date_time', { ascending: false })

    if (error) {
      throw new APIError(`Failed to fetch interactions: ${error.message}`, error.code)
    }

    return data.map(interaction => ({
      interactionId: interaction.id,
      contactId: interaction.contact_id,
      userId: interaction.user_id,
      type: interaction.type as 'call' | 'email' | 'meeting' | 'note',
      dateTime: new Date(interaction.date_time),
      notes: interaction.notes,
      followUpRequired: interaction.follow_up_required,
      createdAt: new Date(interaction.created_at)
    }))
  },

  async createInteraction(interactionData: Omit<Interaction, 'interactionId' | 'createdAt' | 'userId'>): Promise<Interaction> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new APIError('User not authenticated')

    const { data, error } = await supabase
      .from('interactions')
      .insert({
        contact_id: interactionData.contactId,
        user_id: user.id,
        type: interactionData.type,
        date_time: interactionData.dateTime.toISOString(),
        notes: interactionData.notes,
        follow_up_required: interactionData.followUpRequired
      })
      .select()
      .single()

    if (error) {
      throw new APIError(`Failed to create interaction: ${error.message}`, error.code)
    }

    return {
      interactionId: data.id,
      contactId: data.contact_id,
      userId: data.user_id,
      type: data.type as 'call' | 'email' | 'meeting' | 'note',
      dateTime: new Date(data.date_time),
      notes: data.notes,
      followUpRequired: data.follow_up_required,
      createdAt: new Date(data.created_at)
    }
  }
}

// Tasks API
export const tasksAPI = {
  async getTasks(): Promise<Task[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new APIError('User not authenticated')

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('due_date', { ascending: true })

    if (error) {
      throw new APIError(`Failed to fetch tasks: ${error.message}`, error.code)
    }

    return data.map(task => ({
      taskId: task.id,
      userId: task.user_id,
      contactId: task.contact_id,
      description: task.description,
      dueDate: new Date(task.due_date),
      completed: task.completed,
      priority: task.priority as 'low' | 'medium' | 'high',
      createdAt: new Date(task.created_at)
    }))
  },

  async createTask(taskData: Omit<Task, 'taskId' | 'createdAt' | 'userId'>): Promise<Task> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new APIError('User not authenticated')

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        user_id: user.id,
        contact_id: taskData.contactId,
        description: taskData.description,
        due_date: taskData.dueDate.toISOString(),
        completed: taskData.completed,
        priority: taskData.priority
      })
      .select()
      .single()

    if (error) {
      throw new APIError(`Failed to create task: ${error.message}`, error.code)
    }

    return {
      taskId: data.id,
      userId: data.user_id,
      contactId: data.contact_id,
      description: data.description,
      dueDate: new Date(data.due_date),
      completed: data.completed,
      priority: data.priority as 'low' | 'medium' | 'high',
      createdAt: new Date(data.created_at)
    }
  },

  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .update({
        description: updates.description,
        due_date: updates.dueDate?.toISOString(),
        completed: updates.completed,
        priority: updates.priority
      })
      .eq('id', taskId)
      .select()
      .single()

    if (error) {
      throw new APIError(`Failed to update task: ${error.message}`, error.code)
    }

    return {
      taskId: data.id,
      userId: data.user_id,
      contactId: data.contact_id,
      description: data.description,
      dueDate: new Date(data.due_date),
      completed: data.completed,
      priority: data.priority as 'low' | 'medium' | 'high',
      createdAt: new Date(data.created_at)
    }
  },

  async deleteTask(taskId: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)

    if (error) {
      throw new APIError(`Failed to delete task: ${error.message}`, error.code)
    }
  }
}
