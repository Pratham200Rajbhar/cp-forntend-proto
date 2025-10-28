import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';

// Teacher Pages
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import Sessions from './pages/teacher/Sessions';
import SessionDetails from './pages/teacher/SessionDetails';
import FlaggedReview from './pages/teacher/FlaggedReview';
import ManualAttendance from './pages/teacher/ManualAttendance';
import AttendanceHistory from './pages/teacher/AttendanceHistory';
import TeacherReports from './pages/teacher/Reports';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentManagement from './pages/admin/StudentManagement';
import StudentForm from './pages/admin/StudentForm';
import TeacherManagement from './pages/admin/TeacherManagement';
import TeacherForm from './pages/admin/TeacherForm';
import SubjectManagement from './pages/admin/SubjectManagement';
import SubjectForm from './pages/admin/SubjectForm';
import SessionManagement from './pages/admin/SessionManagement';
import SessionForm from './pages/admin/SessionForm';
import GeofenceManagement from './pages/admin/GeofenceManagement';
import GeofenceForm from './pages/admin/GeofenceForm';
import AttendanceOversight from './pages/admin/AttendanceOversight';
import SystemConfig from './pages/admin/SystemConfig';
import AuditLogs from './pages/admin/AuditLogs';
import AdminReports from './pages/teacher/Reports'; // Reusing Reports component

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />

              {/* Teacher Routes */}
              <Route
                path="/teacher/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['teacher']}>
                    <TeacherDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teacher/sessions"
                element={
                  <ProtectedRoute allowedRoles={['teacher']}>
                    <Sessions />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teacher/sessions/:sessionId"
                element={
                  <ProtectedRoute allowedRoles={['teacher']}>
                    <SessionDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teacher/flagged-review"
                element={
                  <ProtectedRoute allowedRoles={['teacher']}>
                    <FlaggedReview />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teacher/manual-attendance"
                element={
                  <ProtectedRoute allowedRoles={['teacher']}>
                    <ManualAttendance />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teacher/attendance-history"
                element={
                  <ProtectedRoute allowedRoles={['teacher']}>
                    <AttendanceHistory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teacher/reports"
                element={
                  <ProtectedRoute allowedRoles={['teacher']}>
                    <TeacherReports />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/students"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <StudentManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/students/add"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <StudentForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/students/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <StudentForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/teachers"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <TeacherManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/teachers/add"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <TeacherForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/teachers/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <TeacherForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/subjects"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <SubjectManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/subjects/add"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <SubjectForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/subjects/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <SubjectForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/sessions"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <SessionManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/sessions/add"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <SessionForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/sessions/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <SessionForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/geofence"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <GeofenceManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/geofence/add"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <GeofenceForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/geofence/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <GeofenceForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/attendance-oversight"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AttendanceOversight />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminReports />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/system-config"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <SystemConfig />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/audit-logs"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AuditLogs />
                  </ProtectedRoute>
                }
              />

              {/* Default Redirect */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>

            {/* Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--toast-bg, #fff)',
                  color: 'var(--toast-color, #000)',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
