import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  name: string
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

  // Check for stored authentication on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Failed to parse stored user:', error)
        localStorage.removeItem('auth_user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Simple authentication logic - in a real app, this would call your API
    if (email && password.length >= 6) {
      const newUser: User = {
        id: '1',
        email: email,
        name: email.split('@')[0] || 'User'
      }
      
      setUser(newUser)
      localStorage.setItem('auth_user', JSON.stringify(newUser))
      setIsLoading(false)
      return true
    }
    
    setIsLoading(false)
    return false
  }

  const loginWithOutlook = async (): Promise<boolean> => {
    setIsLoading(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Simulate Outlook OAuth flow - in a real app, this would redirect to Microsoft OAuth
    // For demo purposes, we'll create a mock Outlook user
    try {
      const outlookUser: User = {
        id: 'outlook_' + Date.now(),
        email: 'user@outlook.com',
        name: 'Outlook User'
      }
      
      setUser(outlookUser)
      localStorage.setItem('auth_user', JSON.stringify(outlookUser))
      setIsLoading(false)
      return true
    } catch (error) {
      console.error('Outlook login failed:', error)
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('auth_user')
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
