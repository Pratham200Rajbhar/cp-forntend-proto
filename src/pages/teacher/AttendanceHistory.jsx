import { useState, useEffect } from 'react';
import { Download, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import Layout from '../../components/layout/Layout';
import Card, { CardHeader, CardBody, CardTitle } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { formatDate, formatPercentage } from '../../utils/helpers';

const AttendanceHistory = () => {
  const [activeTab, setActiveTab] = useState('session');
  const [loading] = useState(false); // Using mock data

  // Mock data - Session/Report APIs not documented in API_DOCUMENTATION.md
  const sessionData = [
    {
      id: 1,
      date: '2025-11-07',
      session: 'Lecture 1: Introduction',
      subject: 'Data Structures',
      present: 23,
      total: 25,
      rate: 92,
    },
    {
      id: 2,
      date: '2025-11-06',
      session: 'Lab Session 3',
      subject: 'Algorithms',
      present: 20,
      total: 25,
      rate: 80,
    },
    {
      id: 3,
      date: '2025-11-05',
      session: 'Tutorial: SQL Basics',
      subject: 'Database Systems',
      present: 22,
      total: 25,
      rate: 88,
    }
  ];

  const studentData = [
    {
      id: 1,
      name: 'Aarav Verma',
      email: 'aarav.verma@students.iitm.ac.in',
      totalSessions: 15,
      present: 13,
      absent: 1,
      suspicious: 1,
      rate: 86.7,
    },
    {
      id: 2,
      name: 'Diya Gupta',
      email: 'diya.gupta@students.iitm.ac.in',
      totalSessions: 15,
      present: 15,
      absent: 0,
      suspicious: 0,
      rate: 100,
    },
    {
      id: 3,
      name: 'Kabir Nair',
      email: 'kabir.nair@students.iitm.ac.in',
      totalSessions: 15,
      present: 14,
      absent: 1,
      suspicious: 0,
      rate: 93.3,
    },
    {
      id: 4,
      name: 'Priya Patel',
      email: 'priya.patel@students.iitm.ac.in',
      totalSessions: 15,
      present: 12,
      absent: 2,
      suspicious: 1,
      rate: 80.0,
    },
  ];

  useEffect(() => {
    // Mock data - no API call needed
  }, [activeTab]);

  const handleExport = async () => {
    try {
      // Export API not documented
      toast.success('Report exported successfully (mock)');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export report');
    }
  };

  return (
    <Layout title="Attendance History">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Attendance History</CardTitle>
              <Button variant="outline" icon={Download} onClick={handleExport}>
                Export Report
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('session')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'session'
                      ? 'border-sky-600 text-sky-600 dark:text-sky-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  Session-wise
                </button>
                <button
                  onClick={() => setActiveTab('student')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'student'
                      ? 'border-sky-600 text-sky-600 dark:text-sky-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  Student-wise
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="text-gray-500">Loading...</div>
              </div>
            ) : (
              <>
                {/* Session-wise View */}
                {activeTab === 'session' && (
                  <div className="space-y-4">
                    {sessionData.length > 0 ? (
                      sessionData.map((session) => (
                        <div
                          key={session.id}
                          className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <Calendar className="h-5 w-5 text-gray-400" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {formatDate(session.date || session.session_date)}
                                </span>
                              </div>
                              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                                {session.session_name || session.session}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {session.subject_name || session.subject}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-sky-600 dark:text-sky-400">
                                {formatPercentage(session.attendance_rate || session.rate)}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {session.present || session.present_count}/{session.total || session.total_students} present
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        No session data available
                      </div>
                    )}
                  </div>
                )}

                {/* Student-wise View */}
                {activeTab === 'student' && (
                  <div className="space-y-4">
                    {studentData.length > 0 ? (
                      studentData.map((student) => (
                        <div
                          key={student.id}
                          className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                {student.student_name || student.name}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {student.student_email || student.email}
                              </p>
                            </div>
                            <Badge
                              variant={
                                (student.attendance_rate || student.rate) >= 90
                                  ? 'success'
                                  : (student.attendance_rate || student.rate) >= 75
                                  ? 'warning'
                                  : 'error'
                              }
                            >
                              {formatPercentage(student.attendance_rate || student.rate)}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600 dark:text-gray-400">Total</p>
                              <p className="font-medium text-gray-900 dark:text-gray-100">
                                {student.total_sessions || student.totalSessions}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600 dark:text-gray-400">Present</p>
                              <p className="font-medium text-green-600 dark:text-green-400">
                                {student.present || student.present_count}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600 dark:text-gray-400">Absent</p>
                              <p className="font-medium text-red-600 dark:text-red-400">
                                {student.absent || student.absent_count}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600 dark:text-gray-400">Flagged</p>
                              <p className="font-medium text-amber-600 dark:text-amber-400">
                                {student.suspicious || student.flagged_count || 0}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        No student data available
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
};

export default AttendanceHistory;

