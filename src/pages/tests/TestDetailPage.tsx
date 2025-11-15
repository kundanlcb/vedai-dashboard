import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  Chip,
  Stack,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PublishIcon from '@mui/icons-material/Publish';
import ArchiveIcon from '@mui/icons-material/Archive';
import AdminLayout from '@layouts/AdminLayout';
import type { AppDispatch } from '@store/store';
import {
  fetchTestById,
  publishTest,
  archiveTest,
  deleteTest,
} from '@store/slices/testSlice';
import {
  selectCurrentTest,
  selectTestLoading,
  selectTestError,
} from '@store/selectors/testSelectors';
import { useNotification } from '@hooks/useNotification';

export const TestDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { showSuccess, showError } = useNotification();

  const test = useSelector(selectCurrentTest);
  const loading = useSelector(selectTestLoading);
  const error = useSelector(selectTestError);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchTestById(id));
    }
  }, [dispatch, id]);

  const handlePublish = async () => {
    if (!id) return;
    try {
      await dispatch(publishTest(id)).unwrap();
      showSuccess('Test published successfully');
    } catch {
      showError('Failed to publish test');
    }
  };

  const handleArchive = async () => {
    if (!id) return;
    try {
      await dispatch(archiveTest(id)).unwrap();
      showSuccess('Test archived successfully');
    } catch {
      showError('Failed to archive test');
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await dispatch(deleteTest(id)).unwrap();
      showSuccess('Test deleted successfully');
      navigate('/tests');
    } catch {
      showError('Failed to delete test');
    }
    setDeleteDialogOpen(false);
  };

  if (loading) {
    return (
      <AdminLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <Alert severity="error">{error}</Alert>
      </AdminLayout>
    );
  }

  if (!test) {
    return (
      <AdminLayout>
        <Typography color="textSecondary">Test not found</Typography>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ mb: 1 }}>
              {test.name}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              {test.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label={test.status}
                size="small"
                color={test.status === 'published' ? 'success' : 'default'}
              />
              <Chip label={`${test.totalQuestions} Questions`} size="small" />
              <Chip label={`${test.totalMarks} Marks`} size="small" />
              <Chip label={`${test.duration} mins`} size="small" />
            </Box>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/tests/${id}/edit`)}
            >
              Edit
            </Button>
            {test.status !== 'published' && (
              <Button
                variant="outlined"
                size="small"
                color="success"
                startIcon={<PublishIcon />}
                onClick={handlePublish}
              >
                Publish
              </Button>
            )}
            {test.status !== 'archived' && (
              <Button
                variant="outlined"
                size="small"
                color="warning"
                startIcon={<ArchiveIcon />}
                onClick={handleArchive}
              >
                Archive
              </Button>
            )}
            <Button
              variant="outlined"
              size="small"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete
            </Button>
          </Stack>
        </Box>

        {/* Basic Info */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Marks
              </Typography>
              <Typography variant="h5">{test.totalMarks}</Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Duration
              </Typography>
              <Typography variant="h5">{test.duration} mins</Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Passing %
              </Typography>
              <Typography variant="h5">{test.passingPercentage}%</Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Questions
              </Typography>
              <Typography variant="h5">{test.totalQuestions}</Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Organization */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Organization
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Class
                </Typography>
                <Typography variant="body2">{test.class}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Subject
                </Typography>
                <Typography variant="body2">{test.subject}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Chapter
                </Typography>
                <Typography variant="body2">{test.chapter}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Configuration */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Configuration
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Negative Marking
                </Typography>
                <Chip
                  label={test.negativeMarking ? 'Enabled' : 'Disabled'}
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              </Box>
              {test.negativeMarking && (
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Negative Marks
                  </Typography>
                  <Typography variant="body2">{test.negativeMarkValue}</Typography>
                </Box>
              )}
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Show Answers
                </Typography>
                <Chip
                  label={test.showAnswersAfter ? 'Yes' : 'No'}
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Show Score
                </Typography>
                <Chip
                  label={test.showScoreAfter ? 'Yes' : 'No'}
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Allow Review
                </Typography>
                <Chip
                  label={test.allowReview ? 'Yes' : 'No'}
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Shuffle Questions
                </Typography>
                <Chip
                  label={test.shuffleQuestions ? 'Yes' : 'No'}
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Statistics
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Total Attempts
                </Typography>
                <Typography variant="h6">{test.totalAttempts || 0}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Average Score
                </Typography>
                <Typography variant="h6">{test.averageScore || 0}%</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Published
                </Typography>
                <Typography variant="body2">
                  {test.publishedDate ? new Date(test.publishedDate).toLocaleDateString() : 'Not published'}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Questions List */}
        {test.questions && test.questions.length > 0 && (
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Questions in Test
              </Typography>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell>Order</TableCell>
                      <TableCell>Question ID</TableCell>
                      <TableCell align="right">Marks</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {test.questions.map((q) => (
                      <TableRow key={q.questionId}>
                        <TableCell>{q.order}</TableCell>
                        <TableCell>{q.questionId}</TableCell>
                        <TableCell align="right">{q.marks}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}
      </Box>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this test? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default TestDetailPage;

