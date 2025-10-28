import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

const teacherManagementService = {
  /**
   * Get all teachers with filtering (Admin only)
   * GET /api/v1/admin/users?role=teacher
   */
  getTeachers: async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.ADMIN.USERS, { 
      ...params, 
      role: 'teacher' 
    });
    return response.data;
  },

  /**
   * Get teacher by ID (Admin only)
   * GET /api/v1/admin/users/{user_id}
   */
  getTeacherById: async (teacherId) => {
    const response = await api.get(API_ENDPOINTS.ADMIN.USER_BY_ID(teacherId));
    return response.data;
  },

  /**
   * Create a new teacher (Admin only)
   * POST /api/v1/admin/users
   */
  createTeacher: async (teacherData) => {
    const response = await api.post(API_ENDPOINTS.ADMIN.USERS, {
      ...teacherData,
      role: 'teacher'
    });
    return response.data;
  },

  /**
   * Update teacher information (Admin only)
   * PUT /api/v1/admin/users/{user_id}
   */
  updateTeacher: async (teacherId, teacherData) => {
    const response = await api.put(API_ENDPOINTS.ADMIN.USER_BY_ID(teacherId), {
      ...teacherData,
      role: 'teacher'
    });
    return response.data;
  },

  /**
   * Delete teacher (Admin only)
   * DELETE /api/v1/admin/users/{user_id}
   */
  deleteTeacher: async (teacherId) => {
    const response = await api.delete(API_ENDPOINTS.ADMIN.USER_BY_ID(teacherId));
    return response.data;
  },

  /**
   * Get teacher's subjects (Admin only)
   * GET /api/v1/admin/subjects?teacher_id={teacher_id}
   */
  getTeacherSubjects: async (teacherId, params = {}) => {
    const response = await api.get(API_ENDPOINTS.ADMIN.SUBJECTS, { 
      ...params,
      teacher_id: teacherId 
    });
    return response.data;
  },

  /**
   * Get teacher's sessions (Admin only)
   * GET /api/v1/admin/sessions?teacher_id={teacher_id}
   */
  getTeacherSessions: async (teacherId, params = {}) => {
    const response = await api.get(API_ENDPOINTS.ADMIN.SESSIONS, { 
      ...params,
      teacher_id: teacherId 
    });
    return response.data;
  },
};

export default teacherManagementService;
