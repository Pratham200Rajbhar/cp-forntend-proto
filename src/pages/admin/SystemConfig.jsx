import Layout from '../../components/layout/Layout';
import Card, { CardHeader, CardBody, CardTitle } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Save } from 'lucide-react';

const SystemConfig = () => {
  return (
    <Layout title="System Configuration">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>AI Validation Thresholds</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Face Recognition Threshold"
                type="number"
                step="0.01"
                min="0"
                max="1"
                defaultValue="0.8"
                fullWidth
              />
              <Input
                label="Liveness Detection Threshold"
                type="number"
                step="0.01"
                min="0"
                max="1"
                defaultValue="0.7"
                fullWidth
              />
              <Input
                label="Background Validation Threshold"
                type="number"
                step="0.01"
                min="0"
                max="1"
                defaultValue="0.6"
                fullWidth
              />
              <Input
                label="Audio Validation Threshold"
                type="number"
                step="0.01"
                min="0"
                max="1"
                defaultValue="0.7"
                fullWidth
              />
            </div>
            <div className="mt-6 flex justify-end">
              <Button variant="primary" icon={Save}>
                Save Configuration
              </Button>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Institution Name"
                defaultValue="Smart Attendance System"
                fullWidth
              />
              <Input
                label="Default Geofence Radius (meters)"
                type="number"
                defaultValue="100"
                fullWidth
              />
              <Input
                label="GPS Accuracy Threshold (meters)"
                type="number"
                defaultValue="50"
                fullWidth
              />
              <Input
                label="Session Timeout (minutes)"
                type="number"
                defaultValue="1440"
                fullWidth
              />
            </div>
            <div className="mt-6 flex justify-end">
              <Button variant="primary" icon={Save}>
                Save Settings
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
};

export default SystemConfig;

