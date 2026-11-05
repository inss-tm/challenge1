import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setAuthToken, getAuthToken } from '../services/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check initial authentication state (via sessionStorage or stored token)
  useEffect(() => {
    let isMounted = true;

    // Purge any tokens or personal data from localStorage (strict compliance)
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('itc_user_session');
      localStorage.removeItem('itc_auth_token');
      localStorage.removeItem('itc_chat_session');
    }

    async function checkAuth() {
      try {
        const storedUser = typeof sessionStorage !== 'undefined'
          ? sessionStorage.getItem('itc_user_session')
          : null;
        const token = getAuthToken();

        if (storedUser || token) {
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
          // Verify with backend
          const res = await api.getCurrentUser().catch(() => null);
          if (res && res.user && isMounted) {
            setUser(res.user);
            if (typeof sessionStorage !== 'undefined') {
              sessionStorage.setItem('itc_user_session', JSON.stringify(res.user));
            }
          }
        }
      } catch (err) {
        console.warn('Initial session check notice:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (credentials) => {
    const response = await api.login(credentials);
    if (response.success && response.user) {
      setUser(response.user);
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('itc_user_session', JSON.stringify(response.user));
      }
      if (response.token) {
        setAuthToken(response.token);
      }
      return response.user;
    }
    throw new Error(response.message || 'Login failed');
  };

  const register = async (userData) => {
    const response = await api.register(userData);
    if (response.success && response.user) {
      setUser(response.user);
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('itc_user_session', JSON.stringify(response.user));
      }
      if (response.token) {
        setAuthToken(response.token);
      }
      return response.user;
    }
    throw new Error(response.message || 'Registration failed');
  };

  const logout = async () => {
    try {
      await api.logout().catch(() => {});
    } finally {
      setUser(null);
      setAuthToken(null);
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem('itc_user_session');
        sessionStorage.removeItem('itc_auth_token');
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('itc_user_session');
        localStorage.removeItem('itc_auth_token');
      }
    }
  };

  const value = {
    user,
    isAuthenticated: Boolean(user),
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
