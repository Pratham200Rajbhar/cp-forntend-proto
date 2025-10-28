import Layout from '../../components/layout/Layout';
import Card, { CardHeader, CardBody, CardTitle } from '../../components/common/Card';

const AttendanceOversight = () => {
  return (
    <Layout title="Attendance Oversight">
      <Card>
        <CardHeader>
          <CardTitle>Institution-wide Attendance</CardTitle>
        </CardHeader>
        <CardBody>
          <p className="text-gray-500 dark:text-gray-400">Attendance oversight interface coming soon...</p>
        </CardBody>
      </Card>
    </Layout>
  );
};

export default AttendanceOversight;

