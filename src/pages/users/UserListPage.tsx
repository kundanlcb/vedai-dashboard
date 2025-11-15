import { Box, Typography } from '@mui/material';
import AdminLayout from '@layouts/AdminLayout';

export const UserListPage = () => {
  return (
    <AdminLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3 }}>
          User Management
        </Typography>
        <Typography color="textSecondary">
          View, create, edit, and manage user accounts with roles and permissions.
        </Typography>
      </Box>
    </AdminLayout>
  );
};

export default UserListPage;

