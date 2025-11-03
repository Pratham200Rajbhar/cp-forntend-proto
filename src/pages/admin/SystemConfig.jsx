import { useEffect, useState } from 'react';
import { Save, RefreshCw, Database, Shield, Settings, Eye, Activity, MapPin, Clock, HardDrive, Globe } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Card, { CardHeader, CardBody, CardTitle } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

const SystemConfig = () => {
  const [config, setConfig] = useState({
    face_recognition_threshold: 0.8,
    liveness_detection_threshold: 0.7,
    background_validation_threshold: 0.75,
    audio_validation_threshold: 0.8,
    default_geofence_radius: 100.0,
    gps_accuracy_threshold: 10.0,
    max_file_size: 10485760,
    session_timeout: 1440,
    default_latitude: 28.6139,
    default_longitude: 77.2090,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const data = await adminService.getSystemConfig();
      setConfig(data);
    } catch (error) {
      toast.error('Failed to load system configuration');
      console.error('Config error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await adminService.updateSystemConfig(config);
      toast.success('System configuration updated successfully');
    } catch (error) {
      toast.error('Failed to update system configuration');
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const maxFileSizeMb = Number((config.max_file_size / 1048576).toFixed(1));

  return (
    <Layout title="System Configuration">
      <div className="space-y-6">
        {/* AI Validation Thresholds */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>AI Validation Thresholds</span>
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Face Threshold"
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={config.face_recognition_threshold}
                onChange={(e) => handleInputChange('face_recognition_threshold', parseFloat(e.target.value))}
                fullWidth
                helperText="0.0 - 1.0 (higher = stricter)"
                icon={Eye}
              />
              <Input
                label="Liveness Threshold"
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={config.liveness_detection_threshold}
                onChange={(e) => handleInputChange('liveness_detection_threshold', parseFloat(e.target.value))}
                fullWidth
                helperText="0.0 - 1.0 (higher = stricter)"
                icon={Activity}
              />
              <Input
                label="Background Threshold"
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={config.background_validation_threshold}
                onChange={(e) => handleInputChange('background_validation_threshold', parseFloat(e.target.value))}
                fullWidth
                helperText="0.0 - 1.0 (higher = stricter)"
                icon={Eye}
              />
              <Input
                label="Audio Threshold"
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={config.audio_validation_threshold}
                onChange={(e) => handleInputChange('audio_validation_threshold', parseFloat(e.target.value))}
                fullWidth
                helperText="0.0 - 1.0 (higher = stricter)"
                icon={Activity}
              />
            </div>
          </CardBody>
        </Card>

        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>General Settings</span>
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Default Geofence Radius (meters)"
                type="number"
                step="0.1"
                min="1"
                value={config.default_geofence_radius}
                onChange={(e) => handleInputChange('default_geofence_radius', parseFloat(e.target.value))}
                fullWidth
                helperText="Default radius for new geofence zones"
                icon={MapPin}
              />
              <Input
                label="GPS Accuracy Threshold (meters)"
                type="number"
                step="0.1"
                min="1"
                value={config.gps_accuracy_threshold}
                onChange={(e) => handleInputChange('gps_accuracy_threshold', parseFloat(e.target.value))}
                fullWidth
                helperText="Maximum acceptable GPS accuracy for attendance"
                icon={Globe}
              />
              <Input
                label="Default Latitude"
                type="number"
                step="0.000001"
                min="-90"
                max="90"
                value={config.default_latitude}
                onChange={(e) => handleInputChange('default_latitude', parseFloat(e.target.value))}
                fullWidth
                helperText="Default latitude for new geofence zones"
                icon={MapPin}
              />
              <Input
                label="Default Longitude"
                type="number"
                step="0.000001"
                min="-180"
                max="180"
                value={config.default_longitude}
                onChange={(e) => handleInputChange('default_longitude', parseFloat(e.target.value))}
                fullWidth
                helperText="Default longitude for new geofence zones"
                icon={MapPin}
              />
              <Input
                label="Max File Size (MB)"
                type="number"
                step="0.1"
                min="0.1"
                value={maxFileSizeMb}
                onChange={(e) => {
                  const mb = parseFloat(e.target.value);
                  if (!isNaN(mb)) handleInputChange('max_file_size', Math.round(mb * 1048576));
                }}
                fullWidth
                helperText={`Bytes: ${config.max_file_size}`}
                icon={HardDrive}
              />
              <Input
                label="Session Timeout (minutes)"
                type="number"
                step="1"
                min="1"
                value={config.session_timeout}
                onChange={(e) => handleInputChange('session_timeout', parseInt(e.target.value))}
                fullWidth
                helperText="How long sessions remain active"
                icon={Clock}
              />
            </div>
          </CardBody>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>System Health</span>
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">System Status: Healthy</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                icon={RefreshCw}
                onClick={fetchConfig}
                loading={loading}
              >
                Refresh
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            variant="primary"
            icon={Save}
            onClick={handleSave}
            loading={saving}
            disabled={loading}
          >
            Save Configuration
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default SystemConfig;