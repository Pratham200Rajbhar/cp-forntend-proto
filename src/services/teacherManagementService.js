import { ok } from './mockUtils';
import { mockUsers, mockSessions, mockSubjects } from './mockData';

const teacherManagementService = {
  /**
   * Get all teachers with filtering (Admin only)
   * GET /api/v1/admin/users?role=teacher
   */
  getTeachers: async (params = {}) => {
    const { q, department } = params;
    let teachers = mockUsers.filter((u) => u.role === 'teacher');
    
    // Filter by department if provided
    if (department) {
      teachers = teachers.filter((t) => t.department === department);
    }
    
    // Filter by search query if provided
    if (q) {
      teachers = teachers.filter((t) => 
        [t.name, t.full_name, t.email, t.username].some((f) => 
          f && f.toLowerCase().includes(q.toLowerCase())
        )
      );
    }
    
    return ok(teachers);
  },

  /**
   * Get teacher by ID (Admin only)
   * GET /api/v1/admin/users/{user_id}
   */
  getTeacherById: async (teacherId) => ok(mockUsers.find((u) => u.id === teacherId) || null),
  
  /**
   * Alias for getTeacherById (for compatibility)
   */
  getTeacher: async (teacherId) => ok(mockUsers.find((u) => u.id === teacherId) || null),

  /**
   * Create a new teacher (Admin only)
   * POST /api/v1/admin/users
   */
  createTeacher: async (teacherData) => ok({ ...teacherData, id: teacherData.id || 'NEW-TEACH' }),

  /**
   * Update teacher information (Admin only)
   * PUT /api/v1/admin/users/{user_id}
   */
  updateTeacher: async (teacherId, teacherData) => ok({ ...teacherData, id: teacherId }),

  /**
   * Delete teacher (Admin only)
   * DELETE /api/v1/admin/users/{user_id}
   */
  deleteTeacher: async (teacherId) => ok({ success: true, id: teacherId }),

  /**
   * Get teacher's subjects (Admin only)
   * GET /api/v1/admin/subjects?teacher_id={teacher_id}
   */
  getTeacherSubjects: async () => ok(mockSubjects),

  /**
   * Get teacher's sessions (Admin only)
   * GET /api/v1/admin/sessions?teacher_id={teacher_id}
   */
  getTeacherSessions: async () => ok(mockSessions),
};

export default teacherManagementService;
