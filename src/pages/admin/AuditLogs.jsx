import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import Card, { CardHeader, CardBody, CardTitle } from '../../components/common/Card';
import Table from '../../components/common/Table';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import { Search } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

const AuditLogs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState('');

  // Mock data
  const logs = [
    {
      id: 1,
      timestamp: new Date().toISOString(),
      user: 'admin@attendance.com',
      action: 'login_success',
      resource: 'user',
      status: 'success',
      ip_address: '192.168.1.100',
    },
    {
      id: 2,
      timestamp: new Date().toISOString(),
      user: 'teacher@example.com',
      action: 'attendance_override',
      resource: 'attendance',
      status: 'success',
      ip_address: '192.168.1.101',
    },
  ];

  const columns = [
    {
      key: 'timestamp',
      header: 'Timestamp',
      render: (value) => formatDate(value, 'MMM dd, HH:mm:ss'),
    },
    {
      key: 'user',
      header: 'User',
    },
    {
      key: 'action',
      header: 'Action',
      render: (value) => (
        <Badge variant="info">{value.replace('_', ' ')}</Badge>
      ),
    },
    {
      key: 'resource',
      header: 'Resource',
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => (
        <Badge variant={value === 'success' ? 'success' : 'error'}>
          {value}
        </Badge>
      ),
    },
    {
      key: 'ip_address',
      header: 'IP Address',
    },
  ];

  return (
    <Layout title="Audit Logs">
      <Card>
        <CardHeader>
          <CardTitle>System Audit Logs</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                { value: 'login', label: 'Login' },
                { value: 'logout', label: 'Logout' },
                { value: 'attendance', label: 'Attendance' },
                { value: 'user_management', label: 'User Management' },
              ]}
            />
          </div>

          <Table
            columns={columns}
            data={logs}
            loading={false}
            emptyMessage="No audit logs found"
          />
        </CardBody>
      </Card>
    </Layout>
  );
};

export default AuditLogs;

