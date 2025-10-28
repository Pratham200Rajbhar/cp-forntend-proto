import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, BookOpen, User } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Card, { CardHeader, CardBody, CardTitle } from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import adminService from '../../services/adminService';
import teacherManagementService from '../../services/teacherManagementService';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const SubjectManagement = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');

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
      key: 'description',
      header: 'Description',
      render: (value) => (
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {value || '-'}
        </span>
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
            <span className="text-sm text-gray-700 dark:text-gray-300">{teacher.full_name}</span>
          </div>
        ) : (
          <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
        );
      },
    },
    {
      key: 'created_at',
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
