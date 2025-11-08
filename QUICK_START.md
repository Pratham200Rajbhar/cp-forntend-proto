# SmartAttend - Quick Start Guide

## 🚀 Getting Started

### Prerequisites

1. **Backend Server** - Ensure the backend API is running on `http://localhost:8000`
2. **Node.js** - Version 16 or higher
3. **NPM** - Version 7 or higher

### Installation

1. **Clone and Install Dependencies**
   ```bash
   cd new_dashboard
   npm install
   ```

2. **Configure Environment**
   ```bash
   # Create .env file
   cp .env.example .env
   
   # Edit .env and set your backend URL
   # VITE_API_BASE_URL=http://localhost:8000
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Access the Application**
   Open your browser to: `http://localhost:5173`

## 🔑 Default Login Credentials

The system requires real user accounts from the backend. If the backend has demo/seed data, use those credentials. Otherwise, register new users via the API.

**Example (if backend has seed data):**
- **Admin:** admin@example.com / password
- **Teacher:** teacher@example.com / password
- **Student:** student@example.com / password

## 📱 Features

### Admin Features
- ✅ User Management (Students, Teachers)
- ✅ Subject Management
- ✅ Session Management
- ✅ Geofence Zone Configuration
- ✅ Attendance Oversight
- ✅ System Audit Logs
- ✅ Dashboard with Statistics

### Teacher Features
- ✅ View Assigned Sessions
- ✅ Mark Manual Attendance
- ✅ Review Flagged Attendance
- ✅ Generate Attendance Reports
- ✅ View Attendance History
- ✅ Session Details

### Student Features (via API)
- ✅ Submit Attendance with Face Recognition
- ✅ View Personal Attendance History

## 🔧 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Fix linting issues
npm run lint -- --fix
```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/          # Generic components (Button, Input, etc.)
│   └── layout/          # Layout components (Header, Sidebar)
├── pages/               # Page components
│   ├── admin/           # Admin dashboard pages
│   ├── teacher/         # Teacher dashboard pages
│   └── auth/            # Authentication pages
├── context/             # React Context providers
│   ├── AuthContext.jsx  # Authentication state
│   └── ThemeContext.jsx # Theme management
├── services/            # API service layer
│   └── api.js           # API client and services
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
└── App.jsx              # Main application component
```

## 🌐 API Integration

All pages are connected to the backend API. The application:

1. **Authenticates** users via JWT tokens
2. **Fetches** real data from backend endpoints
3. **Submits** form data to create/update records
4. **Handles** errors with user-friendly messages
5. **Shows** loading states during async operations

See `BACKEND_INTEGRATION.md` for detailed integration documentation.

## 🎨 Theme

The application supports light and dark modes:
- Toggle theme via the header icon
- Theme preference is saved in localStorage
- Automatically applies on reload

## 📊 Dashboard Features

### Admin Dashboard
- Total students, teachers, subjects count
- Active sessions overview
- Attendance statistics
- Recent activity logs

### Teacher Dashboard
- Assigned subjects count
- Today's sessions
- Attendance rate
- Flagged attendance alerts

## 🔐 Security Features

- JWT token-based authentication
- Automatic token refresh
- Role-based access control
- Protected routes
- Auto-logout on token expiry

## 🐛 Troubleshooting

### Backend Connection Issues

**Problem:** Cannot connect to backend
```
Error: Network Error
```

**Solutions:**
1. Ensure backend is running: `http://localhost:8000`
2. Check `.env` file has correct `VITE_API_BASE_URL`
3. Verify CORS is enabled on backend
4. Check browser console for detailed errors

### Authentication Issues

**Problem:** Login not working
```
Error: Unauthorized
```

**Solutions:**
1. Verify credentials are correct
2. Check backend user exists
3. Clear localStorage and try again
4. Check network tab for API response

### Build Issues

**Problem:** Build fails
```
Error: Module not found
```

**Solutions:**
1. Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
2. Clear npm cache: `npm cache clean --force`
3. Check Node.js version: `node --version` (should be 16+)

### Linting Errors

**Problem:** ESLint errors
```
Error: Unexpected token
```

**Solutions:**
1. Run `npm run lint -- --fix` to auto-fix
2. Check the specific file mentioned in error
3. Ensure all imports are correct

## 📸 Face Recognition Setup

To use face recognition attendance:

1. **Upload Student Face:**
   - Go to Admin → Students → Add Student
   - Fill in student details
   - Upload a clear, front-facing photo
   - Save student

2. **Mark Attendance:**
   - Teacher marks session as active
   - Student captures face via camera
   - System verifies face and marks attendance
   - If confidence < 60%, flagged for review

3. **Review Flagged:**
   - Teacher → Flagged Review
   - View flagged attendance
   - Approve or reject manually

## 🎯 Best Practices

### For Development

1. **Always run lint before commit:**
   ```bash
   npm run lint
   ```

2. **Test with real backend data**

3. **Check console for errors**

4. **Use toast notifications for user feedback**

5. **Implement loading states**

### For API Integration

1. **Handle all error cases:**
   ```javascript
   try {
     const data = await studentService.getAll();
   } catch (error) {
     toast.error(error.message || 'Operation failed');
   }
   ```

2. **Show loading states:**
   ```javascript
   const [loading, setLoading] = useState(true);
   ```

3. **Validate forms with Zod schemas**

4. **Use toast for user feedback**

## 📚 Additional Documentation

- `API_DOCUMENTATION.md` - Complete API endpoint reference
- `BACKEND_INTEGRATION.md` - Detailed integration guide
- `PAGES_REQUIREMENTS.md` - Page specifications
- `README.md` - Project overview

## 🤝 Support

For issues or questions:
1. Check console errors
2. Review network tab in DevTools
3. Verify backend logs
4. Check API documentation

## 📝 License

This project is part of the SmartAttend system.

---

**Happy Coding! 🎉**
