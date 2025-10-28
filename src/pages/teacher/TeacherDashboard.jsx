import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  AlertTriangle, 
  TrendingUp,
  Clock,
  CheckCircle,
  Plus,
  FileText
} from 'lucide-react';
import Layout from '../../components/layout/Layout';
import StatCard from '../../components/common/StatCard';
import Card, { CardHeader, CardBody, CardTitle } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import teacherService from '../../services/teacherService';
import { formatDate, formatRelativeTime, formatPercentage } from '../../utils/helpers';
import { STATUS_COLORS } from '../../utils/constants';
import toast from 'react-hot-toast';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await teacherService.getDashboard();
      setDashboardData(data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Dashboard">
        <div className="flex items-center justify-center h-full">
          <Loader size="lg" text="Loading dashboard..." />
        </div>
      </Layout>
    );
  }

  const stats = [
    {
      title: "Today's Sessions",
      value: dashboardData?.today_sessions || 0,
      icon: Calendar,
      color: 'primary',
    },
    {
      title: "Present Today",
      value: dashboardData?.total_students ? 
        formatPercentage((dashboardData.total_students - (dashboardData.pending_attendance || 0)) / dashboardData.total_students * 100) : 
        '0%',
      icon: CheckCircle,
      color: 'success',
    },
    {
      title: "Flagged Records",
      value: dashboardData?.flagged_attendance || 0,
      icon: AlertTriangle,
      color: 'warning',
    },
    {
      title: "Avg Attendance",
      value: '87.5%',
      icon: TrendingUp,
      color: 'info',
      trend: 'up',
      trendValue: '+2.5%',
    },
  ];

  return (
    <Layout title="Dashboard">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="primary"
                fullWidth
                icon={Calendar}
                onClick={() => navigate('/teacher/sessions')}
              >
                View Sessions
              </Button>
              <Button
                variant="warning"
                fullWidth
                icon={AlertTriangle}
                onClick={() => navigate('/teacher/flagged-review')}
              >
                Review Flagged ({dashboardData?.flagged_attendance || 0})
              </Button>
              <Button
                variant="outline"
                fullWidth
                icon={Plus}
                onClick={() => navigate('/teacher/manual-attendance')}
              >
                Manual Attendance
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Today's Schedule & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
            </CardHeader>
            <CardBody>
              {dashboardData?.today_sessions > 0 ? (
                <div className="space-y-3">
                  {/* Mock data - replace with actual schedule */}
                  {[1, 2, 3].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                      onClick={() => navigate('/teacher/sessions')}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-sky-100 dark:bg-sky-900 rounded-lg flex items-center justify-center">
                          <Clock className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            Data Structures
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            10:00 AM - 11:30 AM • Room 101
                          </p>
                        </div>
                      </div>
                      <Badge variant="success">Active</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No sessions scheduled for today
                </p>
              )}
            </CardBody>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardBody>
              {dashboardData?.recent_activity && dashboardData.recent_activity.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.recent_activity.slice(0, 5).map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md"
                    >
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        activity.status === 'present' ? 'bg-green-100 dark:bg-green-900' :
                        activity.status === 'absent' ? 'bg-red-100 dark:bg-red-900' :
                        'bg-amber-100 dark:bg-amber-900'
                      }`}>
                        <Users className={`h-4 w-4 ${
                          activity.status === 'present' ? 'text-green-600 dark:text-green-400' :
                          activity.status === 'absent' ? 'text-red-600 dark:text-red-400' :
                          'text-amber-600 dark:text-amber-400'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {activity.student_name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {activity.session_name} • {activity.subject_name}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {formatRelativeTime(activity.timestamp)}
                        </p>
                      </div>
                      <Badge variant={STATUS_COLORS[activity.status]} size="sm">
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No recent activity
                </p>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Subjects Overview */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>My Subjects</CardTitle>
            <Button
              variant="link"
              size="sm"
              onClick={() => navigate('/teacher/sessions')}
            >
              View All
            </Button>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Mock subjects - replace with actual data */}
              {[1, 2, 3].map((item, index) => (
                <div
                  key={index}
                  className="p-4 bg-gradient-to-br from-sky-50 to-blue-100 dark:from-gray-700 dark:to-gray-600 rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate('/teacher/sessions')}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      Data Structures
                    </h4>
                    <Badge variant="primary">CS301</Badge>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                    <p>15 Sessions</p>
                    <p>25 Students</p>
                    <p className="font-medium text-sky-600 dark:text-sky-400">
                      85.5% Attendance
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

export default TeacherDashboard;

