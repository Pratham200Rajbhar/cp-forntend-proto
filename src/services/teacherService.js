import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

const teacherService = {
  /**
   * Get teacher dashboard overview (Teacher/Admin only)
   * GET /api/v1/teacher/dashboard
   */
  getDashboard: async () => {
    const response = await api.get(API_ENDPOINTS.TEACHER.DASHBOARD);
    return response.data;
  },

  /**
   * Get teacher's subjects with summary statistics (Teacher/Admin only)
   * GET /api/v1/teacher/subjects
   */
  getSubjects: async () => {
    const response = await api.get(API_ENDPOINTS.TEACHER.SUBJECTS);
    return response.data;
  },

  /**
   * Get teacher's sessions with attendance summary (Teacher/Admin only)
   * GET /api/v1/teacher/sessions
   */
  getSessions: async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.TEACHER.SESSIONS, { params });
    return response.data;
  },

  /**
   * Get flagged attendance records for review (Teacher/Admin only)
   * GET /api/v1/teacher/flagged-attendance
   */
  getFlaggedAttendance: async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.TEACHER.FLAGGED_ATTENDANCE, { params });
    return response.data;
  },

  /**
   * Get detailed attendance information for a specific session (Teacher/Admin only)
   * GET /api/v1/teacher/session/{session_id}/details
   */
  getSessionDetails: async (sessionId) => {
    const response = await api.get(API_ENDPOINTS.TEACHER.SESSION_DETAILS(sessionId));
    return response.data;
  },

  /**
   * Generate comprehensive attendance report (Teacher/Admin only)
   * POST /api/v1/teacher/generate-report
   */
  generateReport: async (reportData) => {
    const response = await api.post(API_ENDPOINTS.TEACHER.GENERATE_REPORT, reportData);
    return response.data;
  },

  /**
   * Get teacher profile with subjects and settings (Teacher/Admin only)
   * GET /api/v1/teacher/profile
   */
  getProfile: async () => {
    const response = await api.get(API_ENDPOINTS.TEACHER.PROFILE);
    return response.data;
  },
};

export default teacherService;

