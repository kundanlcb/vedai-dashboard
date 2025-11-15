import { Box, Typography } from '@mui/material';
import AdminLayout from '@layouts/AdminLayout';

export const AnalyticsDashboard = () => {
  return (
    <AdminLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Analytics & Reports
        </Typography>
        <Typography color="textSecondary">
          View comprehensive analytics about content, questions, tests, and users with charts and metrics.
        </Typography>
      </Box>
    </AdminLayout>
  );
};

export default AnalyticsDashboard;

