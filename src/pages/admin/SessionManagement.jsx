import Layout from '../../components/layout/Layout';
import Card, { CardHeader, CardBody, CardTitle } from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Calendar } from 'lucide-react';

const SessionManagement = () => {
  return (
    <Layout title="Session Management">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Sessions</CardTitle>
            <Button variant="primary" icon={Calendar}>
              Create Session
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <p className="text-gray-500 dark:text-gray-400">Session management interface coming soon...</p>
        </CardBody>
      </Card>
    </Layout>
  );
};

export default SessionManagement;

