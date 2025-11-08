import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, BookOpen, FileText, Calendar, Clock, MapPin } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Card, { CardHeader, CardBody, CardTitle } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
const sessionSchema = z.object({
  subject_id: z.number().min(1, 'Subject is required'),
  session_name: z.string().min(1, 'Session name is required'),
  session_date: z.string().min(1, 'Session date is required'),
  start_time: z.string().min(1, 'Start time is required'),
  end_time: z.string().min(1, 'End time is required'),
  geofence_zone_id: z.number().optional(),
});

const SessionForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [subjects] = useState([]);
  const [geofenceZones] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(sessionSchema),
  });

  useEffect(() => {
    // Data loading removed
    // Data loading removed
    if (isEdit) {
      // Data loading removed
    }
  }, [id, isEdit]);

  // Fetch function removed

  // Fetch function removed

  // Fetch function removed

  const onSubmit = async (data) => {
    try {
      const sessionData = {
        ...data,
        session_date: `${data.session_date}T00:00:00Z`,
        start_time: `${data.session_date}T${data.start_time}:00Z`,
        end_time: `${data.session_date}T${data.end_time}:00Z`,
      };

      if (isEdit) {
        /* Service call removed */
        // toast.success('Session updated successfully');
        console.log('Update session:', sessionData);
      } else {
        /* Service call removed */
        // toast.success('Session created successfully');
        console.log('Create session:', sessionData);
      }
      navigate('/admin/sessions');
    } catch (error) {
      console.error('Form submission error:', error);
      // toast.error('Failed to save session');
    }
  };

  return (
    <Layout title={isEdit ? 'Edit Session' : 'Add Session'}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            icon={ArrowLeft}
            onClick={() => navigate('/admin/sessions')}
          >
            Back to Sessions
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isEdit ? 'Edit Session' : 'Create New Session'}</CardTitle>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <Select
                    label="Subject"
                    icon={BookOpen}
                    error={errors.subject_id?.message}
                    fullWidth
                    {...register('subject_id', { valueAsNumber: true })}
                    options={subjects.map(subject => ({ 
                      value: subject.id, 
                      label: `${subject.name} (${subject.code})` 
                    }))}
                  />
                  <Input
                    label="Session Name"
                    placeholder="Data Structures Lecture 1"
                    icon={FileText}
                    error={errors.session_name?.message}
                    fullWidth
                    {...register('session_name')}
                  />
                </div>
              </div>

              {/* Schedule */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Schedule
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Session Date"
                    type="date"
                    icon={Calendar}
                    error={errors.session_date?.message}
                    fullWidth
                    {...register('session_date')}
                  />
                  <Input
                    label="Start Time"
                    type="time"
                    icon={Clock}
                    error={errors.start_time?.message}
                    fullWidth
                    {...register('start_time')}
                  />
                  <Input
                    label="End Time"
                    type="time"
                    icon={Clock}
                    error={errors.end_time?.message}
                    fullWidth
                    {...register('end_time')}
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Location (Optional)
                </h3>
                <Select
                  label="Geofence Zone"
                  icon={MapPin}
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

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => navigate('/admin/sessions')}
                >
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  type="submit" 
                  icon={Save}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : (isEdit ? 'Update Session' : 'Create Session')}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
};

export default SessionForm;

