import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

const studentService = {
  /**
   * Get all students with filtering (Admin only)
   * GET /api/v1/admin/users?role=student
   */
  getStudents: async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.ADMIN.USERS, { 
      ...params, 
      role: 'student' 
    });
    return response.data;
  },

  /**
   * Get student by ID (Admin only)
   * GET /api/v1/admin/users/{user_id}
   */
  getStudentById: async (studentId) => {
    const response = await api.get(API_ENDPOINTS.ADMIN.USER_BY_ID(studentId));
    return response.data;
  },

  /**
   * Create a new student (Admin only)
   * POST /api/v1/admin/users
   */
  createStudent: async (studentData) => {
    const response = await api.post(API_ENDPOINTS.ADMIN.USERS, {
      ...studentData,
      role: 'student'
    });
    return response.data;
  },

  /**
   * Update student information (Admin only)
   * PUT /api/v1/admin/users/{user_id}
   */
  updateStudent: async (studentId, studentData) => {
    const response = await api.put(API_ENDPOINTS.ADMIN.USER_BY_ID(studentId), {
      ...studentData,
      role: 'student'
    });
    return response.data;
  },

  /**
   * Delete student (Admin only)
   * DELETE /api/v1/admin/users/{user_id}
   */
  deleteStudent: async (studentId) => {
    const response = await api.delete(API_ENDPOINTS.ADMIN.USER_BY_ID(studentId));
    return response.data;
  },

  /**
   * Get student attendance records (Admin only)
   * GET /api/v1/attendance/my-attendance
   */
  getStudentAttendance: async (studentId, params = {}) => {
    const response = await api.get(API_ENDPOINTS.ATTENDANCE.MY_ATTENDANCE, { 
      ...params,
      student_id: studentId 
    });
    return response.data;
  },
};

export default studentService;
