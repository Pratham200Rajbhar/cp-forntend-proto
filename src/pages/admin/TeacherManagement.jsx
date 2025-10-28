import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Search, Edit, Trash2, BookOpen, Mail, Phone } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Card, { CardBody } from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import teacherManagementService from '../../services/teacherManagementService';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const TeacherManagement = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

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
    teacher.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const departments = [
    'Computer Science',
    'Information Technology',
    'Electronics and Communication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'Business Administration',
  ];

  const columns = [
    {
      key: 'full_name',
      header: 'Teacher',
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
            <BookOpen className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">@{row.username}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Contact',
      render: (value, row) => (
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300">
            <Mail className="h-3.5 w-3.5 text-gray-400" />
            <span>{value}</span>
          </div>
          {row.phone_number && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <Phone className="h-3.5 w-3.5" />
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
        <span className="text-sm text-gray-700 dark:text-gray-300">{value}</span>
      ),
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (value) => (
        <Badge variant={value ? 'success' : 'error'} size="sm">
          {value ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'created_at',
      header: 'Joined',
      render: (value) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
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
              navigate(`/admin/teachers/edit/${row.id}`);
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
            className="text-red-600 hover:text-red-700 dark:text-red-400"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Teachers</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Manage teacher accounts and information
            </p>
          </div>
          <Button
            variant="primary"
            icon={UserPlus}
            onClick={() => navigate('/admin/teachers/add')}
          >
            Add Teacher
          </Button>
        </div>

        {/* Main Content */}
        <Card>
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
                placeholder="All Departments"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                options={[
                  { value: '', label: 'All Departments' },
                  ...departments.map(dept => ({ value: dept, label: dept }))
                ]}
              />
            </div>

            {/* Table */}
            <Table
              columns={columns}
              data={filteredTeachers}
              loading={loading}
              emptyMessage="No teachers found"
            />
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
};

export default TeacherManagement;
