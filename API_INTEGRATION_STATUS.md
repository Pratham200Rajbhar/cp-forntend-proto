# API Integration Status

This document outlines which components use documented API endpoints from `API_DOCUMENTATION.md` versus mock data.

## Overview

**Strategy**: The application uses a hybrid approach where:
- ✅ **Documented APIs** - Components use actual API endpoints from `API_DOCUMENTATION.md`
- 🔄 **Mock Data** - Components use placeholder data for endpoints not yet documented

This approach ensures:
- The UI remains fully functional during backend development
- Real API integration works for documented endpoints
- Easy transition when new endpoints are documented

---

## Documented API Endpoints (15 total)

### Authentication (3 endpoints)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

**Used by**: `Login.jsx`, `AuthContext.jsx`

### Attendance (2 endpoints)
- `POST /api/attendance/verify` - Verify and record attendance
- `GET /api/attendance/{student_id}` - Get attendance history

**Status**: Not currently used in dashboard views (attendance verification happens via separate flow)

### Admin - Students (4 endpoints)
- `GET /api/admin/students` - Get all students
- `POST /api/admin/students` - Create new student
- `DELETE /api/admin/students/{id}` - Delete student
- `POST /api/admin/students/{id}/face` - Upload face image

**Used by**:
- ✅ `StudentManagement.jsx` - GET all, DELETE
- ✅ `StudentForm.jsx` - POST create, POST face upload
- ✅ `AdminDashboard.jsx` - GET all (for statistics)
- ✅ `AttendanceOversight.jsx` - GET all (for filtering)

### Admin - Teachers (3 endpoints)
- `GET /api/admin/teachers` - Get all teachers
- `POST /api/admin/teachers` - Create new teacher
- `DELETE /api/admin/teachers/{id}` - Delete teacher

**Used by**:
- ✅ `TeacherManagement.jsx` - GET all, DELETE
- ✅ `TeacherForm.jsx` - POST create
- ✅ `AdminDashboard.jsx` - GET all (for statistics)
- ✅ `SubjectManagement.jsx` - GET all (for teacher selection)

### System (2 endpoints)
- `GET /` - Root endpoint
- `GET /health` - Health check

**Status**: Not used in dashboard (system/infrastructure endpoints)

---

## Components Using Mock Data

### Admin Dashboard
**File**: `src/pages/admin/AdminDashboard.jsx`

**Uses Real API**:
- ✅ Student list (`GET /api/admin/students`)
- ✅ Teacher list (`GET /api/admin/teachers`)

**Uses Mock Data**:
- 🔄 Dashboard statistics (total sessions, subjects, attendance rate)
- 🔄 Recent activity feed
- 🔄 Subject list
- 🔄 Session statistics
- 🔄 Chart data (attendance trends, subject distribution)

**Reason**: Dashboard statistics endpoints not documented

---

### Attendance Oversight
**File**: `src/pages/admin/AttendanceOversight.jsx`

**Uses Real API**:
- ✅ Student list for filters (`GET /api/admin/students`)

**Uses Mock Data**:
- 🔄 Attendance records (3 sample records)
- 🔄 Subject list for filters
- 🔄 Session list for filters
- 🔄 Export functionality

**Reason**: Attendance listing/reporting endpoints not documented

---

### Audit Logs
**File**: `src/pages/admin/AuditLogs.jsx`

**Uses Mock Data**:
- 🔄 All audit log entries (5 sample logs)
- 🔄 Export functionality
- 🔄 Client-side filtering (action, resource, user, date range)

**Reason**: Audit endpoints (`GET /api/audit/logs`, `GET /api/audit/export`) not documented

---

### Session Management
**File**: `src/pages/admin/SessionManagement.jsx`

**Uses Mock Data**:
- 🔄 All sessions (3 sample sessions)
- 🔄 Subject list for filters
- 🔄 Create/Update/Delete operations

**Reason**: Session endpoints (`GET/POST/PUT/DELETE /api/sessions`) not documented

---

### Subject Management
**File**: `src/pages/admin/SubjectManagement.jsx`

**Uses Real API**:
- ✅ Teacher list for assignment (`GET /api/admin/teachers`)

**Uses Mock Data**:
- 🔄 All subjects (4 sample subjects)
- 🔄 Create/Update/Delete operations

**Reason**: Subject endpoints (`GET/POST/PUT/DELETE /api/subjects`) not documented

---

### Geofence Management
**File**: `src/pages/admin/GeofenceManagement.jsx`

**Uses Mock Data**:
- 🔄 All geofence zones (4 sample zones)
- 🔄 Create/Update/Delete operations

**Reason**: Geofence endpoints (`GET/POST/PUT/DELETE /api/geofence`) not documented

---

### Teacher Dashboard
**File**: `src/pages/teacher/TeacherDashboard.jsx`

**Uses Mock Data**:
- 🔄 All dashboard data (schedule, recent activity, performance metrics)
- 🔄 Statistics (total sessions, present/absent counts, flagged students)
- 🔄 Charts (attendance trends, subject breakdown)

**Reason**: Teacher dashboard endpoints not documented

---

### Sessions (Teacher)
**File**: `src/pages/teacher/Sessions.jsx`

**Uses Mock Data**:
- 🔄 All sessions (4 sample sessions)
- 🔄 Subject list for filters
- 🔄 Export functionality

**Reason**: Session endpoints not documented

---

### Attendance History
**File**: `src/pages/teacher/AttendanceHistory.jsx`

**Uses Mock Data**:
- 🔄 Session-wise attendance (3 sample sessions)
- 🔄 Student-wise attendance (4 sample students)
- 🔄 Export functionality

**Reason**: Attendance reporting endpoints not documented

---

### Reports
**File**: `src/pages/teacher/Reports.jsx`

**Uses Mock Data**:
- 🔄 Subject list (5 sample subjects)
- 🔄 Report generation (simulated 2-second delay)
- 🔄 Export functionality (PDF/CSV/Excel)

**Reason**: Report generation endpoints not documented

---

## Form Components (Using Documented APIs)

### Student Form
**File**: `src/pages/admin/StudentForm.jsx`

**Uses Real API**:
- ✅ Create student (`POST /api/admin/students`)
- ✅ Upload face image (`POST /api/admin/students/{id}/face`)

---

### Teacher Form
**File**: `src/pages/admin/TeacherForm.jsx`

**Uses Real API**:
- ✅ Create teacher (`POST /api/admin/teachers`)

---

## Mock Data Characteristics

All mock data includes:
- **Realistic values** - Plausible names, dates, statistics
- **Variety** - Different statuses, times, locations
- **Relationships** - Connected data (teachers assigned to subjects, students in sessions)
- **Timestamps** - Relative dates (today, yesterday, last week)
- **Filtering support** - Mock data can be filtered client-side

---

## Migration Path

When new endpoints are added to `API_DOCUMENTATION.md`:

1. **Identify the component** using mock data
2. **Import the service** from `services/api.js`
3. **Replace mock data** with service call
4. **Update error handling** for API failures
5. **Test the integration** with real backend
6. **Update this document** to reflect changes

### Example Migration

**Before (Mock Data)**:
```javascript
const mockSessions = [
  { id: 1, name: 'Session 1', ... }
];
const [sessions, setSessions] = useState(mockSessions);
```

**After (Real API)**:
```javascript
import { sessionService } from '../../services/api';

const [sessions, setSessions] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchSessions = async () => {
    try {
      setLoading(true);
      const data = await sessionService.getAll();
      setSessions(data);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
      toast.error('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };
  fetchSessions();
}, []);
```

---

## Summary Statistics

- **Total Components**: 20+
- **Using Real APIs**: 8 components (Student Management, Teacher Management, Student Form, Teacher Form, Admin Dashboard partial, etc.)
- **Using Mock Data**: 12+ components (dashboards, reports, session/subject/geofence management, audit logs)
- **Documented Endpoints**: 15
- **Undocumented Features**: ~30+ endpoints needed

**Overall Integration**: ~40% real API, ~60% mock data

This hybrid approach allows the frontend to be fully functional while backend development continues.

---

*Last Updated: 2024*
*Status: Hybrid Integration (Documented APIs + Mock Fallback)*
