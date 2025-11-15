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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PublishIcon from '@mui/icons-material/Publish';
import ArchiveIcon from '@mui/icons-material/Archive';
import AdminLayout from '@layouts/AdminLayout';
import type { AppDispatch } from '@store/store';
import {
  fetchQuestionById,
  publishQuestion,
  archiveQuestion,
  deleteQuestion,
} from '@store/slices/questionSlice';
import {
  selectCurrentQuestion,
  selectQuestionLoading,
  selectQuestionError,
} from '@store/selectors/questionSelectors';
import { useNotification } from '@hooks/useNotification';

export const QuestionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { showSuccess, showError } = useNotification();

  const question = useSelector(selectCurrentQuestion);
  const loading = useSelector(selectQuestionLoading);
  const error = useSelector(selectQuestionError);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchQuestionById(id));
    }
  }, [dispatch, id]);

  const handlePublish = async () => {
    if (!id) return;
    try {
      await dispatch(publishQuestion(id)).unwrap();
      showSuccess('Question published successfully');
    } catch {
      showError('Failed to publish question');
    }
  };

  const handleArchive = async () => {
    if (!id) return;
    try {
      await dispatch(archiveQuestion(id)).unwrap();
      showSuccess('Question archived successfully');
    } catch {
      showError('Failed to archive question');
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await dispatch(deleteQuestion(id)).unwrap();
      showSuccess('Question deleted successfully');
      navigate('/questions');
    } catch {
      showError('Failed to delete question');
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

  if (!question) {
    return (
      <AdminLayout>
        <Typography color="textSecondary">Question not found</Typography>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" sx={{ mb: 1 }}>
              {question.text}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label={question.type} size="small" />
              <Chip
                label={question.difficultyLevel}
                size="small"
                color={question.difficultyLevel === 'hard' ? 'error' : 'default'}
              />
              <Chip label={question.bloomsLevel} size="small" variant="outlined" />
              <Chip
                label={question.status}
                size="small"
                color={question.status === 'published' ? 'success' : 'default'}
              />
            </Box>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/questions/${id}/edit`)}
            >
              Edit
            </Button>
            {question.status !== 'published' && (
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
            {question.status !== 'archived' && (
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

        {/* Question Text */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Question
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              {question.text}
            </Typography>
          </CardContent>
        </Card>

        {/* Options (for MCQ) */}
        {question.type === 'mcq' && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Options
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {question.options?.map((option, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      p: 1.5,
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      backgroundColor:
                        option.isCorrect && option.id === question.options?.[0]?.id ? '#e8f5e9' : '#fafafa',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">{option.text}</Typography>
                      {option.isCorrect && <Chip label="Correct" size="small" color="success" />}
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Explanation */}
        {question.explanation && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Explanation
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ whiteSpace: 'pre-wrap' }}>
                {question.explanation}
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Metadata */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Question Metadata
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Class
                </Typography>
                <Typography variant="body2">{question.class}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Subject
                </Typography>
                <Typography variant="body2">{question.subject}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Chapter
                </Typography>
                <Typography variant="body2">{question.chapter}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Marks
                </Typography>
                <Typography variant="body2">{question.marks || 'N/A'}</Typography>
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
                <Typography variant="h6">{question.totalAttempts || 0}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Success Rate
                </Typography>
                <Typography variant="h6">{question.successRate || 0}%</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Created
                </Typography>
                <Typography variant="body2">
                  {new Date(question.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this question? This action cannot be undone.
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

export default QuestionDetailPage;

