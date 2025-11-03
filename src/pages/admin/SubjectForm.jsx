import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, BookOpen, Hash, FileText, UserCheck } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Card, { CardHeader, CardBody, CardTitle } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Textarea from '../../components/common/Textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import adminService from '../../services/adminService';
import teacherManagementService from '../../services/teacherManagementService';
import toast from 'react-hot-toast';

const subjectSchema = z.object({
  name: z.string().min(1, 'Subject name is required'),
  code: z.string().min(1, 'Subject code is required'),
  description: z.string().optional(),
  teacher_id: z.number().min(1, 'Teacher is required'),
});

const SubjectForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [teachers, setTeachers] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(subjectSchema),
  });

  useEffect(() => {
    fetchTeachers();
    if (isEdit) {
      fetchSubject();
    }
  }, [id]);

  const fetchTeachers = async () => {
    try {
      const data = await teacherManagementService.getTeachers({ limit: 100 });
      setTeachers(data);
    } catch (error) {
      console.error('Teachers error:', error);
    }
  };

  const fetchSubject = async () => {
    try {
      const data = await adminService.getSubject(id);
      reset(data);
    } catch (error) {
      toast.error('Failed to load subject details');
      console.error('Subject fetch error:', error);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await adminService.updateSubject(id, data);
        toast.success('Subject updated successfully');
      } else {
        await adminService.createSubject(data);
        toast.success('Subject created successfully');
      }
      navigate('/admin/subjects');
    } catch (error) {
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} subject`);
      console.error('Subject save error:', error);
    }
  };

  return (
    <Layout title={isEdit ? 'Edit Subject' : 'Add Subject'}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            icon={ArrowLeft}
            onClick={() => navigate('/admin/subjects')}
          >
            Back to Subjects
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isEdit ? 'Edit Subject' : 'Add New Subject'}</CardTitle>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Subject Name"
                    placeholder="Data Structures and Algorithms"
                    icon={BookOpen}
                    error={errors.name?.message}
                    fullWidth
                    {...register('name')}
                  />
                  <Input
                    label="Subject Code"
                    placeholder="CS201"
                    icon={Hash}
                    error={errors.code?.message}
                    fullWidth
                    {...register('code')}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <Textarea
                  label="Description (Optional)"
                  placeholder="Introduction to data structures and algorithms"
                  icon={FileText}
                  error={errors.description?.message}
                  rows={4}
                  fullWidth
                  {...register('description')}
                />
              </div>

              {/* Teacher Assignment */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Teacher Assignment
                </h3>
                <Select
                  label="Assigned Teacher"
                  icon={UserCheck}
                  error={errors.teacher_id?.message}
                  fullWidth
                  {...register('teacher_id', { valueAsNumber: true })}
                  options={teachers.map(teacher => ({ 
                    value: teacher.id, 
                    label: `${teacher.full_name} - ${teacher.department}` 
                  }))}
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => navigate('/admin/subjects')}
                >
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  type="submit" 
                  icon={Save}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : (isEdit ? 'Update Subject' : 'Create Subject')}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
};

export default SubjectForm;

