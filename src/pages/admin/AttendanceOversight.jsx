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
import { formatDate } from '../../utils/helpers';
import { studentService } from '../../services/api';
import toast from 'react-hot-toast';

const AttendanceOversight = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });

  // Mock data
  const sessions = [];
  const attendanceData = [
    {
      id: 1,
      student_name: 'John Doe',
      student_id: 'STU001',
      subject_name: 'Computer Science',
      session_name: 'CS101 - Introduction',
      status: 'present',
      timestamp: new Date().toISOString(),
      face_recognition_score: 0.87,
      liveness_detection_score: 0.92
    },
    {
      id: 2,
      student_name: 'Jane Smith',
      student_id: 'STU002',
      subject_name: 'Mathematics',
      session_name: 'MATH201 - Calculus',
      status: 'absent',
      timestamp: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 3,
      student_name: 'Bob Johnson',
      student_id: 'STU003',
      subject_name: 'Physics',
      session_name: 'PHY101 - Mechanics',
      status: 'suspicious',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      face_recognition_score: 0.45,
      liveness_detection_score: 0.38
    }
  ];

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      await studentService.getAll();
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to load students data');
    }
  };

  const handleApplyFilters = () => {
    toast.success('Filters applied');
  };

  const handleExport = async () => {
    try {
      // Export not documented in API
      toast.success('Attendance report exported successfully (mock)');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export report');
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
                  { value: '1', label: 'Computer Science' },
                  { value: '2', label: 'Mathematics' },
                  { value: '3', label: 'Physics' }
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
                onClick={handleApplyFilters}
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
              emptyMessage="No attendance records found"
            />
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
};

export default AttendanceOversight;

