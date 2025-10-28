import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap,
  BookOpen, 
  Calendar, 
  CheckSquare,
  Users,
} from 'lucide-react';
import Layout from '../../components/layout/Layout';
import StatCard from '../../components/common/StatCard';
import Card, { CardHeader, CardBody, CardTitle } from '../../components/common/Card';
import Button from '../../components/common/Button';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await adminService.getSystemStats();
      setStats(data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Total Students',
      value: stats?.total_students || 0,
      icon: GraduationCap,
      color: 'primary',
    },
    {
      title: 'Total Teachers',
      value: stats?.total_teachers || 0,
      icon: Users,
      color: 'success',
    },
    {
      title: 'Total Subjects',
      value: stats?.total_subjects || 0,
      icon: BookOpen,
      color: 'info',
    },
    {
      title: 'Total Sessions',
      value: stats?.total_sessions || 0,
      icon: Calendar,
      color: 'warning',
    },
  ];

  const quickActions = [
    { icon: GraduationCap, label: 'Students', path: '/admin/students' },
    { icon: Users, label: 'Teachers', path: '/admin/teachers' },
    { icon: BookOpen, label: 'Subjects', path: '/admin/subjects' },
    { icon: Calendar, label: 'Sessions', path: '/admin/sessions' },
    { icon: CheckSquare, label: 'Attendance', path: '/admin/attendance-oversight' },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            System overview and management
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  fullWidth
                  icon={action.icon}
                  onClick={() => navigate(action.path)}
                  className="justify-start"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Manage students, teachers, and their information
              </p>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  fullWidth
                  icon={GraduationCap}
                  onClick={() => navigate('/admin/students')}
                  className="justify-start"
                >
                  Manage Students
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  icon={Users}
                  onClick={() => navigate('/admin/teachers')}
                  className="justify-start"
                >
                  Manage Teachers
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Academic Management</CardTitle>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Manage subjects, sessions, and schedules
              </p>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  fullWidth
                  icon={BookOpen}
                  onClick={() => navigate('/admin/subjects')}
                  className="justify-start"
                >
                  Manage Subjects
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  icon={Calendar}
                  onClick={() => navigate('/admin/sessions')}
                  className="justify-start"
                >
                  Manage Sessions
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
