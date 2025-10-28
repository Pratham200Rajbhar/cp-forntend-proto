import Layout from '../../components/layout/Layout';
import Card, { CardHeader, CardBody, CardTitle } from '../../components/common/Card';
import Button from '../../components/common/Button';
import { MapPin } from 'lucide-react';

const GeofenceManagement = () => {
  return (
    <Layout title="Geofence Management">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Geofence Zones</CardTitle>
            <Button variant="primary" icon={MapPin}>
              Add Zone
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <p className="text-gray-500 dark:text-gray-400">Geofence management interface coming soon...</p>
        </CardBody>
      </Card>
    </Layout>
  );
};

export default GeofenceManagement;

