import { ok } from './mockUtils';
import { mockSessions, mockSubjects, mockStudents, mockDashboardStats } from './mockData';

const teacherService = {
  /**
   * Get teacher dashboard overview (Teacher/Admin only)
   * GET /api/v1/teacher/dashboard
   */
  getDashboard: async () => {
    // Use the enhanced mock dashboard stats
    const dashboardStats = mockDashboardStats.teacher;
    
    // Calculate today's sessions dynamically
    const today = new Date().toISOString().split('T')[0];
    const todaySessions = mockSessions.filter(s => s.date === today).length;
    
    // Calculate suspicious attendance from actual sessions
    const suspiciousAttendance = mockSessions
      .filter(s => s.suspicious && s.suspicious.length > 0)
      .reduce((total, s) => total + s.suspicious.length, 0);
    
    // Calculate recent activity from actual sessions
    const recentActivity = mockSessions
      .filter(s => s.status === 'completed')
      .slice(0, 3)
      .map(session => {
        const activities = [];
        
        // Add present students
        session.present.forEach(studentId => {
          const student = mockStudents.find(s => s.id === studentId);
          if (student) {
            activities.push({
              student_name: student.name,
              session_name: session.session,
              status: 'present',
              timestamp: `${session.date}T${session.startTime}:00+05:30`
            });
          }
        });
        
        // Add absent students
        session.absent.forEach(studentId => {
          const student = mockStudents.find(s => s.id === studentId);
          if (student) {
            activities.push({
              student_name: student.name,
              session_name: session.session,
              status: 'absent',
              timestamp: `${session.date}T${session.startTime}:00+05:30`
            });
          }
        });
        
        // Add suspicious students
        session.suspicious.forEach(studentId => {
          const student = mockStudents.find(s => s.id === studentId);
          if (student) {
            activities.push({
              student_name: student.name,
              session_name: session.session,
              status: 'suspicious',
              timestamp: `${session.date}T${session.startTime}:00+05:30`
            });
          }
        });
        
        return activities;
      })
      .flat()
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5);

    return ok({
      today_sessions: todaySessions,
      total_students: mockStudents.length,
      flagged_attendance: suspiciousAttendance,
      pending_reviews: suspiciousAttendance,
      recent_activity: recentActivity,
      // Transform subject_performance to match ProgressChart component format
      subject_performance: dashboardStats.subject_performance?.map(item => ({
        label: item.subject || item.label,
        value: item.attendance || item.value
      })) || [
        { label: 'Data Structures', value: 85 },
        { label: 'Algorithms', value: 92 },
        { label: 'Database Systems', value: 78 }
      ],
      weekly_attendance: dashboardStats.weekly_attendance,
      quick_stats: dashboardStats.quick_stats
    });
  },

  /**
   * Get teacher's subjects with summary statistics (Teacher/Admin only)
   * GET /api/v1/teacher/subjects
   */
  getSubjects: async () => ok(mockSubjects),

  /**
   * Get teacher's sessions with attendance summary (Teacher/Admin only)
   * GET /api/v1/teacher/sessions
   */
  getSessions: async (params = {}) => {
    const subjectId = params.subject_id || params.subjectId;
    const filtered = subjectId
      ? mockSessions.filter((s) => s.subjectId === subjectId)
      : mockSessions;
    
    // Transform sessions to include all required fields for the table
    const shaped = filtered.map((s) => ({
      id: s.id,
      session_name: s.session,
      subject_name: s.subject,
      session_date: s.date,
      start_time: s.startTime,
      end_time: s.endTime,
      present_count: s.present.length,
      absent_count: s.absent.length,
      suspicious_count: s.suspicious.length,
      total_students: s.present.length + s.absent.length + s.suspicious.length,
      attendance_rate: s.attendanceRate,
      status: s.status,
      room: s.room,
      teacher: s.teacher
    }));
    return ok(shaped);
  },

  /**
   * Get suspicious attendance records for review (Teacher/Admin only)
   * GET /api/v1/teacher/suspicious-attendance
   */
  getSuspiciousAttendance: async () => {
    const suspiciousRecords = [];
    
    mockSessions.forEach(session => {
      if (session.suspicious && session.suspicious.length > 0) {
        session.suspicious.forEach(studentId => {
          const student = mockStudents.find(s => s.id === studentId);
          if (student) {
            suspiciousRecords.push({
              id: `${session.id}-${studentId}`,
              student_id: studentId,
              student_name: student.name,
              student_email: student.email,
              session_id: session.id,
              session_name: session.session,
              subject_name: session.subject,
              submission_time: `${session.date}T${session.startTime}:00+05:30`,
              face_recognition_score: 0.65 + Math.random() * 0.3, // Random score between 0.65-0.95
              liveness_detection_score: 0.60 + Math.random() * 0.35, // Random score between 0.60-0.95
              background_validation_score: 0.70 + Math.random() * 0.25, // Random score between 0.70-0.95
              geofence_validation: Math.random() > 0.3, // 70% chance of valid geofence
              is_manually_approved: false,
              created_at: `${session.date}T${session.startTime}:00+05:30`
            });
          }
        });
      }
    });
    
    return ok(suspiciousRecords);
  },

  /**
   * Get detailed attendance information for a specific session (Teacher/Admin only)
   * GET /api/v1/teacher/session/{session_id}/details
   */
  getSessionDetails: async (sessionId) => {
    const session = mockSessions.find((s) => s.id === sessionId);
    if (!session) return ok(null);
    const students = mockStudents.map((st) => ({
      id: st.id,
      name: st.name,
      email: st.email,
      status: session.present.includes(st.id)
        ? 'present'
        : session.absent.includes(st.id)
        ? 'absent'
        : 'flagged',
    }));
    return ok({ ...session, students });
  },

  /**
   * Generate comprehensive attendance report (Teacher/Admin only)
   * POST /api/v1/teacher/generate-report
   */
  generateReport: async (reportData) => ok({ success: true, reportId: 'mock-report-1', ...reportData }),

  /**
   * Get teacher profile with subjects and settings (Teacher/Admin only)
   * GET /api/v1/teacher/profile
   */
  getProfile: async () => ok({ name: 'Rahul Sharma', subjects: mockSubjects }),
};

export default teacherService;

