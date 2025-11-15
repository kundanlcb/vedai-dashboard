import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import AdminLayout from '@layouts/AdminLayout';
import type { AppDispatch } from '@store/store';
import {
  fetchTestAnalytics,
  setFilters,
} from '@store/slices/analyticsSlice';
import {
  selectTestAnalytics,
  selectAnalyticsLoading,
  selectAnalyticsError,
} from '@store/selectors/analyticsSelectors';

export const TestAnalyticsPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const testAnalytics = useSelector(selectTestAnalytics);
  const loading = useSelector(selectAnalyticsLoading);
  const error = useSelector(selectAnalyticsError);

  useEffect(() => {
    dispatch(setFilters({}));
    dispatch(fetchTestAnalytics());
  }, [dispatch]);

  return (
    <AdminLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Test Analytics
        </Typography>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : testAnalytics ? (
          <>
            {/* Key Metrics */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Tests
                  </Typography>
                  <Typography variant="h5">{testAnalytics.totalTests}</Typography>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Attempts
                  </Typography>
                  <Typography variant="h5">{testAnalytics.totalAttempts}</Typography>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Avg Score
                  </Typography>
                  <Typography variant="h5">{testAnalytics.averageScore}%</Typography>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Pass Rate
                  </Typography>
                  <Typography variant="h5">{testAnalytics.passRate}%</Typography>
                </CardContent>
              </Card>
            </Box>

            {/* Additional Metrics */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 3 }}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Completion Rate
                  </Typography>
                  <Typography variant="h5">{testAnalytics.completionRate}%</Typography>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Avg Time (minutes)
                  </Typography>
                  <Typography variant="h5">{testAnalytics.averageTimeMinutes}</Typography>
                </CardContent>
              </Card>
            </Box>

            {/* Student Performance Distribution */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Student Performance Distribution
                </Typography>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableRow>
                        <TableCell>Score Range</TableCell>
                        <TableCell align="right">Students</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {testAnalytics.studentPerformance.map((perf, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{perf.score}%</TableCell>
                          <TableCell align="right">{perf.count}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>

            {/* Trending Tests */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Trending Tests
                </Typography>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableRow>
                        <TableCell>Test Name</TableCell>
                        <TableCell align="right">Attempts</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {testAnalytics.trendingTests.map((test) => (
                        <TableRow key={test.id}>
                          <TableCell>{test.name}</TableCell>
                          <TableCell align="right">{test.attempts}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
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

export default TestAnalyticsPage;

