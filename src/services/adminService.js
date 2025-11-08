import { ok } from './mockUtils';
import { mockSubjects, mockSessions, mockStudents, mockSystem, mockGeofences } from './mockData';

const adminService = {

  // Subject Management (Admin only)
  /**
   * Get all subjects (Admin only)
   * GET /api/v1/admin/subjects
   */
  getSubjects: async (params = {}) => {
    const { teacher_id, q, limit } = params;
    let subjects = [...mockSubjects];
    
    // Filter by teacher_id if provided
    if (teacher_id) {
      subjects = subjects.filter((s) => s.teacher_id === teacher_id);
    }
    
    // Filter by search query if provided
    if (q) {
      subjects = subjects.filter((s) => 
        [s.name, s.code, s.description].some((f) => 
          f && f.toLowerCase().includes(q.toLowerCase())
        )
      );
    }
    
    // Apply limit if provided
    if (limit) {
      subjects = subjects.slice(0, limit);
    }
    
    return ok(subjects);
  },

  /**
   * Get subject by ID (Admin only)
   * GET /api/v1/admin/subjects/{subject_id}
   */
  getSubjectById: async (subjectId) => ok(mockSubjects.find((s) => s.id === subjectId) || null),
  
  /**
   * Alias for getSubjectById (for compatibility)
   */
  getSubject: async (subjectId) => ok(mockSubjects.find((s) => s.id === subjectId) || null),

  /**
   * Create a new subject (Admin only)
   * POST /api/v1/admin/subjects
   */
  createSubject: async (subjectData) => ok({ ...subjectData, id: subjectData.id || 'NEW-SUBJ' }),

  /**
   * Update subject (Admin only)
   * PUT /api/v1/admin/subjects/{subject_id}
   */
  updateSubject: async (subjectId, subjectData) => ok({ ...subjectData, id: subjectId }),

  /**
   * Delete subject (Admin only)
   * DELETE /api/v1/admin/subjects/{subject_id}
   */
  deleteSubject: async (subjectId) => ok({ success: true, id: subjectId }),

  // Session Management (Admin only)
  /**
   * Get all sessions (Admin only)
   * GET /api/v1/admin/sessions
   */
  getSessions: async () => ok(mockSessions),

  /**
   * Get session by ID (Admin only)
   * GET /api/v1/admin/sessions/{session_id}
   */
  getSessionById: async (sessionId) => ok(mockSessions.find((s) => s.id === sessionId) || null),

  /**
   * Create a new session (Admin only)
   * POST /api/v1/admin/sessions
   */
  createSession: async (sessionData) => ok({ ...sessionData, id: 'NEW-SESSION' }),

  /**
   * Update session (Admin only)
   * PUT /api/v1/admin/sessions/{session_id}
   */
  updateSession: async (sessionId, sessionData) => ok({ ...sessionData, id: sessionId }),

  /**
   * Delete session (Admin only)
   * DELETE /api/v1/admin/sessions/{session_id}
   */
  deleteSession: async (sessionId) => ok({ success: true, id: sessionId }),

  // Geofence Zone Management (Admin only)
  /**
   * Get all geofence zones (Admin only)
   * GET /api/v1/admin/geofence-zones
   */
  getGeofenceZones: async () => ok(mockGeofences),

  /**
   * Get geofence zone by ID (Admin only)
   * GET /api/v1/admin/geofence-zones/{zone_id}
   */
  getGeofenceZoneById: async (zoneId) => ok(mockGeofences.find((z) => z.id === zoneId) || null),

  /**
   * Create a new geofence zone (Admin only)
   * POST /api/v1/admin/geofence-zones
   */
  createGeofenceZone: async (zoneData) => ok({ ...zoneData, id: 'NEW-GF' }),

  /**
   * Update geofence zone (Admin only)
   * PUT /api/v1/admin/geofence-zones/{zone_id}
   */
  updateGeofenceZone: async (zoneId, zoneData) => ok({ ...zoneData, id: zoneId }),

  /**
   * Delete geofence zone (Admin only)
   * DELETE /api/v1/admin/geofence-zones/{zone_id}
   */
  deleteGeofenceZone: async (zoneId) => ok({ success: true, id: zoneId }),

  // System Statistics (Admin only)
  /**
   * Get system statistics (Admin only)
   * GET /api/v1/admin/stats
   */
  getSystemStats: async () => ok({
    total_students: mockSystem.stats.totalStudents,
    total_teachers: mockSystem.stats.totalTeachers,
    total_subjects: (mockSubjects || []).length,
    total_sessions: (mockSessions || []).length,
  }),

  /**
   * Get attendance overview (Admin only)
   * GET /api/v1/admin/attendance-overview
   */
  getAttendanceOverview: async () => ok({ bySubject: mockSubjects.map((s) => ({ subject: s.name, rate: 85 })) }),

  /**
   * Get system health status (Admin only)
   * GET /api/v1/admin/health
   */
  getSystemHealth: async () => ok(mockSystem.health),

  // System Configuration (Admin only)
  /**
   * Get system configuration (Admin only)
   * GET /api/v1/admin/config
   */
  getSystemConfig: async () => ok(mockSystem.config),

  /**
   * Update system configuration (Admin only)
   * PUT /api/v1/admin/config
   */
  updateSystemConfig: async (configData) => ok({ ...mockSystem.config, ...configData }),

  // System Backup (Admin only)
  /**
   * Create system backup (Admin only)
   * POST /api/v1/admin/backup
   */
  createBackup: async () => ok({ success: true, file: 'mock-backup.tar.gz' }),
};

export default adminService;

