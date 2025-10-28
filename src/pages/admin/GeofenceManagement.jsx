import { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, MapPin, Navigation, Circle } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Card, { CardHeader, CardBody, CardTitle } from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Modal, { ModalFooter } from '../../components/common/Modal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import adminService from '../../services/adminService';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const geofenceSchema = z.object({
  name: z.string().min(1, 'Zone name is required'),
  description: z.string().optional(),
  center_latitude: z.number().min(-90).max(90, 'Invalid latitude'),
  center_longitude: z.number().min(-180).max(180, 'Invalid longitude'),
  radius_meters: z.number().min(1, 'Radius must be at least 1 meter'),
  is_active: z.boolean().optional(),
});

const GeofenceManagement = () => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingZone, setEditingZone] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(geofenceSchema),
  });

  useEffect(() => {
    fetchZones();
  }, []);

  const fetchZones = async () => {
    try {
      setLoading(true);
      const data = await adminService.getGeofenceZones({ limit: 100 });
      setZones(data);
    } catch (error) {
      toast.error('Failed to load geofence zones');
      console.error('Zones error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (zone = null) => {
    setEditingZone(zone);
    if (zone) {
      reset(zone);
    } else {
      reset({
        name: '',
        description: '',
        center_latitude: 0,
        center_longitude: 0,
        radius_meters: 50,
        is_active: true,
      });
    }
    setShowModal(true);
  };

  const onSubmit = async (data) => {
    try {
      if (editingZone) {
        await adminService.updateGeofenceZone(editingZone.id, data);
        toast.success('Geofence zone updated successfully');
      } else {
        await adminService.createGeofenceZone(data);
        toast.success('Geofence zone created successfully');
      }
      setShowModal(false);
      fetchZones();
    } catch (error) {
      toast.error(`Failed to ${editingZone ? 'update' : 'create'} geofence zone`);
      console.error('Zone save error:', error);
    }
  };

  const handleDelete = async (zoneId) => {
    if (!confirm('Are you sure you want to delete this geofence zone?')) return;

    try {
      await adminService.deleteGeofenceZone(zoneId);
      toast.success('Geofence zone deleted successfully');
      fetchZones();
    } catch (error) {
      toast.error('Failed to delete geofence zone');
      console.error('Delete error:', error);
    }
  };

  const filteredZones = zones.filter(zone =>
    zone.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    zone.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      key: 'name',
      header: 'Zone',
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
            <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">{value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{row.description || 'No description'}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      render: (value, row) => (
        <div className="text-sm">
          <div className="flex items-center space-x-1">
            <Navigation className="h-4 w-4 text-gray-400" />
            <span>{row.center_latitude?.toFixed(6)}, {row.center_longitude?.toFixed(6)}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'radius',
      header: 'Radius',
      render: (value, row) => (
        <div className="flex items-center space-x-1 text-sm">
          <Circle className="h-4 w-4 text-gray-400" />
          <span>{row.radius_meters}m</span>
        </div>
      ),
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
      key: 'created_at',
      header: 'Created',
      render: (value) => formatDate(value, 'MMM dd, yyyy'),
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
    <Layout title="Geofence Management">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <CardTitle>Geofence Zones</CardTitle>
              <Button
                variant="primary"
                icon={Plus}
                onClick={() => handleOpenModal()}
              >
                Add Zone
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
              <Input
                placeholder="Search geofence zones..."
                icon={Search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Zones Table */}
            <Table
              columns={columns}
              data={filteredZones}
              loading={loading}
              emptyMessage="No geofence zones found"
            />
          </CardBody>
        </Card>

        {/* Add/Edit Zone Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={editingZone ? 'Edit Geofence Zone' : 'Add New Geofence Zone'}
          size="lg"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <Input
                label="Zone Name"
                placeholder="Main Campus Building A"
                error={errors.name?.message}
                fullWidth
                {...register('name')}
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Input
                label="Description"
                placeholder="Main campus building A classroom area"
                error={errors.description?.message}
                fullWidth
                {...register('description')}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Center Latitude"
                type="number"
                step="0.000001"
                placeholder="40.7128"
                error={errors.center_latitude?.message}
                fullWidth
                {...register('center_latitude', { valueAsNumber: true })}
              />
              <Input
                label="Center Longitude"
                type="number"
                step="0.000001"
                placeholder="-74.0060"
                error={errors.center_longitude?.message}
                fullWidth
                {...register('center_longitude', { valueAsNumber: true })}
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Input
                label="Radius (meters)"
                type="number"
                step="0.1"
                placeholder="50"
                error={errors.radius_meters?.message}
                fullWidth
                {...register('radius_meters', { valueAsNumber: true })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_active"
                {...register('is_active')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Active Zone
              </label>
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
                {editingZone ? 'Update Zone' : 'Create Zone'}
              </Button>
            </ModalFooter>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};

export default GeofenceManagement;

