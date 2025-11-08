import { useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Eye } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Card, { CardHeader, CardBody, CardTitle } from '../../components/common/Card';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal, { ModalFooter } from '../../components/common/Modal';
import Textarea from '../../components/common/Textarea';
import Select from '../../components/common/Select';
import { formatDate, formatScore, getScoreBadgeColor } from '../../utils/helpers';
import { AI_THRESHOLDS } from '../../utils/constants';
import toast from 'react-hot-toast';
const SuspiciousReview = () => {
  const [suspiciousRecords] = useState([]);
  const [subjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [reviewDecision, setReviewDecision] = useState('approve');
  const [reviewReason, setReviewReason] = useState('');

  const handleReview = () => {
    if (!selectedRecord) return;

    // Update the record status (placeholder logic)
    toast.success(`Attendance ${reviewDecision}d successfully`);
    setShowReviewModal(false);
    setSelectedRecord(null);
    setReviewReason('');
  };

  const openReviewModal = (record) => {
    setSelectedRecord(record);
    setReviewDecision('approve');
    setShowReviewModal(true);
  };

  const columns = [
    {
      key: 'student',
      header: 'Student',
      render: (_, row) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-gray-100">
            {row.student_name || 'Unknown'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {row.student_email || '-'}
          </p>
        </div>
      ),
    },
    {
      key: 'session_name',
      header: 'Session',
      render: (value, row) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-gray-100">{value}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{row.subject_name}</p>
        </div>
      ),
    },
    {
      key: 'submission_time',
      header: 'Submission',
      render: (value) => formatDate(value, 'MMM dd, HH:mm'),
    },
    {
      key: 'face_recognition_score',
      header: 'Face',
      render: (value) => (
        <Badge variant={getScoreBadgeColor(value, AI_THRESHOLDS.FACE_RECOGNITION)} size="sm">
          {formatScore(value)}
        </Badge>
      ),
    },
    {
      key: 'liveness_detection_score',
      header: 'Liveness',
      render: (value) => (
        <Badge variant={getScoreBadgeColor(value, AI_THRESHOLDS.LIVENESS_DETECTION)} size="sm">
          {formatScore(value)}
        </Badge>
      ),
    },
    {
      key: 'background_validation_score',
      header: 'Background',
      render: (value) => (
        <Badge variant={getScoreBadgeColor(value, AI_THRESHOLDS.BACKGROUND_VALIDATION)} size="sm">
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
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            icon={Eye}
            onClick={(e) => {
              e.stopPropagation();
              openReviewModal(row);
            }}
          >
            Review
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Layout title="Suspicious Review">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Suspicious</p>
                  <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                    {suspiciousRecords.length}
                  </p>
                </div>
                <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                  <AlertTriangle className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Needs Review</p>
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {suspiciousRecords.filter(r => !r.is_manually_approved).length}
                  </p>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-lg">
                  <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Reviewed</p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {suspiciousRecords.filter(r => r.is_manually_approved).length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Flagged Records Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <CardTitle>Suspicious Attendance Records</CardTitle>
              <div className="w-full md:w-64">
                <Select
                  placeholder="Filter by subject"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  options={subjects.map(s => ({ value: s.id, label: s.name }))}
                />
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <Table
              columns={columns}
              data={suspiciousRecords}
              loading={false}
              emptyMessage="No suspicious records found"
            />
          </CardBody>
        </Card>

        {/* Review Modal */}
        <Modal
          isOpen={showReviewModal}
          onClose={() => {
            setShowReviewModal(false);
            setSelectedRecord(null);
            setReviewReason('');
          }}
          title="Review Suspicious Attendance"
          size="lg"
        >
          <div className="space-y-6">
            {/* Student Info */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Student Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Name</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {selectedRecord?.student_name}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Email</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {selectedRecord?.student_email}
                  </p>
                </div>
              </div>
            </div>

            {/* Validation Scores */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Validation Scores</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Face Recognition</p>
                  <Badge variant={getScoreBadgeColor(selectedRecord?.face_recognition_score, AI_THRESHOLDS.FACE_RECOGNITION)}>
                    {formatScore(selectedRecord?.face_recognition_score)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Liveness Detection</p>
                  <Badge variant={getScoreBadgeColor(selectedRecord?.liveness_detection_score, AI_THRESHOLDS.LIVENESS_DETECTION)}>
                    {formatScore(selectedRecord?.liveness_detection_score)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Background Validation</p>
                  <Badge variant={getScoreBadgeColor(selectedRecord?.background_validation_score, AI_THRESHOLDS.BACKGROUND_VALIDATION)}>
                    {formatScore(selectedRecord?.background_validation_score)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Geofence</p>
                  <Badge variant={selectedRecord?.geofence_validation ? 'success' : 'error'}>
                    {selectedRecord?.geofence_validation ? 'Valid' : 'Invalid'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Review Decision */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Decision
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="decision"
                    value="approve"
                    checked={reviewDecision === 'approve'}
                    onChange={(e) => setReviewDecision(e.target.value)}
                    className="h-4 w-4 text-sky-600 focus:ring-sky-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Approve (Mark as Present)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="decision"
                    value="reject"
                    checked={reviewDecision === 'reject'}
                    onChange={(e) => setReviewDecision(e.target.value)}
                    className="h-4 w-4 text-sky-600 focus:ring-sky-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Reject (Mark as Absent)</span>
                </label>
              </div>
            </div>

            <Textarea
              label="Reason (Optional)"
              value={reviewReason}
              onChange={(e) => setReviewReason(e.target.value)}
              placeholder="Add any notes about your decision..."
              rows={3}
              fullWidth
            />
          </div>

          <ModalFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowReviewModal(false);
                setSelectedRecord(null);
                setReviewReason('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant={reviewDecision === 'approve' ? 'success' : 'error'}
              onClick={handleReview}
            >
              {reviewDecision === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </Layout>
  );
};

export default SuspiciousReview;

