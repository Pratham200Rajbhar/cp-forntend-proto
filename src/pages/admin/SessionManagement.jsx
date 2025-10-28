import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Calendar, Clock, MapPin } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Card, { CardHeader, CardBody, CardTitle } from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import adminService from '../../services/adminService';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const SessionManagement = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [geofenceZones, setGeofenceZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  useEffect(() => {
    fetchSessions();
    fetchSubjects();
    fetchGeofenceZones();
  }, [selectedSubject]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const data = await adminService.getSessions({ 
        subject_id: selectedSubject || undefined,
        limit: 100 
      });
      setSessions(data);
    } catch (error) {
      toast.error('Failed to load sessions');
      console.error('Sessions error:', error);
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

  const fetchGeofenceZones = async () => {
    try {
      const data = await adminService.getGeofenceZones({ limit: 100 });
      setGeofenceZones(data);
    } catch (error) {
      console.error('Geofence zones error:', error);
    }
  };

  const handleDelete = async (sessionId) => {
    if (!confirm('Are you sure you want to delete this session?')) return;

    try {
      await adminService.deleteSession(sessionId);
      toast.success('Session deleted successfully');
      fetchSessions();
    } catch (error) {
      toast.error('Failed to delete session');
      console.error('Delete error:', error);
    }
  };

  const filteredSessions = sessions.filter(session =>
    session.session_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.subject?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      key: 'session_name',
      header: 'Session',
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
            <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">{value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{row.subject?.name}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'session_date',
      header: 'Date',
      render: (value) => (
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {formatDate(value, 'MMM dd, yyyy')}
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
            {row.start_time?.split('T')[1]?.substring(0, 5)} - {row.end_time?.split('T')[1]?.substring(0, 5)}
          </span>
        </div>
      ),
    },
    {
      key: 'geofence_zone',
      header: 'Location',
      render: (value, row) => {
        const zone = geofenceZones.find(z => z.id === row.geofence_zone_id);
        return zone ? (
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span>{zone.name}</span>
          </div>
        ) : (
          <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
        );
      },
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (value) => (
        <Badge variant={value ? 'success' : 'error'}>
          {value ? 'Active' : 'Inactive'}
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
              loading={loading}
              emptyMessage="No sessions found"
            />
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
};

export default SessionManagement;
