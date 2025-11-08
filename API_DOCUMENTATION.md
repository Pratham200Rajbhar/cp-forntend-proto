# Smart Attendance System API Documentation

## 📋 **Overview**

This document provides complete API documentation for the Smart Attendance System backend. The API is built with FastAPI and includes authentication, face recognition-based attendance tracking, and admin management features.

**Base URL**: `http://localhost:8000`  
**API Prefix**: `/api`

---

## 🔐 **Authentication Module**

### **POST** `/api/auth/register`

Register a new user in the system.

**Request**
```http
POST /api/auth/register
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123",
    "role": "student"
}
```

**Parameters**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Full name of the user |
| email | string | Yes | Valid email address |
| password | string | Yes | Password (min 8 characters recommended) |
| role | string | Yes | Must be one of: "admin", "teacher", "student" |

**Response**
```json
{
    "status": "success",
    "message": "User registered successfully",
    "data": {
        "user_id": 123
    }
}
```

**Error Responses**
- `400 Bad Request`: Email already registered or invalid role
- `422 Unprocessable Entity`: Invalid input format

---

### **POST** `/api/auth/login`

Authenticate user and receive JWT token.

**Request**
```http
POST /api/auth/login
Content-Type: application/json

{
    "email": "john@example.com",
    "password": "securePassword123"
}
```

**Parameters**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | Registered email address |
| password | string | Yes | User's password |

**Response**
```json
{
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "token_type": "bearer"
}
```

**Error Responses**
- `401 Unauthorized`: Incorrect email or password

**Usage in Frontend**
```javascript
// Store token in localStorage or secure storage
localStorage.setItem('accessToken', response.access_token);

// Use in subsequent requests
const headers = {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
};
```

---

### **GET** `/api/auth/profile`

Get current authenticated user's profile information.

**Request**
```http
GET /api/auth/profile
Authorization: Bearer <jwt_token>
```

**Response**
```json
{
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "created_at": "2024-01-01T10:00:00.000Z"
}
```

**Error Responses**
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: User not found

---

## 🎯 **Attendance Module**

### **POST** `/api/attendance/verify`

Mark attendance using face recognition technology.

**Request**
```http
POST /api/attendance/verify
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

student_id=123&face_image=data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEA...
```

**Parameters**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| student_id | integer | Yes | ID of the student marking attendance |
| face_image | string | Yes | Base64 encoded image (JPEG/PNG) |

**Face Image Format**
- Base64 encoded string
- Supports data URLs: `data:image/jpeg;base64,<encoded_data>`
- Or raw base64 string without prefix
- Recommended: Clear front-facing photo with good lighting

**Response - Success**
```json
{
    "status": "success",
    "message": "Attendance marked as present",
    "data": {
        "attendance_id": 456,
        "status": "present",
        "confidence": 0.87,
        "student_name": "John Doe"
    }
}
```

**Response - Low Confidence**
```json
{
    "status": "success",
    "message": "Attendance marked as flagged",
    "data": {
        "attendance_id": 457,
        "status": "flagged",
        "confidence": 0.45,
        "student_name": "John Doe"
    }
}
```

**Attendance Status Logic**
- `present`: Face confidence ≥ 0.6 (60% match)
- `flagged`: Face confidence < 0.6 (requires manual verification)

**Error Responses**
- `400 Bad Request`: No face detected in image or student face not registered
- `404 Not Found`: Student not found
- `401 Unauthorized`: Invalid token

**Frontend Implementation Example**
```javascript
// Capture image from camera
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
context.drawImage(video, 0, 0, canvas.width, canvas.height);
const base64Image = canvas.toDataURL('image/jpeg');

// Send to API
const formData = new FormData();
formData.append('student_id', studentId);
formData.append('face_image', base64Image);

fetch('/api/attendance/verify', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`
    },
    body: formData
});
```

---

### **GET** `/api/attendance/{student_id}`

Retrieve attendance history for a specific student.

**Request**
```http
GET /api/attendance/123
Authorization: Bearer <jwt_token>
```

**Response**
```json
[
    {
        "id": 456,
        "student_id": 123,
        "status": "present",
        "confidence": 0.87,
        "timestamp": "2024-01-01T10:00:00.000Z"
    },
    {
        "id": 455,
        "student_id": 123,
        "status": "flagged",
        "confidence": 0.45,
        "timestamp": "2024-01-01T09:00:00.000Z"
    }
]
```

**Error Responses**
- `404 Not Found`: Student not found
- `401 Unauthorized`: Invalid token

---

## 👨‍💼 **Admin Module**

> **Note**: All admin endpoints require admin role authentication

### **Student Management**

#### **POST** `/api/admin/students`

Add a new student to the system.

**Request**
```http
POST /api/admin/students
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json

{
    "student_id": "STU001",
    "name": "Jane Smith",
    "email": "jane@university.edu"
}
```

**Parameters**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| student_id | string | Yes | Unique student identifier |
| name | string | Yes | Student's full name |
| email | string | Yes | Student's email address |

**Response**
```json
{
    "status": "success",
    "message": "Student added successfully",
    "data": {
        "student_id": 124
    }
}
```

**Error Responses**
- `400 Bad Request`: Email already exists
- `403 Forbidden`: Admin access required

---

#### **POST** `/api/admin/students/{student_id}/face`

Upload face image for a student to enable face recognition.

**Request**
```http
POST /api/admin/students/124/face
Authorization: Bearer <admin_jwt_token>
Content-Type: multipart/form-data

face_image=data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEA...
```

**Parameters**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| face_image | string | Yes | Base64 encoded clear face image |

**Face Image Requirements**
- Clear, front-facing photo
- Good lighting conditions
- Single face in image
- JPEG or PNG format
- Recommended resolution: 640x480 or higher

**Response**
```json
{
    "status": "success",
    "message": "Face uploaded successfully"
}
```

**Error Responses**
- `400 Bad Request`: No face found in image
- `404 Not Found`: Student not found
- `403 Forbidden`: Admin access required

---

#### **GET** `/api/admin/students`

Retrieve list of all students.

**Request**
```http
GET /api/admin/students
Authorization: Bearer <admin_jwt_token>
```

**Response**
```json
[
    {
        "id": 124,
        "student_id": "STU001",
        "name": "Jane Smith",
        "email": "jane@university.edu",
        "created_at": "2024-01-01T10:00:00.000Z"
    },
    {
        "id": 125,
        "student_id": "STU002",
        "name": "Bob Johnson",
        "email": "bob@university.edu",
        "created_at": "2024-01-01T11:00:00.000Z"
    }
]
```

**Error Responses**
- `403 Forbidden`: Admin access required

---

#### **DELETE** `/api/admin/students/{student_id}`

Remove a student from the system.

**Request**
```http
DELETE /api/admin/students/124
Authorization: Bearer <admin_jwt_token>
```

**Response**
```json
{
    "status": "success",
    "message": "Student deleted successfully"
}
```

**Note**: This will also delete all associated attendance records due to cascade delete.

**Error Responses**
- `404 Not Found`: Student not found
- `403 Forbidden`: Admin access required

---

### **Teacher Management**

#### **POST** `/api/admin/teachers`

Add a new teacher to the system.

**Request**
```http
POST /api/admin/teachers
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json

{
    "name": "Dr. Sarah Wilson",
    "email": "sarah@university.edu",
    "department": "Computer Science"
}
```

**Parameters**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Teacher's full name |
| email | string | Yes | Teacher's email address |
| department | string | No | Department or subject area |

**Response**
```json
{
    "status": "success",
    "message": "Teacher added successfully",
    "data": {
        "teacher_id": 15
    }
}
```

**Error Responses**
- `400 Bad Request`: Email already exists
- `403 Forbidden`: Admin access required

---

#### **GET** `/api/admin/teachers`

Retrieve list of all teachers.

**Request**
```http
GET /api/admin/teachers
Authorization: Bearer <admin_jwt_token>
```

**Response**
```json
[
    {
        "id": 15,
        "name": "Dr. Sarah Wilson",
        "email": "sarah@university.edu",
        "department": "Computer Science",
        "created_at": "2024-01-01T10:00:00.000Z"
    },
    {
        "id": 16,
        "name": "Prof. Michael Brown",
        "email": "michael@university.edu",
        "department": "Mathematics",
        "created_at": "2024-01-01T11:00:00.000Z"
    }
]
```

---

#### **DELETE** `/api/admin/teachers/{teacher_id}`

Remove a teacher from the system.

**Request**
```http
DELETE /api/admin/teachers/15
Authorization: Bearer <admin_jwt_token>
```

**Response**
```json
{
    "status": "success",
    "message": "Teacher deleted successfully"
}
```

**Error Responses**
- `404 Not Found`: Teacher not found
- `403 Forbidden`: Admin access required

---

## 🔧 **System Endpoints**

### **GET** `/`

Health check endpoint - verify API is running.

**Request**
```http
GET /
```

**Response**
```json
{
    "message": "Smart Attendance System API",
    "status": "running"
}
```

---

### **GET** `/health`

Detailed health check endpoint.

**Request**
```http
GET /health
```

**Response**
```json
{
    "status": "healthy"
}
```

---

## 🚨 **Error Handling**

### **Standard Error Response Format**
```json
{
    "detail": "Error description"
}
```

### **Common HTTP Status Codes**
| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 400 | Bad Request | Invalid input or missing required fields |
| 401 | Unauthorized | Invalid or missing authentication token |
| 403 | Forbidden | Insufficient permissions (non-admin accessing admin routes) |
| 404 | Not Found | Resource not found |
| 422 | Unprocessable Entity | Validation error in request data |
| 500 | Internal Server Error | Server error |

---

## 🔐 **Authentication Flow**

### **1. Registration**
```javascript
const registerUser = async (userData) => {
    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    return response.json();
};
```

### **2. Login**
```javascript
const loginUser = async (credentials) => {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    });
    const data = await response.json();
    
    if (data.access_token) {
        localStorage.setItem('accessToken', data.access_token);
    }
    return data;
};
```

### **3. Authenticated Requests**
```javascript
const makeAuthenticatedRequest = async (url, options = {}) => {
    const token = localStorage.getItem('accessToken');
    
    return fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        }
    });
};
```

---

## 📱 **Frontend Integration Examples**

### **Face Capture for Attendance**
```javascript
// Camera setup
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');

// Start camera
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    });

// Capture and verify attendance
const captureAttendance = async (studentId) => {
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const base64Image = canvas.toDataURL('image/jpeg');
    
    const formData = new FormData();
    formData.append('student_id', studentId);
    formData.append('face_image', base64Image);
    
    const response = await fetch('/api/attendance/verify', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: formData
    });
    
    return response.json();
};
```

### **Admin Dashboard - Student Management**
```javascript
// Load students list
const loadStudents = async () => {
    const response = await makeAuthenticatedRequest('/api/admin/students');
    return response.json();
};

// Add new student
const addStudent = async (studentData) => {
    const response = await makeAuthenticatedRequest('/api/admin/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData)
    });
    return response.json();
};

// Upload student face
const uploadStudentFace = async (studentId, faceImage) => {
    const formData = new FormData();
    formData.append('face_image', faceImage);
    
    const response = await makeAuthenticatedRequest(`/api/admin/students/${studentId}/face`, {
        method: 'POST',
        body: formData
    });
    return response.json();
};
```

---

## ⚙️ **Configuration**

### **Environment Variables**
- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: JWT signing key
- `BACKEND_CORS_ORIGINS`: Allowed origins for CORS

### **Default Settings**
- **JWT Expiry**: 24 hours (1440 minutes)
- **Face Recognition Threshold**: 0.6 (60% similarity)
- **CORS Origins**: `localhost:3000, localhost:8080`

---

## 📋 **Rate Limiting & Best Practices**

### **Recommended Usage**
- **Authentication**: Cache JWT token, refresh only when expired
- **Face Recognition**: Process one image at a time to avoid server overload
- **Admin Operations**: Implement confirmation dialogs for delete operations
- **Error Handling**: Always handle network errors and display user-friendly messages

### **Performance Tips**
- **Image Optimization**: Resize images to 640x480 before sending
- **Batch Operations**: Use pagination for large lists
- **Caching**: Cache user profile and student lists when appropriate

---

## 🐛 **Troubleshooting**

### **Common Issues**

1. **Face Recognition Fails**
   - Ensure good lighting in photos
   - Face should be clearly visible and front-facing
   - Only one face per image
   - Student must have face uploaded first

2. **Authentication Errors**
   - Check token expiry (24 hours)
   - Verify token format: `Bearer <token>`
   - Ensure user has proper role for admin endpoints

3. **CORS Issues**
   - Verify frontend origin is in CORS settings
   - Check if credentials are included properly

---

**Last Updated**: November 8, 2024  
**API Version**: 1.0.0  
**Contact**: For issues, please check the repository or contact the development team.