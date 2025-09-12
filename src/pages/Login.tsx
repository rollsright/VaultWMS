import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import Button from '../components/ui/Button'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login, loginWithOutlook, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('Email is required')
      return
    }

    if (!password) {
      setError('Password is required')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    const success = await login(email, password)
    if (!success) {
      setError('Invalid email or password')
    }
  }

  const handleOutlookSignIn = async () => {
    setError('')
    const success = await loginWithOutlook()
    if (!success) {
      setError('Outlook sign-in failed. Please try again.')
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Logo Section */}
        <div className="login-header">
          <div className="login-logo">
            <div className="login-logo-icon">🎯</div>
            <div className="login-logo-content">
              <div className="login-logo-text">Rolls Right</div>
              <div className="login-logo-subtitle">Warehouse Management</div>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="login-content">
          <div className="login-title">Welcome back</div>
          <div className="login-subtitle">Sign in to your account to continue</div>

          <form className="login-form" onSubmit={handleSubmit}>
            {error && (
              <div className="login-error">
                <div className="error-icon">⚠️</div>
                <div className="error-message">{error}</div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="Enter your email"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="Enter your password"
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="login-button"
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="login-divider">
            <div className="divider-line"></div>
            <div className="divider-text">or</div>
            <div className="divider-line"></div>
          </div>

          {/* Outlook Sign In */}
          <Button
            type="button"
            variant="outline"
            className="outlook-button"
            disabled={isLoading}
            size="lg"
            onClick={handleOutlookSignIn}
          >
            <svg className="outlook-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M7 9a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" fill="#0078d4"/>
              <path d="M20.5 3h-17A1.5 1.5 0 0 0 2 4.5v15A1.5 1.5 0 0 0 3.5 21h17a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 20.5 3zm-.5 15H4V6h16v12z" fill="#0078d4"/>
            </svg>
            Sign in with Outlook
          </Button>

          {/* Demo Credentials */}
          <div className="demo-credentials">
            <div className="demo-title">Demo Credentials</div>
            <div className="demo-info">
              <strong>Email:</strong> demo@example.com<br />
              <strong>Password:</strong> password123
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="login-footer">
          <div className="login-footer-text">
            Secure warehouse management system
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
