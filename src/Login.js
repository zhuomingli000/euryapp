import React, { useEffect } from 'react';
import { useAuth } from './AuthContext';

const Login = () => {
  const { loginWithGoogle } = useAuth();

  useEffect(() => {
    // Check if Google OAuth is properly configured
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    
    if (!clientId || clientId === 'your-google-client-id-here') {
      console.log('Google OAuth not configured - showing demo mode');
      // Show demo mode message
      const fallbackDiv = document.getElementById('oauth-fallback');
      if (fallbackDiv) {
        fallbackDiv.style.display = 'block';
      }
      return;
    }
    
    console.log('Google OAuth Client ID found:', clientId ? 'Configured' : 'Not configured');
    
    console.log('Google OAuth Client ID:', clientId);
    console.log('Google object available:', !!window.google);
    
    if (window.google) {
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          { 
            theme: 'outline', 
            size: 'large',
            width: 300,
            text: 'signin_with'
          }
        );
        console.log('Google Sign-In button rendered successfully');
      } catch (error) {
        console.error('Error initializing Google Sign-In:', error);
        // Show fallback message
        const fallbackDiv = document.getElementById('oauth-fallback');
        if (fallbackDiv) {
          fallbackDiv.style.display = 'block';
        }
      }
    } else {
      console.log('Google object not available yet, waiting...');
      // Wait for Google to load
      const checkGoogle = setInterval(() => {
        if (window.google) {
          clearInterval(checkGoogle);
          try {
            window.google.accounts.id.initialize({
              client_id: clientId,
              callback: handleCredentialResponse,
            });

            window.google.accounts.id.renderButton(
              document.getElementById('google-signin-button'),
              { 
                theme: 'outline', 
                size: 'large',
                width: 300,
                text: 'signin_with'
              }
            );
            console.log('Google Sign-In button rendered successfully');
          } catch (error) {
            console.error('Error initializing Google Sign-In:', error);
            // Show fallback message
            const fallbackDiv = document.getElementById('oauth-fallback');
            if (fallbackDiv) {
              fallbackDiv.style.display = 'block';
            }
          }
        }
      }, 100);
    }
  }, []);

  const handleCredentialResponse = async (response) => {
    const result = await loginWithGoogle(response.credential);
    if (result.success) {
      // Redirect back to main page after successful login
      window.history.pushState({}, '', '/');
      window.location.reload();
    } else {
      alert(`Login failed: ${result.error}`);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h1 style={{
          color: '#2c3e50',
          marginBottom: '10px',
          fontSize: '2.5em'
        }}>
          🚀 DWL Training
        </h1>
        
        <p style={{
          color: '#7f8c8d',
          marginBottom: '30px',
          fontSize: '1.1em',
          lineHeight: '1.5'
        }}>
          Advanced Deep Learning with DWL Technology
        </p>

        <div style={{
          backgroundColor: '#e8f5e8',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '30px',
          border: '1px solid #c3e6c3'
        }}>
          <h3 style={{
            color: '#2d5a2d',
            marginBottom: '10px',
            fontSize: '1.2em'
          }}>
            💰 Get Started with $10 Credits
          </h3>
          <p style={{
            color: '#2d5a2d',
            fontSize: '0.9em',
            margin: 0
          }}>
            Each training job costs $0.50. Sign in to start training your models!
          </p>
        </div>

        <div id="google-signin-button" style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '20px'
        }}></div>
        
        {/* Demo mode option - always visible */}
        <div style={{
          padding: '20px',
          backgroundColor: '#e8f5e8',
          border: '1px solid #c3e6c3',
          borderRadius: '8px',
          marginBottom: '20px',
          color: '#2d5a2d'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '10px', fontSize: '1.1em' }}>
            🎭 Demo Mode Available
          </div>
          <div style={{ fontSize: '0.9em', marginBottom: '15px', lineHeight: '1.5' }}>
            Try DWL without signing in! Demo mode gives you $10 in credits to test the platform.
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
              onClick={() => {
                // Create a demo user for testing
                const demoUser = {
                  google_id: 'demo-user-123',
                  email: 'demo@example.com',
                  name: 'Demo User',
                  credits: 10.0
                };
                localStorage.setItem('demoUser', JSON.stringify(demoUser));
                // Create a demo token that the backend can recognize
                localStorage.setItem('authToken', 'demo-token-123');
                window.history.pushState({}, '', '/?page=train');
                window.location.reload();
              }}
              style={{
                padding: '12px 24px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '1em',
                fontWeight: 'bold',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
            >
              🎭 Try Demo Mode
            </button>
          </div>
        </div>

        {/* Fallback message if Google OAuth doesn't load */}
        <div id="oauth-fallback" style={{
          display: 'none',
          padding: '20px',
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '8px',
          marginBottom: '20px',
          color: '#856404'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '10px', fontSize: '1.1em' }}>
            🔧 Google OAuth Not Configured
          </div>
          <div style={{ fontSize: '0.9em', marginBottom: '15px', lineHeight: '1.5' }}>
            To enable Google Sign-In, you need to set up Google OAuth credentials. 
            Check the <code>GOOGLE_OAUTH_SETUP.md</code> file for detailed instructions.
          </div>
          <div style={{ 
            fontSize: '0.85em', 
            marginBottom: '15px',
            textAlign: 'left',
            backgroundColor: '#f8f9fa',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #e1e8ed'
          }}>
            <strong>Setup Steps:</strong>
            <ol style={{ margin: '8px 0', paddingLeft: '20px' }}>
              <li>Go to <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" style={{ color: '#3498db' }}>Google Cloud Console</a></li>
              <li>Create a new project or select existing one</li>
              <li>Enable Google+ API</li>
              <li>Create OAuth 2.0 credentials</li>
              <li>Set authorized origins to: <code>http://localhost:3000</code></li>
              <li>Add <code>REACT_APP_GOOGLE_CLIENT_ID=your-client-id</code> to .env file</li>
            </ol>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '8px 16px',
                backgroundColor: '#27ae60',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9em'
              }}
            >
              🔄 Refresh After Setup
            </button>
          </div>
        </div>

        <p style={{
          color: '#95a5a6',
          fontSize: '0.8em',
          margin: 0,
          marginBottom: '20px'
        }}>
          By signing in, you agree to our terms of service
        </p>

        <button
          onClick={() => {
            window.history.pushState({}, '', '/?page=train');
            window.location.reload();
          }}
          style={{
            padding: '8px 16px',
            backgroundColor: '#95a5a6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9em'
          }}
        >
          ← Back to Webapp
        </button>
      </div>
    </div>
  );
};

export default Login; 