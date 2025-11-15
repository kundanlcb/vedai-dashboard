import { Box, Typography } from '@mui/material';
import AdminLayout from '@layouts/AdminLayout';

export const UserCreatePage = () => {
  return (
    <AdminLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Create User
        </Typography>
        <Typography color="textSecondary">
          Create a new user account with email, password, and role assignment.
        </Typography>
      </Box>
    </AdminLayout>
  );
};

export default UserCreatePage;

