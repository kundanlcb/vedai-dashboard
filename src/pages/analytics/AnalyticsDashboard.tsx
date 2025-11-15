import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  CircularProgress,

} from '@mui/material';
import AdminLayout from '@layouts/AdminLayout';
import type { AppDispatch } from '@store/store';
import { fetchDashboardStats } from '@store/slices/analyticsSlice';
import {
  selectDashboardStats,
  selectAnalyticsLoading,
  selectAnalyticsError,
} from '@store/selectors/analyticsSelectors';

export const AnalyticsDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();

  const dashboardStats = useSelector(selectDashboardStats);
  const loading = useSelector(selectAnalyticsLoading);
  const error = useSelector(selectAnalyticsError);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  return (
    <AdminLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Analytics Dashboard
        </Typography>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : dashboardStats ? (
          <>
            {/* Statistics Cards */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Users
                  </Typography>
                  <Typography variant="h5">{dashboardStats.totalUsers}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {dashboardStats.activeUsers} active
                  </Typography>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Content Uploaded
                  </Typography>
                  <Typography variant="h5">{dashboardStats.totalContent}</Typography>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Questions Created
                  </Typography>
                  <Typography variant="h5">{dashboardStats.totalQuestions}</Typography>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Tests Published
                  </Typography>
                  <Typography variant="h5">{dashboardStats.totalTests}</Typography>
                </CardContent>
              </Card>
            </Box>

            {/* Additional Info */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Additional Metrics
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Inactive Users
                    </Typography>
                    <Typography variant="h6">{dashboardStats.inactiveUsers}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Total Attempts
                    </Typography>
                    <Typography variant="h6">{dashboardStats.totalAttempts}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </>
        ) : (
          <Typography color="textSecondary">No data available</Typography>
        )}
      </Box>
    </AdminLayout>
  );
};

export default AnalyticsDashboard;

