import { useState } from 'react';
import { FileText, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import Layout from '../../components/layout/Layout';
import Card, { CardHeader, CardBody, CardTitle } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import Input from '../../components/common/Input';
import Checkbox from '../../components/common/Checkbox';
import Modal, { ModalFooter } from '../../components/common/Modal';

const Reports = () => {
  const [reportType, setReportType] = useState('summary');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [includeStudentDetails, setIncludeStudentDetails] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [generating, setGenerating] = useState(false);

  const subjects = [
    { id: 1, name: 'Data Structures' },
    { id: 2, name: 'Algorithms' },
    { id: 3, name: 'Database Systems' },
    { id: 4, name: 'Operating Systems' },
    { id: 5, name: 'Computer Networks' }
  ];

  const reportTypes = [
    { value: 'summary', label: 'Summary Report' },
    { value: 'detailed', label: 'Detailed Report' },
    { value: 'student', label: 'Student-wise Report' },
    { value: 'subject', label: 'Subject-wise Report' },
  ];

  const handleGenerate = async () => {
    if (!startDate || !endDate) {
      toast.error('Please select date range');
      return;
    }

    setGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowPreview(true);
      toast.success('Report generated successfully');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  const handleExport = async (format) => {
    try {
      toast.success(`Exporting report as ${format.toUpperCase()}...`);
      setShowPreview(false);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export report');
    }
  };

  return (
    <Layout title="Reports">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Generate Attendance Report</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-6">
              {/* Report Type */}
              <Select
                label="Report Type"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                options={reportTypes}
                fullWidth
              />

                {/* Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Start Date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    fullWidth
                  />
                  <Input
                    label="End Date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    fullWidth
                  />
                </div>

                {/* Subject Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Select Subjects
                  </label>
                  {subjects.length > 0 ? (
                    <div className="space-y-2 border border-gray-200 dark:border-gray-700 rounded-md p-4">
                      {subjects.map((subject) => (
                        <Checkbox
                          key={subject.id}
                          label={subject.name || subject.subject_name}
                          checked={selectedSubjects.includes(subject.id)}
                          onChange={() => {
                            setSelectedSubjects(prev =>
                              prev.includes(subject.id)
                                ? prev.filter(id => id !== subject.id)
                                : [...prev, subject.id]
                            );
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                      No subjects available
                    </p>
                  )}
                </div>

                {/* Options */}
                <div className="space-y-2">
                  <Checkbox
                    label="Include student details"
                    checked={includeStudentDetails}
                    onChange={(e) => setIncludeStudentDetails(e.target.checked)}
                  />
                  <Checkbox label="Include AI validation scores" defaultChecked />
                  <Checkbox label="Include geofence data" defaultChecked />
                </div>

                {/* Generate Button */}
                <div className="flex justify-end space-x-4">
                  <Button variant="outline" onClick={() => window.location.reload()}>
                    Reset
                  </Button>
                  <Button
                    variant="primary"
                    icon={FileText}
                    onClick={handleGenerate}
                    loading={generating}
                    disabled={generating}
                  >
                    Generate Report
                  </Button>
              </div>
            </div>
          </CardBody>
        </Card>        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {[1, 2, 3].map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-sky-100 dark:bg-sky-900 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        Summary Report - October 2025
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Generated on Oct 27, 2025 at 10:30 AM
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" icon={Download}>
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Report Preview Modal */}
        <Modal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          title="Report Preview"
          size="lg"
        >
          <div className="space-y-6">
            <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Attendance Summary Report
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Date Range</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {startDate} to {endDate}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Total Sessions</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">45</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Total Students</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">75</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Overall Attendance</p>
                  <p className="font-medium text-green-600 dark:text-green-400">87.3%</p>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>This is a preview of your report. Export it in your preferred format to view full details.</p>
            </div>
          </div>

          <ModalFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Close
            </Button>
            <Button variant="outline" onClick={() => handleExport('csv')}>
              Export as CSV
            </Button>
            <Button variant="primary" onClick={() => handleExport('pdf')}>
              Export as PDF
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </Layout>
  );
};

export default Reports;

