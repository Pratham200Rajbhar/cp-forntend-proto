import { ok } from './mockUtils';
import { mockAuditLogs } from './mockData';

const auditService = {
  /**
   * Get audit logs with filtering options (Admin only)
   * GET /api/v1/audit/logs
   */
  getLogs: async () => ok(mockAuditLogs),

  /**
   * Get attendance audit summary (Teacher/Admin only)
   * GET /api/v1/audit/attendance-summary
   */
  getAttendanceSummary: async () => ok({ presentRate: 87, suspiciousCount: 4 }),

  /**
   * Get activity logs for a specific user (Admin only)
   * GET /api/v1/audit/user-activity/{user_id}
   */
  getUserActivity: async (userId) => ok(mockAuditLogs.filter((l) => l.user.includes('Rahul'))),

  /**
   * Get security events (Admin only)
   * GET /api/v1/audit/security-events
   */
  getSecurityEvents: async () => ok([{ id: 'sec-1', event: 'Login', severity: 'low' }]),

  /**
   * Get failed attendance attempts (Teacher/Admin only)
   * GET /api/v1/audit/failed-attempts
   */
  getFailedAttempts: async () => ok([{ id: 'fail-1', reason: 'Outside geofence' }]),

  /**
   * Export audit logs (Admin only)
   * GET /api/v1/audit/export
   */
  exportLogs: async () => ok({ url: 'mock://audit-logs.csv' }),
};

export default auditService;

