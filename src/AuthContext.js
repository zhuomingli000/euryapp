import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState(0);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const token = localStorage.getItem('authToken');
    const demoUser = localStorage.getItem('demoUser');
    
    if (token) {
      fetchUserProfile(token);
    } else if (demoUser) {
      // Handle demo user
      try {
        const userData = JSON.parse(demoUser);
        setUser(userData);
        setCredits(userData.credits);
        setLoading(false);
      } catch (error) {
        console.error('Error parsing demo user:', error);
        localStorage.removeItem('demoUser');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch(`${BACKEND_URL}/user/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setCredits(userData.credits);
      } else {
        // Token is invalid, clear it
        localStorage.removeItem('authToken');
        setUser(null);
        setCredits(0);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      localStorage.removeItem('authToken');
      setUser(null);
      setCredits(0);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (googleToken) => {
    try {
      const response = await fetch(`${BACKEND_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: googleToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('authToken', data.access_token);
        setUser(data.user);
        setCredits(data.user.credits);
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('demoUser');
    setUser(null);
    setCredits(0);
  };

  const addCredits = async (amount) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${BACKEND_URL}/user/add-credits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount }),
      });

      if (response.ok) {
        const data = await response.json();
        setCredits(data.credits);
        return { success: true, credits: data.credits };
      } else {
        const error = await response.json();
        return { success: false, error: error.error || 'Failed to add credits' };
      }
    } catch (error) {
      console.error('Add credits error:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const deductCredits = (amount) => {
    setCredits(prev => Math.max(0, prev - amount));
  };

  const value = {
    user,
    credits,
    loading,
    loginWithGoogle,
    logout,
    addCredits,
    deductCredits,
    fetchUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 