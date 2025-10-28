import { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, BookOpen, User } from 'lucide-react';
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
import teacherManagementService from '../../services/teacherManagementService';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const subjectSchema = z.object({
  name: z.string().min(1, 'Subject name is required'),
  code: z.string().min(1, 'Subject code is required'),
  description: z.string().optional(),
  teacher_id: z.number().min(1, 'Teacher is required'),
});

const SubjectManagement = () => {
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(subjectSchema),
  });

  useEffect(() => {
    fetchSubjects();
    fetchTeachers();
  }, [selectedTeacher]);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const data = await adminService.getSubjects({ 
        teacher_id: selectedTeacher || undefined,
        limit: 100 
      });
      setSubjects(data);
    } catch (error) {
      toast.error('Failed to load subjects');
      console.error('Subjects error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const data = await teacherManagementService.getTeachers({ limit: 100 });
      setTeachers(data);
    } catch (error) {
      console.error('Teachers error:', error);
    }
  };

  const handleOpenModal = (subject = null) => {
    setEditingSubject(subject);
    if (subject) {
      reset(subject);
    } else {
      reset({
        name: '',
        code: '',
        description: '',
        teacher_id: '',
      });
    }
    setShowModal(true);
  };

  const onSubmit = async (data) => {
    try {
      if (editingSubject) {
        await adminService.updateSubject(editingSubject.id, data);
        toast.success('Subject updated successfully');
      } else {
        await adminService.createSubject(data);
        toast.success('Subject created successfully');
      }
      setShowModal(false);
      fetchSubjects();
    } catch (error) {
      toast.error(`Failed to ${editingSubject ? 'update' : 'create'} subject`);
      console.error('Subject save error:', error);
    }
  };

  const handleDelete = async (subjectId) => {
    if (!confirm('Are you sure you want to delete this subject?')) return;

    try {
      await adminService.deleteSubject(subjectId);
      toast.success('Subject deleted successfully');
      fetchSubjects();
    } catch (error) {
      toast.error('Failed to delete subject');
      console.error('Delete error:', error);
    }
  };

  const filteredSubjects = subjects.filter(subject =>
    subject.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      key: 'name',
      header: 'Subject',
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">{value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{row.code}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (value) => value || '-',
    },
    {
      key: 'teacher',
      header: 'Teacher',
      render: (value, row) => {
        const teacher = teachers.find(t => t.id === row.teacher_id);
        return teacher ? (
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-gray-400" />
            <span className="text-sm">{teacher.full_name}</span>
          </div>
        ) : '-';
      },
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
    <Layout title="Subject Management">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <CardTitle>Subject Management</CardTitle>
              <Button
                variant="primary"
                icon={Plus}
                onClick={() => handleOpenModal()}
              >
                Add Subject
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Input
                placeholder="Search subjects..."
                icon={Search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select
                placeholder="Filter by teacher"
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                options={[
                  { value: '', label: 'All Teachers' },
                  ...teachers.map(teacher => ({ 
                    value: teacher.id, 
                    label: teacher.full_name 
                  }))
                ]}
              />
            </div>

            {/* Subjects Table */}
            <Table
              columns={columns}
              data={filteredSubjects}
              loading={loading}
              emptyMessage="No subjects found"
            />
          </CardBody>
        </Card>

        {/* Add/Edit Subject Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={editingSubject ? 'Edit Subject' : 'Add New Subject'}
          size="lg"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Subject Name"
                placeholder="Data Structures and Algorithms"
                error={errors.name?.message}
                fullWidth
                {...register('name')}
              />
              <Input
                label="Subject Code"
                placeholder="CS201"
                error={errors.code?.message}
                fullWidth
                {...register('code')}
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Input
                label="Description"
                placeholder="Introduction to data structures and algorithms"
                error={errors.description?.message}
                fullWidth
                {...register('description')}
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Select
                label="Teacher"
                error={errors.teacher_id?.message}
                fullWidth
                {...register('teacher_id', { valueAsNumber: true })}
                options={teachers.map(teacher => ({ 
                  value: teacher.id, 
                  label: teacher.full_name 
                }))}
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
                {editingSubject ? 'Update Subject' : 'Create Subject'}
              </Button>
            </ModalFooter>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};

export default SubjectManagement;

