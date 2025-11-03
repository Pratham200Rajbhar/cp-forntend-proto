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
import { ProgressChart, StatsGrid, DonutChart, SimpleLineChart } from '../../components/common/Chart';

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
        {/* Welcome Header */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                System overview and management
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <CheckSquare className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Department Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Department Performance</CardTitle>
            </CardHeader>
            <CardBody>
              <ProgressChart
                data={[
                  { label: 'Computer Science', value: 88 },
                  { label: 'Information Technology', value: 82 },
                  { label: 'Electronics', value: 85 },
                  { label: 'Mechanical', value: 79 }
                ]}
                title="Attendance by Department"
              />
            </CardBody>
          </Card>

          {/* System Overview */}
          <Card>
            <CardHeader>
              <CardTitle>System Overview</CardTitle>
            </CardHeader>
            <CardBody>
              <StatsGrid
                data={[
                  { label: 'Active Users', value: '1,200' },
                  { label: 'Today\'s Sessions', value: '45' },
                  { label: 'System Uptime', value: '99.9%' },
                  { label: 'Data Processed', value: '2.4GB' }
                ]}
              />
            </CardBody>
          </Card>

          {/* Weekly Attendance Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Attendance Trend</CardTitle>
            </CardHeader>
            <CardBody>
              <SimpleLineChart
                data={[
                  { x: 0, y: 72 },
                  { x: 1, y: 81 },
                  { x: 2, y: 79 },
                  { x: 3, y: 88 },
                  { x: 4, y: 90 },
                  { x: 5, y: 85 },
                  { x: 6, y: 83 }
                ]}
                color="#3b82f6"
              />
              <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
                Last 7 days attendance percentage
              </div>
            </CardBody>
          </Card>
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
