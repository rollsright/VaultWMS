# Supabase Authentication Setup Guide

This guide will help you configure Supabase for both email/password and OAuth authentication (Google & Microsoft).

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `wms-backend` (or your preferred name)
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"

## 2. Get Project Credentials

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project.supabase.co`)
   - **anon public** key
   - **service_role** key (keep this secret!)

## 3. Configure Authentication Providers

### Email/Password Authentication
1. Go to **Authentication** → **Settings**
2. Under **Auth Providers**, ensure **Email** is enabled
3. Configure email templates if needed

### Google OAuth Setup

1. **Create Google OAuth App:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
   - Application type: **Web application**
   - Authorized redirect URIs: 
     ```
     https://your-project.supabase.co/auth/v1/callback
     ```

2. **Configure in Supabase:**
   - Go to **Authentication** → **Providers**
   - Enable **Google**
   - Enter your Google Client ID and Client Secret
   - Save configuration

### Microsoft OAuth Setup

1. **Create Microsoft App:**
   - Go to [Azure Portal](https://portal.azure.com/)
   - Navigate to **Azure Active Directory** → **App registrations**
   - Click **New registration**
   - Name: `WMS Backend`
   - Supported account types: **Accounts in any organizational directory and personal Microsoft accounts**
   - Redirect URI: **Web** → `https://your-project.supabase.co/auth/v1/callback`

2. **Get Client Credentials:**
   - Go to **Certificates & secrets** → **New client secret**
   - Copy the secret value
   - Go to **Overview** → Copy **Application (client) ID**

3. **Configure in Supabase:**
   - Go to **Authentication** → **Providers**
   - Enable **Microsoft**
   - Enter your Microsoft Client ID and Client Secret
   - Save configuration

## 4. Environment Configuration

Create a `.env` file in your project root:

```env
# Server Configuration
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3001

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# OAuth Configuration (Optional - for custom OAuth handling)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
MICROSOFT_CLIENT_ID=your_microsoft_client_id
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
```

## 5. Database Schema (Optional)

If you need custom user profiles, create a `profiles` table:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 6. Testing Authentication

### Test Email/Password Authentication

```bash
# Sign up
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

### Test OAuth Authentication

```bash
# Get Google OAuth URL
curl -X POST http://localhost:3000/api/auth/oauth/google \
  -H "Content-Type: application/json" \
  -d '{"redirect_to": "http://localhost:3001/auth/callback"}'

# Get Microsoft OAuth URL
curl -X POST http://localhost:3000/api/auth/oauth/microsoft \
  -H "Content-Type: application/json" \
  -d '{"redirect_to": "http://localhost:3001/auth/callback"}'
```

## 7. Frontend Integration

### React Example

```typescript
// OAuth login
const handleGoogleLogin = async () => {
  const response = await fetch('/api/auth/oauth/google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ redirect_to: window.location.origin + '/auth/callback' })
  });
  
  const { data } = await response.json();
  window.location.href = data.url;
};

// Email/password login
const handleEmailLogin = async (email: string, password: string) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const { data } = await response.json();
  if (data.success) {
    localStorage.setItem('access_token', data.data.session.access_token);
    localStorage.setItem('refresh_token', data.data.session.refresh_token);
  }
};
```

## 8. Security Considerations

1. **Never expose service role key** in frontend code
2. **Use HTTPS** in production
3. **Set up proper CORS** origins
4. **Enable email confirmation** for production
5. **Use strong passwords** and consider password policies
6. **Monitor authentication logs** in Supabase dashboard

## 9. Troubleshooting

### Common Issues:

1. **"Invalid redirect URI"**: Check that your redirect URI matches exactly in OAuth provider settings
2. **"Client ID not found"**: Verify your OAuth app is properly configured
3. **"Email not confirmed"**: Check Supabase email settings and spam folder
4. **CORS errors**: Ensure your frontend URL is added to allowed origins

### Debug Steps:

1. Check Supabase logs in the dashboard
2. Verify environment variables are loaded correctly
3. Test with Postman or curl first
4. Check browser network tab for detailed error messages

## Next Steps

Once authentication is working:
1. Implement user profile management
2. Add role-based access control
3. Set up tenant management for multi-tenancy
4. Add audit logging
5. Implement rate limiting
