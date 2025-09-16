import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiClient } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { updateAuthState } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check if we have tokens in URL fragment (Supabase direct response)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const provider = searchParams.get('provider') as 'google' | 'azure';
        
        if (accessToken && refreshToken && provider) {
          // Direct token response from Supabase - store tokens and create session
          localStorage.setItem('access_token', accessToken);
          localStorage.setItem('refresh_token', refreshToken);
          
          // Get user profile using the access token
          const userResponse = await apiClient.getCurrentUser();
          if (userResponse.success && userResponse.data?.user) {
            updateAuthState(userResponse.data.user, {
              access_token: accessToken,
              refresh_token: refreshToken,
              user: userResponse.data.user
            });
            navigate('/', { replace: true });
            return;
          }
        }
        
        // Fallback to original code-based flow
        const code = searchParams.get('code');
        
        if (!code || !provider) {
          setError('Missing authorization code or provider. Please try again.');
          setLoading(false);
          return;
        }

        // Exchange the code for tokens via backend
        const response = await apiClient.handleOAuthCallback(code, provider);
        
        if (response.success && response.data) {
          // Update auth state with user and session data
          updateAuthState(response.data.user, response.data.session);
          // OAuth successful, redirect to dashboard
          navigate('/', { replace: true });
        } else {
          setError(response.error || 'Authentication failed. Please try again.');
          setLoading(false);
        }
      } catch (err) {
        console.error('Unexpected error during auth callback:', err);
        setError('An unexpected error occurred. Please try again.');
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams]);

  if (loading) {
    return (
      <div className="auth-callback-container">
        <div className="auth-callback-card">
          <div className="loading-spinner"></div>
          <h2>Completing sign in...</h2>
          <p>Please wait while we complete your authentication.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="auth-callback-container">
        <div className="auth-callback-card error">
          <div className="error-icon">⚠️</div>
          <h2>Authentication Error</h2>
          <p>{error}</p>
          <button 
            className="retry-button"
            onClick={() => navigate('/login')}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default AuthCallback;
