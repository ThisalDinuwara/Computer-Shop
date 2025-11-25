import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }
    
    setLoading(true);
    try {
      const response = await cartAPI.get();
      setCart(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      setError('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  const addToCart = async (productId, size, quantity = 1) => {
    try {
      console.log('🛒 CartContext: Adding item to cart', { productId, size, quantity });
      await cartAPI.addItem(productId, size, quantity);
      console.log('✅ CartContext: Item added, refreshing cart...');
      await fetchCart();
      console.log('✅ CartContext: Cart refreshed successfully');
      return { success: true };
    } catch (err) {
      console.error('❌ CartContext: Failed to add item to cart:', err);
      throw err;
    }
  };

  const updateCartItem = async (cartItemId, quantity) => {
    try {
      await cartAPI.updateItem(cartItemId, { quantity });
      await fetchCart();
      return { success: true };
    } catch (err) {
      console.error('Failed to update cart item:', err);
      throw err;
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      await cartAPI.removeItem(cartItemId);
      await fetchCart();
      return { success: true };
    } catch (err) {
      console.error('Failed to remove item from cart:', err);
      throw err;
    }
  };

  const cartItemsCount = cart?.cartItems?.length || 0;
  const cartTotal = cart?.totalSellingPrice || 0;

  const value = {
    cart,
    loading,
    error,
    addToCart,
    updateCartItem,
    removeFromCart,
    fetchCart,
    cartItemsCount,
    cartTotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
