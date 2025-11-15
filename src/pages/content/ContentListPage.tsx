import { Box, Typography } from '@mui/material';
import AdminLayout from '@layouts/AdminLayout';

export const ContentListPage = () => {
  return (
    <AdminLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Content Management
        </Typography>
        <Typography color="textSecondary">
          This page will display a list of all uploaded content with filtering, sorting, and pagination.
        </Typography>
      </Box>
    </AdminLayout>
  );
};

export default ContentListPage;

