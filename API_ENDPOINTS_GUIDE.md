# Smart Attendance System - API Endpoints Guide

## Overview
This guide provides comprehensive documentation for all API endpoints in the Smart Attendance System backend. The system uses FastAPI with JWT authentication and provides AI-powered attendance validation.

**Base URL:** `http://localhost:8000` (or your deployed server URL)  
**API Version:** v1  
**Authentication:** Bearer Token (JWT)

## ⚠️ Important Notes for cURL Usage

### PowerShell Users
If you're using PowerShell on Windows, use `--data-binary` instead of `-d` for JSON files:
```bash
curl -X POST "http://localhost:8000/api/v1/auth/register" -H "Content-Type: application/json" --data-binary "@filename.json"
```

### JSON File Method (Recommended)
For complex JSON payloads, create a JSON file and reference it:
```bash
# Create file: test_data.json
# Then use: --data-binary "@test_data.json"
```

### Direct JSON (Simple cases)
For simple JSON, you can use inline JSON with proper escaping:
```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

## Table of Contents
1. [Authentication Endpoints](#authentication-endpoints)
2. [Attendance Endpoints](#attendance-endpoints)
3. [Teacher Dashboard Endpoints](#teacher-dashboard-endpoints)
4. [Admin Management Endpoints](#admin-management-endpoints)
5. [Audit Log Endpoints](#audit-log-endpoints)
6. [System Health Endpoints](#system-health-endpoints)
7. [Error Handling](#error-handling)
8. [Data Models](#data-models)
9. [Testing Results](#testing-results)

---

## Authentication Endpoints

### 1. User Registration
**POST** `/api/v1/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "email": "student@university.edu",
  "username": "john_doe",
  "full_name": "John Doe",
  "role": "student",
  "password": "securepassword123",
  "student_id": "STU001",
  "department": "Computer Science",
  "phone_number": "+1234567890"
}
```

**cURL Example (JSON File Method - Recommended):**
```bash
# Create register.json file with the above JSON
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  --data-binary "@register.json"
```

**cURL Example (Direct JSON):**
```bash
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"student@university.edu\",\"username\":\"john_doe\",\"full_name\":\"John Doe\",\"role\":\"student\",\"password\":\"securepassword123\",\"student_id\":\"STU001\",\"department\":\"Computer Science\",\"phone_number\":\"+1234567890\"}"
```

**Response:**
```json
{
  "id": 1,
  "email": "student@university.edu",
  "username": "john_doe",
  "full_name": "John Doe",
  "role": "student",
  "student_id": "STU001",
  "department": "Computer Science",
  "phone_number": "+1234567890",
  "is_active": true,
  "is_verified": false,
  "created_at": "2024-01-01T10:00:00Z",
  "updated_at": null,
  "last_login": null
}
```

### 2. User Login
**POST** `/api/v1/auth/login`

Authenticate user and receive JWT tokens.

**Request Body:**
```json
{
  "email": "student@university.edu",
  "password": "securepassword123"
}
```

**cURL Example (JSON File Method):**
```bash
# Create login.json file with the above JSON
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  --data-binary "@login.json"
```

**cURL Example (Direct JSON):**
```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"student@university.edu\",\"password\":\"securepassword123\"}"
```

**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "expires_in": null
}
```

### 3. Refresh Token
**POST** `/api/v1/auth/refresh`

Refresh access token using refresh token.

**Request Body:**
```json
{
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**cURL Example:**
```bash
curl -X POST "http://localhost:8000/api/v1/auth/refresh" \
  -H "Content-Type: application/json" \
  -d "{\"refresh_token\":\"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...\"}"
```

### 4. Get Current User Profile
**GET** `/api/v1/auth/me`

Get current authenticated user's profile.

**Headers:**
```
Authorization: Bearer <access_token>
```

**cURL Example:**
```bash
curl -X GET "http://localhost:8000/api/v1/auth/me" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

### 5. Logout
**POST** `/api/v1/auth/logout`

Logout user (client should discard tokens).

**Headers:**
```
Authorization: Bearer <access_token>
```

**cURL Example:**
```bash
curl -X POST "http://localhost:8000/api/v1/auth/logout" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

### 6. Password Reset Request
**POST** `/api/v1/auth/password-reset`

Request password reset.

**Request Body:**
```json
{
  "email": "student@university.edu"
}
```

**cURL Example:**
```bash
curl -X POST "http://localhost:8000/api/v1/auth/password-reset" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"student@university.edu\"}"
```

### 7. Password Reset Confirm
**POST** `/api/v1/auth/password-reset/confirm`

Confirm password reset with token.

**Request Body:**
```json
{
  "token": "reset_token_here",
  "new_password": "newpassword123"
}
```

**cURL Example:**
```bash
curl -X POST "http://localhost:8000/api/v1/auth/password-reset/confirm" \
  -H "Content-Type: application/json" \
  -d "{\"token\":\"reset_token_here\",\"new_password\":\"newpassword123\"}"
```

### 8. Change Password
**POST** `/api/v1/auth/change-password`

Change user password.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "current_password": "oldpassword123",
  "new_password": "newpassword123"
}
```

**cURL Example:**
```bash
curl -X POST "http://localhost:8000/api/v1/auth/change-password" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." \
  -H "Content-Type: application/json" \
  -d "{\"current_password\":\"oldpassword123\",\"new_password\":\"newpassword123\"}"
```

---

## Attendance Endpoints

### 1. Submit Attendance
**POST** `/api/v1/attendance/submit`

Submit attendance with AI validation (Student only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "session_id": 1,
  "face_image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
  "background_image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
  "audio_sample": "data:audio/wav;base64,UklGRnoGAABXQVZFZm10...",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "gps_accuracy": 5.0
}
```

**cURL Example (JSON File Method - Recommended):**
```bash
# Create attendance_submit.json file with the above JSON
curl -X POST "http://localhost:8000/api/v1/attendance/submit" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." \
  -H "Content-Type: application/json" \
  --data-binary "@attendance_submit.json"
```

**Response:**
```json
{
  "id": 1,
  "student_id": 1,
  "subject_id": 1,
  "session_id": 1,
  "status": "present",
  "submission_time": "2024-01-01T10:30:00Z",
  "face_recognition_score": 0.95,
  "liveness_detection_score": 0.88,
  "background_validation_score": 0.92,
  "audio_validation_score": 0.87,
  "geofence_validation": true,
  "latitude": 40.7128,
  "longitude": -74.0060,
  "gps_accuracy": 5.0,
  "is_manually_approved": false,
  "approved_by": null,
  "approval_notes": null,
  "approved_at": null,
  "created_at": "2024-01-01T10:30:00Z",
  "updated_at": null
}
```

### 2. Submit Offline Attendance
**POST** `/api/v1/attendance/offline-submit`

Submit offline attendance packet for later processing (Student only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "session_id": 1,
  "face_image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
  "background_image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
  "audio_sample": "data:audio/wav;base64,UklGRnoGAABXQVZFZm10...",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "gps_accuracy": 5.0,
  "timestamp": "2024-01-01T10:30:00Z",
  "device_info": {
    "device_model": "iPhone 13",
    "os_version": "iOS 15.0"
  }
}
```

**cURL Example:**
```bash
curl -X POST "http://localhost:8000/api/v1/attendance/offline-submit" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." \
  -H "Content-Type: application/json" \
  --data-binary "@offline_attendance.json"
```

### 3. Get My Attendance
**GET** `/api/v1/attendance/my-attendance`

Get current user's attendance records (Student only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `limit` (optional): Number of records to return (default: 50)
- `offset` (optional): Number of records to skip (default: 0)

**cURL Example:**
```bash
curl -X GET "http://localhost:8000/api/v1/attendance/my-attendance?limit=20&offset=0" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

### 4. Get Session Attendance
**GET** `/api/v1/attendance/session/{session_id}/attendance`

Get attendance records for a specific session (Teacher/Admin only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**cURL Example:**
```bash
curl -X GET "http://localhost:8000/api/v1/attendance/session/1/attendance" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

### 5. Manual Attendance Override
**POST** `/api/v1/attendance/manual-override`

Manually override attendance status (Teacher/Admin only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "attendance_record_id": 1,
  "new_status": "present",
  "reason": "Student was present but face recognition failed due to lighting"
}
```

**cURL Example:**
```bash
curl -X POST "http://localhost:8000/api/v1/attendance/manual-override" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." \
  -H "Content-Type: application/json" \
  -d "{\"attendance_record_id\":1,\"new_status\":\"present\",\"reason\":\"Student was present but face recognition failed due to lighting\"}"
```

### 6. Get Flagged Attendance
**GET** `/api/v1/attendance/flagged-attendance`

Get flagged attendance records for review (Teacher/Admin only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `limit` (optional): Number of records to return (default: 50)
- `offset` (optional): Number of records to skip (default: 0)

**cURL Example:**
```bash
curl -X GET "http://localhost:8000/api/v1/attendance/flagged-attendance?limit=20" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

### 7. Generate Attendance Report
**GET** `/api/v1/attendance/attendance-report`

Generate attendance report (Teacher/Admin only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `subject_id` (optional): Filter by subject ID
- `start_date` (optional): Filter by start date
- `end_date` (optional): Filter by end date

**cURL Example:**
```bash
curl -X GET "http://localhost:8000/api/v1/attendance/attendance-report?subject_id=1&start_date=2024-01-01&end_date=2024-01-31" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

---

## Teacher Dashboard Endpoints

### 1. Get Teacher Dashboard
**GET** `/api/v1/teacher/dashboard`

Get teacher dashboard overview (Teacher/Admin only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**cURL Example:**
```bash
curl -X GET "http://localhost:8000/api/v1/teacher/dashboard" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

**Response:**
```json
{
  "total_subjects": 3,
  "total_sessions": 15,
  "total_students": 45,
  "today_sessions": 2,
  "pending_attendance": 5,
  "flagged_attendance": 2,
  "recent_activity": [
    {
      "student_name": "John Doe",
      "session_name": "Data Structures Lecture",
      "status": "present",
      "timestamp": "2024-01-01T10:30:00Z",
      "subject_name": "Computer Science"
    }
  ]
}
```

### 2. Get Teacher Subjects
**GET** `/api/v1/teacher/subjects`

Get teacher's subjects with summary statistics (Teacher/Admin only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**cURL Example:**
```bash
curl -X GET "http://localhost:8000/api/v1/teacher/subjects" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

### 3. Get Teacher Sessions
**GET** `/api/v1/teacher/sessions`

Get teacher's sessions with attendance summary (Teacher/Admin only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `subject_id` (optional): Filter by subject ID
- `start_date` (optional): Filter by start date
- `end_date` (optional): Filter by end date
- `limit` (optional): Number of sessions to return (default: 50)

**cURL Example:**
```bash
curl -X GET "http://localhost:8000/api/v1/teacher/sessions?subject_id=1&limit=20" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

### 4. Get Flagged Attendance Details
**GET** `/api/v1/teacher/flagged-attendance`

Get flagged attendance records for review (Teacher/Admin only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `subject_id` (optional): Filter by subject ID
- `limit` (optional): Number of records to return (default: 50)

**cURL Example:**
```bash
curl -X GET "http://localhost:8000/api/v1/teacher/flagged-attendance?subject_id=1&limit=20" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

### 5. Get Session Attendance Details
**GET** `/api/v1/teacher/session/{session_id}/details`

Get detailed attendance information for a specific session (Teacher/Admin only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**cURL Example:**
```bash
curl -X GET "http://localhost:8000/api/v1/teacher/session/1/details" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

### 6. Generate Attendance Report
**POST** `/api/v1/teacher/generate-report`

Generate comprehensive attendance report (Teacher/Admin only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "subject_ids": [1, 2, 3],
  "start_date": "2024-01-01T00:00:00Z",
  "end_date": "2024-01-31T23:59:59Z",
  "report_type": "analytics",
  "include_student_details": true
}
```

**cURL Example:**
```bash
curl -X POST "http://localhost:8000/api/v1/teacher/generate-report" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." \
  -H "Content-Type: application/json" \
  --data-binary "@report_request.json"
```

### 7. Get Teacher Profile
**GET** `/api/v1/teacher/profile`

Get teacher profile with subjects and settings (Teacher/Admin only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**cURL Example:**
```bash
curl -X GET "http://localhost:8000/api/v1/teacher/profile" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

---

## Admin Management Endpoints

### User Management

#### 1. Create User
**POST** `/api/v1/admin/users`

Create a new user (Admin only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "email": "teacher@university.edu",
  "username": "jane_teacher",
  "full_name": "Jane Smith",
  "role": "teacher",
  "password": "securepassword123",
  "department": "Computer Science",
  "phone_number": "+1234567890",
  "is_active": true
}
```

**cURL Example:**
```bash
curl -X POST "http://localhost:8000/api/v1/admin/users" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." \
  -H "Content-Type: application/json" \
  --data-binary "@create_user.json"
```

#### 2. Get Users
**GET** `/api/v1/admin/users`

Get all users with filtering (Admin only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `role` (optional): Filter by role (student, teacher, admin)
- `is_active` (optional): Filter by active status
- `limit` (optional): Number of users to return (default: 100)
- `offset` (optional): Number of users to skip (default: 0)

**cURL Example:**
```bash
curl -X GET "http://localhost:8000/api/v1/admin/users?role=student&limit=50" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

#### 3. Get User by ID
**GET** `/api/v1/admin/users/{user_id}`

Get user by ID (Admin only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**cURL Example:**
```bash
curl -X GET "http://localhost:8000/api/v1/admin/users/1" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

#### 4. Update User
**PUT** `/api/v1/admin/users/{user_id}`

Update user information (Admin only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "full_name": "Jane Smith Updated",
  "department": "Mathematics",
  "is_active": true
}
```

**cURL Example:**
```bash
curl -X PUT "http://localhost:8000/api/v1/admin/users/1" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." \
  -H "Content-Type: application/json" \
  -d "{\"full_name\":\"Jane Smith Updated\",\"department\":\"Mathematics\",\"is_active\":true}"
```

#### 5. Delete User
**DELETE** `/api/v1/admin/users/{user_id}`

Delete user (Admin only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**cURL Example:**
```bash
curl -X DELETE "http://localhost:8000/api/v1/admin/users/1" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

### Subject Management

#### 1. Create Subject
**POST** `/api/v1/admin/subjects`

Create a new subject (Admin only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "name": "Data Structures and Algorithms",
  "code": "CS201",
  "description": "Introduction to data structures and algorithms",
  "teacher_id": 2
}
```

**cURL Example:**
```bash
curl -X POST "http://localhost:8000/api/v1/admin/subjects" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." \
  -H "Content-Type: application/json" \
  --data-binary "@create_subject.json"
```

#### 2. Get Subjects
**GET** `/api/v1/admin/subjects`

Get all subjects (Admin only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `teacher_id` (optional): Filter by teacher ID
- `limit` (optional): Number of subjects to return (default: 100)
- `offset` (optional): Number of subjects to skip (default: 0)

**cURL Example:**
```bash
curl -X GET "http://localhost:8000/api/v1/admin/subjects?teacher_id=2&limit=50" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

#### 3. Get Subject by ID
**GET** `/api/v1/admin/subjects/{subject_id}`

Get subject by ID (Admin only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**cURL Example:**
```bash
curl -X GET "http://localhost:8000/api/v1/admin/subjects/1" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

#### 4. Update Subject
**PUT** `/api/v1/admin/subjects/{subject_id}`

Update subject (Admin only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**cURL Example:**
```bash
curl -X PUT "http://localhost:8000/api/v1/admin/subjects/1" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Updated Subject Name\",\"description\":\"Updated description\"}"
```

#### 5. Delete Subject
**DELETE** `/api/v1/admin/subjects/{subject_id}`

Delete subject (Admin only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**cURL Example:**
```bash
curl -X DELETE "http://localhost:8000/api/v1/admin/subjects/1" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

### Session Management

#### 1. Create Session
**POST** `/api/v1/admin/sessions`

Create a new session (Admin only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "subject_id": 1,
  "session_name": "Data Structures Lecture 1",
  "session_date": "2024-01-15T00:00:00Z",
  "start_time": "2024-01-15T09:00:00Z",
  "end_time": "2024-01-15T10:30:00Z",
  "geofence_zone_id": 1
}
```

**cURL Example:**
```bash
curl -X POST "http://localhost:8000/api/v1/admin/sessions" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." \
  -H "Content-Type: application/json" \
  --data-binary "@create_session.json"
```

#### 2. Get Sessions
**GET** `/api/v1/admin/sessions`

Get all sessions (Admin only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `subject_id` (optional): Filter by subject ID
- `limit` (optional): Number of sessions to return (default: 100)
- `offset` (optional): Number of sessions to skip (default: 0)

**cURL Example:**
```bash
curl -X GET "http://localhost:8000/api/v1/admin/sessions?subject_id=1&limit=50" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

#### 3. Get Session by ID
**GET** `/api/v1/admin/sessions/{session_id}`

Get session by ID (Admin only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**cURL Example:**
```bash
curl -X GET "http://localhost:8000/api/v1/admin/sessions/1" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

#### 4. Update Session
**PUT** `/api/v1/admin/sessions/{session_id}`

Update session (Admin only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**cURL Example:**
```bash
curl -X PUT "http://localhost:8000/api/v1/admin/sessions/1" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." \
  -H "Content-Type: application/json" \
  -d "{\"session_name\":\"Updated Session Name\",\"is_active\":true}"
```

#### 5. Delete Session
**DELETE** `/api/v1/admin/sessions/{session_id}`

Delete session (Admin only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**cURL Example:**
```bash
curl -X DELETE "http://localhost:8000/api/v1/admin/sessions/1" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

### Geofence Zone Management

#### 1. Create Geofence Zone
**POST** `/api/v1/admin/geofence-zones`

Create a new geofence zone (Admin only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "name": "Main Campus Building A",
  "description": "Main campus building A classroom area",
  "center_latitude": 40.7128,
  "center_longitude": -74.0060,
  "radius_meters": 50.0,
  "polygon_coordinates": [
    [40.7125, -74.0065],
    [40.7131, -74.0065],
    [40.7131, -74.0055],
    [40.7125, -74.0055]
  ]
}
```

**cURL Example:**
```bash
curl -X POST "http://localhost:8000/api/v1/admin/geofence-zones" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." \
  -H "Content-Type: application/json" \
  --data-binary "@create_geofence.json"
```

#### 2. Get Geofence Zones
**GET** `/api/v1/admin/geofence-zones`

Get all geofence zones (Admin only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `is_active` (optional): Filter by active status

**cURL Example:**
```bash
curl -X GET "http://localhost:8000/api/v1/admin/geofence-zones?is_active=true" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

### System Statistics

#### 1. Get System Stats
**GET** `/api/v1/admin/stats`

Get system statistics (Admin only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**cURL Example:**
```bash
curl -X GET "http://localhost:8000/api/v1/admin/stats" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

**Response:**
```json
{
  "total_users": 150,
  "total_students": 120,
  "total_teachers": 25,
  "total_admins": 5,
  "total_subjects": 30,
  "total_sessions": 200,
  "total_attendance_records": 5000,
  "total_geofence_zones": 10,
  "active_sessions_today": 5,
  "attendance_rate_today": 85.5
}
```

#### 2. Get Attendance Overview
**GET** `/api/v1/admin/attendance-overview`

Get attendance overview (Admin only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**cURL Example:**
```bash
curl -X GET "http://localhost:8000/api/v1/admin/attendance-overview" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

#### 3. Get System Health
**GET** `/api/v1/admin/health`

Get system health status (Admin only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**cURL Example:**
```bash
curl -X GET "http://localhost:8000/api/v1/admin/health" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

**Response:**
```json
{
  "database_status": "healthy",
  "ai_models_status": "healthy",
  "storage_status": "healthy",
  "api_status": "healthy",
  "overall_status": "healthy",
  "last_health_check": "2025-10-28T03:59:20.256662",
  "issues": []
}
```

#### 4. Get System Configuration
**GET** `/api/v1/admin/config`

Get system configuration (Admin only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**cURL Example:**
```bash
curl -X GET "http://localhost:8000/api/v1/admin/config" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

#### 5. Update System Configuration
**PUT** `/api/v1/admin/config`

Update system configuration (Admin only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "face_recognition_threshold": 0.8,
  "liveness_detection_threshold": 0.7,
  "background_validation_threshold": 0.75,
  "audio_validation_threshold": 0.8,
  "default_geofence_radius": 100.0,
  "gps_accuracy_threshold": 10.0,
  "max_file_size": 10485760,
  "session_timeout": 1440
}
```

**cURL Example:**
```bash
curl -X PUT "http://localhost:8000/api/v1/admin/config" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." \
  -H "Content-Type: application/json" \
  --data-binary "@config_update.json"
```

#### 6. Create Backup
**POST** `/api/v1/admin/backup`

Create system backup (Admin only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "backup_type": "full",
  "include_media": true,
  "description": "Weekly backup"
}
```

**cURL Example:**
```bash
curl -X POST "http://localhost:8000/api/v1/admin/backup" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." \
  -H "Content-Type: application/json" \
  --data-binary "@backup_request.json"
```

---

## Audit Log Endpoints

### 1. Get Audit Logs
**GET** `/api/v1/audit/logs`

Get audit logs with filtering options (Admin only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `user_id` (optional): Filter by user ID
- `action` (optional): Filter by action
- `resource_type` (optional): Filter by resource type
- `start_date` (optional): Start date filter
- `end_date` (optional): End date filter
- `limit` (optional): Number of logs to return (default: 100)
- `offset` (optional): Number of logs to skip (default: 0)

**cURL Example:**
```bash
curl -X GET "http://localhost:8000/api/v1/audit/logs?action=login_success&limit=50" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

### 2. Get Attendance Audit Summary
**GET** `/api/v1/audit/attendance-summary`

Get attendance audit summary (Teacher/Admin only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `session_id` (optional): Filter by session ID
- `start_date` (optional): Start date filter
- `end_date` (optional): End date filter

**cURL Example:**
```bash
curl -X GET "http://localhost:8000/api/v1/audit/attendance-summary?session_id=1" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

### 3. Get User Activity
**GET** `/api/v1/audit/user-activity/{user_id}`

Get activity logs for a specific user (Admin only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `days` (optional): Number of days to look back (default: 30)
- `limit` (optional): Number of logs to return (default: 100)

**cURL Example:**
```bash
curl -X GET "http://localhost:8000/api/v1/audit/user-activity/1?days=7&limit=50" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

### 4. Get Security Events
**GET** `/api/v1/audit/security-events`

Get security events (Admin only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `severity` (optional): Filter by severity
- `days` (optional): Number of days to look back (default: 7)
- `limit` (optional): Number of logs to return (default: 100)

**cURL Example:**
```bash
curl -X GET "http://localhost:8000/api/v1/audit/security-events?days=7&limit=50" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

### 5. Get Failed Attempts
**GET** `/api/v1/audit/failed-attempts`

Get failed attendance attempts (Teacher/Admin only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `days` (optional): Number of days to look back (default: 7)
- `limit` (optional): Number of logs to return (default: 100)

**cURL Example:**
```bash
curl -X GET "http://localhost:8000/api/v1/audit/failed-attempts?days=7&limit=50" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

### 6. Export Audit Logs
**GET** `/api/v1/audit/export`

Export audit logs (Admin only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `start_date` (optional): Start date filter
- `end_date` (optional): End date filter
- `format` (optional): Export format (json, csv) (default: json)

**cURL Example:**
```bash
curl -X GET "http://localhost:8000/api/v1/audit/export?format=csv&start_date=2024-01-01&end_date=2024-01-31" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

---

## System Health Endpoints

### 1. Health Check
**GET** `/health`

Basic health check endpoint.

**cURL Example:**
```bash
curl -X GET "http://localhost:8000/health"
```

**Response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "ai_models": "loaded",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### 2. Root Endpoint
**GET** `/`

API information endpoint.

**cURL Example:**
```bash
curl -X GET "http://localhost:8000/"
```

**Response:**
```json
{
  "message": "Smart Attendance System API",
  "version": "1.0.0",
  "status": "healthy"
}
```

---

## Error Handling

### Common HTTP Status Codes

- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Access denied
- **404 Not Found**: Resource not found
- **422 Unprocessable Entity**: Validation error
- **500 Internal Server Error**: Server error

### Error Response Format

```json
{
  "detail": "Error message",
  "status_code": 400
}
```

### Example Error Responses

**Validation Error (422):**
```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ],
  "status_code": 422
}
```

**Authentication Error (401):**
```json
{
  "detail": "Incorrect email or password",
  "status_code": 401
}
```

**Authorization Error (403):**
```json
{
  "detail": "Access denied to this resource",
  "status_code": 403
}
```

---

## Data Models

### User Roles
- `student`: Can submit attendance and view own records
- `teacher`: Can view attendance for their subjects and manage flagged records
- `admin`: Full system access including user management

### Attendance Status
- `present`: Attendance successfully validated
- `absent`: No attendance submitted
- `flagged`: Attendance submitted but requires manual review
- `pending`: Attendance submitted but not yet processed

### Authentication
- Uses JWT (JSON Web Tokens) for authentication
- Access tokens expire (configurable, default 24 hours)
- Refresh tokens for obtaining new access tokens
- Bearer token format: `Authorization: Bearer <token>`

### File Uploads
- Images and audio are sent as base64 encoded strings
- Supported formats:
  - Images: JPEG, PNG
  - Audio: WAV, MP3
- Maximum file size: 10MB (configurable)

### GPS Coordinates
- Latitude: -90 to 90 degrees
- Longitude: -180 to 180 degrees
- Accuracy in meters (optional)

---

## Testing Results

### ✅ Successfully Tested Endpoints

1. **Health Endpoints**
   - `GET /` - ✅ Working
   - `GET /health` - ✅ Working

2. **Authentication Endpoints**
   - `POST /api/v1/auth/register` - ✅ Working
   - `POST /api/v1/auth/login` - ✅ Working
   - `GET /api/v1/auth/me` - ✅ Working

3. **Admin Endpoints**
   - `GET /api/v1/admin/stats` - ✅ Working
   - `GET /api/v1/admin/users` - ✅ Working
   - `GET /api/v1/admin/subjects` - ✅ Working
   - `GET /api/v1/admin/sessions` - ✅ Working
   - `GET /api/v1/admin/health` - ✅ Working

4. **Attendance Endpoints**
   - `GET /api/v1/attendance/my-attendance` - ✅ Working

5. **Audit Endpoints**
   - `GET /api/v1/audit/logs` - ✅ Working

### 🔧 Issues Found and Fixed

1. **PowerShell JSON Escaping**: Fixed by using `--data-binary` with JSON files
2. **Complex JSON Payloads**: Recommended using JSON files instead of inline JSON
3. **Token Expiration**: Noted that `expires_in` can be `null` in responses

### 📝 Recommendations

1. **Use JSON Files**: For complex requests, create JSON files and use `--data-binary "@filename.json"`
2. **Test Authentication**: Always test with valid tokens
3. **Check Response Format**: Some fields may be `null` in responses
4. **PowerShell Users**: Use `--data-binary` instead of `-d` for file uploads

---

## Rate Limiting

The API implements rate limiting to prevent abuse:
- Authentication endpoints: 5 requests per minute per IP
- Attendance submission: 10 requests per minute per user
- General API: 100 requests per minute per user

---

## CORS Configuration

The API supports CORS for cross-origin requests:
- Allowed origins: Configurable (default: all)
- Allowed methods: All HTTP methods
- Allowed headers: All headers

---

## API Documentation

Interactive API documentation is available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

---

## Support

For technical support or questions about the API, please contact the development team or refer to the system documentation.
