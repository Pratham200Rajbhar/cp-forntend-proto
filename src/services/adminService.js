import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

const adminService = {

  // Subject Management (Admin only)
  /**
   * Get all subjects (Admin only)
   * GET /api/v1/admin/subjects
   */
  getSubjects: async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.ADMIN.SUBJECTS, { params });
    return response.data;
  },

  /**
   * Get subject by ID (Admin only)
   * GET /api/v1/admin/subjects/{subject_id}
   */
  getSubjectById: async (subjectId) => {
    const response = await api.get(API_ENDPOINTS.ADMIN.SUBJECT_BY_ID(subjectId));
    return response.data;
  },

  /**
   * Create a new subject (Admin only)
   * POST /api/v1/admin/subjects
   */
  createSubject: async (subjectData) => {
    const response = await api.post(API_ENDPOINTS.ADMIN.SUBJECTS, subjectData);
    return response.data;
  },

  /**
   * Update subject (Admin only)
   * PUT /api/v1/admin/subjects/{subject_id}
   */
  updateSubject: async (subjectId, subjectData) => {
    const response = await api.put(API_ENDPOINTS.ADMIN.SUBJECT_BY_ID(subjectId), subjectData);
    return response.data;
  },

  /**
   * Delete subject (Admin only)
   * DELETE /api/v1/admin/subjects/{subject_id}
   */
  deleteSubject: async (subjectId) => {
    const response = await api.delete(API_ENDPOINTS.ADMIN.SUBJECT_BY_ID(subjectId));
    return response.data;
  },

  // Session Management (Admin only)
  /**
   * Get all sessions (Admin only)
   * GET /api/v1/admin/sessions
   */
  getSessions: async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.ADMIN.SESSIONS, { params });
    return response.data;
  },

  /**
   * Get session by ID (Admin only)
   * GET /api/v1/admin/sessions/{session_id}
   */
  getSessionById: async (sessionId) => {
    const response = await api.get(API_ENDPOINTS.ADMIN.SESSION_BY_ID(sessionId));
    return response.data;
  },

  /**
   * Create a new session (Admin only)
   * POST /api/v1/admin/sessions
   */
  createSession: async (sessionData) => {
    const response = await api.post(API_ENDPOINTS.ADMIN.SESSIONS, sessionData);
    return response.data;
  },

  /**
   * Update session (Admin only)
   * PUT /api/v1/admin/sessions/{session_id}
   */
  updateSession: async (sessionId, sessionData) => {
    const response = await api.put(API_ENDPOINTS.ADMIN.SESSION_BY_ID(sessionId), sessionData);
    return response.data;
  },

  /**
   * Delete session (Admin only)
   * DELETE /api/v1/admin/sessions/{session_id}
   */
  deleteSession: async (sessionId) => {
    const response = await api.delete(API_ENDPOINTS.ADMIN.SESSION_BY_ID(sessionId));
    return response.data;
  },

  // Geofence Zone Management (Admin only)
  /**
   * Get all geofence zones (Admin only)
   * GET /api/v1/admin/geofence-zones
   */
  getGeofenceZones: async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.ADMIN.GEOFENCE_ZONES, { params });
    return response.data;
  },

  /**
   * Get geofence zone by ID (Admin only)
   * GET /api/v1/admin/geofence-zones/{zone_id}
   */
  getGeofenceZoneById: async (zoneId) => {
    const response = await api.get(API_ENDPOINTS.ADMIN.GEOFENCE_ZONE_BY_ID(zoneId));
    return response.data;
  },

  /**
   * Create a new geofence zone (Admin only)
   * POST /api/v1/admin/geofence-zones
   */
  createGeofenceZone: async (zoneData) => {
    const response = await api.post(API_ENDPOINTS.ADMIN.GEOFENCE_ZONES, zoneData);
    return response.data;
  },

  /**
   * Update geofence zone (Admin only)
   * PUT /api/v1/admin/geofence-zones/{zone_id}
   */
  updateGeofenceZone: async (zoneId, zoneData) => {
    const response = await api.put(API_ENDPOINTS.ADMIN.GEOFENCE_ZONE_BY_ID(zoneId), zoneData);
    return response.data;
  },

  /**
   * Delete geofence zone (Admin only)
   * DELETE /api/v1/admin/geofence-zones/{zone_id}
   */
  deleteGeofenceZone: async (zoneId) => {
    const response = await api.delete(API_ENDPOINTS.ADMIN.GEOFENCE_ZONE_BY_ID(zoneId));
    return response.data;
  },

  // System Statistics (Admin only)
  /**
   * Get system statistics (Admin only)
   * GET /api/v1/admin/stats
   */
  getSystemStats: async () => {
    const response = await api.get(API_ENDPOINTS.ADMIN.STATS);
    return response.data;
  },

  /**
   * Get attendance overview (Admin only)
   * GET /api/v1/admin/attendance-overview
   */
  getAttendanceOverview: async () => {
    const response = await api.get(API_ENDPOINTS.ADMIN.ATTENDANCE_OVERVIEW);
    return response.data;
  },

  /**
   * Get system health status (Admin only)
   * GET /api/v1/admin/health
   */
  getSystemHealth: async () => {
    const response = await api.get(API_ENDPOINTS.ADMIN.HEALTH);
    return response.data;
  },

  // System Configuration (Admin only)
  /**
   * Get system configuration (Admin only)
   * GET /api/v1/admin/config
   */
  getSystemConfig: async () => {
    const response = await api.get(API_ENDPOINTS.ADMIN.CONFIG);
    return response.data;
  },

  /**
   * Update system configuration (Admin only)
   * PUT /api/v1/admin/config
   */
  updateSystemConfig: async (configData) => {
    const response = await api.put(API_ENDPOINTS.ADMIN.CONFIG, configData);
    return response.data;
  },

  // System Backup (Admin only)
  /**
   * Create system backup (Admin only)
   * POST /api/v1/admin/backup
   */
  createBackup: async (backupData) => {
    const response = await api.post(API_ENDPOINTS.ADMIN.BACKUP, backupData);
    return response.data;
  },
};

export default adminService;

