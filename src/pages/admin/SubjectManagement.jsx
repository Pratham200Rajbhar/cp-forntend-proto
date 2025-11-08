import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, BookOpen, User } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Card, { CardHeader, CardBody, CardTitle } from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { formatDate } from '../../utils/helpers';
import { teacherService } from '../../services/api';
import toast from 'react-hot-toast';

const SubjectManagement = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');

  // Mock subjects data (Subject API not documented in API_DOCUMENTATION.md)
  const mockSubjects = [
    {
      _id: '1',
      code: 'CS201',
      name: 'Data Structures',
      description: 'Introduction to fundamental data structures and algorithms',
      credits: 4,
      department: 'Computer Science',
      teacher: { _id: '1', name: 'Dr. Smith', employee_id: 'EMP001' },
      semester: 'Fall 2024',
      total_sessions: 15,
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: '2',
      code: 'CS202',
      name: 'Algorithms',
      description: 'Analysis and design of algorithms',
      credits: 4,
      department: 'Computer Science',
      teacher: { _id: '2', name: 'Prof. Johnson', employee_id: 'EMP002' },
      semester: 'Fall 2024',
      total_sessions: 12,
      created_at: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: '3',
      code: 'CS301',
      name: 'Database Systems',
      description: 'Database design and management',
      credits: 3,
      department: 'Computer Science',
      teacher: { _id: '3', name: 'Dr. Williams', employee_id: 'EMP003' },
      semester: 'Fall 2024',
      total_sessions: 18,
      created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: '4',
      code: 'CS302',
      name: 'Operating Systems',
      description: 'Operating system concepts and implementations',
      credits: 4,
      department: 'Computer Science',
      teacher: { _id: '1', name: 'Dr. Smith', employee_id: 'EMP001' },
      semester: 'Fall 2024',
      total_sessions: 14,
      created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  const [subjects, setSubjects] = useState(mockSubjects);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const teachersData = await teacherService.getAll();
      setTeachers(teachersData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to load teachers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (subjectId) => {
    if (!confirm('Are you sure you want to delete this subject?')) return;
    setSubjects(subjects.filter(s => s._id !== subjectId));
    toast.success('Subject deleted successfully');
  };

  const filteredSubjects = subjects.filter(subject =>
    subject.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      key: 'name',
      header: 'Subject',
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
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
      key: 'credits',
      header: 'Credits',
      render: (value) => (
        <span className="text-sm text-gray-700 dark:text-gray-300">{value}</span>
      ),
    },
    {
      key: 'semester',
      header: 'Semester',
      render: (value) => (
        <span className="text-sm text-gray-700 dark:text-gray-300">{value}</span>
      ),
    },
    {
      key: 'teacher',
      header: 'Teacher',
      render: (value, row) => {
        const teacher = teachers.find(t => t.id === row.teacher_id);
        return teacher ? (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">{teacher.name}</span>
          </div>
        ) : (
          <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
        );
      },
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (value) => (
        <span className="text-sm text-gray-700 dark:text-gray-300">
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
              navigate(`/admin/subjects/edit/${row.id}`);
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
            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
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
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Subjects</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage subjects and course information
            </p>
          </div>
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => navigate('/admin/subjects/add')}
          >
            Add Subject
          </Button>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle>Subjects</CardTitle>
          </CardHeader>
          <CardBody>
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Input
                placeholder="Search by name, code, or description..."
                icon={Search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select
                placeholder="All Teachers"
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

            {/* Results Summary */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredSubjects.length} of {subjects.length} subjects
              </p>
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
      </div>
    </Layout>
  );
};

export default SubjectManagement;
