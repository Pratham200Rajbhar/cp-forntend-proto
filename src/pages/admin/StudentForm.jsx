import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, User, Hash, Mail, Lock, Phone, Building2, Calendar, Users, Upload, Camera } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Card, { CardHeader, CardBody, CardTitle } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { studentService } from '../../services/api';
import toast from 'react-hot-toast';

const studentSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Full name is required'),
  student_id: z.string().min(1, 'Student ID is required'),
  department: z.string().optional(),
  year: z.string().optional(),
  section: z.string().optional(),
  phone_number: z.string().optional(),
});

const StudentForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [faceImage, setFaceImage] = useState(null);
  const [facePreview, setFacePreview] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(studentSchema),
  });

  useEffect(() => {
    const loadStudent = async () => {
      if (isEdit) {
        try {
          const student = await studentService.getById(id);
          setValue('email', student.email);
          setValue('name', student.name);
          setValue('student_id', student.student_id);
          setValue('department', student.department || '');
          setValue('year', student.year || '');
          setValue('section', student.section || '');
          setValue('phone_number', student.phone_number || '');
        } catch (error) {
          console.error('Failed to fetch student:', error);
          toast.error('Failed to load student data');
        }
      }
    };
    
    loadStudent();
  }, [id, isEdit, setValue]);

  const handleFaceImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFaceImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFacePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      let studentId;
      
      if (isEdit) {
        await studentService.update(id, data);
        studentId = id;
        toast.success('Student updated successfully');
      } else {
        const response = await studentService.create(data);
        studentId = response.data.student_id;
        toast.success('Student created successfully');
      }

      // Upload face image if provided
      if (faceImage && studentId) {
        try {
          const reader = new FileReader();
          reader.onloadend = async () => {
            await studentService.uploadFace(studentId, reader.result);
            toast.success('Face image uploaded successfully');
          };
          reader.readAsDataURL(faceImage);
        } catch (error) {
          console.error('Face upload error:', error);
          toast.error('Failed to upload face image');
        }
      }

      navigate('/admin/students');
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(error.message || 'Failed to save student');
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
  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  const sections = ['A', 'B', 'C', 'D'];

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
                    icon={User}
                    error={errors.name?.message}
                    fullWidth
                    {...register('name')}
                  />
                  <Input
                    label="Student ID"
                    placeholder="STU001"
                    icon={Hash}
                    error={errors.student_id?.message}
                    fullWidth
                    {...register('student_id')}
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
                    icon={Mail}
                    error={errors.email?.message}
                    fullWidth
                    {...register('email')}
                  />
                  <Input
                    label="Phone Number (Optional)"
                    placeholder="+1234567890"
                    icon={Phone}
                    error={errors.phone_number?.message}
                    fullWidth
                    {...register('phone_number')}
                  />
                </div>
              </div>

              {/* Academic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Academic Information (Optional)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Department"
                    icon={Building2}
                    error={errors.department?.message}
                    fullWidth
                    {...register('department')}
                    options={departments.map(dept => ({ value: dept, label: dept }))}
                  />
                  <Select
                    label="Year"
                    icon={Calendar}
                    error={errors.year?.message}
                    fullWidth
                    {...register('year')}
                    options={years.map(y => ({ value: y, label: y }))}
                  />
                  <Select
                    label="Section"
                    icon={Users}
                    error={errors.section?.message}
                    fullWidth
                    {...register('section')}
                    options={sections.map(s => ({ value: s, label: s }))}
                  />
                </div>
              </div>

              {/* Face Image Upload */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Face Recognition
                </h3>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Upload a clear, front-facing photo for face recognition attendance.
                  </p>
                  
                  <div className="flex items-center gap-4">
                    {facePreview && (
                      <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                        <img 
                          src={facePreview} 
                          alt="Face preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFaceImageChange}
                        className="hidden"
                      />
                      <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 transition-colors">
                        <Camera className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {facePreview ? 'Change Photo' : 'Upload Photo'}
                        </span>
                      </div>
                    </label>
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

