# Ngrok Setup Guide for DWL App

This guide will help you set up ngrok to expose your local backend server to the internet, allowing you to deploy the frontend to GitHub Pages while keeping the backend running locally.

## Prerequisites

1. **Ngrok Account**: Sign up at [ngrok.com](https://ngrok.com)
2. **Ngrok CLI**: Download and install ngrok from [ngrok.com/download](https://ngrok.com/download)
3. **Backend Server**: Your FastAPI backend should be running on `localhost:8000`

## Setup Steps

### 1. Install and Authenticate Ngrok

```bash
# Download ngrok (if not already done)
# Then authenticate with your ngrok account
ngrok authtoken YOUR_AUTH_TOKEN
```

### 2. Start Your Backend Server

```bash
# Navigate to your backend directory
cd dwlapp/backend

# Start the FastAPI server
python main.py
# or
uvicorn main:app --host 0.0.0.0 --port 8000
```

### 3. Start Ngrok Tunnel

```bash
# In a new terminal, start ngrok to expose port 8000
ngrok http 8000
```

You should see output like:
```
Session Status                online
Account                       your-email@example.com
Version                       3.x.x
Region                        United States (us)
Latency                       51ms
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok.io -> http://localhost:8000
```

### 4. Update Frontend Configuration

Copy the ngrok URL (e.g., `https://abc123.ngrok.io`) and update the configuration:

1. Open `dwlapp/frontend/src/config.js`
2. Replace the `BACKEND_URL` with your ngrok URL:

```javascript
export const BACKEND_URL = "https://abc123.ngrok.io"; // Your actual ngrok URL
```

### 5. Test the Connection

1. Start your React development server:
```bash
cd dwlapp/frontend
npm start
```

2. Open your browser and test the app
3. Try running a training session to ensure the backend connection works

## Deploy to GitHub Pages

### 1. Build the Production Version

```bash
cd dwlapp/frontend
npm run build
```

### 2. Push to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Add DWL app with ngrok configuration"

# Add your GitHub repository as remote
git remote add origin https://github.com/yourusername/your-repo-name.git
git branch -M main
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to your GitHub repository
2. Click "Settings" → "Pages"
3. Select "Deploy from a branch"
4. Choose "main" branch and "/ (root)" folder
5. Click "Save"

## Important Notes

### Security Considerations

⚠️ **Warning**: When using ngrok, your local backend is exposed to the internet. Consider:

- Using ngrok's authentication features
- Implementing rate limiting
- Monitoring ngrok logs for suspicious activity
- Using ngrok's paid plans for additional security features

### URL Management

- **Free ngrok**: URLs change every time you restart ngrok
- **Paid ngrok**: You can get fixed subdomains
- **Alternative**: Use a VPS or cloud service for production

### Environment Variables (Recommended)

For production, use environment variables:

1. Create `.env` file in `dwlapp/frontend/`:
```
REACT_APP_BACKEND_URL=https://your-ngrok-url.ngrok.io
```

2. Update `config.js`:
```javascript
export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "https://your-ngrok-url.ngrok.io";
```

3. Add `.env` to `.gitignore`:
```
# .gitignore
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your backend allows requests from your ngrok domain
2. **Connection Refused**: Ensure your backend is running on port 8000
3. **Ngrok URL Not Working**: Check ngrok status at http://localhost:4040

### Backend CORS Configuration

Update your FastAPI backend to allow ngrok domains:

```python
# In main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development - restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Alternative: Use ngrok with Custom Domain

If you have a paid ngrok account, you can use a fixed subdomain:

```bash
ngrok http 8000 --subdomain=your-dwl-app
```

This will give you a consistent URL like `https://your-dwl-app.ngrok.io`.

## Next Steps

1. **Production Deployment**: Consider deploying the backend to a cloud service
2. **Domain Name**: Get a custom domain for your app
3. **SSL Certificate**: Ensure HTTPS is properly configured
4. **Monitoring**: Set up logging and monitoring for your deployed app 