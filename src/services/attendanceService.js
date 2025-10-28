import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

const attendanceService = {
  /**
   * Submit attendance with AI validation (Student only)
   * POST /api/v1/attendance/submit
   */
  submitAttendance: async (attendanceData) => {
    const response = await api.post(API_ENDPOINTS.ATTENDANCE.SUBMIT, attendanceData);
    return response.data;
  },

  /**
   * Submit offline attendance packet for later processing (Student only)
   * POST /api/v1/attendance/offline-submit
   */
  submitOfflineAttendance: async (attendanceData) => {
    const response = await api.post(API_ENDPOINTS.ATTENDANCE.OFFLINE_SUBMIT, attendanceData);
    return response.data;
  },

  /**
   * Get current user's attendance records (Student only)
   * GET /api/v1/attendance/my-attendance
   */
  getMyAttendance: async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.ATTENDANCE.MY_ATTENDANCE, { params });
    return response.data;
  },

  /**
   * Get attendance records for a specific session (Teacher/Admin only)
   * GET /api/v1/attendance/session/{session_id}/attendance
   */
  getSessionAttendance: async (sessionId) => {
    const response = await api.get(API_ENDPOINTS.ATTENDANCE.SESSION_ATTENDANCE(sessionId));
    return response.data;
  },

  /**
   * Manually override attendance status (Teacher/Admin only)
   * POST /api/v1/attendance/manual-override
   */
  manualOverride: async (data) => {
    const response = await api.post(API_ENDPOINTS.ATTENDANCE.MANUAL_OVERRIDE, data);
    return response.data;
  },

  /**
   * Get flagged attendance records for review (Teacher/Admin only)
   * GET /api/v1/attendance/flagged-attendance
   */
  getFlaggedAttendance: async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.ATTENDANCE.FLAGGED, { params });
    return response.data;
  },

  /**
   * Generate attendance report (Teacher/Admin only)
   * GET /api/v1/attendance/attendance-report
   */
  generateAttendanceReport: async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.ATTENDANCE.ATTENDANCE_REPORT, { params });
    return response.data;
  },
};

export default attendanceService;

