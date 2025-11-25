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
      console.log('🔐 Initializing auth...', { hasToken: !!token });
      
      if (token) {
        try {
          const response = await authAPI.getProfile();
          setUser(response.data);
          setIsAuthenticated(true);
          console.log('✅ Auth initialized successfully');
        } catch (error) {
          console.error('❌ Auth initialization failed:', error);
          console.log('🧹 Clearing invalid auth data');
          localStorage.removeItem('jwt');
          localStorage.removeItem('user');
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        console.log('ℹ️ No token found - user not authenticated');
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
    try {
      console.log('📝 Attempting signup...', { email, fullName });
      const response = await authAPI.signup(email, fullName, otp);
      const { jwt, role } = response.data;
      
      if (!jwt) {
        throw new Error('No JWT token received from server');
      }
      
      localStorage.setItem('jwt', jwt);
      console.log('✅ JWT stored successfully');
      
      // Fetch user profile after signup
      const profileResponse = await authAPI.getProfile();
      setUser(profileResponse.data);
      setIsAuthenticated(true);
      console.log('✅ Signup completed successfully');
      
      return response.data;
    } catch (error) {
      console.error('❌ Signup failed:', error);
      throw error;
    }
  };

  const login = async (email, otp) => {
    try {
      console.log('🔑 Attempting login...', { email });
      const response = await authAPI.login(email, otp);
      const { jwt, role } = response.data;
      
      if (!jwt) {
        throw new Error('No JWT token received from server');
      }
      
      localStorage.setItem('jwt', jwt);
      console.log('✅ JWT stored successfully');
      
      // Fetch user profile after login
      const profileResponse = await authAPI.getProfile();
      setUser(profileResponse.data);
      setIsAuthenticated(true);
      console.log('✅ Login completed successfully');
      
      return response.data;
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('👋 Logging out...');
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    console.log('✅ Logout completed');
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
