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
  fetchContentAnalytics,
  setFilters,
} from '@store/slices/analyticsSlice';
import {
  selectContentAnalytics,
  selectAnalyticsLoading,
  selectAnalyticsError,
} from '@store/selectors/analyticsSelectors';

export const ContentAnalyticsPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const contentAnalytics = useSelector(selectContentAnalytics);
  const loading = useSelector(selectAnalyticsLoading);
  const error = useSelector(selectAnalyticsError);

  useEffect(() => {
    dispatch(setFilters({}));
    dispatch(fetchContentAnalytics());
  }, [dispatch]);

  return (
    <AdminLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Content Analytics
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
        ) : contentAnalytics ? (
          <>
            {/* Key Metrics */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 2, mb: 3 }}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Content
                  </Typography>
                  <Typography variant="h5">{contentAnalytics.totalContent}</Typography>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Publishing Rate
                  </Typography>
                  <Typography variant="h5">{contentAnalytics.publishingRate}%</Typography>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Success Rate
                  </Typography>
                  <Typography variant="h5">{contentAnalytics.successRate}%</Typography>
                </CardContent>
              </Card>
            </Box>

            {/* Processing Status */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Processing Status
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  {Object.entries(contentAnalytics.processingStatus).map(([status, count]) => (
                    <Box key={status}>
                      <Typography variant="caption" color="textSecondary" sx={{ textTransform: 'capitalize' }}>
                        {status}
                      </Typography>
                      <Typography variant="h6">{count}</Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* Usage Metrics */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Usage Metrics
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Views
                    </Typography>
                    <Typography variant="h6">{contentAnalytics.usage.views}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="textSecondary">
                      Downloads
                    </Typography>
                    <Typography variant="h6">{contentAnalytics.usage.downloads}</Typography>
                  </Box>
                  <Box sx={{ gridColumn: '1 / -1' }}>
                    <Typography variant="caption" color="textSecondary">
                      Avg. Processing Time
                    </Typography>
                    <Typography variant="h6">{contentAnalytics.averageProcessingTime} minutes</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Content by Subject */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Content by Subject
                </Typography>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableRow>
                        <TableCell>Subject</TableCell>
                        <TableCell align="right">Count</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(contentAnalytics.bySubject).map(([subject, count]) => (
                        <TableRow key={subject}>
                          <TableCell>{subject}</TableCell>
                          <TableCell align="right">{count}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>

            {/* Content by Chapter */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Content by Chapter
                </Typography>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableRow>
                        <TableCell>Chapter</TableCell>
                        <TableCell align="right">Count</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(contentAnalytics.byChapter).map(([chapter, count]) => (
                        <TableRow key={chapter}>
                          <TableCell>{chapter}</TableCell>
                          <TableCell align="right">{count}</TableCell>
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

export default ContentAnalyticsPage;

