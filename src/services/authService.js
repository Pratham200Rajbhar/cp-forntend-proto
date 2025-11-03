import { STORAGE_KEYS, USER_ROLES } from '../utils/constants';
import { mockUsers } from './mockData';
import { ok, badRequest } from './mockUtils';

const authService = {
  /**
   * Login user
   * POST /api/v1/auth/login
   */
  login: async (email, password) => {
    const user = mockUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) return badRequest('Invalid credentials');

    const accessToken = `mock-access-${user.id}`;
    const refreshToken = `mock-refresh-${user.id}`;
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    localStorage.setItem(
      STORAGE_KEYS.USER_DATA,
      JSON.stringify({ id: user.id, name: user.name, email: user.email, role: user.role })
    );
    return ok({ access_token: accessToken, refresh_token: refreshToken });
  },

  /**
   * Register new user
   * POST /api/v1/auth/register
   */
  register: async () => badRequest('Registration disabled in mock mode'),

  /**
   * Refresh access token
   * POST /api/v1/auth/refresh
   */
  refreshToken: async (refreshToken) => {
    const newAccess = `${refreshToken}-rotated`;
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newAccess);
    return ok({ access_token: newAccess });
  },

  /**
   * Get current user profile
   * GET /api/v1/auth/me
   */
  getCurrentUser: async () => {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (stored) return ok(JSON.parse(stored));
    return badRequest('No user session');
  },

  /**
   * Logout user
   * POST /api/v1/auth/logout
   */
  logout: async () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    return ok({ success: true });
  },

  /**
   * Request password reset
   * POST /api/v1/auth/password-reset
   */
  requestPasswordReset: async () => badRequest('Not available in mock mode'),

  /**
   * Confirm password reset
   * POST /api/v1/auth/password-reset/confirm
   */
  confirmPasswordReset: async () => badRequest('Not available in mock mode'),

  /**
   * Change password
   * POST /api/v1/auth/change-password
   */
  changePassword: async () => badRequest('Not available in mock mode'),

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

