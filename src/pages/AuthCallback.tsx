import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // The URL contains the auth tokens from the OAuth provider
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          navigate('/login?error=auth_callback_failed')
          return
        }

        if (data.session) {
          // User is authenticated, redirect to home
          navigate('/', { replace: true })
        } else {
          // No session found, redirect to login
          navigate('/login', { replace: true })
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        navigate('/login?error=auth_callback_failed')
      }
    }

    handleAuthCallback()
  }, [navigate])

  return (
    <div className="auth-callback-container">
      <div className="auth-callback-content">
        <div className="loading">
          <div className="spinner"></div>
          <div>Completing sign in...</div>
        </div>
      </div>
    </div>
  )
}

export default AuthCallback
