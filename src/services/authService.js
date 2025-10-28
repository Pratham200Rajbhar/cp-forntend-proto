import api from './api';
import { API_ENDPOINTS, STORAGE_KEYS } from '../utils/constants';

const authService = {
  /**
   * Login user
   * POST /api/v1/auth/login
   */
  login: async (email, password) => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
    const { access_token, refresh_token } = response.data;
    
    // Store tokens
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh_token);
    
    return response.data;
  },

  /**
   * Register new user
   * POST /api/v1/auth/register
   */
  register: async (userData) => {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  },

  /**
   * Refresh access token
   * POST /api/v1/auth/refresh
   */
  refreshToken: async (refreshToken) => {
    const response = await api.post(API_ENDPOINTS.AUTH.REFRESH, {
      refresh_token: refreshToken
    });
    const { access_token } = response.data;
    
    // Store new access token
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token);
    
    return response.data;
  },

  /**
   * Get current user profile
   * GET /api/v1/auth/me
   */
  getCurrentUser: async () => {
    const response = await api.get(API_ENDPOINTS.AUTH.ME);
    const userData = response.data;
    
    // Store user data
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    
    return userData;
  },

  /**
   * Logout user
   * POST /api/v1/auth/logout
   */
  logout: async () => {
    try {
      await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all stored data
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    }
  },

  /**
   * Request password reset
   * POST /api/v1/auth/password-reset
   */
  requestPasswordReset: async (email) => {
    const response = await api.post(API_ENDPOINTS.AUTH.PASSWORD_RESET, { email });
    return response.data;
  },

  /**
   * Confirm password reset
   * POST /api/v1/auth/password-reset/confirm
   */
  confirmPasswordReset: async (token, newPassword) => {
    const response = await api.post(API_ENDPOINTS.AUTH.PASSWORD_RESET_CONFIRM, {
      token,
      new_password: newPassword
    });
    return response.data;
  },

  /**
   * Change password
   * POST /api/v1/auth/change-password
   */
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      current_password: currentPassword,
      new_password: newPassword
    });
    return response.data;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  /**
   * Get stored user data
   */
  getStoredUser: () => {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  },

  /**
   * Get access token from storage
   */
  getAccessToken: () => {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  /**
   * Get refresh token from storage
   */
  getRefreshToken: () => {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  },
};

export default authService;

