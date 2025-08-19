# Google OAuth Setup Guide

## Current Issue
Your app is showing "Demo Mode - Google OAuth Not Configured" because the Google OAuth client ID is not configured.

## Step-by-Step Setup

### 1. Create a .env file
Create a `.env` file in the root directory of your project with the following content:

```env
# Google OAuth Configuration
# Replace 'your-google-client-id-here' with your actual Google OAuth Client ID
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id-here

# Backend URL (optional - can be overridden)
REACT_APP_BACKEND_URL=https://unique-bullfrog-blatantly.ngrok-free.app
```

### 2. Set up Google Cloud Console

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com
   - Sign in with your Google account

2. **Create a new project or select existing one**
   - Click on the project dropdown at the top
   - Click "New Project" or select an existing project

3. **Enable Google+ API**
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" or "Google Identity"
   - Click on it and press "Enable"

4. **Create OAuth 2.0 credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application" as the application type

5. **Configure OAuth consent screen**
   - If prompted, configure the OAuth consent screen
   - Add your app name: "Eury Training App"
   - Add your email as the developer contact
   - Save and continue

6. **Set up OAuth client ID**
   - **Name**: Eury Training App
   - **Authorized JavaScript origins**:
     - `http://localhost:3000` (for development)
     - `https://your-ngrok-url.ngrok.io` (if using ngrok)
     - `https://your-production-domain.com` (for production)
   - **Authorized redirect URIs**:
     - `http://localhost:3000`
     - `http://localhost:3000/`
     - `https://your-ngrok-url.ngrok.io`
     - `https://your-production-domain.com`

7. **Copy the Client ID**
   - After creating, you'll get a Client ID (looks like: `123456789-abcdefghijklmnop.apps.googleusercontent.com`)
   - Copy this Client ID

### 3. Update your .env file
Replace `your-google-client-id-here` in your `.env` file with the actual Client ID you copied.

### 4. Restart your development server
```bash
npm start
```

### 5. Test the setup
- Go to your app
- Click "Sign In"
- You should now see the Google Sign-In button instead of the demo mode message

## Troubleshooting

### If you still see "Demo Mode":
1. Make sure your `.env` file is in the root directory (same level as `package.json`)
2. Make sure you restarted the development server after creating the `.env` file
3. Check that the Client ID is correct and doesn't have extra spaces
4. Verify that `http://localhost:3000` is in your authorized origins

### If Google Sign-In button doesn't appear:
1. Check the browser console for errors
2. Make sure the Google OAuth script is loading (check Network tab)
3. Verify your Client ID is correct

### For Production:
When deploying to production, make sure to:
1. Add your production domain to authorized origins
2. Set up proper environment variables on your hosting platform
3. Update the backend URL if needed

## Alternative: Quick Demo Mode
If you want to test the app without setting up Google OAuth:
1. Go to the login page
2. Click "Try Demo Mode" button
3. This will create a demo user with $10 credits for testing

## Security Notes
- Never commit your `.env` file to version control
- Keep your Client ID secure
- Use different Client IDs for development and production
- Regularly rotate your OAuth credentials 