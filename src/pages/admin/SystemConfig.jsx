import { useEffect, useState } from 'react';
import { Save, RefreshCw, Database, Shield, Settings, AlertCircle } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Card, { CardHeader, CardBody, CardTitle } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
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

  return (
    <Layout title="System Configuration">
      <div className="space-y-6">
        {/* AI Validation Thresholds */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>AI Validation Thresholds</span>
              </CardTitle>
              <Badge variant="info">Critical Settings</Badge>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Face Recognition Threshold"
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={config.face_recognition_threshold}
                onChange={(e) => handleInputChange('face_recognition_threshold', parseFloat(e.target.value))}
                fullWidth
                helperText="Higher values = stricter face matching (0.0 - 1.0)"
              />
              <Input
                label="Liveness Detection Threshold"
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={config.liveness_detection_threshold}
                onChange={(e) => handleInputChange('liveness_detection_threshold', parseFloat(e.target.value))}
                fullWidth
                helperText="Higher values = stricter liveness detection (0.0 - 1.0)"
              />
              <Input
                label="Background Validation Threshold"
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={config.background_validation_threshold}
                onChange={(e) => handleInputChange('background_validation_threshold', parseFloat(e.target.value))}
                fullWidth
                helperText="Higher values = stricter background validation (0.0 - 1.0)"
              />
              <Input
                label="Audio Validation Threshold"
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={config.audio_validation_threshold}
                onChange={(e) => handleInputChange('audio_validation_threshold', parseFloat(e.target.value))}
                fullWidth
                helperText="Higher values = stricter audio validation (0.0 - 1.0)"
              />
            </div>
          </CardBody>
        </Card>

        {/* General Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>General Settings</span>
              </CardTitle>
              <Badge variant="success">System Settings</Badge>
            </div>
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
              />
              <Input
                label="Max File Size (bytes)"
                type="number"
                step="1024"
                min="1024"
                value={config.max_file_size}
                onChange={(e) => handleInputChange('max_file_size', parseInt(e.target.value))}
                fullWidth
                helperText={`Current: ${(config.max_file_size / 1024 / 1024).toFixed(1)} MB`}
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

        {/* Warning Notice */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-amber-600 dark:text-amber-400">
              <AlertCircle className="h-5 w-5" />
              <span>Important Notice</span>
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Warning:</strong> Changing AI validation thresholds can significantly impact attendance accuracy. 
                Higher thresholds make the system more strict but may increase false negatives. 
                Lower thresholds make the system more lenient but may increase false positives.
              </p>
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

