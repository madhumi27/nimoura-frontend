import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach JWT token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nimoura_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const registerUser = (data) => api.post('/api/auth/register', data);
export const loginUser = (data) => api.post('/api/auth/login', data);

// Product APIs
export const getAllProducts = () => api.get('/api/products');
export const getProductsByCategory = (category) => api.get(`/api/products?category=${category}`);
export const getProductById = (id) => api.get(`/api/products/${id}`);
export const addProduct = (data) => api.post('/api/products', data);
export const updateProduct = (id, data) => api.put(`/api/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/api/products/${id}`);

// Order APIs
export const placeOrder = (data) => api.post('/api/orders', data);
export const getMyOrders = () => api.get('/api/orders/my');
export const getAllOrders = () => api.get('/api/orders/all');
export const updateOrderStatus = (id, status) => api.put(`/api/orders/${id}/status?status=${status}`);
// Image upload
export const uploadImage = (formData) => api.post('/api/upload/image', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const searchProducts = (query) => api.get(`/api/products/search?q=${query}`);
// Promo code APIs
export const validatePromoCode = (code, amount) => api.post('/api/promo/validate', { code, amount });
export const createPromoCode = (data) => api.post('/api/promo/create', data);
export const getAllPromoCodes = () => api.get('/api/promo/all');
export const deactivatePromoCode = (id) => api.delete(`/api/promo/${id}`);
export default api;