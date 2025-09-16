import { Router, Request, Response } from 'express';
import { supabase, supabaseAdmin } from '../config/supabase';
import { 
  LoginRequest, 
  SignupRequest, 
  OAuthRequest, 
  OAuthCallbackRequest,
  RefreshTokenRequest,
  ApiResponse, 
  AuthResponse 
} from '../types';
import { OAuthService } from '../utils/oauth';

const router = Router();

// Helper function to get default tenant (must exist)
async function getDefaultTenant() {
  try {
    console.log('🔍 Getting default tenant...');
    
    const { data: existingTenant, error: selectError } = await supabaseAdmin
      .from('tenants')
      .select('id')
      .eq('slug', 'default')
      .single();

    if (selectError || !existingTenant) {
      console.error('❌ Default tenant not found:', selectError);
      throw new Error('Default tenant not found. Please create it manually in Supabase with slug "default"');
    }

    console.log('✅ Found default tenant:', existingTenant.id);
    return existingTenant.id;
  } catch (error) {
    console.error('❌ Error getting default tenant:', error);
    throw error;
  }
}

// Sign up route
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, password, first_name, last_name }: SignupRequest = req.body;

    // Validate input
    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, first name, and last name are required'
      } as ApiResponse);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      } as ApiResponse);
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long'
      } as ApiResponse);
    }

    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name,
          last_name,
          full_name: `${first_name} ${last_name}`
        }
      }
    });

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message
      } as ApiResponse);
    }

    // If user was created successfully, create corresponding record in public.users table
    if (data.user) {
      try {
        // Get default tenant (must exist)
        const tenantId = await getDefaultTenant();

        // Create user record in public.users table
        const now = new Date().toISOString();
        const { error: userInsertError } = await supabaseAdmin
          .from('users')
          .insert({
            id: crypto.randomUUID(),
            supabase_user_id: data.user.id,
            tenant_id: tenantId,
            email: email,
            first_name: first_name,
            last_name: last_name,
            role: 'operator', // default role
            is_active: true,
            created_at: now,
            updated_at: now
          });

        if (userInsertError) {
          console.error('Error creating user in public.users table:', userInsertError);
          // Note: We don't return an error here because the Supabase Auth user was already created
          // The user can still authenticate, but admin might need to manually create the public.users record
        }
      } catch (userCreationError) {
        console.error('Error in user creation process:', userCreationError);
        // Same as above - don't fail the signup since Auth user exists
      }
    }

    res.status(201).json({
      success: true,
      data: {
        user: data.user,
        session: data.session
      },
      message: 'User created successfully. Please check your email for verification.'
    } as ApiResponse<AuthResponse>);
    return;

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
    return;
  }
});

// Login route
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password }: LoginRequest = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      } as ApiResponse);
    }

    // Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({
        success: false,
        error: error.message
      } as ApiResponse);
    }
    console.log('Login successful', data.user, data.session);
    res.json({
      success: true,
      data: {
        user: data.user,
        session: data.session
      },
      message: 'Login successful'
    } as ApiResponse<AuthResponse>);
    return;

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
    return;
  }
});

// Logout route
router.post('/logout', async (req: Request, res: Response) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message
      } as ApiResponse);
    }

    res.json({
      success: true,
      message: 'Logout successful'
    } as ApiResponse);
    return;

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
    return;
  }
});

// Get current user route
router.get('/me', async (req: Request, res: Response) => {
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Auth session missing!'
      } as ApiResponse);
    }

    // Extract the token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error) {
      return res.status(401).json({
        success: false,
        error: error.message
      } as ApiResponse);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'No authenticated user'
      } as ApiResponse);
    }

    res.json({
      success: true,
      data: { user },
      message: 'User retrieved successfully'
    } as ApiResponse);
    return;

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
    return;
  }
});

// OAuth routes
// Initiate OAuth flow
router.post('/oauth/:provider', async (req: Request, res: Response) => {
  try {
    const { provider } = req.params;
    const { redirect_to } = req.body;

    if (!['google', 'azure'].includes(provider)) {
      res.status(400).json({
        success: false,
        error: 'Invalid OAuth provider. Supported providers: google, azure'
      } as ApiResponse);
      return;
    }

    const oauthUrl = await OAuthService.getOAuthUrl(
      provider as 'google' | 'azure',
      redirect_to
    );

    res.json({
      success: true,
      data: { url: oauthUrl },
      message: 'OAuth URL generated successfully'
    } as ApiResponse);
    return;

  } catch (error) {
    console.error('OAuth initiation error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'OAuth initiation failed'
    } as ApiResponse);
  }
});

// OAuth callback handler
router.post('/oauth/callback', async (req: Request, res: Response) => {
  try {
    const { code, provider } = req.body;

    if (!code || !provider) {
      res.status(400).json({
        success: false,
        error: 'Code and provider are required'
      } as ApiResponse);
      return;
    }

    if (!['google', 'azure'].includes(provider)) {
      res.status(400).json({
        success: false,
        error: 'Invalid OAuth provider'
      } as ApiResponse);
      return;
    }

    const authData = await OAuthService.handleOAuthCallback(
      code,
      provider as 'google' | 'azure'
    );

    res.json({
      success: true,
      data: {
        user: authData.user,
        session: authData.session
      },
      message: 'OAuth authentication successful'
    } as ApiResponse<AuthResponse>);
    return;

  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'OAuth callback failed'
    } as ApiResponse);
  }
});

// Refresh token route
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refresh_token }: RefreshTokenRequest = req.body;

    if (!refresh_token) {
      res.status(400).json({
        success: false,
        error: 'Refresh token is required'
      } as ApiResponse);
      return;
    }

    const authData = await OAuthService.refreshToken(refresh_token);

    res.json({
      success: true,
      data: {
        user: authData.user,
        session: authData.session
      },
      message: 'Token refreshed successfully'
    } as ApiResponse<AuthResponse>);
    return;

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Token refresh failed'
    } as ApiResponse);
  }
});

// Get user profile route
router.get('/profile', async (req: Request, res: Response) => {
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Auth session missing!'
      } as ApiResponse);
    }

    // Extract the token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        error: 'No authenticated user'
      } as ApiResponse);
    }

    const profile = {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name,
      avatar_url: user.user_metadata?.avatar_url,
      provider: user.app_metadata?.provider || 'email',
      created_at: user.created_at,
      updated_at: user.updated_at
    };

    res.json({
      success: true,
      data: profile,
      message: 'Profile retrieved successfully'
    } as ApiResponse);
    return;

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
    return;
  }
});

// Test endpoint to manually initiate OAuth (for debugging)
router.get('/test-oauth/:provider', async (req: Request, res: Response) => {
  try {
    const { provider } = req.params;
    
    if (!['google', 'azure'].includes(provider)) {
      return res.status(400).send('Invalid provider. Use "azure" or "google"');
    }

    const oauthUrl = await OAuthService.getOAuthUrl(
      provider as 'google' | 'azure',
      `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback`
    );

    // Redirect user to OAuth URL
    res.redirect(oauthUrl);
    return;
  } catch (error) {
    console.error('Test OAuth error:', error);
    res.status(500).send(`OAuth test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return;
  }
});

export default router;
