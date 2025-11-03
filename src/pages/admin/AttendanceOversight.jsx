import { useEffect, useState } from 'react';
import { Search, Filter, Download, Eye, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Card, { CardHeader, CardBody, CardTitle } from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import StatCard from '../../components/common/StatCard';
import adminService from '../../services/adminService';
import attendanceService from '../../services/attendanceService';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const AttendanceOversight = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });

  useEffect(() => {
    fetchAttendanceData();
    fetchSubjects();
    fetchSessions();
  }, [selectedSubject, selectedSession, selectedStatus, dateRange]);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const params = {
        subject_id: selectedSubject || undefined,
        session_id: selectedSession || undefined,
        status: selectedStatus || undefined,
        start_date: dateRange.start || undefined,
        end_date: dateRange.end || undefined,
        limit: 100
      };
      
      const data = await attendanceService.generateAttendanceReport(params);
      setAttendanceData(data);
    } catch (error) {
      toast.error('Failed to load attendance data');
      console.error('Attendance data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const data = await adminService.getSubjects({ limit: 100 });
      setSubjects(data);
    } catch (error) {
      console.error('Subjects error:', error);
    }
  };

  const fetchSessions = async () => {
    try {
      const data = await adminService.getSessions({ limit: 100 });
      setSessions(data);
    } catch (error) {
      console.error('Sessions error:', error);
    }
  };

  const handleExport = async () => {
    try {
      const params = {
        subject_id: selectedSubject || undefined,
        session_id: selectedSession || undefined,
        status: selectedStatus || undefined,
        start_date: dateRange.start || undefined,
        end_date: dateRange.end || undefined,
        format: 'csv'
      };
      
      await attendanceService.generateAttendanceReport(params);
      toast.success('Attendance report exported successfully');
    } catch (error) {
      toast.error('Failed to export attendance report');
      console.error('Export error:', error);
    }
  };

  const filteredData = attendanceData.filter(record =>
    record.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.subject_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.session_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate statistics
  const totalRecords = filteredData.length;
  const presentCount = filteredData.filter(r => r.status === 'present').length;
  const absentCount = filteredData.filter(r => r.status === 'absent').length;
  const suspiciousCount = filteredData.filter(r => r.status === 'suspicious').length;
  const attendanceRate = totalRecords > 0 ? ((presentCount / totalRecords) * 100).toFixed(1) : 0;

  const statsCards = [
    {
      title: 'Total Records',
      value: totalRecords,
      icon: CheckCircle,
      color: 'primary',
    },
    {
      title: 'Present',
      value: presentCount,
      icon: CheckCircle,
      color: 'success',
    },
    {
      title: 'Absent',
      value: absentCount,
      icon: XCircle,
      color: 'error',
    },
    {
      title: 'Flagged',
      value: suspiciousCount,
      icon: AlertCircle,
      color: 'warning',
    },
    {
      title: 'Attendance Rate',
      value: `${attendanceRate}%`,
      icon: Clock,
      color: 'info',
    },
  ];

  const columns = [
    {
      key: 'student_name',
      header: 'Student',
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {value?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">{value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{row.student_id}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'subject_name',
      header: 'Subject',
      render: (value) => (
        <div className="text-sm">
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: 'session_name',
      header: 'Session',
      render: (value) => (
        <div className="text-sm">
          <span>{value}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => (
        <Badge variant={
          value === 'present' ? 'success' :
          value === 'absent' ? 'error' :
          value === 'suspicious' ? 'warning' : 'info'
        }>
          {value}
        </Badge>
      ),
    },
    {
      key: 'submission_time',
      header: 'Submitted',
      render: (value) => value ? formatDate(value, 'MMM dd, HH:mm') : '-',
    },
    {
      key: 'scores',
      header: 'AI Scores',
      render: (value, row) => (
        <div className="text-xs space-y-1">
          {row.face_recognition_score && (
            <div>Face: {(row.face_recognition_score * 100).toFixed(1)}%</div>
          )}
          {row.liveness_detection_score && (
            <div>Liveness: {(row.liveness_detection_score * 100).toFixed(1)}%</div>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <Button
          variant="outline"
          size="sm"
          icon={Eye}
          onClick={() => {
            // View details logic
            console.log('View details for:', row);
          }}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <Layout title="Attendance Oversight">
      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {statsCards.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Filters and Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Records</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Input
                placeholder="Search records..."
                icon={Search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select
                placeholder="Filter by subject"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                options={[
                  { value: '', label: 'All Subjects' },
                  ...subjects.map(subject => ({ 
                    value: subject.id, 
                    label: subject.name 
                  }))
                ]}
              />
              <Select
                placeholder="Filter by session"
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
                options={[
                  { value: '', label: 'All Sessions' },
                  ...sessions.map(session => ({ 
                    value: session.id, 
                    label: session.session_name 
                  }))
                ]}
              />
              <Select
                placeholder="Filter by status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                options={[
                  { value: '', label: 'All Status' },
                  { value: 'present', label: 'Present' },
                  { value: 'absent', label: 'Absent' },
                  { value: 'suspicious', label: 'Flagged' },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Input
                label="Start Date"
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              />
              <Input
                label="End Date"
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              />
            </div>

            <div className="flex justify-end space-x-2 mb-6">
              <Button
                variant="outline"
                icon={Filter}
                onClick={fetchAttendanceData}
              >
                Apply Filters
              </Button>
              <Button
                variant="primary"
                icon={Download}
                onClick={handleExport}
              >
                Export Report
              </Button>
            </div>

            {/* Attendance Table */}
            <Table
              columns={columns}
              data={filteredData}
              loading={loading}
              emptyMessage="No attendance records found"
            />
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
};

export default AttendanceOversight;

