import React, { createContext, useContext, useState, useEffect } from 'react';
import { sellerAPI } from '../services/api';

const SellerAuthContext = createContext(null);

export const useSellerAuth = () => {
  const context = useContext(SellerAuthContext);
  if (!context) {
    throw new Error('useSellerAuth must be used within a SellerAuthProvider');
  }
  return context;
};

export const SellerAuthProvider = ({ children }) => {
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('seller_jwt');
      if (token) {
        try {
          // Set token for API calls
          localStorage.setItem('jwt', token);
          const response = await sellerAPI.getProfile();
          setSeller(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Seller auth initialization failed:', error);
          localStorage.removeItem('seller_jwt');
          localStorage.removeItem('jwt');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const sendOtp = async (email) => {
    const response = await sellerAPI.sendOtp(email);
    return response.data;
  };

  const register = async (sellerData) => {
    const response = await sellerAPI.register(sellerData);
    return response.data;
  };

  const login = async (email, otp) => {
    const response = await sellerAPI.login(email, otp);
    const { jwt } = response.data;
    localStorage.setItem('seller_jwt', jwt);
    localStorage.setItem('jwt', jwt);
    
    // Fetch seller profile after login
    const profileResponse = await sellerAPI.getProfile();
    setSeller(profileResponse.data);
    setIsAuthenticated(true);
    return response.data;
  };

  const verifyEmail = async (otp) => {
    const response = await sellerAPI.verifyEmail(otp);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('seller_jwt');
    localStorage.removeItem('jwt');
    setSeller(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (sellerData) => {
    const response = await sellerAPI.updateProfile(sellerData);
    setSeller(response.data);
    return response.data;
  };

  const value = {
    seller,
    loading,
    isAuthenticated,
    sendOtp,
    register,
    login,
    logout,
    verifyEmail,
    updateProfile,
  };

  return (
    <SellerAuthContext.Provider value={value}>
      {children}
    </SellerAuthContext.Provider>
  );
};
