import { useEffect, useState } from 'react';
import { Search, Filter, Download, Eye, AlertTriangle, Shield, User, Calendar } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Card, { CardHeader, CardBody, CardTitle } from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import StatCard from '../../components/common/StatCard';
import auditService from '../../services/auditService';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  const [selectedResource, setSelectedResource] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });

  useEffect(() => {
    fetchLogs();
  }, [selectedAction, selectedResource, selectedUser, dateRange]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = {
        action: selectedAction || undefined,
        resource_type: selectedResource || undefined,
        user_id: selectedUser || undefined,
        start_date: dateRange.start || undefined,
        end_date: dateRange.end || undefined,
        limit: 100
      };
      
      const data = await auditService.getLogs(params);
      setLogs(data);
    } catch (error) {
      toast.error('Failed to load audit logs');
      console.error('Logs error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const params = {
        action: selectedAction || undefined,
        resource_type: selectedResource || undefined,
        user_id: selectedUser || undefined,
        start_date: dateRange.start || undefined,
        end_date: dateRange.end || undefined,
        format: 'csv'
      };
      
      await auditService.exportLogs(params);
      toast.success('Audit logs exported successfully');
    } catch (error) {
      toast.error('Failed to export audit logs');
      console.error('Export error:', error);
    }
  };

  const filteredLogs = logs.filter(log =>
    log.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.resource?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.ip_address?.includes(searchTerm)
  );

  // Calculate statistics
  const totalLogs = filteredLogs.length;
  const successCount = filteredLogs.filter(l => l.status === 'success').length;
  const errorCount = filteredLogs.filter(l => l.status === 'error').length;
  const warningCount = filteredLogs.filter(l => l.status === 'warning').length;
  const securityCount = filteredLogs.filter(l => l.action?.includes('security') || l.action?.includes('login')).length;

  const statsCards = [
    {
      title: 'Total Logs',
      value: totalLogs,
      icon: Calendar,
      color: 'primary',
    },
    {
      title: 'Success',
      value: successCount,
      icon: Shield,
      color: 'success',
    },
    {
      title: 'Errors',
      value: errorCount,
      icon: AlertTriangle,
      color: 'error',
    },
    {
      title: 'Security Events',
      value: securityCount,
      icon: Shield,
      color: 'warning',
    },
  ];

  const getActionBadgeVariant = (action) => {
    if (action?.includes('login') || action?.includes('logout')) return 'info';
    if (action?.includes('create') || action?.includes('add')) return 'success';
    if (action?.includes('update') || action?.includes('edit')) return 'warning';
    if (action?.includes('delete') || action?.includes('remove')) return 'error';
    if (action?.includes('security') || action?.includes('auth')) return 'purple';
    return 'info';
  };

  const columns = [
    {
      key: 'timestamp',
      header: 'Timestamp',
      render: (value) => (
        <div className="text-sm">
          <div className="font-medium">{formatDate(value, 'MMM dd, yyyy')}</div>
          <div className="text-gray-500 dark:text-gray-400">{formatDate(value, 'HH:mm:ss')}</div>
        </div>
      ),
    },
    {
      key: 'user',
      header: 'User',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="text-sm font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      render: (value) => (
        <Badge variant={getActionBadgeVariant(value)}>
          {value?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </Badge>
      ),
    },
    {
      key: 'resource',
      header: 'Resource',
      render: (value) => (
        <span className="text-sm capitalize">{value}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => (
        <Badge variant={
          value === 'success' ? 'success' :
          value === 'error' ? 'error' :
          value === 'warning' ? 'warning' : 'info'
        }>
          {value}
        </Badge>
      ),
    },
    {
      key: 'ip_address',
      header: 'IP Address',
      render: (value) => (
        <span className="text-sm font-mono">{value}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <Button
          variant="outline"
          size="sm"
          icon={Eye}
          onClick={() => {
            // View details logic
            console.log('View log details for:', row);
          }}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <Layout title="Audit Logs">
      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Filters and Controls */}
        <Card>
          <CardHeader>
            <CardTitle>System Audit Logs</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Input
                placeholder="Search logs..."
                icon={Search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select
                placeholder="Filter by action"
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value)}
                options={[
                  { value: '', label: 'All Actions' },
                  { value: 'login', label: 'Login' },
                  { value: 'logout', label: 'Logout' },
                  { value: 'create', label: 'Create' },
                  { value: 'update', label: 'Update' },
                  { value: 'delete', label: 'Delete' },
                  { value: 'attendance', label: 'Attendance' },
                  { value: 'security', label: 'Security' },
                ]}
              />
              <Select
                placeholder="Filter by resource"
                value={selectedResource}
                onChange={(e) => setSelectedResource(e.target.value)}
                options={[
                  { value: '', label: 'All Resources' },
                  { value: 'user', label: 'User' },
                  { value: 'attendance', label: 'Attendance' },
                  { value: 'session', label: 'Session' },
                  { value: 'subject', label: 'Subject' },
                  { value: 'system', label: 'System' },
                ]}
              />
              <Input
                placeholder="Filter by user ID"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Input
                label="Start Date"
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              />
              <Input
                label="End Date"
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              />
            </div>

            <div className="flex justify-end space-x-2 mb-6">
              <Button
                variant="outline"
                icon={Filter}
                onClick={fetchLogs}
              >
                Apply Filters
              </Button>
              <Button
                variant="primary"
                icon={Download}
                onClick={handleExport}
              >
                Export Logs
              </Button>
            </div>

            {/* Audit Logs Table */}
            <Table
              columns={columns}
              data={filteredLogs}
              loading={loading}
              emptyMessage="No audit logs found"
            />
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
};

export default AuditLogs;

