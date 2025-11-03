import { ok } from './mockUtils';
import { mockSessions, mockStudents } from './mockData';

const attendanceService = {
  /**
   * Submit attendance with AI validation (Student only)
   * POST /api/v1/attendance/submit
   */
  submitAttendance: async (attendanceData) => ok({ success: true, ...attendanceData }),

  /**
   * Submit offline attendance packet for later processing (Student only)
   * POST /api/v1/attendance/offline-submit
   */
  submitOfflineAttendance: async (attendanceData) => ok({ queued: true, ...attendanceData }),

  /**
   * Get current user's attendance records (Student only)
   * GET /api/v1/attendance/my-attendance
   */
  getMyAttendance: async () => {
    const totalSessions = mockSessions.length;
    const present = Math.floor(totalSessions * 0.85);
    const absent = totalSessions - present - 1;
    const suspicious = 1;
    return ok({ totalSessions, present, absent, suspicious });
  },

  /**
   * Get attendance records for a specific session (Teacher/Admin only)
   * GET /api/v1/attendance/session/{session_id}/attendance
   */
  getSessionAttendance: async (sessionId) => {
    const session = mockSessions.find((s) => s.id === sessionId);
    if (!session) return ok(null);
    const data = mockStudents.map((st) => ({
      id: st.id,
      name: st.name,
      email: st.email,
      status: session.present.includes(st.id)
        ? 'present'
        : session.absent.includes(st.id)
        ? 'absent'
        : 'suspicious',
    }));
    return ok(data);
  },

  /**
   * Manually override attendance status (Teacher/Admin only)
   * POST /api/v1/attendance/manual-override
   */
  manualOverride: async (data) => ok({ success: true, ...data }),

  /**
   * Get suspicious attendance records for review (Teacher/Admin only)
   * GET /api/v1/attendance/suspicious-attendance
   */
  getFlaggedAttendance: async () => {
    const suspicious = mockSessions
      .filter((s) => s.suspicious.length > 0)
      .flatMap((s) => s.suspicious.map((sid) => ({ sessionId: s.id, studentId: sid, date: s.date })));
    return ok(suspicious);
  },

  /**
   * Generate attendance report (Teacher/Admin only)
   * GET /api/v1/attendance/attendance-report
   */
  generateAttendanceReport: async (params = {}) => {
    // Return row-wise records matching AttendanceOversight page needs
    const rows = mockSessions.flatMap((s) =>
      mockStudents.map((st) => {
        const isPresent = s.present.includes(st.id);
        const isAbsent = s.absent.includes(st.id);
        const status = isPresent ? 'present' : isAbsent ? 'absent' : 'suspicious';
        return {
          student_name: st.name,
          student_id: st.id,
          subject_name: s.subject,
          session_name: s.session,
          status,
          submission_time: `${s.date}T09:45:00+05:30`,
          face_recognition_score: isPresent ? 0.92 : isAbsent ? 0.0 : 0.55,
          liveness_detection_score: isPresent ? 0.88 : isAbsent ? 0.0 : 0.6,
        };
      })
    );
    return ok(rows);
  },
};

export default attendanceService;

