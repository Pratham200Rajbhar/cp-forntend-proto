import { useEffect, useState } from 'react';
import { UserPlus, Search, Edit, Trash2, BookOpen, Mail, Phone, MapPin, Calendar } from 'lucide-react';
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
import teacherManagementService from '../../services/teacherManagementService';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const teacherSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  full_name: z.string().min(1, 'Full name is required'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  department: z.string().min(1, 'Department is required'),
  phone_number: z.string().optional(),
  is_active: z.boolean().optional(),
});

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(teacherSchema),
  });

  useEffect(() => {
    fetchTeachers();
  }, [selectedDepartment]);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const data = await teacherManagementService.getTeachers({ 
        department: selectedDepartment || undefined,
        limit: 100 
      });
      setTeachers(data);
    } catch (error) {
      toast.error('Failed to load teachers');
      console.error('Teachers error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (teacher = null) => {
    setEditingTeacher(teacher);
    if (teacher) {
      reset(teacher);
    } else {
      reset({
        email: '',
        username: '',
        full_name: '',
        password: '',
        department: '',
        phone_number: '',
        is_active: true,
      });
    }
    setShowModal(true);
  };

  const onSubmit = async (data) => {
    try {
      if (editingTeacher) {
        await teacherManagementService.updateTeacher(editingTeacher.id, data);
        toast.success('Teacher updated successfully');
      } else {
        await teacherManagementService.createTeacher(data);
        toast.success('Teacher created successfully');
      }
      setShowModal(false);
      fetchTeachers();
    } catch (error) {
      toast.error(`Failed to ${editingTeacher ? 'update' : 'create'} teacher`);
      console.error('Teacher save error:', error);
    }
  };

  const handleDelete = async (teacherId) => {
    if (!confirm('Are you sure you want to delete this teacher?')) return;

    try {
      await teacherManagementService.deleteTeacher(teacherId);
      toast.success('Teacher deleted successfully');
      fetchTeachers();
    } catch (error) {
      toast.error('Failed to delete teacher');
      console.error('Delete error:', error);
    }
  };

  const filteredTeachers = teachers.filter(teacher =>
    teacher.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const columns = [
    {
      key: 'full_name',
      header: 'Teacher',
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">{value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">@{row.username}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Contact',
      render: (value, row) => (
        <div>
          <div className="flex items-center space-x-1 text-sm">
            <Mail className="h-4 w-4 text-gray-400" />
            <span className="text-gray-900 dark:text-gray-100">{value}</span>
          </div>
          {row.phone_number && (
            <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
              <Phone className="h-4 w-4" />
              <span>{row.phone_number}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'department',
      header: 'Department',
      render: (value) => (
        <div className="flex items-center space-x-1">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{value}</span>
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
      header: 'Joined',
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
    <Layout title="Teacher Management">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <CardTitle>Teacher Management</CardTitle>
              <Button
                variant="primary"
                icon={UserPlus}
                onClick={() => handleOpenModal()}
              >
                Add Teacher
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Input
                placeholder="Search teachers..."
                icon={Search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select
                placeholder="Filter by department"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                options={[
                  { value: '', label: 'All Departments' },
                  ...departments.map(dept => ({ value: dept, label: dept }))
                ]}
              />
            </div>

            {/* Teachers Table */}
            <Table
              columns={columns}
              data={filteredTeachers}
              loading={loading}
              emptyMessage="No teachers found"
            />
          </CardBody>
        </Card>

        {/* Add/Edit Teacher Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
          size="lg"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                placeholder="Dr. Jane Smith"
                error={errors.full_name?.message}
                fullWidth
                {...register('full_name')}
              />
              <Input
                label="Username"
                placeholder="janesmith"
                error={errors.username?.message}
                fullWidth
                {...register('username')}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Email"
                type="email"
                placeholder="jane@university.edu"
                error={errors.email?.message}
                fullWidth
                {...register('email')}
              />
              <Input
                label={editingTeacher ? 'Password (leave blank to keep current)' : 'Password'}
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                fullWidth
                {...register('password')}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Department"
                error={errors.department?.message}
                fullWidth
                {...register('department')}
                options={departments.map(dept => ({ value: dept, label: dept }))}
              />
              <Input
                label="Phone Number"
                placeholder="+1234567890"
                error={errors.phone_number?.message}
                fullWidth
                {...register('phone_number')}
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
                Active Teacher
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
                {editingTeacher ? 'Update Teacher' : 'Create Teacher'}
              </Button>
            </ModalFooter>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};

export default TeacherManagement;
