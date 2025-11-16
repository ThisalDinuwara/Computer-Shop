import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

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
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('jwt');
      if (token) {
        try {
          const response = await authAPI.getProfile();
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Auth initialization failed:', error);
          localStorage.removeItem('jwt');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const sendOtp = async (email, role = 'ROLE_CUSTOMER') => {
    const response = await authAPI.sendOtp(email, role);
    return response.data;
  };

  const signup = async (email, fullName, otp) => {
    const response = await authAPI.signup(email, fullName, otp);
    const { jwt, role } = response.data;
    localStorage.setItem('jwt', jwt);
    
    // Fetch user profile after signup
    const profileResponse = await authAPI.getProfile();
    setUser(profileResponse.data);
    setIsAuthenticated(true);
    return response.data;
  };

  const login = async (email, otp) => {
    const response = await authAPI.login(email, otp);
    const { jwt, role } = response.data;
    localStorage.setItem('jwt', jwt);
    
    // Fetch user profile after login
    const profileResponse = await authAPI.getProfile();
    setUser(profileResponse.data);
    setIsAuthenticated(true);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    sendOtp,
    signup,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
