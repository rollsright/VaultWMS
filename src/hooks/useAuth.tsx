import React, { createContext, useContext, useState, useEffect } from 'react'
import { authHelpers } from '../lib/supabase'
import type { Session, User as SupabaseUser } from '@supabase/supabase-js'

interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  loginWithOutlook: () => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [session, setSession] = useState<Session | null>(null)

  // Helper function to convert Supabase user to our User interface
  const convertSupabaseUser = (supabaseUser: SupabaseUser): User => {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: supabaseUser.user_metadata?.full_name || 
            supabaseUser.user_metadata?.name || 
            supabaseUser.email?.split('@')[0] || 
            'User',
      avatar_url: supabaseUser.user_metadata?.avatar_url,
    }
  }

  // Check for existing session on mount and listen for auth changes
  useEffect(() => {
    // Get initial session
    authHelpers.getSession().then(({ session, error }) => {
      if (error) {
        console.error('Error getting session:', error)
      } else if (session) {
        setSession(session)
        setUser(convertSupabaseUser(session.user))
      }
      setIsLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = authHelpers.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session)
      setSession(session)
      
      if (session) {
        setUser(convertSupabaseUser(session.user))
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    try {
      const { data, error } = await authHelpers.signInWithPassword(email, password)
      
      if (error) {
        console.error('Login error:', error)
        setIsLoading(false)
        return false
      }
      
      if (data.user && data.session) {
        setSession(data.session)
        setUser(convertSupabaseUser(data.user))
        setIsLoading(false)
        return true
      }
      
      setIsLoading(false)
      return false
    } catch (error) {
      console.error('Login error:', error)
      setIsLoading(false)
      return false
    }
  }

  const loginWithOutlook = async (): Promise<boolean> => {
    setIsLoading(true)
    
    try {
      const { data, error } = await authHelpers.signInWithOutlook()
      
      if (error) {
        console.error('Outlook login error:', error)
        setIsLoading(false)
        return false
      }
      
      // The OAuth flow will redirect to the provider, so we don't get immediate data back
      // The auth state change listener will handle the session when the user returns
      setIsLoading(false)
      return true
    } catch (error) {
      console.error('Outlook login error:', error)
      setIsLoading(false)
      return false
    }
  }

  const logout = async () => {
    setIsLoading(true)
    
    try {
      const { error } = await authHelpers.signOut()
      
      if (error) {
        console.error('Logout error:', error)
      }
      
      // Clear local state regardless of API success
      setUser(null)
      setSession(null)
      setIsLoading(false)
    } catch (error) {
      console.error('Logout error:', error)
      setUser(null)
      setSession(null)
      setIsLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    loginWithOutlook,
    logout,
    isLoading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
