import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Search, Edit, Trash2, GraduationCap, Mail, Phone } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Card, { CardHeader, CardBody, CardTitle } from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import studentService from '../../services/studentService';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const StudentManagement = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

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
    student.student_id?.toLowerCase().includes(searchTerm.toLowerCase())
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
      header: 'Student',
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
            <GraduationCap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{row.student_id}</p>
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
      key: 'yearSection',
      header: 'Year / Section',
      render: (_, row) => (
        <span className="text-sm text-gray-700 dark:text-gray-300">{row.year || '-'} / {row.section || '-'}</span>
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
      key: 'createdAt',
      header: 'Enrolled',
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
              navigate(`/admin/students/edit/${row.id}`);
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
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Students</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Manage student accounts and information
            </p>
          </div>
          <Button
            variant="primary"
            icon={UserPlus}
            onClick={() => navigate('/admin/students/add')}
          >
            Add Student
          </Button>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle>Students</CardTitle>
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
              data={filteredStudents}
              loading={loading}
              emptyMessage="No students found"
            />
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
};

export default StudentManagement;
