import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, MapPin, Navigation, Circle } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Card, { CardHeader, CardBody, CardTitle } from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import adminService from '../../services/adminService';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const GeofenceManagement = () => {
  const navigate = useNavigate();
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-purple-50 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
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
        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <Navigation className="h-4 w-4 text-gray-400" />
          <span>{row.center?.latitude?.toFixed?.(6)}, {row.center?.longitude?.toFixed?.(6)}</span>
        </div>
      ),
    },
    {
      key: 'radius',
      header: 'Radius',
      render: (value, row) => (
        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <Circle className="h-4 w-4 text-gray-400" />
          <span>{row.radius}m</span>
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (value) => (
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {formatDate(value, 'MMM dd, yyyy')}
        </span>
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
              navigate(`/admin/geofence/edit/${row.id}`);
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
    <Layout title="Geofence Management">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Geofence Zones</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage location-based zones for attendance tracking
            </p>
          </div>
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => navigate('/admin/geofence/add')}
          >
            Add Zone
          </Button>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle>Geofence Zones</CardTitle>
          </CardHeader>
          <CardBody>
            {/* Filters */}
            <div className="mb-6">
              <Input
                placeholder="Search by zone name or description..."
                icon={Search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Results Summary */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredZones.length} of {zones.length} zones
              </p>
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
      </div>
    </Layout>
  );
};

export default GeofenceManagement;
