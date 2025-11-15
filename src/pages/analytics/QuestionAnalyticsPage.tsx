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
  fetchQuestionAnalytics,
  setFilters,
} from '@store/slices/analyticsSlice';
import {
  selectQuestionAnalytics,
  selectAnalyticsLoading,
  selectAnalyticsError,
} from '@store/selectors/analyticsSelectors';

export const QuestionAnalyticsPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const questionAnalytics = useSelector(selectQuestionAnalytics);
  const loading = useSelector(selectAnalyticsLoading);
  const error = useSelector(selectAnalyticsError);

  useEffect(() => {
    dispatch(setFilters({}));
    dispatch(fetchQuestionAnalytics());
  }, [dispatch]);

  return (
    <AdminLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Question Analytics
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
        ) : questionAnalytics ? (
          <>
            {/* Key Metrics */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Questions
                  </Typography>
                  <Typography variant="h5">{questionAnalytics.totalQuestions}</Typography>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Attempts
                  </Typography>
                  <Typography variant="h5">{questionAnalytics.totalAttempts}</Typography>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Avg Success Rate
                  </Typography>
                  <Typography variant="h5">{questionAnalytics.averageSuccessRate}%</Typography>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Quality Score
                  </Typography>
                  <Typography variant="h5">{(questionAnalytics.successRateDistribution[2] || 0)}%</Typography>
                </CardContent>
              </Card>
            </Box>

            {/* Difficulty Distribution */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Questions by Difficulty
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
                  {Object.entries(questionAnalytics.byDifficulty).map(([difficulty, count]) => (
                    <Box key={difficulty}>
                      <Typography variant="caption" color="textSecondary" sx={{ textTransform: 'capitalize' }}>
                        {difficulty}
                      </Typography>
                      <Typography variant="h6">{count}</Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* Bloom's Level Distribution */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Questions by Bloom's Level
                </Typography>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableRow>
                        <TableCell>Level</TableCell>
                        <TableCell align="right">Count</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(questionAnalytics.byBloomsLevel).map(([level, count]) => (
                        <TableRow key={level}>
                          <TableCell sx={{ textTransform: 'capitalize' }}>{level}</TableCell>
                          <TableCell align="right">{count}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>

            {/* Most Attempted Questions */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Most Attempted Questions
                </Typography>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableRow>
                        <TableCell>Question</TableCell>
                        <TableCell align="right">Attempts</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {questionAnalytics.mostAttempted.map((q) => (
                        <TableRow key={q.id}>
                          <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {q.text}
                          </TableCell>
                          <TableCell align="right">{q.attempts}</TableCell>
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

export default QuestionAnalyticsPage;

