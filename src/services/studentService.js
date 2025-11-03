import { ok } from './mockUtils';
import { mockStudents } from './mockData';

const studentService = {
  /**
   * Get all students with filtering (Admin only)
   * GET /api/v1/admin/users?role=student
   */
  getStudents: async (params = {}) => {
    const { q } = params;
    const hay = (s) => [s.name, s.email, s.rollNumber, s.department, s.year, s.section].filter(Boolean).join(' ').toLowerCase();
    const filtered = q ? mockStudents.filter((s) => hay(s).includes(q.toLowerCase())) : mockStudents;
    return ok(filtered);
  },

  /**
   * Get student by ID (Admin only)
   * GET /api/v1/admin/users/{user_id}
   */
  getStudentById: async (studentId) => ok(mockStudents.find((s) => s.id === studentId) || null),

  // Compatibility alias for pages using getStudent(id)
  getStudent: async (studentId) => ok(mockStudents.find((s) => s.id === studentId) || null),

  /**
   * Create a new student (Admin only)
   * POST /api/v1/admin/users
   */
  createStudent: async (studentData) => ok({ ...studentData, id: studentData.id || 'NEW-STU' }),

  /**
   * Update student information (Admin only)
   * PUT /api/v1/admin/users/{user_id}
   */
  updateStudent: async (studentId, studentData) => ok({ ...studentData, id: studentId }),

  /**
   * Delete student (Admin only)
   * DELETE /api/v1/admin/users/{user_id}
   */
  deleteStudent: async (studentId) => ok({ success: true, id: studentId }),

  // Note: No direct admin endpoint to fetch another user's "my-attendance".
  // Use report or session-specific endpoints from admin/attendance APIs instead.
};

export default studentService;
