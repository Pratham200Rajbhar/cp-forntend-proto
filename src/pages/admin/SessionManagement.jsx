import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Calendar, Clock, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import Layout from '../../components/layout/Layout';
import Card, { CardHeader, CardBody, CardTitle } from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import { formatDate } from '../../utils/helpers';

const SessionManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  // Mock data (Session and Subject APIs not documented in API_DOCUMENTATION.md)
  const mockSessions = [
    {
      _id: '1',
      subject: { _id: '1', name: 'Data Structures', code: 'CS201' },
      teacher: { name: 'Dr. Smith', employee_id: 'EMP001' },
      date: new Date().toISOString(),
      start_time: '09:00',
      end_time: '10:30',
      location: { name: 'Room 101', building: 'Main Building' },
      geofence: { name: 'Main Campus', radius: 100 },
      status: 'scheduled',
      attendance_count: 0
    },
    {
      _id: '2',
      subject: { _id: '2', name: 'Algorithms', code: 'CS202' },
      teacher: { name: 'Prof. Johnson', employee_id: 'EMP002' },
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      start_time: '11:00',
      end_time: '12:30',
      location: { name: 'Lab 2', building: 'CS Building' },
      geofence: { name: 'CS Department', radius: 50 },
      status: 'scheduled',
      attendance_count: 0
    },
    {
      _id: '3',
      subject: { _id: '3', name: 'Database Systems', code: 'CS301' },
      teacher: { name: 'Dr. Williams', employee_id: 'EMP003' },
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      start_time: '14:00',
      end_time: '15:30',
      location: { name: 'Room 205', building: 'Main Building' },
      geofence: { name: 'Main Campus', radius: 100 },
      status: 'completed',
      attendance_count: 42
    }
  ];

  const mockSubjects = [
    { _id: '1', name: 'Data Structures', code: 'CS201' },
    { _id: '2', name: 'Algorithms', code: 'CS202' },
    { _id: '3', name: 'Database Systems', code: 'CS301' },
    { _id: '4', name: 'Operating Systems', code: 'CS302' },
    { _id: '5', name: 'Computer Networks', code: 'CS303' }
  ];

  const [sessions, setSessions] = useState(mockSessions);
  const subjects = mockSubjects;

  const handleDelete = (sessionId) => {
    if (!confirm('Are you sure you want to delete this session?')) return;
    setSessions(sessions.filter(s => s._id !== sessionId));
    toast.success('Session deleted successfully');
  };

  const filteredSessions = sessions.filter(session =>
    session.session?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      key: 'session',
      header: 'Session',
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
            <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">{row.session || 'Untitled Session'}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{row.subject || 'No Subject'}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      render: (value, row) => (
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {formatDate(row.date, 'MMM dd, yyyy')}
        </span>
      ),
    },
    {
      key: 'time',
      header: 'Time',
      render: (value, row) => (
        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <Clock className="h-4 w-4 text-gray-400" />
          <span>
            {row.startTime} - {row.endTime}
          </span>
        </div>
      ),
    },
    {
      key: 'room',
      header: 'Location',
      render: (value, row) => (
        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span>{row.room || 'No Location'}</span>
        </div>
      ),
    },
    {
      key: 'attendance',
      header: 'Attendance',
      render: (value, row) => (
        <div className="text-center">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {row.present?.length || 0} / {(row.present?.length || 0) + (row.absent?.length || 0)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {row.attendanceRate || 0}%
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => (
        <Badge variant={value === 'completed' ? 'success' : value === 'scheduled' ? 'warning' : 'error'}>
          {value === 'completed' ? 'Completed' : value === 'scheduled' ? 'Scheduled' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon={Edit}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/sessions/edit/${row.id}`);
            }}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={Trash2}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row.id);
            }}
            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Layout title="Session Management">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sessions</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage class sessions and schedules
            </p>
          </div>
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => navigate('/admin/sessions/add')}
          >
            Create Session
          </Button>
        </div>

        {/* Main Content */}
        <Card>
          <CardBody>
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Input
                placeholder="Search by session or subject name..."
                icon={Search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select
                placeholder="All Subjects"
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
            </div>

            {/* Results Summary */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredSessions.length} of {sessions.length} sessions
              </p>
            </div>

            {/* Sessions Table */}
            <Table
              columns={columns}
              data={filteredSessions}
              emptyMessage="No sessions found"
            />
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
};

export default SessionManagement;
