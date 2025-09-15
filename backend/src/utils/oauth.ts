import { supabase } from '../config/supabase';

export class OAuthService {
  /**
   * Generate OAuth URL for the specified provider
   */
  static async getOAuthUrl(provider: 'google' | 'azure', redirectTo?: string): Promise<string> {
    // Configure scopes and query params based on provider
    let options: any = {
      redirectTo: redirectTo || `${process.env.FRONTEND_URL || 'https://vault-wms-frontend.vercel.app'}/auth/callback`,
    };

    if (provider === 'azure') {
      // For Microsoft/Azure, use Microsoft Graph API scopes
      // Include email scope explicitly to ensure email claim is requested
      options.scopes = 'openid profile email User.Read';
      options.queryParams = {
        tenant: 'common', // Allow both personal and work/school accounts
        prompt: 'consent',
      };
    } else if (provider === 'google') {
      options.scopes = 'openid profile email';
      options.queryParams = {
        access_type: 'offline',
        prompt: 'consent',
      };
    }

    console.log('OAuth URL generation:', { provider, options });
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options,
    });

    if (error) {
      console.error('OAuth URL generation error:', error);
      throw new Error(`Failed to generate OAuth URL: ${error.message}`);
    }

    console.log('Generated OAuth URL:', data.url);
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
