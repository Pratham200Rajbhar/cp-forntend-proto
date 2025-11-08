import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Search, Filter, Download } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Card, { CardHeader, CardBody, CardTitle } from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import { formatDate, formatPercentage } from '../../utils/helpers';
import toast from 'react-hot-toast';

const Sessions = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Mock data (Session and Subject APIs not documented in API_DOCUMENTATION.md)
  const mockSessions = [
    {
      _id: '1',
      subject: { name: 'Data Structures', code: 'CS201' },
      date: new Date().toISOString(),
      start_time: '09:00',
      end_time: '10:30',
      location: { name: 'Room 101', building: 'Main Building' },
      status: 'scheduled',
      total_students: 45,
      present_count: 0
    },
    {
      _id: '2',
      subject: { name: 'Algorithms', code: 'CS202' },
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      start_time: '11:00',
      end_time: '12:30',
      location: { name: 'Lab 2', building: 'CS Building' },
      status: 'scheduled',
      total_students: 42,
      present_count: 0
    },
    {
      _id: '3',
      subject: { name: 'Database Systems', code: 'CS301' },
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      start_time: '14:00',
      end_time: '15:30',
      location: { name: 'Room 205', building: 'Main Building' },
      status: 'completed',
      total_students: 48,
      present_count: 42
    },
    {
      _id: '4',
      subject: { name: 'Data Structures', code: 'CS201' },
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      start_time: '09:00',
      end_time: '10:30',
      location: { name: 'Room 101', building: 'Main Building' },
      status: 'completed',
      total_students: 45,
      present_count: 38
    }
  ];

  const mockSubjects = [
    { _id: '1', name: 'Data Structures', code: 'CS201' },
    { _id: '2', name: 'Algorithms', code: 'CS202' },
    { _id: '3', name: 'Database Systems', code: 'CS301' }
  ];

  const [sessions] = useState(mockSessions);
  const subjects = mockSubjects;

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.subject?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.subject?.code?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });


  const columns = [
    {
      key: 'session_date',
      header: 'Date',
      render: (value) => {
        if (!value) return '';
        try {
          // Handle date string like "2025-01-15"
          const dateObj = new Date(value + 'T00:00:00');
          return formatDate(dateObj, 'MMM dd, yyyy');
        } catch {
          return value;
        }
      },
    },
    {
      key: 'start_time',
      header: 'Time',
      render: (_, row) => {
        const startTime = row.start_time || '--';
        const endTime = row.end_time || '--';
        return `${startTime} - ${endTime}`;
      },
    },
    {
      key: 'subject_name',
      header: 'Subject',
      render: (value) => (
        <div>
          <p className="font-medium">{value}</p>
        </div>
      ),
    },
    {
      key: 'session_name',
      header: 'Session',
    },
    {
      key: 'attendance',
      header: 'Attendance',
      render: (_, row) => (
        <div>
          <p className="font-medium">{row.present_count}/{row.total_students}</p>
          <p className="text-xs text-gray-500">
            {formatPercentage(row.attendance_rate || 0)}
          </p>
        </div>
      ),
    },
    {
      key: 'suspicious_count',
      header: 'Suspicious',
      render: (value) => (
        value > 0 ? (
          <Badge variant="warning">{value}</Badge>
        ) : (
          <span className="text-gray-400">0</span>
        )
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/teacher/sessions/${row.id}`);
            }}
          >
            View Details
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Layout title="Sessions">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <CardTitle>All Sessions</CardTitle>
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                <Button
                  variant="outline"
                  icon={Download}
                  onClick={() => toast.info('Export functionality coming soon')}
                >
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardBody>
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Input
                placeholder="Search sessions..."
                icon={Search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select
                placeholder="Filter by subject"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                options={subjects.map(s => ({ value: s.id, label: s.name }))}
              />
              <Select
                placeholder="Filter by status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                options={[
                  { value: 'active', label: 'Active' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'upcoming', label: 'Upcoming' },
                ]}
              />
            </div>

            {/* Sessions Table */}
            <Table
              columns={columns}
              data={filteredSessions}
              onRowClick={(row) => navigate(`/teacher/sessions/${row.id}`)}
              emptyMessage="No sessions found"
            />
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
};

export default Sessions;

