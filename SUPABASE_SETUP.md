# Supabase + Outlook OAuth Setup Guide

This guide will help you integrate the "Sign in with Outlook" feature with Supabase authentication.

## 1. Environment Variables Setup

Create a `.env` file in your project root with the following variables:

```env
# Supabase Configuration
# You can find these values in your Supabase project settings > API
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Example:
# VITE_SUPABASE_URL=https://your-project-ref.supabase.co
# VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 2. Supabase Project Configuration

### Step 1: Enable Azure/Outlook OAuth Provider

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Providers**
3. Find **Azure** and click **Enable**
4. Configure the following settings:

```
Provider: Azure
Enabled: Yes
Client ID: [Your Azure Application Client ID]
Client Secret: [Your Azure Application Client Secret]
Redirect URL: https://your-project-ref.supabase.co/auth/v1/callback
```

### Step 2: Azure App Registration

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** → **App registrations**
3. Click **New registration**
4. Configure:
   - **Name**: Your app name (e.g., "Rolls Right Warehouse")
   - **Supported account types**: Accounts in any organizational directory and personal Microsoft accounts
   - **Redirect URI**: `https://your-project-ref.supabase.co/auth/v1/callback`

5. After creation, note down:
   - **Application (client) ID** → Use as `Client ID` in Supabase
   - **Directory (tenant) ID**

6. Go to **Certificates & secrets** → **New client secret**
   - Note down the secret value → Use as `Client Secret` in Supabase

### Step 3: Configure API Permissions

1. In your Azure app, go to **API permissions**
2. Add the following Microsoft Graph permissions:
   - `openid` (Sign users in)
   - `profile` (View users' basic profile)
   - `email` (View users' email address)

3. Grant admin consent for your organization

## 3. Update Your Application URLs

Make sure your Supabase project is configured with the correct Site URL:

1. Go to **Authentication** → **Settings**
2. Set **Site URL** to your production domain (e.g., `https://yourdomain.com`)
3. Add your local development URL to **Additional Redirect URLs**:
   - `http://localhost:5173/auth/callback`
   - `http://localhost:3000/auth/callback` (if using different port)

## 4. Testing the Integration

1. Start your development server: `npm run dev`
2. Navigate to the login page
3. Click "Sign in with Outlook"
4. You should be redirected to Microsoft's OAuth flow
5. After authentication, you'll be redirected back to your app

## 5. Production Deployment

When deploying to production:

1. Update the **Site URL** in Supabase to your production domain
2. Update the **Redirect URI** in Azure App Registration to your production callback URL
3. Ensure your production environment has the correct environment variables

## 6. Troubleshooting

### Common Issues:

1. **"Invalid redirect URI"**
   - Ensure the redirect URI in Azure matches exactly with Supabase
   - Check that the Site URL in Supabase is correct

2. **"Application not found"**
   - Verify the Client ID is correct in Supabase
   - Ensure the Azure app is not deleted or disabled

3. **"Access denied"**
   - Check API permissions are properly configured in Azure
   - Ensure admin consent is granted

4. **Environment variables not loading**
   - Restart your development server after adding `.env` file
   - Ensure `.env` file is in the project root
   - Check that variables start with `VITE_` prefix

### Debug Mode:

You can enable debug logging by adding this to your `.env`:

```env
VITE_SUPABASE_DEBUG=true
```

## 7. File Structure

The integration adds these new files:

```
src/
├── lib/
│   └── supabase.ts          # Supabase client configuration
├── pages/
│   └── AuthCallback.tsx     # Handles OAuth callback
└── hooks/
    └── useAuth.tsx          # Updated with Supabase integration
```

## 8. Next Steps

- Set up row-level security (RLS) policies in Supabase
- Configure user roles and permissions
- Add additional OAuth providers if needed
- Implement user profile management
