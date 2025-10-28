import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Card, { CardHeader, CardBody, CardTitle } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Textarea from '../../components/common/Textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

const geofenceSchema = z.object({
  name: z.string().min(1, 'Zone name is required'),
  latitude: z.number().min(-90).max(90, 'Invalid latitude'),
  longitude: z.number().min(-180).max(180, 'Invalid longitude'),
  radius: z.number().min(1, 'Radius must be at least 1 meter'),
  description: z.string().optional(),
});

const GeofenceForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(geofenceSchema),
  });

  useEffect(() => {
    if (isEdit) {
      fetchGeofenceZone();
    }
  }, [id]);

  const fetchGeofenceZone = async () => {
    try {
      const data = await adminService.getGeofenceZone(id);
      reset(data);
    } catch (error) {
      toast.error('Failed to load geofence zone details');
      console.error('Geofence fetch error:', error);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await adminService.updateGeofenceZone(id, data);
        toast.success('Geofence zone updated successfully');
      } else {
        await adminService.createGeofenceZone(data);
        toast.success('Geofence zone created successfully');
      }
      navigate('/admin/geofence');
    } catch (error) {
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} geofence zone`);
      console.error('Geofence save error:', error);
    }
  };

  return (
    <Layout title={isEdit ? 'Edit Geofence Zone' : 'Add Geofence Zone'}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            icon={ArrowLeft}
            onClick={() => navigate('/admin/geofence')}
          >
            Back to Geofence Zones
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isEdit ? 'Edit Geofence Zone' : 'Add New Geofence Zone'}</CardTitle>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Basic Information
                </h3>
                <Input
                  label="Zone Name"
                  placeholder="Main Building"
                  error={errors.name?.message}
                  fullWidth
                  {...register('name')}
                />
              </div>

              {/* Location Coordinates */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Location Coordinates
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Latitude"
                    type="number"
                    step="any"
                    placeholder="40.7128"
                    error={errors.latitude?.message}
                    fullWidth
                    {...register('latitude', { valueAsNumber: true })}
                  />
                  <Input
                    label="Longitude"
                    type="number"
                    step="any"
                    placeholder="-74.0060"
                    error={errors.longitude?.message}
                    fullWidth
                    {...register('longitude', { valueAsNumber: true })}
                  />
                  <Input
                    label="Radius (meters)"
                    type="number"
                    placeholder="100"
                    error={errors.radius?.message}
                    fullWidth
                    {...register('radius', { valueAsNumber: true })}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Tip: You can use Google Maps to find coordinates. Right-click on a location and select the coordinates.
                </p>
              </div>

              {/* Description */}
              <div>
                <Textarea
                  label="Description (Optional)"
                  placeholder="Description of the geofence zone"
                  error={errors.description?.message}
                  rows={4}
                  fullWidth
                  {...register('description')}
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => navigate('/admin/geofence')}
                >
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  type="submit" 
                  icon={Save}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : (isEdit ? 'Update Zone' : 'Create Zone')}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
};

export default GeofenceForm;

