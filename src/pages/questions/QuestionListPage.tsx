import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Stack,
  Typography,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import GetAppIcon from '@mui/icons-material/GetApp';
import AdminLayout from '@layouts/AdminLayout';
import QuestionTable from '@components/tables/QuestionTable';
import type { AppDispatch } from '@store/store';
import {
  fetchQuestions,
  setFilters,
  setPage,
  setLimit,
  toggleSelectId,
  selectAllIds,
  clearSelectedIds,
  publishQuestion,
  archiveQuestion,
  deleteQuestion,
  fetchQuestionStats,
} from '@store/slices/questionSlice';
import {
  selectQuestionItems,
  selectQuestionLoading,
  selectQuestionError,
  selectQuestionPagination,
  selectQuestionFilters,
  selectQuestionStats,
  selectSelectedQuestionIds,
} from '@store/selectors/questionSelectors';
import questionService from '@services/question.service';
import { useNotification } from '@hooks/useNotification';

export const QuestionListPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  const items = useSelector(selectQuestionItems);
  const loading = useSelector(selectQuestionLoading);
  const error = useSelector(selectQuestionError);
  const pagination = useSelector(selectQuestionPagination);
  const filters = useSelector(selectQuestionFilters);
  const stats = useSelector(selectQuestionStats);
  const selectedIds = useSelector(selectSelectedQuestionIds);

  const [subjects, setSubjects] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        const subjectsList = await questionService.getSubjects();
        setSubjects(subjectsList);
      } catch {
        showError('Failed to load subjects');
      }
    };
    init();
  }, [showError]);

  useEffect(() => {
    dispatch(fetchQuestions({ page: 1, limit: 10, filters }));
    dispatch(fetchQuestionStats());
  }, [dispatch, filters]);

  const handleApplyFilters = () => {
    const newFilters: Record<string, unknown> = {};
    if (selectedSubject) newFilters.subject = selectedSubject;
    if (difficultyFilter) newFilters.difficultyLevel = difficultyFilter;
    if (statusFilter) newFilters.status = statusFilter;

    dispatch(setFilters(newFilters));
    dispatch(setPage(1));
    dispatch(fetchQuestions({ page: 1, limit: pagination.limit, filters: newFilters }));
  };

  return (
    <AdminLayout>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Question Bank</Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" startIcon={<GetAppIcon />}>
              Export
            </Button>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/questions/create')}>
              Create Question
            </Button>
          </Stack>
        </Box>

        {/* Stats */}
        {stats && (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total
                </Typography>
                <Typography variant="h5">{stats.total}</Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Published
                </Typography>
                <Typography variant="h5">{stats.published}</Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Draft
                </Typography>
                <Typography variant="h5">{stats.draft}</Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Under Review
                </Typography>
                <Typography variant="h5">{stats.underReview}</Typography>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Filters
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
              <TextField
                select
                label="Subject"
                size="small"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <MenuItem value="">All Subjects</MenuItem>
                {subjects.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Difficulty"
                size="small"
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
              >
                <MenuItem value="">All Levels</MenuItem>
                <MenuItem value="easy">Easy</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="hard">Hard</MenuItem>
              </TextField>
              <TextField
                select
                label="Status"
                size="small"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="under_review">Under Review</MenuItem>
                <MenuItem value="published">Published</MenuItem>
                <MenuItem value="archived">Archived</MenuItem>
              </TextField>
            </Box>
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button variant="contained" onClick={handleApplyFilters}>
                Apply
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <Card sx={{ mb: 3, backgroundColor: '#f5f5f5' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>{selectedIds.length} item(s) selected</Typography>
                <Stack direction="row" spacing={1}>
                  <Button size="small">Publish</Button>
                  <Button size="small">Archive</Button>
                  <Button size="small" color="error">
                    Delete
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Table */}
        <QuestionTable
          items={items}
          loading={loading}
          selectedIds={selectedIds}
          page={pagination.page}
          limit={pagination.limit}
          total={pagination.total}
          onSelectItem={(id) => dispatch(toggleSelectId(id))}
          onSelectAll={() => {
            if (selectedIds.length === items.length) {
              dispatch(clearSelectedIds());
            } else {
              dispatch(selectAllIds());
            }
          }}
          onView={(id) => navigate(`/questions/${id}`)}
          onEdit={(id) => navigate(`/questions/${id}/edit`)}
          onPublish={async (id) => {
            try {
              await dispatch(publishQuestion(id)).unwrap();
              showSuccess('Question published');
            } catch {
              showError('Failed to publish');
            }
          }}
          onArchive={async (id) => {
            try {
              await dispatch(archiveQuestion(id)).unwrap();
              showSuccess('Question archived');
            } catch {
              showError('Failed to archive');
            }
          }}
          onDelete={async (id) => {
            try {
              await dispatch(deleteQuestion(id)).unwrap();
              showSuccess('Question deleted');
              dispatch(fetchQuestions({ page: pagination.page, limit: pagination.limit, filters }));
            } catch {
              showError('Failed to delete');
            }
          }}
          onPageChange={(page) => {
            dispatch(setPage(page));
            dispatch(fetchQuestions({ page, limit: pagination.limit, filters }));
          }}
          onLimitChange={(limit) => {
            dispatch(setLimit(limit));
            dispatch(fetchQuestions({ page: 1, limit, filters }));
          }}
        />
      </Box>
    </AdminLayout>
  );
};

export default QuestionListPage;

