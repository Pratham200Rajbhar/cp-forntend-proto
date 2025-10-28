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
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, isAdmin, isTeacher } = useAuth();

  const teacherLinks = [
    { path: '/teacher/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/teacher/sessions', label: 'Sessions', icon: Calendar },
    { path: '/teacher/flagged-review', label: 'Review', icon: Activity },
    { path: '/teacher/manual-attendance', label: 'Attendance', icon: CheckSquare },
    { path: '/teacher/attendance-history', label: 'History', icon: FileText },
    { path: '/teacher/reports', label: 'Reports', icon: FileText },
  ];

  const adminLinks = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/students', label: 'Students', icon: GraduationCap },
    { path: '/admin/teachers', label: 'Teachers', icon: Users },
    { path: '/admin/subjects', label: 'Subjects', icon: BookOpen },
    { path: '/admin/sessions', label: 'Sessions', icon: Calendar },
    { path: '/admin/geofence', label: 'Geofence', icon: MapPin },
    { path: '/admin/attendance-oversight', label: 'Attendance', icon: CheckSquare },
    { path: '/admin/system-config', label: 'Settings', icon: Settings },
    { path: '/admin/audit-logs', label: 'Audit', icon: Shield },
  ];

  const links = isAdmin() ? adminLinks : isTeacher() ? teacherLinks : [];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <CheckSquare className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                SmartAttend
              </span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => window.innerWidth < 1024 && onClose()}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`
                }
              >
                <link.icon className="h-5 w-5" />
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* User info at bottom */}
          <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-medium">
                {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {user?.full_name || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate capitalize">
                  {user?.role}
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
