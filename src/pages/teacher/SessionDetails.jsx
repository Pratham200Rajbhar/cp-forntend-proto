import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Users,
  Download,
  CheckCircle,
  XCircle,
  AlertTriangle 
} from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Card, { CardHeader, CardBody, CardTitle } from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal, { ModalFooter } from '../../components/common/Modal';
import Textarea from '../../components/common/Textarea';
import attendanceService from '../../services/attendanceService';
import { formatDate, formatScore, getScoreBadgeColor, formatPercentage } from '../../utils/helpers';
import { STATUS_COLORS, AI_THRESHOLDS } from '../../utils/constants';
import toast from 'react-hot-toast';

const SessionDetails = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [overrideReason, setOverrideReason] = useState('');
  const [overrideStatus, setOverrideStatus] = useState('present');

  useEffect(() => {
    fetchSessionData();
  }, [sessionId]);

  const fetchSessionData = async () => {
    try {
      setLoading(true);
      const data = await attendanceService.getSessionAttendance(sessionId);
      setSessionData(data);
    } catch (error) {
      toast.error('Failed to load session details');
      console.error('Session details error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManualOverride = async () => {
    if (!selectedRecord) return;

    try {
      await attendanceService.manualOverride({
        attendance_record_id: selectedRecord.id,
        new_status: overrideStatus,
        reason: overrideReason
      });
      
      toast.success('Attendance status updated successfully');
      setShowOverrideModal(false);
      setSelectedRecord(null);
      setOverrideReason('');
      fetchSessionData();
    } catch (error) {
      toast.error('Failed to update attendance status');
      console.error('Override error:', error);
    }
  };

  const openOverrideModal = (record) => {
    setSelectedRecord(record);
    setOverrideStatus(record.status);
    setShowOverrideModal(true);
  };

  const columns = [
    {
      key: 'student',
      header: 'Student',
      render: (_, row) => (
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-sky-100 dark:bg-sky-900 rounded-full flex items-center justify-center text-sky-600 dark:text-sky-400 font-medium">
            {row.student_name?.charAt(0) || 'S'}
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">{row.student_name || 'Unknown'}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{row.student_email || '-'}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => (
        <Badge variant={STATUS_COLORS[value]}>
          {value}
        </Badge>
      ),
    },
    {
      key: 'submission_time',
      header: 'Submission Time',
      render: (value) => value ? formatDate(value, 'HH:mm:ss') : '-',
    },
    {
      key: 'face_recognition_score',
      header: 'Face',
      render: (value) => (
        <Badge 
          variant={getScoreBadgeColor(value, AI_THRESHOLDS.FACE_RECOGNITION)}
          size="sm"
        >
          {formatScore(value)}
        </Badge>
      ),
    },
    {
      key: 'liveness_detection_score',
      header: 'Liveness',
      render: (value) => (
        <Badge 
          variant={getScoreBadgeColor(value, AI_THRESHOLDS.LIVENESS_DETECTION)}
          size="sm"
        >
          {formatScore(value)}
        </Badge>
      ),
    },
    {
      key: 'geofence_validation',
      header: 'Location',
      render: (value) => (
        value ? (
          <CheckCircle className="h-5 w-5 text-green-600" />
        ) : (
          <XCircle className="h-5 w-5 text-red-600" />
        )
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            openOverrideModal(row);
          }}
        >
          Override
        </Button>
      ),
    },
  ];

  if (loading || !sessionData) {
    return (
      <Layout title="Session Details">
        <div className="flex items-center justify-center h-full">
          <div>Loading...</div>
        </div>
      </Layout>
    );
  }

  const stats = sessionData.attendance_stats || {};

  return (
    <Layout title="Session Details">
      <div className="space-y-6">
        {/* Back Button */}
        <Button
          variant="outline"
          icon={ArrowLeft}
          onClick={() => navigate('/teacher/sessions')}
        >
          Back to Sessions
        </Button>

        {/* Session Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Session Information</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Session Name</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {sessionData.session_name}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Subject</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {sessionData.subject_name}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Date & Time</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {formatDate(sessionData.attendance_date)}
                    </p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attendance Statistics</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Present</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {stats.present_count || 0}
                  </p>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Absent</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {stats.absent_count || 0}
                  </p>
                </div>
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Flagged</p>
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {stats.flagged_count || 0}
                  </p>
                </div>
                <div className="p-4 bg-sky-50 dark:bg-sky-900/20 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Rate</p>
                  <p className="text-2xl font-bold text-sky-600 dark:text-sky-400">
                    {formatPercentage(stats.attendance_rate || 0)}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Attendance Records */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Attendance Records</CardTitle>
            <Button variant="outline" icon={Download} size="sm">
              Export
            </Button>
          </CardHeader>
          <CardBody>
            <Table
              columns={columns}
              data={sessionData.attendance_records || []}
              loading={false}
              emptyMessage="No attendance records found"
            />
          </CardBody>
        </Card>

        {/* Manual Override Modal */}
        <Modal
          isOpen={showOverrideModal}
          onClose={() => {
            setShowOverrideModal(false);
            setSelectedRecord(null);
            setOverrideReason('');
          }}
          title="Manual Attendance Override"
        >
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Student</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {selectedRecord?.student_name}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Status
              </label>
              <div className="flex space-x-4">
                {['present', 'absent'].map((status) => (
                  <label key={status} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={overrideStatus === status}
                      onChange={(e) => setOverrideStatus(e.target.value)}
                      className="h-4 w-4 text-sky-600 focus:ring-sky-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                      {status}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <Textarea
              label="Reason (Required)"
              value={overrideReason}
              onChange={(e) => setOverrideReason(e.target.value)}
              placeholder="Provide a reason for this override..."
              rows={4}
              fullWidth
            />
          </div>

          <ModalFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowOverrideModal(false);
                setSelectedRecord(null);
                setOverrideReason('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleManualOverride}
              disabled={!overrideReason.trim()}
            >
              Update Status
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </Layout>
  );
};

export default SessionDetails;

