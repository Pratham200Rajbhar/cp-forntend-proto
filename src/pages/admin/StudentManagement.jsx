import { useEffect, useState } from 'react';
import { UserPlus, Search, Edit, Trash2, GraduationCap, Mail, Phone, MapPin } from 'lucide-react';
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
import studentService from '../../services/studentService';
import { formatDate } from '../../utils/helpers';
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

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(studentSchema),
  });

  useEffect(() => {
    fetchStudents();
  }, [selectedDepartment]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await studentService.getStudents({ 
        department: selectedDepartment || undefined,
        limit: 100 
      });
      setStudents(data);
    } catch (error) {
      toast.error('Failed to load students');
      console.error('Students error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (student = null) => {
    setEditingStudent(student);
    if (student) {
      reset(student);
    } else {
      reset({
        email: '',
        username: '',
        full_name: '',
        password: '',
        department: '',
        phone_number: '',
        student_id: '',
        is_active: true,
      });
    }
    setShowModal(true);
  };

  const onSubmit = async (data) => {
    try {
      if (editingStudent) {
        await studentService.updateStudent(editingStudent.id, data);
        toast.success('Student updated successfully');
      } else {
        await studentService.createStudent(data);
        toast.success('Student created successfully');
      }
      setShowModal(false);
      fetchStudents();
    } catch (error) {
      toast.error(`Failed to ${editingStudent ? 'update' : 'create'} student`);
      console.error('Student save error:', error);
    }
  };

  const handleDelete = async (studentId) => {
    if (!confirm('Are you sure you want to delete this student?')) return;

    try {
      await studentService.deleteStudent(studentId);
      toast.success('Student deleted successfully');
      fetchStudents();
    } catch (error) {
      toast.error('Failed to delete student');
      console.error('Delete error:', error);
    }
  };

  const filteredStudents = students.filter(student =>
    student.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.student_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.username?.toLowerCase().includes(searchTerm.toLowerCase())
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
      header: 'Student',
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">{value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">ID: {row.student_id}</p>
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
      header: 'Enrolled',
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
    <Layout title="Student Management">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <CardTitle>Student Management</CardTitle>
              <Button
                variant="primary"
                icon={UserPlus}
                onClick={() => handleOpenModal()}
              >
                Add Student
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Input
                placeholder="Search students..."
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

            {/* Students Table */}
            <Table
              columns={columns}
              data={filteredStudents}
              loading={loading}
              emptyMessage="No students found"
            />
          </CardBody>
        </Card>

        {/* Add/Edit Student Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={editingStudent ? 'Edit Student' : 'Add New Student'}
          size="lg"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                placeholder="John Doe"
                error={errors.full_name?.message}
                fullWidth
                {...register('full_name')}
              />
              <Input
                label="Username"
                placeholder="johndoe"
                error={errors.username?.message}
                fullWidth
                {...register('username')}
              />
            </div>

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
                label={editingStudent ? 'Password (leave blank to keep current)' : 'Password'}
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                fullWidth
                {...register('password')}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Student ID"
                placeholder="STU001"
                error={errors.student_id?.message}
                fullWidth
                {...register('student_id')}
              />
              <Select
                label="Department"
                error={errors.department?.message}
                fullWidth
                {...register('department')}
                options={departments.map(dept => ({ value: dept, label: dept }))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Phone Number"
                placeholder="+1234567890"
                error={errors.phone_number?.message}
                fullWidth
                {...register('phone_number')}
              />
              <div className="flex items-center space-x-2">
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

            <ModalFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {editingStudent ? 'Update Student' : 'Create Student'}
              </Button>
            </ModalFooter>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};

export default StudentManagement;
