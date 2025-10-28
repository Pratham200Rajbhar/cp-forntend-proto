import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  MapPin,
  CheckSquare,
  FileText,
  Settings,
  Shield,
  Activity,
  X,
  Menu,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { USER_ROLES } from '../../utils/constants';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, isAdmin, isTeacher } = useAuth();

  const teacherLinks = [
    { path: '/teacher/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/teacher/sessions', label: 'Sessions', icon: Calendar },
    { path: '/teacher/flagged-review', label: 'Flagged Review', icon: Activity },
    { path: '/teacher/manual-attendance', label: 'Manual Attendance', icon: CheckSquare },
    { path: '/teacher/attendance-history', label: 'Attendance History', icon: FileText },
    { path: '/teacher/reports', label: 'Reports', icon: FileText },
  ];

  const adminLinks = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/students', label: 'Student Management', icon: GraduationCap },
    { path: '/admin/teachers', label: 'Teacher Management', icon: Users },
    { path: '/admin/subjects', label: 'Subject Management', icon: BookOpen },
    { path: '/admin/sessions', label: 'Session Management', icon: Calendar },
    { path: '/admin/geofence', label: 'Geofence Management', icon: MapPin },
    { path: '/admin/attendance-oversight', label: 'Attendance Oversight', icon: CheckSquare },
    { path: '/admin/reports', label: 'Reports', icon: FileText },
    { path: '/admin/system-config', label: 'System Configuration', icon: Settings },
    { path: '/admin/audit-logs', label: 'Audit Logs', icon: Shield },
  ];

  const links = isAdmin() ? adminLinks : isTeacher() ? teacherLinks : [];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-sky-600 rounded-lg flex items-center justify-center">
                <CheckSquare className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Smart Attend
              </span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto scrollbar-thin">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => window.innerWidth < 1024 && onClose()}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-200'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`
                }
              >
                <link.icon className="h-5 w-5" />
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* User info at bottom */}
          <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-sky-600 rounded-full flex items-center justify-center text-white font-medium">
                {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {user?.full_name || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.role === USER_ROLES.ADMIN ? 'Administrator' : 
                   user?.role === USER_ROLES.TEACHER ? 'Teacher' : 'User'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

