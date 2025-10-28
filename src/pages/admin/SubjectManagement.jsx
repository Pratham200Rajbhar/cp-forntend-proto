import Layout from '../../components/layout/Layout';
import Card, { CardHeader, CardBody, CardTitle } from '../../components/common/Card';
import Button from '../../components/common/Button';
import { Plus } from 'lucide-react';

const SubjectManagement = () => {
  return (
    <Layout title="Subject Management">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Subjects</CardTitle>
            <Button variant="primary" icon={Plus}>
              Add Subject
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <p className="text-gray-500 dark:text-gray-400">Subject management interface coming soon...</p>
        </CardBody>
      </Card>
    </Layout>
  );
};

export default SubjectManagement;

