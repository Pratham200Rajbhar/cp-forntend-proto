// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// API Endpoints - Updated to match API_ENDPOINTS_GUIDE.md
export const API_ENDPOINTS = {
  // Auth - v1 API
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    ME: '/api/v1/auth/me',
    REFRESH: '/api/v1/auth/refresh',
    LOGOUT: '/api/v1/auth/logout',
    PASSWORD_RESET: '/api/v1/auth/password-reset',
    PASSWORD_RESET_CONFIRM: '/api/v1/auth/password-reset/confirm',
    CHANGE_PASSWORD: '/api/v1/auth/change-password',
  },
  // Attendance - v1 API
  ATTENDANCE: {
    SUBMIT: '/api/v1/attendance/submit',
    OFFLINE_SUBMIT: '/api/v1/attendance/offline-submit',
    MY_ATTENDANCE: '/api/v1/attendance/my-attendance',
    SESSION_ATTENDANCE: (sessionId) => `/api/v1/attendance/session/${sessionId}/attendance`,
    MANUAL_OVERRIDE: '/api/v1/attendance/manual-override',
    SUSPICIOUS: '/api/v1/attendance/suspicious-attendance',
    ATTENDANCE_REPORT: '/api/v1/attendance/attendance-report',
  },
  // Teacher - v1 API
  TEACHER: {
    DASHBOARD: '/api/v1/teacher/dashboard',
    SUBJECTS: '/api/v1/teacher/subjects',
    SESSIONS: '/api/v1/teacher/sessions',
    SUSPICIOUS_ATTENDANCE: '/api/v1/teacher/suspicious-attendance',
    SESSION_DETAILS: (sessionId) => `/api/v1/teacher/session/${sessionId}/details`,
    GENERATE_REPORT: '/api/v1/teacher/generate-report',
    PROFILE: '/api/v1/teacher/profile',
  },
  // Admin - v1 API
  ADMIN: {
    USERS: '/api/v1/admin/users',
    USER_BY_ID: (userId) => `/api/v1/admin/users/${userId}`,
    SUBJECTS: '/api/v1/admin/subjects',
    SUBJECT_BY_ID: (subjectId) => `/api/v1/admin/subjects/${subjectId}`,
    SESSIONS: '/api/v1/admin/sessions',
    SESSION_BY_ID: (sessionId) => `/api/v1/admin/sessions/${sessionId}`,
    GEOFENCE_ZONES: '/api/v1/admin/geofence-zones',
    GEOFENCE_ZONE_BY_ID: (zoneId) => `/api/v1/admin/geofence-zones/${zoneId}`,
    STATS: '/api/v1/admin/stats',
    ATTENDANCE_OVERVIEW: '/api/v1/admin/attendance-overview',
    HEALTH: '/api/v1/admin/health',
    CONFIG: '/api/v1/admin/config',
    BACKUP: '/api/v1/admin/backup',
  },
  // Audit - v1 API
  AUDIT: {
    LOGS: '/api/v1/audit/logs',
    ATTENDANCE_SUMMARY: '/api/v1/audit/attendance-summary',
    USER_ACTIVITY: (userId) => `/api/v1/audit/user-activity/${userId}`,
    SECURITY_EVENTS: '/api/v1/audit/security-events',
    FAILED_ATTEMPTS: '/api/v1/audit/failed-attempts',
    EXPORT: '/api/v1/audit/export',
  },
  // System Health
  HEALTH: '/health',
  ROOT: '/',
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
};

// Attendance Status
export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  SUSPICIOUS: 'suspicious',
  PENDING: 'pending',
};

// Attendance Status Colors
export const STATUS_COLORS = {
  present: 'success',
  absent: 'error',
  suspicious: 'warning',
  pending: 'info',
};

// AI Validation Thresholds (default)
export const AI_THRESHOLDS = {
  FACE_RECOGNITION: 0.8,
  LIVENESS_DETECTION: 0.7,
  BACKGROUND_VALIDATION: 0.6,
  AUDIO_VALIDATION: 0.7,
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_LONG: 'MMMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
  ISO: "yyyy-MM-dd'T'HH:mm:ss",
  TIME_ONLY: 'HH:mm',
  DATE_ONLY: 'yyyy-MM-dd',
};

// Pagination
export const PAGINATION = {
  DEFAULT_LIMIT: 50,
  PAGE_SIZE_OPTIONS: [20, 50, 100, 200],
};

// Chart Colors
export const CHART_COLORS = {
  PRIMARY: '#0284c7',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  INFO: '#3b82f6',
  PURPLE: '#a855f7',
  PINK: '#ec4899',
  GRAY: '#6b7280',
};

// Report Types
export const REPORT_TYPES = {
  SUMMARY: 'summary',
  DETAILED: 'detailed',
  STUDENT_WISE: 'student',
  SUBJECT_WISE: 'subject',
  CUSTOM: 'custom',
};

// Export Formats
export const EXPORT_FORMATS = {
  CSV: 'csv',
  PDF: 'pdf',
  EXCEL: 'excel',
  JSON: 'json',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
};

