import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          created_at: string
          subscription_tier: 'free' | 'pro' | 'business'
          subscription_status: 'active' | 'canceled' | 'past_due'
        }
        Insert: {
          id: string
          email: string
          name: string
          created_at?: string
          subscription_tier?: 'free' | 'pro' | 'business'
          subscription_status?: 'active' | 'canceled' | 'past_due'
        }
        Update: {
          id?: string
          email?: string
          name?: string
          created_at?: string
          subscription_tier?: 'free' | 'pro' | 'business'
          subscription_status?: 'active' | 'canceled' | 'past_due'
        }
      }
      contacts: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string
          phone: string | null
          company: string | null
          tags: string[]
          created_at: string
          last_interaction: string | null
          total_interactions: number
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email: string
          phone?: string | null
          company?: string | null
          tags?: string[]
          created_at?: string
          last_interaction?: string | null
          total_interactions?: number
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string
          phone?: string | null
          company?: string | null
          tags?: string[]
          created_at?: string
          last_interaction?: string | null
          total_interactions?: number
        }
      }
      interactions: {
        Row: {
          id: string
          contact_id: string
          user_id: string
          type: 'call' | 'email' | 'meeting' | 'note'
          date_time: string
          notes: string
          follow_up_required: boolean
          created_at: string
        }
        Insert: {
          id?: string
          contact_id: string
          user_id: string
          type: 'call' | 'email' | 'meeting' | 'note'
          date_time: string
          notes: string
          follow_up_required?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          contact_id?: string
          user_id?: string
          type?: 'call' | 'email' | 'meeting' | 'note'
          date_time?: string
          notes?: string
          follow_up_required?: boolean
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          contact_id: string | null
          description: string
          due_date: string
          completed: boolean
          priority: 'low' | 'medium' | 'high'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          contact_id?: string | null
          description: string
          due_date: string
          completed?: boolean
          priority?: 'low' | 'medium' | 'high'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          contact_id?: string | null
          description?: string
          due_date?: string
          completed?: boolean
          priority?: 'low' | 'medium' | 'high'
          created_at?: string
        }
      }
    }
  }
}
