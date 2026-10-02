import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage and verify with backend
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('access_token');
      const storedUser = localStorage.getItem('user_profile');

      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          // Proactively refresh user profile from server
          const freshUser = await authService.getCurrentUser();
          setUser(freshUser);
          localStorage.setItem('user_profile', JSON.stringify(freshUser));
        } catch (error) {
          console.warn('Failed to validate active session with server', error);
          // If token expired and couldn't refresh, clear storage
          if (error.response?.status === 401) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user_profile');
            setUser(null);
          }
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    localStorage.setItem('access_token', data.access);
    if (data.refresh) {
      localStorage.setItem('refresh_token', data.refresh);
    }
    localStorage.setItem('user_profile', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const register = async (formData) => {
    const data = await authService.register(formData);
    return data;
  };

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    await authService.logout(refreshToken);
    setUser(null);
  }, []);

  const updateUser = (updatedUser) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedUser };
      localStorage.setItem('user_profile', JSON.stringify(merged));
      return merged;
    });
  };

  const refreshUserProfile = async () => {
    try {
      const freshUser = await authService.getCurrentUser();
      setUser(freshUser);
      localStorage.setItem('user_profile', JSON.stringify(freshUser));
      return freshUser;
    } catch (error) {
      console.error('Error refreshing user profile', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
        refreshUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
