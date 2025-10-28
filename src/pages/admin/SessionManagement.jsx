import { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, Calendar, Clock, MapPin, BookOpen } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Card, { CardHeader, CardBody, CardTitle } from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import Modal, { ModalFooter } from '../../components/common/Modal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import adminService from '../../services/adminService';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const sessionSchema = z.object({
  subject_id: z.number().min(1, 'Subject is required'),
  session_name: z.string().min(1, 'Session name is required'),
  session_date: z.string().min(1, 'Session date is required'),
  start_time: z.string().min(1, 'Start time is required'),
  end_time: z.string().min(1, 'End time is required'),
  geofence_zone_id: z.number().optional(),
});

const SessionManagement = () => {
  const [sessions, setSessions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [geofenceZones, setGeofenceZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSession, setEditingSession] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(sessionSchema),
  });

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

  const handleOpenModal = (session = null) => {
    setEditingSession(session);
    if (session) {
      reset({
        ...session,
        session_date: session.session_date?.split('T')[0] || '',
        start_time: session.start_time?.split('T')[1]?.substring(0, 5) || '',
        end_time: session.end_time?.split('T')[1]?.substring(0, 5) || '',
      });
    } else {
      reset({
        subject_id: '',
        session_name: '',
        session_date: '',
        start_time: '',
        end_time: '',
        geofence_zone_id: '',
      });
    }
    setShowModal(true);
  };

  const onSubmit = async (data) => {
    try {
      const sessionData = {
        ...data,
        session_date: `${data.session_date}T00:00:00Z`,
        start_time: `${data.session_date}T${data.start_time}:00Z`,
        end_time: `${data.session_date}T${data.end_time}:00Z`,
      };

      if (editingSession) {
        await adminService.updateSession(editingSession.id, sessionData);
        toast.success('Session updated successfully');
      } else {
        await adminService.createSession(sessionData);
        toast.success('Session created successfully');
      }
      setShowModal(false);
      fetchSessions();
    } catch (error) {
      toast.error(`Failed to ${editingSession ? 'update' : 'create'} session`);
      console.error('Session save error:', error);
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
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
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
      render: (value) => formatDate(value, 'MMM dd, yyyy'),
    },
    {
      key: 'time',
      header: 'Time',
      render: (value, row) => (
        <div className="flex items-center space-x-1 text-sm">
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
          <div className="flex items-center space-x-1 text-sm">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span>{zone.name}</span>
          </div>
        ) : '-';
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
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            icon={Edit}
            onClick={(e) => {
              e.stopPropagation();
              handleOpenModal(row);
            }}
          >
            Edit
          </Button>
          <Button
            variant="error"
            size="sm"
            icon={Trash2}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row.id);
            }}
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
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <CardTitle>Session Management</CardTitle>
              <Button
                variant="primary"
                icon={Plus}
                onClick={() => handleOpenModal()}
              >
                Create Session
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                options={[
                  { value: '', label: 'All Subjects' },
                  ...subjects.map(subject => ({ 
                    value: subject.id, 
                    label: subject.name 
                  }))
                ]}
              />
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

        {/* Add/Edit Session Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={editingSession ? 'Edit Session' : 'Create New Session'}
          size="lg"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <Select
                label="Subject"
                error={errors.subject_id?.message}
                fullWidth
                {...register('subject_id', { valueAsNumber: true })}
                options={subjects.map(subject => ({ 
                  value: subject.id, 
                  label: subject.name 
                }))}
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Input
                label="Session Name"
                placeholder="Data Structures Lecture 1"
                error={errors.session_name?.message}
                fullWidth
                {...register('session_name')}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Session Date"
                type="date"
                error={errors.session_date?.message}
                fullWidth
                {...register('session_date')}
              />
              <Input
                label="Start Time"
                type="time"
                error={errors.start_time?.message}
                fullWidth
                {...register('start_time')}
              />
              <Input
                label="End Time"
                type="time"
                error={errors.end_time?.message}
                fullWidth
                {...register('end_time')}
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Select
                label="Geofence Zone (Optional)"
                fullWidth
                {...register('geofence_zone_id', { valueAsNumber: true })}
                options={[
                  { value: '', label: 'No Geofence Zone' },
                  ...geofenceZones.map(zone => ({ 
                    value: zone.id, 
                    label: zone.name 
                  }))
                ]}
              />
            </div>

            <ModalFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {editingSession ? 'Update Session' : 'Create Session'}
              </Button>
            </ModalFooter>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};

export default SessionManagement;

