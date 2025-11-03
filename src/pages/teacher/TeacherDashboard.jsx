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
import { ProgressChart, StatsGrid, DonutChart, SimpleLineChart } from '../../components/common/Chart';

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
      title: "Suspicious Records",
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
        {/* Welcome Header */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Teacher Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Manage your classes and track attendance
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Subject Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Subject Performance</CardTitle>
            </CardHeader>
            <CardBody>
              <ProgressChart
                data={dashboardData?.subject_performance || [
                  { label: 'Data Structures', value: 85 },
                  { label: 'Algorithms', value: 92 },
                  { label: 'Database Systems', value: 78 }
                ]}
                title="Attendance by Subject"
              />
            </CardBody>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardBody>
              <StatsGrid
                data={dashboardData?.quick_stats ? [
                  { label: 'This Week', value: dashboardData.quick_stats.this_week },
                  { label: 'This Month', value: dashboardData.quick_stats.this_month },
                  { label: 'Total Classes', value: dashboardData.quick_stats.total_classes },
                  { label: 'Avg. Students', value: dashboardData.quick_stats.avg_students }
                ] : [
                  { label: 'This Week', value: '87%' },
                  { label: 'This Month', value: '84%' },
                  { label: 'Total Classes', value: '24' },
                  { label: 'Avg. Students', value: '28' }
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
                data={dashboardData?.weekly_attendance ? 
                  dashboardData.weekly_attendance.map((value, index) => ({ x: index, y: value })) :
                  [
                    { x: 0, y: 82 },
                    { x: 1, y: 88 },
                    { x: 2, y: 76 },
                    { x: 3, y: 91 },
                    { x: 4, y: 85 },
                    { x: 5, y: 93 },
                    { x: 6, y: 87 }
                  ]
                }
                color="#10b981"
                title="Your Classes"
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
                Review Suspicious ({dashboardData?.flagged_attendance || 0})
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
                  {/* Today's actual sessions from mock data */}
                  {[
                    {
                      subject: 'Algorithms',
                      session: 'Lecture: Graph Algorithms',
                      time: '09:30 AM - 10:45 AM',
                      room: 'CS Block 204',
                      status: 'completed',
                      attendance: '83%'
                    },
                    {
                      subject: 'Data Structures',
                      session: 'Lab: Binary Trees Implementation',
                      time: '02:00 PM - 04:00 PM',
                      room: 'Lab L2',
                      status: 'completed',
                      attendance: '71%'
                    },
                    {
                      subject: 'Database Systems',
                      session: 'Tutorial: SQL Optimization',
                      time: '04:30 PM - 05:30 PM',
                      room: 'IT Block 101',
                      status: 'completed',
                      attendance: '75%'
                    }
                  ].map((session, index) => (
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
                            {session.subject}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {session.session}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {session.time} • {session.room}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={session.status === 'completed' ? 'success' : 'warning'} size="sm">
                          {session.status}
                        </Badge>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {session.attendance} attendance
                        </p>
                      </div>
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
