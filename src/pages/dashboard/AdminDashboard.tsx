import { Box, Card, CardContent, Typography } from '@mui/material';
import AdminLayout from '@layouts/AdminLayout';
import useAuth from '@hooks/useAuth';

export const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <AdminLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Welcome, {user?.full_name}!
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
          <Box>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Users
                </Typography>
                <Typography variant="h5">250</Typography>
              </CardContent>
            </Card>
          </Box>

          <Box>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Content
                </Typography>
                <Typography variant="h5">1,200</Typography>
              </CardContent>
            </Card>
          </Box>

          <Box>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Questions
                </Typography>
                <Typography variant="h5">5,430</Typography>
              </CardContent>
            </Card>
          </Box>

          <Box>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Tests
                </Typography>
                <Typography variant="h5">89</Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </AdminLayout>
  );
};

export default AdminDashboard;

