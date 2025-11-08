import { useEffect, useState } from 'react';
import { Search, Filter, Download, Eye, AlertTriangle, Shield, User, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import Layout from '../../components/layout/Layout';
import Card, { CardHeader, CardBody, CardTitle } from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import StatCard from '../../components/common/StatCard';
import { formatDate } from '../../utils/helpers';

const AuditLogs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  const [selectedResource, setSelectedResource] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  
  const mockLogs = [
    {
      _id: '1',
      action: 'CREATE',
      resource_type: 'student',
      resource_id: 'STU001',
      user: { name: 'Admin User', email: 'admin@university.edu', role: 'admin' },
      details: { name: 'John Doe', student_id: 'STU001' },
      ip_address: '192.168.1.100',
      user_agent: 'Mozilla/5.0...',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      severity: 'low'
    },
    {
      _id: '2',
      action: 'UPDATE',
      resource_type: 'teacher',
      resource_id: 'TCH001',
      user: { name: 'Admin User', email: 'admin@university.edu', role: 'admin' },
      details: { updated_fields: ['email', 'phone'] },
      ip_address: '192.168.1.100',
      user_agent: 'Mozilla/5.0...',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      severity: 'medium'
    },
    {
      _id: '3',
      action: 'DELETE',
      resource_type: 'session',
      resource_id: 'SES001',
      user: { name: 'Teacher Smith', email: 'smith@university.edu', role: 'teacher' },
      details: { session_name: 'Math 101 - Morning Batch' },
      ip_address: '192.168.1.105',
      user_agent: 'Mozilla/5.0...',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      severity: 'high'
    },
    {
      _id: '4',
      action: 'LOGIN',
      resource_type: 'auth',
      resource_id: 'AUTH001',
      user: { name: 'Admin User', email: 'admin@university.edu', role: 'admin' },
      details: { success: true, method: 'password' },
      ip_address: '192.168.1.100',
      user_agent: 'Mozilla/5.0...',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      severity: 'low'
    },
    {
      _id: '5',
      action: 'UPDATE',
      resource_type: 'geofence',
      resource_id: 'GEO001',
      user: { name: 'Admin User', email: 'admin@university.edu', role: 'admin' },
      details: { updated_fields: ['radius', 'name'] },
      ip_address: '192.168.1.100',
      user_agent: 'Mozilla/5.0...',
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      severity: 'medium'
    }
  ];

  const [logs, setLogs] = useState(mockLogs);
  
  useEffect(() => {
    fetchAuditLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAction, selectedResource, selectedUser, dateRange]);

  const fetchAuditLogs = () => {
    // Filter mock logs based on selected filters
    let filteredLogs = [...mockLogs];
    
    if (selectedAction) {
      filteredLogs = filteredLogs.filter(log => log.action === selectedAction);
    }
    
    if (selectedResource) {
      filteredLogs = filteredLogs.filter(log => log.resource_type === selectedResource);
    }
    
    if (selectedUser) {
      filteredLogs = filteredLogs.filter(log => log.user.email.includes(selectedUser));
    }
    
    if (dateRange.start) {
      filteredLogs = filteredLogs.filter(log => 
        new Date(log.timestamp) >= new Date(dateRange.start)
      );
    }
    
    if (dateRange.end) {
      filteredLogs = filteredLogs.filter(log => 
        new Date(log.timestamp) <= new Date(dateRange.end)
      );
    }
    
    setLogs(filteredLogs);
  };

  const handleApplyFilters = () => {
    fetchAuditLogs();
    toast.success('Filters applied');
  };

  const handleExport = async () => {
    try {
      // Mock export functionality (Audit export API not documented)
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Audit logs exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export audit logs');
    }
  };

  const filteredLogs = logs.filter(log =>
    log.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.resource_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.ip_address?.includes(searchTerm)
  );

  // Calculate statistics
  const totalLogs = filteredLogs.length;
  const highSeverityCount = filteredLogs.filter(l => l.severity === 'high').length;
  const mediumSeverityCount = filteredLogs.filter(l => l.severity === 'medium').length;
  const lowSeverityCount = filteredLogs.filter(l => l.severity === 'low').length;

  const statsCards = [
    {
      title: 'Total Logs',
      value: totalLogs,
      icon: Calendar,
      color: 'primary',
    },
    {
      title: 'High Severity',
      value: highSeverityCount,
      icon: AlertTriangle,
      color: 'error',
    },
    {
      title: 'Medium Severity',
      value: mediumSeverityCount,
      icon: AlertTriangle,
      color: 'warning',
    },
    {
      title: 'Low Severity',
      value: lowSeverityCount,
      icon: Shield,
      color: 'success',
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
                onClick={handleApplyFilters}
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
              emptyMessage="No audit logs found"
            />
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
};

export default AuditLogs;

