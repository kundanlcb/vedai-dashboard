import { Box, Typography } from '@mui/material';
import AdminLayout from '@layouts/AdminLayout';

export const TestCreatePage = () => {
  return (
    <AdminLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Create Test
        </Typography>
        <Typography color="textSecondary">
          Create a new test by configuring questions, marking scheme, and access settings.
        </Typography>
      </Box>
    </AdminLayout>
  );
};

export default TestCreatePage;

