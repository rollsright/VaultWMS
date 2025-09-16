// Authentication related types
export interface User {
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
  // Add more user fields as needed
}

export interface AuthResponse {
  user: User | null;
  session: any | null;
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  // Add more signup fields as needed
}

export interface OAuthRequest {
  provider: 'google' | 'azure';
  redirect_to?: string;
}

export interface OAuthCallbackRequest {
  code: string;
  state?: string;
}

export interface AuthError {
  message: string;
  status?: number;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  provider: string;
  created_at: string;
  updated_at: string;
}
