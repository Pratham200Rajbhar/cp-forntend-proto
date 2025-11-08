import { createContext, useState, useEffect } from 'react';
import { USER_ROLES, STORAGE_KEYS } from '../utils/constants';
import { authService } from '../services/api';
import toast from 'react-hot-toast';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from localStorage and verify with backend
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER_DATA);
        
        if (token && storedUser) {
          // Verify token with backend
          try {
            const profile = await authService.getProfile();
            setUser(profile);
            setIsAuthenticated(true);
          } catch {
            // Token invalid, clear storage
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER_DATA);
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Login user with backend API
   */
  const login = async (email, password) => {
    try {
      const response = await authService.login({ email, password });
      
      if (response.access_token) {
        // Store token
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.access_token);
        
        // Get user profile
        const profile = await authService.getProfile();
        
        // Store user data
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(profile));
        setUser(profile);
        setIsAuthenticated(true);
        
        toast.success(`Welcome back, ${profile.name}!`);
        return { success: true, user: profile };
      }

      return { success: false, error: 'Invalid response from server' };
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.message || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Register new user with backend API
   */
  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      
      if (response.status === 'success') {
        toast.success('Registration successful! Please login.');
        return { success: true, data: response.data };
      }

      return { success: false, error: 'Registration failed' };
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  /**
   * Update user data
   */
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  };

  /**
   * Refresh user profile from backend
   */
  const refreshProfile = async () => {
    try {
      const profile = await authService.getProfile();
      setUser(profile);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(profile));
      return { success: true, user: profile };
    } catch (error) {
      console.error('Profile refresh error:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Check if user has specific role
   */
  const hasRole = (role) => {
    return user?.role === role;
  };

  /**
   * Check if user is admin
   */
  const isAdmin = () => {
    return user?.role === USER_ROLES.ADMIN;
  };

  /**
   * Check if user is teacher
   */
  const isTeacher = () => {
    return user?.role === USER_ROLES.TEACHER;
  };

  /**
   * Check if user is student
   */
  const isStudent = () => {
    return user?.role === USER_ROLES.STUDENT;
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    refreshProfile,
    hasRole,
    isAdmin,
    isTeacher,
    isStudent,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

