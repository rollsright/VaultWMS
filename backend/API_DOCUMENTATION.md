# WMS Backend API Documentation

## Authentication Endpoints

### Base URL
```
http://localhost:3000/api/auth
```

### 1. Email/Password Authentication

#### Sign Up
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    },
    "session": {
      "access_token": "jwt_token",
      "refresh_token": "refresh_token",
      "expires_at": 1234567890
    }
  },
  "message": "User created successfully. Please check your email for verification."
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    },
    "session": {
      "access_token": "jwt_token",
      "refresh_token": "refresh_token",
      "expires_at": 1234567890
    }
  },
  "message": "Login successful"
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### 2. OAuth Authentication

#### Initiate OAuth Flow
```http
POST /api/auth/oauth/{provider}
Content-Type: application/json

{
  "redirect_to": "http://localhost:3001/auth/callback" // optional
}
```

**Supported Providers:**
- `google`
- `microsoft`

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://accounts.google.com/oauth/authorize?..."
  },
  "message": "OAuth URL generated successfully"
}
```

#### OAuth Callback
```http
POST /api/auth/oauth/callback
Content-Type: application/json

{
  "code": "oauth_authorization_code",
  "provider": "google" // or "microsoft"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@gmail.com",
      "user_metadata": {
        "full_name": "John Doe",
        "avatar_url": "https://lh3.googleusercontent.com/...",
        "provider": "google"
      },
      "app_metadata": {
        "provider": "google",
        "providers": ["google"]
      }
    },
    "session": {
      "access_token": "jwt_token",
      "refresh_token": "refresh_token",
      "expires_at": 1234567890
    }
  },
  "message": "OAuth authentication successful"
}
```

### 3. Token Management

#### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refresh_token": "refresh_token_here"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com"
    },
    "session": {
      "access_token": "new_jwt_token",
      "refresh_token": "new_refresh_token",
      "expires_at": 1234567890
    }
  },
  "message": "Token refreshed successfully"
}
```

### 4. User Information

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  },
  "message": "User retrieved successfully"
}
```

#### Get User Profile
```http
GET /api/auth/profile
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "avatar_url": "https://example.com/avatar.jpg",
    "provider": "google",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  "message": "Profile retrieved successfully"
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message description"
}
```

**Common HTTP Status Codes:**
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/expired token)
- `404` - Not Found
- `500` - Internal Server Error

## Authentication Flow Examples

### Frontend Integration (React/TypeScript)

```typescript
// OAuth Login
const handleOAuthLogin = async (provider: 'google' | 'microsoft') => {
  try {
    const response = await fetch(`/api/auth/oauth/${provider}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        redirect_to: `${window.location.origin}/auth/callback` 
      })
    });
    
    const { data } = await response.json();
    if (data.success) {
      window.location.href = data.data.url;
    }
  } catch (error) {
    console.error('OAuth login failed:', error);
  }
};

// Email/Password Login
const handleEmailLogin = async (email: string, password: string) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const result = await response.json();
    if (result.success) {
      localStorage.setItem('access_token', result.data.session.access_token);
      localStorage.setItem('refresh_token', result.data.session.refresh_token);
      // Redirect to dashboard
    }
  } catch (error) {
    console.error('Login failed:', error);
  }
};

// Authenticated Request
const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('access_token');
  
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    }
  });
};
```

### cURL Examples

```bash
# Sign up
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'

# Get OAuth URL
curl -X POST http://localhost:3000/api/auth/oauth/google \
  -H "Content-Type: application/json" \
  -d '{"redirect_to": "http://localhost:3001/auth/callback"}'

# Get current user
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Refresh token
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refresh_token": "YOUR_REFRESH_TOKEN"}'
```

## Security Notes

1. **Always use HTTPS** in production
2. **Store tokens securely** (httpOnly cookies recommended)
3. **Implement token refresh** logic in your frontend
4. **Validate all inputs** on both client and server
5. **Use environment variables** for sensitive configuration
6. **Enable CORS** properly for your frontend domain
7. **Monitor authentication logs** for suspicious activity

## Next Steps

After implementing authentication:
1. Add role-based access control (RBAC)
2. Implement tenant management
3. Add user profile management
4. Set up audit logging
5. Add rate limiting
6. Implement password reset functionality
