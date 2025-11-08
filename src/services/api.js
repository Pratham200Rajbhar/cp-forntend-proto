import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';

// Create a custom HTTP client
const api = {
  async request(url, options = {}) {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    
    const config = {
      method: 'GET',
      headers: {
        ...options.headers,
      },
      ...options,
    };

    // Only add Content-Type if not FormData (FormData sets its own Content-Type)
    if (!(options.body instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    // Add authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${url}`, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.detail || errorData.message || `HTTP ${response.status}`);
        error.status = response.status;
        error.data = errorData;
        throw error;
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  },

  get: async (url, options = {}) => {
    return api.request(url, { ...options, method: 'GET' });
  },

  post: async (url, data = null, options = {}) => {
    const body = data instanceof FormData ? data : (data ? JSON.stringify(data) : null);
    return api.request(url, {
      ...options,
      method: 'POST',
      body,
    });
  },

  put: async (url, data = null, options = {}) => {
    return api.request(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : null,
    });
  },

  patch: async (url, data = null, options = {}) => {
    return api.request(url, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : null,
    });
  },

  delete: async (url, options = {}) => {
    return api.request(url, { ...options, method: 'DELETE' });
  },
};

// ========================================
// Authentication Services
// ========================================
export const authService = {
  register: (userData) => api.post('/api/auth/register', userData),
  
  login: (credentials) => api.post('/api/auth/login', credentials),
  
  getProfile: () => api.get('/api/auth/profile'),
  
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }
};

// ========================================
// Attendance Services
// ========================================
export const attendanceService = {
  verifyAttendance: async (studentId, faceImage) => {
    const formData = new FormData();
    formData.append('student_id', studentId);
    formData.append('face_image', faceImage);
    
    return api.post('/api/attendance/verify', formData);
  },
  
  getStudentAttendance: (studentId) => api.get(`/api/attendance/${studentId}`),
  
  getAttendanceBySession: (sessionId) => api.get(`/api/attendance/session/${sessionId}`),
  
  getFlaggedAttendance: () => api.get('/api/attendance/flagged'),
  
  updateAttendanceStatus: (attendanceId, status) => 
    api.patch(`/api/attendance/${attendanceId}`, { status }),
};

// ========================================
// Student Services
// ========================================
export const studentService = {
  getAll: () => api.get('/api/admin/students'),
  
  getById: (id) => api.get(`/api/admin/students/${id}`),
  
  create: (studentData) => api.post('/api/admin/students', studentData),
  
  update: (id, studentData) => api.put(`/api/admin/students/${id}`, studentData),
  
  delete: (id) => api.delete(`/api/admin/students/${id}`),
  
  uploadFace: async (studentId, faceImage) => {
    const formData = new FormData();
    formData.append('face_image', faceImage);
    
    return api.post(`/api/admin/students/${studentId}/face`, formData);
  },
};

// ========================================
// Teacher Services
// ========================================
export const teacherService = {
  getAll: () => api.get('/api/admin/teachers'),
  
  getById: (id) => api.get(`/api/admin/teachers/${id}`),
  
  create: (teacherData) => api.post('/api/admin/teachers', teacherData),
  
  update: (id, teacherData) => api.put(`/api/admin/teachers/${id}`, teacherData),
  
  delete: (id) => api.delete(`/api/admin/teachers/${id}`),
};

// ========================================
// Subject Services
// ========================================
export const subjectService = {
  getAll: () => api.get('/api/admin/subjects'),
  
  getById: (id) => api.get(`/api/admin/subjects/${id}`),
  
  create: (subjectData) => api.post('/api/admin/subjects', subjectData),
  
  update: (id, subjectData) => api.put(`/api/admin/subjects/${id}`, subjectData),
  
  delete: (id) => api.delete(`/api/admin/subjects/${id}`),
};

// ========================================
// Session Services
// ========================================
export const sessionService = {
  getAll: () => api.get('/api/sessions'),
  
  getById: (id) => api.get(`/api/sessions/${id}`),
  
  create: (sessionData) => api.post('/api/sessions', sessionData),
  
  update: (id, sessionData) => api.put(`/api/sessions/${id}`, sessionData),
  
  delete: (id) => api.delete(`/api/sessions/${id}`),
  
  getActive: () => api.get('/api/sessions/active'),
  
  getByTeacher: (teacherId) => api.get(`/api/sessions/teacher/${teacherId}`),
};

// ========================================
// Geofence Services
// ========================================
export const geofenceService = {
  getAll: () => api.get('/api/geofence'),
  
  getById: (id) => api.get(`/api/geofence/${id}`),
  
  create: (geofenceData) => api.post('/api/geofence', geofenceData),
  
  update: (id, geofenceData) => api.put(`/api/geofence/${id}`, geofenceData),
  
  delete: (id) => api.delete(`/api/geofence/${id}`),
};

// ========================================
// Audit Log Services
// ========================================
export const auditService = {
  getAll: (filters) => {
    const params = new URLSearchParams(filters).toString();
    return api.get(`/api/audit${params ? `?${params}` : ''}`);
  },
  
  getById: (id) => api.get(`/api/audit/${id}`),
};

// ========================================
// System Configuration Services
// ========================================
export const configService = {
  getAll: () => api.get('/api/config'),
  
  update: (key, value) => api.put('/api/config', { key, value }),
  
  reset: () => api.post('/api/config/reset'),
};

// ========================================
// Reports Services
// ========================================
export const reportService = {
  getAttendanceReport: (filters) => {
    const params = new URLSearchParams(filters).toString();
    return api.get(`/api/reports/attendance${params ? `?${params}` : ''}`);
  },
  
  getSessionReport: (sessionId) => api.get(`/api/reports/session/${sessionId}`),
  
  getStudentReport: (studentId, filters) => {
    const params = new URLSearchParams(filters).toString();
    return api.get(`/api/reports/student/${studentId}${params ? `?${params}` : ''}`);
  },
  
  exportReport: (type, filters) => {
    const params = new URLSearchParams(filters).toString();
    return api.get(`/api/reports/export/${type}${params ? `?${params}` : ''}`, {
      headers: { Accept: 'text/csv' }
    });
  },
};

// ========================================
// Dashboard Services
// ========================================
export const dashboardService = {
  getAdminStats: () => api.get('/api/dashboard/admin'),
  
  getTeacherStats: (teacherId) => api.get(`/api/dashboard/teacher/${teacherId}`),
  
  getOverview: () => api.get('/api/dashboard/overview'),
};

export default api;

