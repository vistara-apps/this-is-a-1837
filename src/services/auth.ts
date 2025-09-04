import { supabase } from '../lib/supabase'
import { User } from '../types'

export interface AuthUser {
  id: string
  email: string
  name?: string
}

export interface SignUpData {
  email: string
  password: string
  name: string
}

export interface SignInData {
  email: string
  password: string
}

export class AuthError extends Error {
  constructor(message: string, public code?: string) {
    super(message)
    this.name = 'AuthError'
  }
}

export const authService = {
  // Sign up new user
  async signUp({ email, password, name }: SignUpData): Promise<AuthUser> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name
        }
      }
    })

    if (error) {
      throw new AuthError(error.message, error.message)
    }

    if (!data.user) {
      throw new AuthError('Failed to create user account')
    }

    return {
      id: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata?.name || name
    }
  },

  // Sign in existing user
  async signIn({ email, password }: SignInData): Promise<AuthUser> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      throw new AuthError(error.message, error.message)
    }

    if (!data.user) {
      throw new AuthError('Failed to sign in')
    }

    return {
      id: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata?.name
    }
  },

  // Sign out current user
  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw new AuthError(error.message, error.message)
    }
  },

  // Get current session
  async getCurrentSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) {
      throw new AuthError(error.message, error.message)
    }
    return session
  },

  // Get current user
  async getCurrentUser(): Promise<AuthUser | null> {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) {
      throw new AuthError(error.message, error.message)
    }

    if (!user) return null

    return {
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.name
    }
  },

  // Reset password
  async resetPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })

    if (error) {
      throw new AuthError(error.message, error.message)
    }
  },

  // Update password
  async updatePassword(newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) {
      throw new AuthError(error.message, error.message)
    }
  },

  // Update user profile
  async updateProfile(updates: { name?: string; email?: string }): Promise<AuthUser> {
    const { data, error } = await supabase.auth.updateUser({
      email: updates.email,
      data: {
        name: updates.name
      }
    })

    if (error) {
      throw new AuthError(error.message, error.message)
    }

    if (!data.user) {
      throw new AuthError('Failed to update profile')
    }

    return {
      id: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata?.name
    }
  },

  // Listen to auth state changes
  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        callback({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name
        })
      } else {
        callback(null)
      }
    })
  }
}
