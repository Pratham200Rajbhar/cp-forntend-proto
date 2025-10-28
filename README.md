# Smart Attendance System - Dashboard

A modern, production-ready web dashboard for the Smart Attendance System built with React 18, Vite, and Tailwind CSS.

## Features

### Teacher Features
- **Dashboard**: Overview of today's sessions, attendance statistics, and recent activity
- **Sessions Management**: View and manage all teaching sessions
- **Session Details**: Detailed view of attendance records with AI validation scores
- **Flagged Review**: Review and approve/reject flagged attendance submissions
- **Manual Attendance**: Submit attendance manually for students
- **Attendance History**: View historical attendance data (session-wise and student-wise)
- **Reports**: Generate and export attendance reports

### Admin Features
- **Dashboard**: System-wide statistics and analytics
- **User Management**: Create, update, and manage users (students, teachers, admins)
- **Subject Management**: Manage subjects and courses
- **Session Management**: Create and manage class sessions
- **Geofence Management**: Define and manage location-based attendance zones
- **Attendance Oversight**: Monitor institution-wide attendance
- **System Configuration**: Configure AI thresholds and system settings
- **Audit Logs**: View system activity and user actions

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router v6** - Routing
- **Tailwind CSS 3** - Styling
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Lucide React** - Icons
- **Recharts** - Charts and data visualization
- **React Hot Toast** - Notifications
- **date-fns** - Date manipulation

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running (see API_ENDPOINTS_GUIDE.md)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd new_dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and set your API base URL:
```
VITE_API_BASE_URL=http://localhost:8000
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

### Default Login Credentials

**Admin:**
- Email: admin@attendance.com
- Password: admin123

**Teacher:**
- Email: teacher@example.com
- Password: password123

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   ├── Table.jsx
│   │   └── ...
│   └── layout/          # Layout components
│       ├── Sidebar.jsx
│       ├── Header.jsx
│       ├── Layout.jsx
│       └── ProtectedRoute.jsx
├── context/             # React Context providers
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
├── hooks/               # Custom React hooks
│   ├── useAuth.js
│   ├── useFetch.js
│   └── useDebounce.js
├── pages/
│   ├── auth/            # Authentication pages
│   ├── teacher/         # Teacher dashboard pages
│   └── admin/           # Admin dashboard pages
├── services/            # API service layer
│   ├── api.js
│   ├── authService.js
│   ├── teacherService.js
│   ├── adminService.js
│   └── ...
├── utils/               # Utility functions
│   ├── constants.js
│   └── helpers.js
├── App.jsx              # Main app component with routing
├── main.jsx             # Entry point
└── index.css            # Global styles
```

## Build for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- Follow React best practices
- Use functional components with hooks
- Implement proper error handling
- Add loading states for async operations
- Ensure responsive design (mobile-first)
- Use TypeScript-style JSDoc comments

### Dark Mode

The dashboard includes full dark mode support. Users can toggle between light and dark themes using the button in the header.

## API Integration

The dashboard connects to the Smart Attendance System backend API. See `.cursor/rules/API_ENDPOINTS_GUIDE.md` for complete API documentation.

### API Configuration

Set the base URL in `.env`:
```
VITE_API_BASE_URL=http://localhost:8000
```

### Authentication

The app uses JWT authentication with automatic token refresh. Tokens are stored in localStorage and automatically attached to API requests.

## Features in Detail

### Authentication System
- JWT-based authentication
- Automatic token refresh
- Role-based access control
- Protected routes

### Dashboard Analytics
- Real-time statistics
- Interactive charts
- Attendance trends
- Department-wise breakdown

### User Management
- CRUD operations for users
- Role-based permissions
- Bulk actions support
- Search and filter capabilities

### Attendance Management
- AI validation score display
- Manual override functionality
- Flagged record review
- Geofence validation

### Reporting
- Multiple report types
- Date range selection
- Export to PDF/CSV
- Custom filters

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

© 2025 Smart Attendance System. All rights reserved.

## Support

For issues and questions, please refer to the documentation or contact the development team.
