import { Box, Typography } from '@mui/material';
import AdminLayout from '@layouts/AdminLayout';

export const TestListPage = () => {
  return (
    <AdminLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Tests
        </Typography>
        <Typography color="textSecondary">
          View all published and draft tests with their details and analytics.
        </Typography>
      </Box>
    </AdminLayout>
  );
};

export default TestListPage;

