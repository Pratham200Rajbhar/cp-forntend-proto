import { useState, useEffect } from 'react';
import { CheckSquare, Search } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Card, { CardHeader, CardBody, CardTitle } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import Input from '../../components/common/Input';
import Checkbox from '../../components/common/Checkbox';
import Textarea from '../../components/common/Textarea';
import teacherService from '../../services/teacherService';
import attendanceService from '../../services/attendanceService';
import toast from 'react-hot-toast';

const ManualAttendance = () => {
  const [subjects, setSubjects] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      fetchSessions();
    }
  }, [selectedSubject]);

  useEffect(() => {
    if (selectedSession) {
      fetchStudents();
    }
  }, [selectedSession]);

  const fetchSubjects = async () => {
    try {
      const data = await teacherService.getSubjects();
      setSubjects(data);
    } catch (error) {
      toast.error('Failed to load subjects');
      console.error('Subjects error:', error);
    }
  };

  const fetchSessions = async () => {
    try {
      const data = await teacherService.getSessions({ subject_id: selectedSubject });
      setSessions(data);
    } catch (error) {
      toast.error('Failed to load sessions');
      console.error('Sessions error:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      // Mock data - replace with actual API call
      const mockStudents = [
        { id: 1, name: 'Aarav Verma', email: 'aarav.verma@students.iitm.ac.in', student_id: '23CS001' },
        { id: 2, name: 'Diya Gupta', email: 'diya.gupta@students.iitm.ac.in', student_id: '23CS002' },
        { id: 3, name: 'Kabir Nair', email: 'kabir.nair@students.iitm.ac.in', student_id: '23CS003' },
        { id: 4, name: 'Priya Patel', email: 'priya.patel@students.iitm.ac.in', student_id: '23CS004' },
        { id: 5, name: 'Arjun Singh', email: 'arjun.singh@students.iitm.ac.in', student_id: '23CS005' },
        { id: 6, name: 'Sneha Reddy', email: 'sneha.reddy@students.iitm.ac.in', student_id: '23CS006' },
        { id: 7, name: 'Vikram Kumar', email: 'vikram.kumar@students.iitm.ac.in', student_id: '23CS007' },
        { id: 8, name: 'Ananya Sharma', email: 'ananya.sharma@students.iitm.ac.in', student_id: '23CS008' },
      ];
      setStudents(mockStudents);
    } catch (error) {
      toast.error('Failed to load students');
      console.error('Students error:', error);
    }
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(s => s.id));
    }
  };

  const handleSelectStudent = (studentId) => {
    setSelectedStudents(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      }
      return [...prev, studentId];
    });
  };

  const handleSubmit = async () => {
    if (!selectedSession) {
      toast.error('Please select a session');
      return;
    }

    if (selectedStudents.length === 0) {
      toast.error('Please select at least one student');
      return;
    }

    try {
      setLoading(true);
      
      // Submit attendance for each selected student
      const promises = selectedStudents.map(studentId =>
        attendanceService.manualOverride({
          attendance_record_id: studentId, // This should be the actual attendance record ID
          new_status: 'present',
          reason: comments || 'Manual attendance submission by teacher'
        })
      );

      await Promise.all(promises);

      toast.success(`Manual attendance submitted for ${selectedStudents.length} student(s)`);
      
      // Reset form
      setSelectedStudents([]);
      setComments('');
      setSelectedSession('');
    } catch (error) {
      toast.error('Failed to submit manual attendance');
      console.error('Manual attendance error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.student_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title="Manual Attendance">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Submit Manual Attendance</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-6">
              {/* Subject and Session Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Select Subject"
                  placeholder="Choose a subject"
                  value={selectedSubject}
                  onChange={(e) => {
                    setSelectedSubject(e.target.value);
                    setSelectedSession('');
                    setStudents([]);
                    setSelectedStudents([]);
                  }}
                  options={subjects.map(s => ({ value: s.id, label: `${s.name} (${s.code})` }))}
                  fullWidth
                />

                <Select
                  label="Select Session"
                  placeholder="Choose a session"
                  value={selectedSession}
                  onChange={(e) => {
                    setSelectedSession(e.target.value);
                    setSelectedStudents([]);
                  }}
                  options={sessions.map(s => ({ value: s.id, label: s.session_name }))}
                  disabled={!selectedSubject}
                  fullWidth
                />
              </div>

              {/* Student Selection */}
              {selectedSession && (
                <>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Select Students ({selectedStudents.length} selected)
                      </h3>
                      <Button variant="outline" size="sm" onClick={handleSelectAll}>
                        {selectedStudents.length === filteredStudents.length ? 'Deselect All' : 'Select All'}
                      </Button>
                    </div>

                    {/* Search */}
                    <Input
                      placeholder="Search students by name, email, or ID..."
                      icon={Search}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      fullWidth
                      className="mb-4"
                    />

                    {/* Student List */}
                    <div className="max-h-96 overflow-y-auto space-y-2 border border-gray-200 dark:border-gray-700 rounded-md p-4">
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => (
                          <div
                            key={student.id}
                            className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                            onClick={() => handleSelectStudent(student.id)}
                          >
                            <Checkbox
                              checked={selectedStudents.includes(student.id)}
                              onChange={() => handleSelectStudent(student.id)}
                              containerClassName="mr-3"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 dark:text-gray-100">
                                {student.name}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {student.email} • {student.student_id}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                          No students found
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Comments */}
                  <Textarea
                    label="Comments (Optional)"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Add any notes about this manual attendance entry..."
                    rows={3}
                    fullWidth
                  />

                  {/* Submit Button */}
                  <div className="flex justify-end space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedSubject('');
                        setSelectedSession('');
                        setStudents([]);
                        setSelectedStudents([]);
                        setComments('');
                      }}
                    >
                      Reset
                    </Button>
                    <Button
                      variant="primary"
                      icon={CheckSquare}
                      onClick={handleSubmit}
                      loading={loading}
                      disabled={loading || selectedStudents.length === 0}
                    >
                      Submit Attendance
                    </Button>
                  </div>
                </>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
};

export default ManualAttendance;

