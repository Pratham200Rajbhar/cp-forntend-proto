import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import Layout from '../../components/layout/Layout';
import StatCard from '../../components/common/StatCard';
import Card, { CardHeader, CardBody, CardTitle } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import teacherService from '../../services/teacherService';
import { formatRelativeTime } from '../../utils/helpers';
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
      <Layout>
        <div className="flex items-center justify-center h-full">
          <Loader size="lg" text="Loading..." />
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
      title: "Total Students",
      value: dashboardData?.total_students || 0,
      icon: Users,
      color: 'success',
    },
    {
      title: "Flagged Records",
      value: dashboardData?.flagged_attendance || 0,
      icon: AlertTriangle,
      color: 'warning',
    },
    {
      title: "Pending Reviews",
      value: dashboardData?.pending_reviews || 0,
      icon: CheckCircle,
      color: 'info',
    },
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
            Manage your classes and attendance
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button
                variant="outline"
                fullWidth
                icon={Calendar}
                onClick={() => navigate('/teacher/sessions')}
                className="justify-start"
              >
                View Sessions
              </Button>
              <Button
                variant="outline"
                fullWidth
                icon={AlertTriangle}
                onClick={() => navigate('/teacher/flagged-review')}
                className="justify-start"
              >
                Review Flagged ({dashboardData?.flagged_attendance || 0})
              </Button>
              <Button
                variant="outline"
                fullWidth
                icon={CheckCircle}
                onClick={() => navigate('/teacher/manual-attendance')}
                className="justify-start"
              >
                Mark Attendance
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Today's Schedule & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Today's Schedule</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/teacher/sessions')}
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardBody>
              {dashboardData?.today_sessions > 0 ? (
                <div className="space-y-3">
                  {/* Mock data - replace with actual schedule */}
                  {[1, 2, 3].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                      onClick={() => navigate('/teacher/sessions')}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                          <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-900 dark:text-white">
                            Data Structures
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            10:00 AM - 11:30 AM
                          </p>
                        </div>
                      </div>
                      <Badge variant="success" size="sm">Active</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No sessions scheduled for today
                  </p>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Activity</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/teacher/attendance-history')}
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardBody>
              {dashboardData?.recent_activity && dashboardData.recent_activity.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.recent_activity.slice(0, 5).map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg"
                    >
                      <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                        activity.status === 'present' ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' :
                        activity.status === 'absent' ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400' :
                        'bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
                      }`}>
                        <Users className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.student_name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {activity.session_name}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
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
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No recent activity
                  </p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default TeacherDashboard;
