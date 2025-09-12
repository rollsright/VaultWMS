import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiClient } from '../lib/api';

// Types
interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    provider?: string;
  };
  app_metadata?: {
    provider?: string;
    providers?: string[];
  };
}

interface AuthContextType {
  user: User | null;
  session: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  signInWithOAuth: (provider: 'google' | 'azure') => Promise<void>;
  updateAuthState: (user: User | null, session: any | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session from backend
    const getInitialSession = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await apiClient.getCurrentUser();
        if (response.success && response.data?.user) {
          setUser(response.data.user);
          // Create a mock session object for compatibility
          setSession({
            access_token: token,
            refresh_token: localStorage.getItem('refresh_token'),
            user: response.data.user
          });
        } else {
          // Token is invalid, clear it
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      } catch (error) {
        console.error('Error getting session:', error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
      setLoading(false);
    };

    getInitialSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    const response = await apiClient.login({ email, password });
    if (response.success && response.data) {
      setUser(response.data.user);
      setSession(response.data.session);
    }
    return { error: response.error };
  };

  const signUp = async (email: string, password: string) => {
    const response = await apiClient.signup({ email, password });
    if (response.success && response.data) {
      setUser(response.data.user);
      setSession(response.data.session);
    }
    return { error: response.error };
  };

  const signOut = async () => {
    await apiClient.logout();
    setUser(null);
    setSession(null);
  };

  const signInWithOAuth = async (provider: 'google' | 'azure') => {
    const response = await apiClient.initiateOAuth(provider, `${window.location.origin}/auth/callback`);
    if (response.success && response.data?.url) {
      // Redirect to the OAuth URL provided by the backend
      window.location.href = response.data.url;
    } else {
      console.error('OAuth error:', response.error);
    }
  };

  const updateAuthState = (user: User | null, session: any | null) => {
    setUser(user);
    setSession(session);
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithOAuth,
    updateAuthState,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

