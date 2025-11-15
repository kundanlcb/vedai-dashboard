import { Box, Card, CardContent, Typography } from '@mui/material';
import AdminLayout from '@layouts/AdminLayout';
import useAuth from '@hooks/useAuth';

export const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <AdminLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3 }}>
          My Profile
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <Box>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Personal Information
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Full Name
                  </Typography>
                  <Typography variant="body1">{user?.full_name}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Email
                  </Typography>
                  <Typography variant="body1">{user?.email}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Role
                  </Typography>
                  <Typography variant="body1">{user?.role}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Security
                </Typography>
                <Typography color="textSecondary">
                  Manage your security settings and change password here.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </AdminLayout>
  );
};

export default ProfilePage;

