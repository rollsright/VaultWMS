# Render Deployment Guide for VaultWMS Backend

This guide will help you deploy your VaultWMS backend from the monorepo to Render.

## Prerequisites

- GitHub repository connected to Render
- Environment variables configured (see below)

## Render Configuration

### Current Settings (Recommended)

Based on your current setup, here are the recommended settings for your Render deployment:

**Basic Settings:**
- **Name**: `VaultWMS` (or any name you prefer)
- **Language**: `Node`
- **Branch**: `main`
- **Region**: `Oregon (US West)` (or your preferred region)
- **Root Directory**: `backend` ✅ (Already set correctly)
- **Instance Type**: `Free` (for development) or `Starter` (for production)

**Build & Deploy Commands:**
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### Alternative Configuration Options

You can also use these alternative commands:

**Option 1 (Using render.yaml - Recommended):**
- **Build Command**: Leave empty (render.yaml will handle it)
- **Start Command**: Leave empty (render.yaml will handle it)

**Option 2 (Manual Configuration):**
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

## Environment Variables

You'll need to set up the following environment variables in Render:

### Required Environment Variables

1. **NODE_ENV**: `production`
2. **PORT**: `10000` (Render will override this automatically)
3. **SUPABASE_URL**: Your Supabase project URL
4. **SUPABASE_ANON_KEY**: Your Supabase anonymous key
5. **FRONTEND_URL**: Your frontend URL (e.g., `https://your-frontend.vercel.app`)

### Optional Environment Variables

- **SUPABASE_SERVICE_ROLE_KEY**: If you need elevated permissions
- Any other environment variables your app uses

### How to Add Environment Variables in Render

1. In your Render dashboard, go to your service
2. Click on "Environment" tab
3. Add each environment variable:
   - **Key**: `NODE_ENV`
   - **Value**: `production`
   - Click "Add Another" for each additional variable

## Deployment Steps

### Step 1: Configure Render Service

1. **Name**: Set to `VaultWMS` or your preferred name
2. **Root Directory**: `backend` (already set correctly)
3. **Build Command**: `npm install && npm run build`
4. **Start Command**: `npm start`
5. **Instance Type**: Choose based on your needs:
   - **Free**: For development/testing
   - **Starter ($7/month)**: For production with better performance

### Step 2: Set Environment Variables

Add all the required environment variables listed above.

### Step 3: Deploy

1. Click "Create Web Service"
2. Render will automatically:
   - Clone your repository
   - Navigate to the `backend` directory
   - Run `npm install`
   - Run `npm run build`
   - Start your application with `npm start`

### Step 4: Verify Deployment

1. Check the deployment logs for any errors
2. Visit your service URL (provided by Render)
3. Test the health endpoint: `https://your-service.onrender.com/health`
4. Test your API endpoints

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check that all dependencies are in `dependencies` (not `devDependencies`)
   - Ensure TypeScript compilation succeeds locally
   - Check the build logs in Render dashboard

2. **Runtime Errors**:
   - Verify all environment variables are set
   - Check the application logs in Render dashboard
   - Ensure your app listens on the correct port (Render sets `PORT` automatically)

3. **CORS Issues**:
   - Update `FRONTEND_URL` environment variable
   - Check your CORS configuration in `src/index.ts`

### Logs and Debugging

- **Build Logs**: Available in the Render dashboard under "Logs" tab
- **Runtime Logs**: Available in the Render dashboard under "Logs" tab
- **Health Check**: Your app has a `/health` endpoint for monitoring

## Production Considerations

### Performance

- **Free Tier**: Spins down after inactivity (cold starts)
- **Paid Tiers**: Always running, better performance
- **Database**: Consider using Render's managed PostgreSQL for production

### Security

- Never commit environment variables to your repository
- Use Render's environment variable system
- Ensure your CORS settings are production-ready

### Monitoring

- Use the `/health` endpoint for health checks
- Monitor logs regularly
- Set up alerts for service downtime

## Next Steps

1. Deploy your backend using the configuration above
2. Update your frontend to use the new backend URL
3. Test the complete application flow
4. Consider upgrading to a paid tier for production use

## Support

- Render Documentation: https://render.com/docs
- Render Community: https://community.render.com
- Your service logs are available in the Render dashboard
