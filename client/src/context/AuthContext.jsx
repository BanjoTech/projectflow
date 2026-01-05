// client/src/context/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api.js';
import { connectSocket, disconnectSocket } from '../services/socket.js';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Connect socket when user is authenticated
  useEffect(() => {
    if (user) {
      connectSocket(user.id);
    } else {
      disconnectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [user]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const userData = await authAPI.getMe();
          setUser(userData);
        } catch (err) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const signup = async (name, email, password) => {
    try {
      setError(null);
      const data = await authAPI.signup(name, email, password);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);

      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Signup failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const data = await authAPI.login(email, password);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);

      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    disconnectSocket();
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    error,
    signup,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
