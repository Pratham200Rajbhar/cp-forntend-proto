import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

const auditService = {
  /**
   * Get audit logs with filtering options (Admin only)
   * GET /api/v1/audit/logs
   */
  getLogs: async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.AUDIT.LOGS, { params });
    return response.data;
  },

  /**
   * Get attendance audit summary (Teacher/Admin only)
   * GET /api/v1/audit/attendance-summary
   */
  getAttendanceSummary: async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.AUDIT.ATTENDANCE_SUMMARY, { params });
    return response.data;
  },

  /**
   * Get activity logs for a specific user (Admin only)
   * GET /api/v1/audit/user-activity/{user_id}
   */
  getUserActivity: async (userId, params = {}) => {
    const response = await api.get(API_ENDPOINTS.AUDIT.USER_ACTIVITY(userId), { params });
    return response.data;
  },

  /**
   * Get security events (Admin only)
   * GET /api/v1/audit/security-events
   */
  getSecurityEvents: async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.AUDIT.SECURITY_EVENTS, { params });
    return response.data;
  },

  /**
   * Get failed attendance attempts (Teacher/Admin only)
   * GET /api/v1/audit/failed-attempts
   */
  getFailedAttempts: async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.AUDIT.FAILED_ATTEMPTS, { params });
    return response.data;
  },

  /**
   * Export audit logs (Admin only)
   * GET /api/v1/audit/export
   */
  exportLogs: async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.AUDIT.EXPORT, { params });
    return response.data;
  },
};

export default auditService;

