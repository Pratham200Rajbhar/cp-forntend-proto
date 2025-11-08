# SmartAttend Dashboard - Page Requirements Documentation

## Table of Contents
- [Overview](#overview)
- [Authentication](#authentication)
- [Admin Pages](#admin-pages)
- [Teacher Pages](#teacher-pages)
- [Common Components](#common-components)
- [API Integration](#api-integration)
- [State Management](#state-management)

## Overview

SmartAttend is a comprehensive attendance management system built with React, featuring role-based access control for administrators and teachers. The system supports automated attendance tracking, manual overrides, geofencing, and detailed reporting.

### Technology Stack
- **Frontend**: React 19.1.1 with Vite
- **UI Framework**: Tailwind CSS
- **Form Management**: React Hook Form with Zod validation
- **Routing**: React Router DOM v6
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Maps**: React Leaflet
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

### User Roles
- **Admin**: Full system management capabilities
- **Teacher**: Class and attendance management
- **Student**: (Not implemented in dashboard, mobile app only)

---

## Authentication

### Login Page (`/login`)
**File**: `src/pages/auth/Login.jsx`

#### Requirements
- **Purpose**: User authentication entry point with role-based redirection
- **Access**: Public (unauthenticated users only)
- **Features**:
  - Email/password authentication
  - Remember me functionality
  - Responsive design with dark mode support
  - Demo credentials display
  - Automatic redirection based on user role

#### Form Fields
| Field | Type | Validation | Required |
|-------|------|------------|----------|
| Email | Email | Email format validation | Yes |
| Password | Password | Minimum 6 characters | Yes |
| Remember Me | Checkbox | Boolean | No |

#### User Flow
1. User enters email and password
2. System validates credentials via API
3. On success, redirect to role-specific dashboard:
   - Admin → `/admin/dashboard`
   - Teacher → `/teacher/dashboard`
4. On failure, display error message

#### Demo Credentials
- **Admin**: admin@attendance.com / admin123
- **Teacher**: teacher@example.com / password123

---

## Admin Pages

### Admin Dashboard (`/admin/dashboard`)
**File**: `src/pages/admin/AdminDashboard.jsx`

#### Requirements
- **Purpose**: System overview and quick navigation for administrators
- **Access**: Admin role only
- **Features**:
  - System statistics overview
  - Performance charts and analytics
  - Quick action buttons for management tasks
  - Real-time data updates

#### Dashboard Components
1. **Stats Cards**:
   - Total Students
   - Total Teachers
   - Total Subjects
   - Total Sessions

2. **Charts Section**:
   - Department Performance (Progress Chart)
   - System Overview (Stats Grid)
   - Weekly Attendance Trend (Line Chart)

3. **Quick Actions Grid**:
   - Students Management
   - Teachers Management
   - Subjects Management
   - Sessions Management
   - Attendance Oversight

4. **Management Cards**:
   - User Management shortcuts
   - Academic Management shortcuts

#### API Dependencies
- `adminService.getSystemStats()` - Fetch dashboard statistics
- Real-time updates for system metrics

---

### Student Management (`/admin/students`)
**File**: `src/pages/admin/StudentManagement.jsx`

#### Requirements
- **Purpose**: CRUD operations for student records
- **Access**: Admin role only
- **Features**:
  - Student listing with search and filtering
  - Add new students
  - Edit existing student information
  - Delete student records (with confirmation)
  - Department-based filtering
  - Pagination support

#### Table Columns
| Column | Data | Actions |
|--------|------|---------|
| Student | Name, Student ID, Avatar | - |
| Contact | Email, Phone | - |
| Department | Department name | Filter |
| Year & Section | Academic year, Section | - |
| Status | Active/Inactive | Badge |
| Actions | Edit, Delete | Buttons |

#### Features
- **Search**: By name, email, or student ID
- **Filter**: By department
- **Actions**: Add (+), Edit (pencil), Delete (trash)
- **Responsive**: Mobile-friendly table layout

#### Navigation
- Add Student → `/admin/students/add`
- Edit Student → `/admin/students/edit/:id`

---

### Student Form (`/admin/students/add` | `/admin/students/edit/:id`)
**File**: `src/pages/admin/StudentForm.jsx`

#### Requirements
- **Purpose**: Create and edit student records
- **Access**: Admin role only
- **Features**:
  - Form validation with Zod schema
  - Dynamic form title (Add/Edit)
  - Auto-populate form in edit mode
  - Responsive form layout

#### Form Fields
| Field | Type | Validation | Required |
|-------|------|------------|----------|
| Full Name | Text | Min 1 character | Yes |
| Email | Email | Valid email format | Yes |
| Username | Text | Min 3 characters | Yes |
| Password | Password | Min 6 characters | Yes (Add only) |
| Student ID | Text | Min 1 character | Yes |
| Department | Select | Must be valid department | Yes |
| Year | Select | 1st-4th Year | Yes |
| Section | Select | A-D | Yes |
| Phone Number | Text | Optional | No |
| Status | Checkbox | Active/Inactive | No |

#### Dropdowns Data
- **Departments**: Computer Science, IT, ECE, Mechanical, Civil, Electrical, Business Admin, Mathematics, Physics, Chemistry
- **Years**: 1st Year, 2nd Year, 3rd Year, 4th Year
- **Sections**: A, B, C, D

---

### Teacher Management (`/admin/teachers`)
**File**: `src/pages/admin/TeacherManagement.jsx`

#### Requirements
- **Purpose**: CRUD operations for teacher records
- **Access**: Admin role only
- **Features**:
  - Similar to Student Management
  - Teacher-specific fields
  - Department and subject associations

#### Key Differences from Student Management
- Shows subjects assigned to teachers
- Different validation schema
- Teacher-specific status management

---

### Teacher Form (`/admin/teachers/add` | `/admin/teachers/edit/:id`)
**File**: `src/pages/admin/TeacherForm.jsx`

#### Requirements
- **Purpose**: Create and edit teacher records
- **Access**: Admin role only
- **Features**:
  - Teacher-specific form fields
  - Subject assignment capabilities
  - Department association

---

### Subject Management (`/admin/subjects`)
**File**: `src/pages/admin/SubjectManagement.jsx`

#### Requirements
- **Purpose**: CRUD operations for academic subjects
- **Access**: Admin role only
- **Features**:
  - Subject listing with details
  - Add/edit/delete subjects
  - Teacher assignments
  - Course code management

#### Table Structure
- Subject name and code
- Department association
- Assigned teachers
- Credit hours
- Active status

---

### Subject Form (`/admin/subjects/add` | `/admin/subjects/edit/:id`)
**File**: `src/pages/admin/SubjectForm.jsx`

#### Requirements
- **Purpose**: Create and edit subject records
- **Access**: Admin role only
- **Features**:
  - Subject details form
  - Teacher assignment interface
  - Course code validation

---

### Session Management (`/admin/sessions`)
**File**: `src/pages/admin/SessionManagement.jsx`

#### Requirements
- **Purpose**: CRUD operations for class sessions
- **Access**: Admin role only
- **Features**:
  - Session scheduling interface
  - Subject and teacher assignment
  - Time slot management
  - Room/location assignment
  - Geofence zone association

#### Table Columns
| Column | Data |
|--------|------|
| Session | Session name, Subject |
| Date | Session date |
| Time | Start time - End time |
| Teacher | Assigned teacher |
| Location | Room/venue |
| Geofence | Associated zone |
| Status | Active/Completed |
| Actions | Edit, Delete, View |

---

### Session Form (`/admin/sessions/add` | `/admin/sessions/edit/:id`)
**File**: `src/pages/admin/SessionForm.jsx`

#### Requirements
- **Purpose**: Create and edit session records
- **Access**: Admin role only
- **Features**:
  - Session scheduling form
  - Date/time picker
  - Subject and teacher selection
  - Geofence zone assignment
  - Recurring session options

---

### Geofence Management (`/admin/geofence`)
**File**: `src/pages/admin/GeofenceManagement.jsx`

#### Requirements
- **Purpose**: Manage location-based attendance zones
- **Access**: Admin role only
- **Features**:
  - Interactive map interface
  - Zone creation and editing
  - Radius adjustment
  - Zone status management

#### Zone Properties
- **Name**: Zone identifier
- **Description**: Zone purpose
- **Center**: Latitude/longitude coordinates
- **Radius**: Zone radius in meters
- **Status**: Active/Inactive
- **Created Date**: Zone creation timestamp

#### Features
- **Map Integration**: Leaflet map for visual zone management
- **Location Search**: Address-based zone creation
- **Radius Visualization**: Visual radius display on map

---

### Geofence Form (`/admin/geofence/add` | `/admin/geofence/edit/:id`)
**File**: `src/pages/admin/GeofenceForm.jsx`

#### Requirements
- **Purpose**: Create and edit geofence zones
- **Access**: Admin role only
- **Features**:
  - Interactive map interface
  - Location picker
  - Radius slider
  - Zone validation

---

### Attendance Oversight (`/admin/attendance-oversight`)
**File**: `src/pages/admin/AttendanceOversight.jsx`

#### Requirements
- **Purpose**: System-wide attendance monitoring and reporting
- **Access**: Admin role only
- **Features**:
  - Comprehensive attendance analytics
  - Multi-filter search capabilities
  - Export functionality
  - Statistical overview

#### Filter Options
| Filter | Type | Options |
|--------|------|---------|
| Subject | Dropdown | All subjects |
| Session | Dropdown | All sessions |
| Status | Dropdown | Present, Absent, Late, Suspicious |
| Date Range | Date Picker | Start and end dates |
| Department | Dropdown | All departments |

#### Export Features
- CSV export
- PDF reports
- Excel format
- Custom date ranges

---

### System Configuration (`/admin/system-config`)
**File**: `src/pages/admin/SystemConfig.jsx`

#### Requirements
- **Purpose**: System settings and configuration management
- **Access**: Admin role only
- **Features**:
  - Attendance policies configuration
  - System parameters
  - Integration settings
  - Security settings

---

### Audit Logs (`/admin/audit-logs`)
**File**: `src/pages/admin/AuditLogs.jsx`

#### Requirements
- **Purpose**: System activity logging and monitoring
- **Access**: Admin role only
- **Features**:
  - User activity tracking
  - System changes log
  - Security events
  - Export capabilities

---

## Teacher Pages

### Teacher Dashboard (`/teacher/dashboard`)
**File**: `src/pages/teacher/TeacherDashboard.jsx`

#### Requirements
- **Purpose**: Teacher's main interface for class management
- **Access**: Teacher role only
- **Features**:
  - Teaching statistics overview
  - Today's sessions
  - Pending reviews
  - Subject performance analytics

#### Dashboard Components
1. **Stats Cards**:
   - Today's Sessions
   - Total Students
   - Suspicious Records
   - Pending Reviews

2. **Charts**:
   - Subject Performance
   - Quick Stats
   - Weekly Attendance Trend

3. **Today's Sessions**:
   - Session cards with quick actions
   - Attendance status
   - Student count

4. **Pending Reviews**:
   - Suspicious attendance records
   - Quick approve/reject actions

---

### Sessions (`/teacher/sessions`)
**File**: `src/pages/teacher/Sessions.jsx`

#### Requirements
- **Purpose**: Teacher's session management interface
- **Access**: Teacher role only
- **Features**:
  - Session listing for assigned subjects
  - Attendance statistics per session
  - Quick navigation to session details
  - Export functionality

#### Table Columns
| Column | Data |
|--------|------|
| Date | Session date |
| Time | Start - End time |
| Subject | Subject name |
| Session | Session name |
| Attendance | Present/Total (percentage) |
| Actions | View Details |

#### Features
- **Filter**: By subject, status
- **Search**: By session name, subject
- **Export**: Session reports

---

### Session Details (`/teacher/sessions/:sessionId`)
**File**: `src/pages/teacher/SessionDetails.jsx`

#### Requirements
- **Purpose**: Detailed view of individual session
- **Access**: Teacher role only
- **Features**:
  - Complete student attendance list
  - Individual attendance status
  - Manual attendance override
  - Suspicious records highlighting
  - Session analytics

#### Student List Columns
| Column | Data | Actions |
|--------|------|---------|
| Student | Name, ID, Photo | - |
| Attendance | Status, Timestamp | Override |
| Location | GPS coordinates | Verify |
| Confidence | AI confidence score | Review |
| Notes | Additional comments | Edit |

#### Actions Available
- **Manual Override**: Change attendance status
- **Bulk Actions**: Select multiple students
- **Export**: Session attendance report
- **Add Notes**: Additional comments per student

---

### Manual Attendance (`/teacher/manual-attendance`)
**File**: `src/pages/teacher/ManualAttendance.jsx`

#### Requirements
- **Purpose**: Manual attendance marking interface
- **Access**: Teacher role only
- **Features**:
  - Subject and session selection
  - Student roster with checkboxes
  - Bulk selection options
  - Notes and comments
  - Submit attendance

#### Workflow
1. **Select Subject**: Choose from assigned subjects
2. **Select Session**: Choose from available sessions
3. **Student Selection**: Check/uncheck student attendance
4. **Add Comments**: Optional notes for the session
5. **Submit**: Process manual attendance

#### Features
- **Select All**: Toggle all students
- **Search**: Find students quickly
- **Comments**: Session-level and student-level notes
- **Validation**: Ensure session and subject are selected

---

### Attendance History (`/teacher/attendance-history`)
**File**: `src/pages/teacher/AttendanceHistory.jsx`

#### Requirements
- **Purpose**: Historical attendance data viewing
- **Access**: Teacher role only
- **Features**:
  - Date range selection
  - Subject filtering
  - Student-wise attendance history
  - Export capabilities

---

### Flagged Review (`/teacher/flagged-review`)
**File**: `src/pages/teacher/FlaggedReview.jsx`

#### Requirements
- **Purpose**: Review suspicious attendance records flagged by AI
- **Access**: Teacher role only
- **Features**:
  - Suspicious attendance listing
  - AI confidence scores
  - Review and decision interface
  - Bulk review capabilities
  - Override reasons

#### Review Process
1. **View Record**: See flagged attendance with details
2. **Check Evidence**: Location, time, confidence score
3. **Make Decision**: Approve or reject attendance
4. **Add Reason**: Explanation for decision
5. **Submit**: Process the review

#### Suspicious Record Properties
- **Student Information**: Name, ID, email
- **Session Details**: Subject, session name, date
- **Attendance Data**: Timestamp, location, method
- **AI Analysis**: Confidence score, anomaly reasons
- **Status**: Pending, Approved, Rejected

---

### Reports (`/teacher/reports`)
**File**: `src/pages/teacher/Reports.jsx`

#### Requirements
- **Purpose**: Generate and export attendance reports
- **Access**: Teacher role only
- **Features**:
  - Multiple report types
  - Custom date ranges
  - Subject selection
  - Export formats (PDF, CSV, Excel)
  - Report preview

#### Report Types
1. **Summary Report**: Overall attendance statistics
2. **Detailed Report**: Complete attendance records
3. **Student-wise Report**: Individual student analytics
4. **Subject-wise Report**: Subject performance analysis

#### Configuration Options
| Option | Type | Description |
|--------|------|-------------|
| Report Type | Dropdown | Summary, Detailed, Student-wise, Subject-wise |
| Date Range | Date Picker | Start and end dates |
| Subjects | Multi-select | Include specific subjects |
| Include Details | Checkbox | Add student details |
| Format | Radio | PDF, CSV, Excel |

---

## Common Components

### Layout Components

#### Layout (`src/components/layout/Layout.jsx`)
- **Purpose**: Main application layout wrapper
- **Features**:
  - Header with user menu
  - Sidebar navigation
  - Content area
  - Theme switching
  - Responsive design

#### Header (`src/components/layout/Header.jsx`)
- **Purpose**: Top navigation bar
- **Features**:
  - User profile menu
  - Theme toggle
  - Notifications (if applicable)
  - Logout functionality

#### Sidebar (`src/components/layout/Sidebar.jsx`)
- **Purpose**: Navigation sidebar
- **Features**:
  - Role-based navigation items
  - Collapsible design
  - Active state indication
  - Mobile responsive

#### ProtectedRoute (`src/components/layout/ProtectedRoute.jsx`)
- **Purpose**: Route access control
- **Features**:
  - Role-based access control
  - Authentication checking
  - Redirect to login if unauthorized

### Common UI Components

#### Cards (`src/components/common/Card.jsx`)
- **Purpose**: Content containers
- **Variants**: Basic card, with header, with footer

#### Tables (`src/components/common/Table.jsx`)
- **Purpose**: Data display tables
- **Features**:
  - Responsive design
  - Custom column rendering
  - Loading states
  - Empty states

#### Forms (`src/components/common/`)
- **Input.jsx**: Text inputs with validation
- **Select.jsx**: Dropdown selections
- **Checkbox.jsx**: Checkbox inputs
- **Textarea.jsx**: Multi-line text inputs
- **Button.jsx**: Action buttons with variants

#### Charts (`src/components/common/Chart.jsx`)
- **Purpose**: Data visualization
- **Types**:
  - Progress charts
  - Line charts
  - Donut charts
  - Stats grids

---

## API Integration

### Service Layer Structure

#### Base API (`src/services/api.js`)
- **Purpose**: Axios instance configuration
- **Features**:
  - Request/response interceptors
  - Authentication token handling
  - Error handling
  - Base URL configuration

#### Authentication Service (`src/services/authService.js`)
- **Methods**:
  - `login(email, password)`
  - `logout()`
  - `getCurrentUser()`
  - `isAuthenticated()`
  - `getStoredUser()`

#### Admin Service (`src/services/adminService.js`)
- **Methods**:
  - `getSystemStats()`
  - `getStudents(params)`
  - `getTeachers(params)`
  - `getSubjects(params)`
  - `getSessions(params)`
  - `getGeofenceZones(params)`
  - CRUD operations for all entities

#### Teacher Service (`src/services/teacherService.js`)
- **Methods**:
  - `getDashboard()`
  - `getSessions(params)`
  - `getSubjects()`
  - `getSuspiciousAttendance(params)`
  - `getSessionDetails(sessionId)`

#### Attendance Service (`src/services/attendanceService.js`)
- **Methods**:
  - `generateAttendanceReport(params)`
  - `manualOverride(data)`
  - `submitManualAttendance(data)`

---

## State Management

### Context Providers

#### AuthContext (`src/context/AuthContext.jsx`)
- **State**:
  - `user`: Current user data
  - `isAuthenticated`: Authentication status
  - `loading`: Loading state
- **Methods**:
  - `login()`: User authentication
  - `logout()`: User logout
  - `updateUser()`: Update user data
  - `hasRole()`: Role checking
  - `isAdmin()`, `isTeacher()`: Role helpers

#### ThemeContext (`src/context/ThemeContext.jsx`)
- **State**:
  - `theme`: Current theme (light/dark)
- **Methods**:
  - `toggleTheme()`: Switch themes
  - `setTheme()`: Set specific theme

### Custom Hooks

#### useAuth (`src/hooks/useAuth.js`)
- **Purpose**: Authentication state management
- **Returns**: AuthContext values

#### useTheme (`src/hooks/useTheme.js`)
- **Purpose**: Theme management
- **Returns**: ThemeContext values

#### useFetch (`src/hooks/useFetch.js`)
- **Purpose**: Data fetching utility
- **Features**:
  - Loading states
  - Error handling
  - Data caching

#### useDebounce (`src/hooks/useDebounce.js`)
- **Purpose**: Input debouncing
- **Use Cases**: Search functionality

---

## Data Flow and Business Logic

### Authentication Flow
1. User submits login credentials
2. API validates credentials
3. On success, store user data and token
4. Redirect to role-specific dashboard
5. Subsequent requests include authentication token

### Attendance Management Flow
1. **Automated**: Mobile app submits attendance
2. **AI Analysis**: System analyzes attendance validity
3. **Flagging**: Suspicious records flagged for review
4. **Teacher Review**: Teachers review flagged records
5. **Override**: Manual overrides when necessary
6. **Reporting**: Generate reports and analytics

### Role-Based Access Control
- **Route Protection**: ProtectedRoute component checks user roles
- **API Security**: Backend validates user permissions
- **UI Elements**: Conditional rendering based on roles

### Data Validation
- **Frontend**: Zod schemas for form validation
- **Backend**: API-level validation
- **Real-time**: Form field validation as user types

---

## Performance Considerations

### Optimization Strategies
1. **Code Splitting**: Route-based code splitting
2. **Lazy Loading**: Component lazy loading
3. **Memoization**: React.memo for components
4. **Debouncing**: Search input debouncing
5. **Pagination**: Large dataset pagination
6. **Caching**: API response caching

### Bundle Size Management
- **Tree Shaking**: Remove unused code
- **Dynamic Imports**: Load components on demand
- **Asset Optimization**: Image and icon optimization

---

## Security Requirements

### Authentication Security
- **Token Management**: JWT token handling
- **Session Management**: Secure session storage
- **Password Policies**: Strong password requirements

### Data Protection
- **Input Sanitization**: Prevent XSS attacks
- **CSRF Protection**: Cross-site request forgery prevention
- **API Security**: Authenticated API endpoints

### Role-Based Security
- **Access Control**: Strict role-based access
- **Permission Checking**: Multiple layers of validation
- **Audit Trail**: User action logging

---

## Browser Compatibility

### Supported Browsers
- **Chrome**: Latest 2 versions
- **Firefox**: Latest 2 versions
- **Safari**: Latest 2 versions
- **Edge**: Latest 2 versions

### Progressive Enhancement
- **Core Functionality**: Works without JavaScript
- **Enhanced Features**: JavaScript-enabled features
- **Mobile Support**: Responsive design for mobile devices

---

## Future Enhancements

### Planned Features
1. **Real-time Notifications**: WebSocket integration
2. **Advanced Analytics**: Machine learning insights
3. **Mobile App Integration**: Deep linking
4. **Offline Capability**: Progressive Web App features
5. **Multi-language Support**: Internationalization
6. **Advanced Reporting**: Custom report builder
7. **Integration APIs**: Third-party system integration

### Scalability Considerations
1. **Performance Monitoring**: User experience tracking
2. **Load Balancing**: Multi-instance deployment
3. **Database Optimization**: Query performance
4. **CDN Integration**: Asset delivery optimization
5. **Caching Strategy**: Redis integration for caching

---

This documentation provides a comprehensive overview of all page requirements in the SmartAttend dashboard. Each page is designed with specific user roles in mind, ensuring secure and efficient attendance management for educational institutions.