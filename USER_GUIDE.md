# SmartAttend Frontend - User Guide

## 🎓 Complete User Guide for SmartAttend Dashboard

This guide explains how to use the SmartAttend web dashboard for managing attendance through face recognition.

---

## 📚 Table of Contents

1. [Getting Started](#getting-started)
2. [Login & Authentication](#login--authentication)
3. [Admin Features](#admin-features)
4. [Teacher Features](#teacher-features)
5. [Common Tasks](#common-tasks)
6. [Troubleshooting](#troubleshooting)

---

## Getting Started

### System Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- Camera access (for face recognition features)

### Accessing the System

1. Open your web browser
2. Navigate to the application URL (e.g., `http://localhost:5173`)
3. You'll be presented with the login screen

---

## Login & Authentication

### Login Process

1. **Enter Your Credentials:**
   - Email address
   - Password

2. **Click "Sign In"**

3. **Automatic Redirect:**
   - **Admins** → Admin Dashboard
   - **Teachers** → Teacher Dashboard
   - **Students** → Student Portal (if implemented)

### First Time Login

If this is your first time logging in:
- Contact your system administrator to create an account
- Admins can create accounts through the dashboard

### Forgot Password?

Currently handled through the API. Contact your administrator.

---

## Admin Features

Admins have full access to system management and oversight.

### Admin Dashboard

After login, you'll see:

**Key Metrics:**
- Total Students
- Total Teachers
- Total Subjects
- Active Sessions

**Quick Actions:**
- View all students
- View all teachers
- Manage sessions
- View attendance

### Student Management

#### Viewing Students

1. Click **"Students"** in the sidebar
2. View list of all students
3. Use the **search bar** to find specific students
4. Filter by **department** using the dropdown

#### Adding a New Student

1. Navigate to **Students** → Click **"Add Student"**
2. Fill in required information:
   - **Personal Information:**
     - Full Name (required)
     - Student ID (required)
   - **Contact Information:**
     - Email (required)
     - Phone Number (optional)
   - **Academic Information (Optional):**
     - Department
     - Year
     - Section

3. **Upload Face Photo:**
   - Click "Upload Photo"
   - Select a clear, front-facing photo
   - Preview will show before saving
   - **Photo Requirements:**
     - Clear face visibility
     - Good lighting
     - Front-facing
     - No sunglasses or face coverings

4. Click **"Create Student"**
5. Success notification will appear
6. Student is now ready for face recognition attendance

#### Editing a Student

1. Navigate to **Students**
2. Find the student in the list
3. Click the **Edit** button (pencil icon)
4. Update the information
5. Upload new face photo if needed
6. Click **"Update Student"**

#### Deleting a Student

1. Navigate to **Students**
2. Find the student in the list
3. Click the **Delete** button (trash icon)
4. Confirm deletion
5. **Warning:** This will delete all attendance records for this student

### Teacher Management

#### Viewing Teachers

1. Click **"Teachers"** in the sidebar
2. View list of all teachers
3. Search and filter as needed

#### Adding a New Teacher

1. Navigate to **Teachers** → Click **"Add Teacher"**
2. Fill in required information:
   - Name (required)
   - Email (required)
   - Department (optional)
3. Click **"Create Teacher"**

#### Managing Teachers

- **Edit:** Update teacher information
- **Delete:** Remove teacher from system
- **View Subjects:** See assigned subjects

### Subject Management

#### Creating Subjects

1. Navigate to **"Subjects"**
2. Click **"Add Subject"**
3. Enter:
   - Subject Code
   - Subject Name
   - Credits
   - Department
   - Assigned Teacher(s)
4. Click **"Create Subject"**

### Session Management

Sessions are class periods where attendance is marked.

#### Creating a Session

1. Navigate to **"Sessions"**
2. Click **"Add Session"**
3. Fill in details:
   - Subject
   - Teacher
   - Date and Time
   - Duration
   - Room/Location
   - Geofence Zone (if using location-based attendance)
4. Click **"Create Session"**

#### Managing Sessions

- **Active Sessions:** Currently ongoing
- **Upcoming Sessions:** Scheduled for future
- **Past Sessions:** Completed sessions
- **Edit/Delete:** Modify or remove sessions

### Geofence Management

Geofences ensure students are physically present in the classroom.

#### Creating a Geofence Zone

1. Navigate to **"Geofence"**
2. Click **"Add Zone"**
3. Enter:
   - Zone Name (e.g., "Building A - Room 101")
   - Center Latitude
   - Center Longitude
   - Radius (in meters)
4. Click **"Create Zone"**

**Tips:**
- Use Google Maps to find coordinates
- Typical classroom radius: 50-100 meters
- Test the zone before using in production

### Attendance Oversight

View and manage all attendance records.

#### Viewing Attendance

1. Navigate to **"Attendance Oversight"**
2. Filter by:
   - Date range
   - Subject
   - Session
   - Student
   - Status (Present/Absent/Flagged)

#### Handling Flagged Attendance

Flagged attendance occurs when face recognition confidence is low (<60%).

1. Navigate to **"Flagged Review"**
2. View flagged records with:
   - Student photo
   - Captured photo
   - Confidence score
   - Session details
3. **Actions:**
   - **Approve:** Mark as present
   - **Reject:** Mark as absent
   - **View Details:** See more information

### Audit Logs

Track all system activity.

1. Navigate to **"Audit Logs"**
2. View logs with:
   - User who performed action
   - Action type
   - Timestamp
   - Details
3. Filter by:
   - Date range
   - User
   - Action type

### System Configuration

Manage system settings.

1. Navigate to **"System Config"**
2. Adjust settings:
   - Face recognition threshold
   - Session timeout
   - Geofence settings
   - Email notifications
3. Click **"Save Changes"**

---

## Teacher Features

Teachers can manage their assigned sessions and mark attendance.

### Teacher Dashboard

After login, teachers see:

**Overview:**
- Assigned subjects count
- Today's sessions
- Overall attendance rate
- Flagged attendance count

**Quick Actions:**
- View sessions
- Mark attendance
- Review flagged attendance
- Generate reports

### Managing Sessions

#### Viewing Your Sessions

1. Click **"Sessions"** in the sidebar
2. See all your assigned sessions:
   - **Today:** Today's sessions
   - **Upcoming:** Future sessions
   - **Past:** Completed sessions

#### Session Details

1. Click on a session to view:
   - Subject and time
   - Enrolled students
   - Attendance status
   - Geofence zone
2. **Actions:**
   - Start session (for face recognition)
   - Mark manual attendance
   - View attendance list
   - Download report

### Marking Attendance

#### Automatic (Face Recognition)

Students mark their own attendance:
1. Teacher starts the session
2. Students open mobile app
3. Students capture face photo
4. System verifies and marks attendance
5. Teacher sees real-time updates

#### Manual Attendance

For offline or backup scenarios:

1. Navigate to **"Manual Attendance"**
2. Select:
   - Subject
   - Session
   - Date
3. Mark each student:
   - ✅ Present
   - ❌ Absent
   - 🚩 Late
4. Add notes if needed
5. Click **"Submit Attendance"**

### Reviewing Flagged Attendance

When face recognition has low confidence:

1. Navigate to **"Flagged Review"**
2. Review each flagged entry:
   - See both photos (student photo vs captured)
   - Check confidence score
   - View timestamp and location
3. **Decision:**
   - **Approve:** Accept as present
   - **Reject:** Mark as absent
4. Add notes explaining decision

### Attendance History

View historical attendance data:

1. Navigate to **"Attendance History"**
2. Filter by:
   - Subject
   - Session
   - Date range
   - Student
3. View attendance patterns:
   - Attendance percentage
   - Absent dates
   - Flagged entries
4. Export as CSV for analysis

### Generating Reports

Create attendance reports:

1. Navigate to **"Reports"**
2. Select report type:
   - **Subject Report:** All students in a subject
   - **Session Report:** Single session attendance
   - **Student Report:** Individual student history
   - **Date Range Report:** Multiple sessions
3. Choose format:
   - PDF (for printing)
   - CSV (for Excel)
   - JSON (for data analysis)
4. Click **"Generate Report"**
5. Download or view online

---

## Common Tasks

### How to: Add a Student with Face Recognition

1. **Admin Dashboard** → **Students** → **Add Student**
2. Fill in basic information (name, email, student ID)
3. Add academic details (department, year, section)
4. **Upload Face Photo:**
   - Click "Upload Photo"
   - Take or select a clear photo
   - Preview to ensure quality
5. Click **"Create Student"**
6. Student can now mark attendance using face recognition

### How to: Create and Manage a Class Session

1. **Create Subject First:**
   - Admin → Subjects → Add Subject
   - Enter subject details
   - Assign teacher

2. **Create Session:**
   - Admin/Teacher → Sessions → Add Session
   - Select subject and teacher
   - Set date, time, duration
   - Assign geofence zone

3. **During Class:**
   - Teacher opens session
   - Students mark attendance via app
   - Teacher monitors real-time attendance

4. **After Class:**
   - Review flagged attendance
   - Mark manual attendance if needed
   - Close session

### How to: Handle Attendance Discrepancies

**Student claims they marked attendance but not recorded:**

1. Check **Flagged Attendance** - may need manual approval
2. Check **Attendance History** - verify not already marked
3. Check **Geofence Zone** - student may be outside range
4. Use **Manual Attendance** to add if legitimate

**Student marked present but was absent:**

1. Navigate to **Attendance Oversight**
2. Find the attendance record
3. Edit status to "Absent"
4. Add note explaining change
5. System logs the modification

### How to: Bulk Import Students

Currently, students must be added individually. For bulk import:
1. Contact system administrator
2. Provide student data in required format
3. Admin can use API for bulk operations

---

## Troubleshooting

### Cannot Login

**Check:**
- ✅ Email and password are correct
- ✅ Account exists in system
- ✅ Account is active (not disabled)
- ✅ Internet connection is working
- ✅ Backend server is running

**Solution:**
- Contact administrator to reset password
- Clear browser cache and try again

### Face Recognition Fails

**Common Issues:**

1. **"No face detected"**
   - Ensure face is clearly visible
   - Check lighting (not too dark/bright)
   - Remove sunglasses or masks
   - Hold camera steady

2. **"Student face not registered"**
   - Admin must upload student face first
   - Go to Admin → Students → Edit → Upload Photo

3. **Low confidence / Flagged**
   - Photo quality may be poor
   - Different angle/lighting than registered photo
   - Teacher can approve manually in Flagged Review

### Attendance Not Showing

**Check:**
- ✅ Session is active
- ✅ Student is enrolled in subject
- ✅ Attendance was submitted successfully
- ✅ Refresh the page

**Solution:**
- Check network tab for errors
- Verify attendance in Attendance History
- Contact administrator if persists

### Cannot Upload Face Photo

**Requirements:**
- Image must be JPEG or PNG
- File size < 5MB recommended
- Clear, front-facing photo
- Only one face in photo

**Solution:**
- Resize image if too large
- Use better quality photo
- Ensure file is not corrupted

### Page Loading Slowly

**Causes:**
- Large number of records
- Slow internet connection
- Backend server issues

**Solutions:**
- Use filters to reduce data
- Check internet speed
- Contact administrator about server

---

## Best Practices

### For Admins

1. **Regular Data Maintenance:**
   - Review audit logs weekly
   - Clean up old sessions
   - Update student/teacher info

2. **Face Photo Quality:**
   - Ensure all student photos are clear
   - Re-upload photos if recognition fails frequently
   - Use consistent lighting

3. **Geofence Configuration:**
   - Test geofences before using
   - Adjust radius based on building size
   - Consider Wi-Fi interference

### For Teachers

1. **Session Management:**
   - Create sessions in advance
   - Start sessions on time
   - Review attendance same day

2. **Flagged Review:**
   - Check flagged attendance within 24 hours
   - Document reasons for approvals/rejections
   - Report systematic issues to admin

3. **Manual Attendance:**
   - Use only when necessary
   - Add notes explaining manual marking
   - Double-check before submitting

---

## Security & Privacy

### Data Protection

- All data is encrypted in transit (HTTPS)
- Face images stored securely
- Access controlled by roles
- Activity logged in audit trail

### Privacy Considerations

- Face data used only for attendance
- Photos not shared outside system
- Students can request data access
- Admins can delete student data

---

## Support

### Getting Help

1. **In-App:**
   - Check this user guide
   - Review tooltips and hints

2. **Administrator:**
   - Contact your system admin
   - Report bugs or issues

3. **Technical Support:**
   - Check documentation
   - Review API logs
   - Contact development team

---

**Version:** 1.0.0  
**Last Updated:** November 8, 2024  
**For:** SmartAttend Attendance Management System
