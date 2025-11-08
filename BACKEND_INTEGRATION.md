# Backend Integration Guide

This document describes how the SmartAttend frontend has been integrated with the backend API.

## 📋 Overview

The frontend is now fully connected to the backend API endpoints documented in `API_DOCUMENTATION.md`. All CRUD operations, authentication, and attendance tracking now use real API calls.

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory with:

```env
VITE_API_BASE_URL=http://localhost:8000
```

The default value is `http://localhost:8000` if not specified.

### Backend Requirements

Make sure the backend server is running on `http://localhost:8000` (or your configured URL) before starting the frontend.

## 🏗️ Architecture

### API Service Layer (`src/services/api.js`)

The centralized API service provides:

**Core HTTP Client**
- Automatic JWT token management
- Error handling and logging
- FormData support for file uploads
- JSON request/response handling

**Service Modules:**

1. **authService** - Authentication operations
   - `register(userData)` - Register new user
   - `login(credentials)` - Login user
   - `getProfile()` - Get current user profile
   - `logout()` - Clear local auth data

2. **studentService** - Student management
   - `getAll()` - Get all students
   - `getById(id)` - Get student by ID
   - `create(studentData)` - Create new student
   - `update(id, studentData)` - Update student
   - `delete(id)` - Delete student
   - `uploadFace(studentId, faceImage)` - Upload face for recognition

3. **teacherService** - Teacher management
   - `getAll()` - Get all teachers
   - `getById(id)` - Get teacher by ID
   - `create(teacherData)` - Create new teacher
   - `update(id, teacherData)` - Update teacher
   - `delete(id)` - Delete teacher

4. **attendanceService** - Attendance operations
   - `verifyAttendance(studentId, faceImage)` - Mark attendance with face
   - `getStudentAttendance(studentId)` - Get student's attendance history
   - `getAttendanceBySession(sessionId)` - Get session attendance
   - `getFlaggedAttendance()` - Get flagged attendance for review
   - `updateAttendanceStatus(attendanceId, status)` - Update attendance status

5. **sessionService** - Session management
   - `getAll()` - Get all sessions
   - `getById(id)` - Get session by ID
   - `create(sessionData)` - Create new session
   - `update(id, sessionData)` - Update session
   - `delete(id)` - Delete session
   - `getActive()` - Get active sessions
   - `getByTeacher(teacherId)` - Get teacher's sessions

6. **subjectService** - Subject management
   - `getAll()` - Get all subjects
   - `getById(id)` - Get subject by ID
   - `create(subjectData)` - Create new subject
   - `update(id, subjectData)` - Update subject
   - `delete(id)` - Delete subject

7. **geofenceService** - Geofence management
   - `getAll()` - Get all geofence zones
   - `getById(id)` - Get geofence by ID
   - `create(geofenceData)` - Create new geofence
   - `update(id, geofenceData)` - Update geofence
   - `delete(id)` - Delete geofence

8. **reportService** - Reporting operations
   - `getAttendanceReport(filters)` - Get attendance reports
   - `getSessionReport(sessionId)` - Get session-specific report
   - `getStudentReport(studentId, filters)` - Get student report
   - `exportReport(type, filters)` - Export report as CSV

9. **dashboardService** - Dashboard statistics
   - `getAdminStats()` - Get admin dashboard stats
   - `getTeacherStats(teacherId)` - Get teacher dashboard stats
   - `getOverview()` - Get overview statistics

10. **auditService** - Audit logging
    - `getAll(filters)` - Get audit logs with filters
    - `getById(id)` - Get specific audit log

11. **configService** - System configuration
    - `getAll()` - Get all config settings
    - `update(key, value)` - Update config value
    - `reset()` - Reset to default config

## 🔐 Authentication Flow

### AuthContext (`src/context/AuthContext.jsx`)

The authentication context has been updated to:

1. **Login Process:**
   - Call `authService.login()` with credentials
   - Store JWT token in localStorage
   - Fetch and store user profile
   - Navigate to role-based dashboard

2. **Token Verification:**
   - On app load, verify stored token with backend
   - Auto-logout if token is invalid/expired
   - Refresh user profile on successful verification

3. **Profile Management:**
   - `refreshProfile()` - Re-fetch user profile from backend
   - `updateUser()` - Update local user state
   - Role-based access control helpers

### Protected Routes

The `ProtectedRoute` component automatically:
- Checks authentication status
- Verifies user role for admin/teacher routes
- Redirects to login if not authenticated
- Shows loading state during auth verification

## 📄 Integrated Pages

### Admin Pages

**StudentManagement** (`src/pages/admin/StudentManagement.jsx`)
- ✅ Fetch students from API on mount
- ✅ Delete student with confirmation
- ✅ Real-time table updates
- ✅ Loading states

**StudentForm** (`src/pages/admin/StudentForm.jsx`)
- ✅ Create new student
- ✅ Update existing student
- ✅ Upload face image for recognition
- ✅ Form validation with Zod
- ✅ Face image preview

**TeacherManagement** (`src/pages/admin/TeacherManagement.jsx`)
- ✅ Fetch teachers from API
- ✅ Delete teacher with confirmation
- ✅ Loading states

**TeacherForm** (Similar structure to StudentForm)
- ✅ Create/update teachers
- ✅ Form validation

**SubjectManagement & SessionManagement**
- Similar integration pattern
- Full CRUD operations

**GeofenceManagement**
- Geofence zone creation and management
- Map integration (when implemented)

### Teacher Pages

**TeacherDashboard**
- Dashboard statistics API integration
- Real-time session data

**Sessions**
- Teacher's session list
- Active session management

**AttendanceHistory**
- Student attendance records
- Filtering and search

**FlaggedReview**
- Review flagged attendance
- Approve/reject functionality

### Auth Pages

**Login** (`src/pages/auth/Login.jsx`)
- ✅ Real API authentication
- ✅ JWT token management
- ✅ Role-based redirection
- ✅ Error handling with toast notifications

## 🎨 UI Features

### Toast Notifications

All API operations show user feedback:
- ✅ Success messages (green)
- ❌ Error messages (red)
- ℹ️ Info messages (blue)

### Loading States

All data fetching shows:
- Table skeletons during load
- Button disabled states during submission
- Spinners for async operations

### Error Handling

Comprehensive error handling:
- Network errors caught and displayed
- Validation errors shown inline
- 401 errors trigger auto-logout
- 403 errors show permission messages

## 🔄 Data Flow Example

### Creating a Student

```javascript
// 1. User fills form in StudentForm.jsx
const onSubmit = async (data) => {
  // 2. Validate with Zod schema
  // 3. Call API service
  const response = await studentService.create(data);
  
  // 4. If face image provided, upload it
  if (faceImage) {
    await studentService.uploadFace(response.data.student_id, faceImage);
  }
  
  // 5. Show success toast
  toast.success('Student created successfully');
  
  // 6. Navigate back to list
  navigate('/admin/students');
};
```

### Marking Attendance

```javascript
// 1. Capture face image from camera
const captureAndVerify = async () => {
  const base64Image = captureFromCamera();
  
  // 2. Send to backend for verification
  const result = await attendanceService.verifyAttendance(
    studentId,
    base64Image
  );
  
  // 3. Handle response
  if (result.status === 'present') {
    toast.success('Attendance marked successfully');
  } else if (result.status === 'flagged') {
    toast.warning('Low confidence - flagged for review');
  }
};
```

## 🧪 Testing

### Manual Testing Checklist

**Authentication:**
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Auto-logout on token expiry
- [ ] Role-based redirects (admin → admin dashboard, teacher → teacher dashboard)

**Student Management:**
- [ ] Create student
- [ ] Upload face image
- [ ] Edit student
- [ ] Delete student
- [ ] List students with search/filter

**Teacher Management:**
- [ ] Create teacher
- [ ] Edit teacher
- [ ] Delete teacher
- [ ] List teachers

**Attendance:**
- [ ] Submit attendance with face image
- [ ] View attendance history
- [ ] Review flagged attendance
- [ ] Manual attendance override

**Sessions:**
- [ ] Create session
- [ ] Update session
- [ ] Delete session
- [ ] View session details

## 🐛 Common Issues

### CORS Errors

If you see CORS errors, ensure the backend CORS settings include your frontend origin:

```python
# Backend CORS configuration should allow:
BACKEND_CORS_ORIGINS = ["http://localhost:5173", "http://localhost:3000"]
```

### 401 Unauthorized

- Check if JWT token is present in localStorage
- Verify token hasn't expired (24 hour default)
- Ensure Authorization header format: `Bearer <token>`

### Face Recognition Fails

- Ensure good lighting in photos
- Face should be clearly visible and front-facing
- Student must have face uploaded first via StudentForm

### Network Errors

- Confirm backend is running on configured URL
- Check network tab in browser DevTools
- Verify API_BASE_URL in .env file

## 🚀 Next Steps

To further enhance the integration:

1. **Implement remaining pages:**
   - SubjectForm
   - GeofenceForm
   - SessionDetails with attendance marking
   - Reports page with export functionality

2. **Add real-time features:**
   - WebSocket for live attendance updates
   - Real-time session status
   - Push notifications

3. **Enhance error handling:**
   - Retry logic for failed requests
   - Offline mode support
   - Better error messages

4. **Performance optimization:**
   - Request caching
   - Pagination for large lists
   - Image optimization for face uploads

5. **Testing:**
   - Unit tests for API service
   - Integration tests for auth flow
   - E2E tests for critical workflows

## 📚 API Documentation Reference

See `API_DOCUMENTATION.md` for complete API endpoint documentation including:
- Request/response formats
- Authentication requirements
- Error codes
- Example requests

## 🤝 Contributing

When adding new features:

1. Add new service methods to appropriate service in `api.js`
2. Update this README with integration details
3. Add toast notifications for user feedback
4. Implement loading states
5. Handle errors gracefully
6. Test with real backend before committing

---

**Last Updated:** November 8, 2024
**Status:** ✅ Core features integrated and functional
