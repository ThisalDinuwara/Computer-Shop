import axios from 'axios';

const API_BASE_URL = 'http://localhost:5454';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('jwt');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  sendOtp: (email, role = 'ROLE_CUSTOMER') => 
    api.post('/auth/sent/login-signup-otp', { email, role }),
  
  signup: (email, fullName, otp) => 
    api.post('/auth/signup', { email, fullName, otp }),
  
  login: (email, otp) => 
    api.post('/auth/signing', { email, otp }),
  
  getProfile: () => 
    api.get('/users/profile'),
};

// Product APIs
export const productAPI = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });
    return api.get(`/products?${queryParams.toString()}`);
  },
  
  getById: (id) => 
    api.get(`/products/${id}`),
  
  search: (query) => 
    api.get(`/products/search?query=${query}`),
};

// Cart APIs
export const cartAPI = {
  get: () => 
    api.get('/cart'),
  
  addItem: (productId, size, quantity) => 
    api.put('/cart/add', { productId, size, quantity }),
  
  updateItem: (cartItemId, cartItem) => 
    api.put(`/cart/item/${cartItemId}`, cartItem),
  
  removeItem: (cartItemId) => 
    api.delete(`/cart/item/${cartItemId}`),
};

// Order APIs
export const orderAPI = {
  create: (shippingAddress, paymentMethod = 'RAZORPAY') => 
    api.post(`/orders?paymentMethod=${paymentMethod}`, shippingAddress),
  
  getHistory: () => 
    api.get('/orders/user'),
  
  getById: (orderId) => 
    api.get(`/orders/${orderId}`),
  
  getItemById: (orderItemId) => 
    api.get(`/orders/item/${orderItemId}`),
  
  cancel: (orderId) => 
    api.put(`/orders/${orderId}/cancel`),
};

export default api;
