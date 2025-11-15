import { Box, Typography } from '@mui/material';
import AdminLayout from '@layouts/AdminLayout';

export const SettingsPage = () => {
  return (
    <AdminLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Settings
        </Typography>
        <Typography color="textSecondary">
          Configure system settings, general settings, security, and notifications.
        </Typography>
      </Box>
    </AdminLayout>
  );
};

export default SettingsPage;

