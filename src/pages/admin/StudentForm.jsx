import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Card, { CardHeader, CardBody, CardTitle } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import studentService from '../../services/studentService';
import toast from 'react-hot-toast';

const studentSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  full_name: z.string().min(1, 'Full name is required'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  department: z.string().min(1, 'Department is required'),
  phone_number: z.string().optional(),
  student_id: z.string().min(1, 'Student ID is required'),
  is_active: z.boolean().optional(),
});

const StudentForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      is_active: true,
    },
  });

  useEffect(() => {
    if (isEdit) {
      fetchStudent();
    }
  }, [id]);

  const fetchStudent = async () => {
    try {
      const data = await studentService.getStudent(id);
      reset(data);
    } catch (error) {
      toast.error('Failed to load student details');
      console.error('Student fetch error:', error);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await studentService.updateStudent(id, data);
        toast.success('Student updated successfully');
      } else {
        await studentService.createStudent(data);
        toast.success('Student created successfully');
      }
      navigate('/admin/students');
    } catch (error) {
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} student`);
      console.error('Student save error:', error);
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
    <Layout title={isEdit ? 'Edit Student' : 'Add Student'}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            icon={ArrowLeft}
            onClick={() => navigate('/admin/students')}
          >
            Back to Students
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isEdit ? 'Edit Student' : 'Add New Student'}</CardTitle>
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
                    placeholder="John Doe"
                    error={errors.full_name?.message}
                    fullWidth
                    {...register('full_name')}
                  />
                  <Input
                    label="Student ID"
                    placeholder="STU001"
                    error={errors.student_id?.message}
                    fullWidth
                    {...register('student_id')}
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
                    label="Username"
                    placeholder="johndoe"
                    error={errors.username?.message}
                    fullWidth
                    {...register('username')}
                  />
                  <Input
                    label={isEdit ? 'Password (leave blank to keep current)' : 'Password'}
                    type="password"
                    placeholder="••••••••"
                    error={errors.password?.message}
                    fullWidth
                    {...register('password')}
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Email"
                    type="email"
                    placeholder="john@university.edu"
                    error={errors.email?.message}
                    fullWidth
                    {...register('email')}
                  />
                  <Input
                    label="Phone Number"
                    placeholder="+1234567890"
                    error={errors.phone_number?.message}
                    fullWidth
                    {...register('phone_number')}
                  />
                </div>
              </div>

              {/* Academic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Academic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Department"
                    error={errors.department?.message}
                    fullWidth
                    {...register('department')}
                    options={departments.map(dept => ({ value: dept, label: dept }))}
                  />
                  <div className="flex items-end">
                    <div className="flex items-center space-x-2 h-10">
                      <input
                        type="checkbox"
                        id="is_active"
                        {...register('is_active')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="is_active" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Active Student
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => navigate('/admin/students')}
                >
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  type="submit" 
                  icon={Save}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : (isEdit ? 'Update Student' : 'Create Student')}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
};

export default StudentForm;

