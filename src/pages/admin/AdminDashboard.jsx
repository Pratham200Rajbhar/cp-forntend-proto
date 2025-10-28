import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap,
  BookOpen, 
  Calendar, 
  CheckSquare,
  TrendingUp,
  UserPlus,
  FileText,
  Shield,
  Activity,
  Users
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Layout from '../../components/layout/Layout';
import StatCard from '../../components/common/StatCard';
import Card, { CardHeader, CardBody, CardTitle } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import adminService from '../../services/adminService';
import { formatDate, formatRelativeTime } from '../../utils/helpers';
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

  // Mock chart data
  const attendanceTrendData = [
    { date: 'Oct 20', rate: 85 },
    { date: 'Oct 21', rate: 88 },
    { date: 'Oct 22', rate: 82 },
    { date: 'Oct 23', rate: 90 },
    { date: 'Oct 24', rate: 87 },
    { date: 'Oct 25', rate: 89 },
    { date: 'Oct 26', rate: 91 },
  ];

  const departmentData = [
    { name: 'CS', attendance: 92 },
    { name: 'IT', attendance: 88 },
    { name: 'ECE', attendance: 85 },
    { name: 'ME', attendance: 87 },
  ];

  const statsCards = [
    {
      title: 'Total Users',
      value: stats?.total_users || 0,
      icon: Users,
      color: 'primary',
      subtitle: `${stats?.total_students || 0} Students, ${stats?.total_teachers || 0} Teachers`,
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
      color: 'success',
      subtitle: `${stats?.active_sessions_today || 0} active today`,
    },
    {
      title: 'Attendance Records',
      value: stats?.total_attendance_records || 0,
      icon: CheckSquare,
      color: 'warning',
    },
    {
      title: "Today's Attendance",
      value: `${stats?.attendance_rate_today || 0}%`,
      icon: TrendingUp,
      color: 'success',
      trend: 'up',
      trendValue: '+2.5%',
    },
    {
      title: 'Geofence Zones',
      value: stats?.total_geofence_zones || 0,
      icon: Activity,
      color: 'purple',
    },
  ];

  // Mock recent activity
  const recentActivity = [
    {
      id: 1,
      action: 'New user registered',
      user: 'John Doe',
      time: '2 minutes ago',
      type: 'user',
    },
    {
      id: 2,
      action: 'Session created',
      user: 'Admin',
      time: '15 minutes ago',
      type: 'session',
    },
    {
      id: 3,
      action: 'Attendance marked',
      user: 'Jane Smith',
      time: '1 hour ago',
      type: 'attendance',
    },
  ];

  return (
    <Layout title="Admin Dashboard">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant="primary"
                fullWidth
                icon={GraduationCap}
                onClick={() => navigate('/admin/students')}
              >
                Manage Students
              </Button>
              <Button
                variant="primary"
                fullWidth
                icon={Users}
                onClick={() => navigate('/admin/teachers')}
              >
                Manage Teachers
              </Button>
              <Button
                variant="outline"
                fullWidth
                icon={BookOpen}
                onClick={() => navigate('/admin/subjects')}
              >
                Create Subject
              </Button>
              <Button
                variant="outline"
                fullWidth
                icon={Calendar}
                onClick={() => navigate('/admin/sessions')}
              >
                Create Session
              </Button>
              <Button
                variant="outline"
                fullWidth
                icon={Shield}
                onClick={() => navigate('/admin/audit-logs')}
              >
                View Audit Logs
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Trend */}
          <Card>
            <CardHeader>
              <CardTitle>30-Day Attendance Trend</CardTitle>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={attendanceTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#0284c7" 
                    strokeWidth={2}
                    name="Attendance Rate (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>

          {/* Department Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Department-wise Attendance</CardTitle>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="attendance" 
                    fill="#10b981" 
                    name="Attendance Rate (%)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <Button variant="link" size="sm" onClick={() => navigate('/admin/audit-logs')}>
              View All
            </Button>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md"
                >
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    activity.type === 'user' ? 'bg-blue-100 dark:bg-blue-900' :
                    activity.type === 'session' ? 'bg-green-100 dark:bg-green-900' :
                    'bg-purple-100 dark:bg-purple-900'
                  }`}>
                    {activity.type === 'user' && <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                    {activity.type === 'session' && <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />}
                    {activity.type === 'attendance' && <CheckSquare className="h-4 w-4 text-purple-600 dark:text-purple-400" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      by {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminDashboard;

