import { supabase } from '../config/supabase';

export class OAuthService {
  /**
   * Generate OAuth URL for the specified provider
   */
  static async getOAuthUrl(provider: 'google' | 'azure', redirectTo?: string): Promise<string> {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectTo || `${process.env.FRONTEND_URL || 'http://localhost:3001'}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      throw new Error(`Failed to generate OAuth URL: ${error.message}`);
    }

    return data.url;
  }

  /**
   * Handle OAuth callback and exchange code for session
   */
  static async handleOAuthCallback(code: string, provider: 'google' | 'azure') {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      throw new Error(`OAuth callback failed: ${error.message}`);
    }

    return data;
  }

  /**
   * Get user profile with provider information
   */
  static async getUserProfile(userId: string) {
    const { data, error } = await supabase.auth.admin.getUserById(userId);

    if (error) {
      throw new Error(`Failed to get user profile: ${error.message}`);
    }

    return data.user;
  }

  /**
   * Refresh access token
   */
  static async refreshToken(refreshToken: string) {
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error) {
      throw new Error(`Token refresh failed: ${error.message}`);
    }

    return data;
  }

  /**
   * Sign out user
   */
  static async signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(`Sign out failed: ${error.message}`);
    }
  }
}
