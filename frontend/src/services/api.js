import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false, // Changed from true to false - we're using Bearer tokens, not cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Transaction API endpoints
 */
export const transactionAPI = {
  // Add a new transaction manually
  addTransaction: (data) =>
    apiClient.post('/transactions/add', data),

  // Get all transactions with filters
  getTransactions: (params) =>
    apiClient.get('/transactions', { params }),

  // Get transaction analytics
  getAnalytics: (params) =>
    apiClient.get('/transactions/analytics', { params }),

  // Update a transaction
  updateTransaction: (id, data) =>
    apiClient.put(`/transactions/${id}`, data),

  // Edit classification for a transaction
  editClassification: (id, data) =>
    apiClient.put(`/transactions/${id}/edit-classification`, data),

  // Delete a transaction
  deleteTransaction: (id) =>
    apiClient.delete(`/transactions/${id}`),

  // Delete all transactions
  deleteAllTransactions: () =>
    apiClient.delete('/transactions'),

  // Upload PDF statement
  uploadPDF: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/transactions/upload-pdf', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get transactions from a batch
  getBatchTransactions: (batchId) =>
    apiClient.get(`/transactions/batch/${batchId}`),
};

/**
 * User API endpoints
 */
export const userAPI = {
  // Register a new user
  register: (data) =>
    apiClient.post('/users/register', data),

  // Login user
  login: (data) =>
    apiClient.post('/users/login', data),

  // Logout user
  logout: () =>
    apiClient.post('/users/logout'),

  // Get current user profile
  getCurrentUser: () =>
    apiClient.get('/users/current-user'),

  // Update user profile
  updateProfile: (data) =>
    apiClient.put('/users/profile', data),
};

/**
 * Preference API endpoints
 */
export const preferenceAPI = {
  // Save a new preference
  savePreference: (data) =>
    apiClient.post('/preferences/save', data),

  // Get all user preferences
  getUserPreferences: () =>
    apiClient.get('/preferences'),

  // Search preferences by merchant name
  searchPreferences: (term) =>
    apiClient.get('/preferences/search', { params: { term } }),

  // Delete a preference
  deletePreference: (id) =>
    apiClient.delete(`/preferences/${id}`),
};

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access - clear token and redirect
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export default apiClient;
