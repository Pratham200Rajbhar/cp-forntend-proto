import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, User, Mail, Lock, Phone, Building2 } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Card, { CardHeader, CardBody, CardTitle } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
const teacherSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  full_name: z.string().min(1, 'Full name is required'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  department: z.string().min(1, 'Department is required'),
  phone_number: z.string().optional(),
  is_active: z.boolean().optional(),
});

const TeacherForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      is_active: true,
    },
  });

  useEffect(() => {
    if (isEdit) {
      // Data loading removed
    }
  }, [id, isEdit]);

  // Fetch function removed

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        /* Service call removed */
        // toast.success('Teacher updated successfully');
        console.log('Update teacher:', data);
      } else {
        /* Service call removed */
        // toast.success('Teacher created successfully');
        console.log('Create teacher:', data);
      }
      navigate('/admin/teachers');
    } catch (error) {
      console.error('Form submission error:', error);
      // toast.error('Failed to save teacher');
    }
  };

  const departments = [
    'Computer Science',
    'Information Technology',
    'Electronics and Communication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'Business Administration',
    'Mathematics',
    'Physics',
    'Chemistry',
  ];

  return (
    <Layout title={isEdit ? 'Edit Teacher' : 'Add Teacher'}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            icon={ArrowLeft}
            onClick={() => navigate('/admin/teachers')}
          >
            Back to Teachers
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isEdit ? 'Edit Teacher' : 'Add New Teacher'}</CardTitle>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    placeholder="Dr. Jane Smith"
                    icon={User}
                    error={errors.full_name?.message}
                    fullWidth
                    {...register('full_name')}
                  />
                  <Input
                    label="Username"
                    placeholder="janesmith"
                    icon={User}
                    error={errors.username?.message}
                    fullWidth
                    {...register('username')}
                  />
                </div>
              </div>

              {/* Account Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Account Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Email"
                    type="email"
                    placeholder="jane@university.edu"
                    icon={Mail}
                    error={errors.email?.message}
                    fullWidth
                    {...register('email')}
                  />
                  <Input
                    label={isEdit ? 'Password (leave blank to keep current)' : 'Password'}
                    type="password"
                    placeholder="••••••••"
                    icon={Lock}
                    error={errors.password?.message}
                    fullWidth
                    {...register('password')}
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Contact & Department
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Phone Number"
                    placeholder="+1234567890"
                    icon={Phone}
                    error={errors.phone_number?.message}
                    fullWidth
                    {...register('phone_number')}
                  />
                  <Select
                    label="Department"
                    icon={Building2}
                    error={errors.department?.message}
                    fullWidth
                    {...register('department')}
                    options={departments.map(dept => ({ value: dept, label: dept }))}
                  />
                </div>
              </div>


              {/* Status */}
              <div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    {...register('is_active')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Active Teacher
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => navigate('/admin/teachers')}
                >
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  type="submit" 
                  icon={Save}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : (isEdit ? 'Update Teacher' : 'Create Teacher')}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
};

export default TeacherForm;

