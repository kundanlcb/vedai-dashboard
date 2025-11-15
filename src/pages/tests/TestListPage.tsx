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
import AdminLayout from '@layouts/AdminLayout';
import TestTable from '@components/tables/TestTable';
import type { AppDispatch } from '@store/store';
import {
  fetchTests,
  setFilters,
  setPage,
  setLimit,
  toggleSelectId,
  selectAllIds,
  clearSelectedIds,
  publishTest,
  archiveTest,
  deleteTest,
  fetchTestStats,
} from '@store/slices/testSlice';
import {
  selectTestItems,
  selectTestLoading,
  selectTestError,
  selectTestPagination,
  selectTestFilters,
  selectTestStats,
  selectSelectedTestIds,
} from '@store/selectors/testSelectors';
import testService from '@services/test.service';
import { useNotification } from '@hooks/useNotification';

export const TestListPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  const items = useSelector(selectTestItems);
  const loading = useSelector(selectTestLoading);
  const error = useSelector(selectTestError);
  const pagination = useSelector(selectTestPagination);
  const filters = useSelector(selectTestFilters);
  const stats = useSelector(selectTestStats);
  const selectedIds = useSelector(selectSelectedTestIds);

  const [subjects, setSubjects] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [classes, setClasses] = useState<string[]>([]);

  useEffect(() => {
    const init = async () => {
      try {
        const [subjectsList, classesList] = await Promise.all([
          testService.getSubjects(),
          testService.getClasses(),
        ]);
        setSubjects(subjectsList);
        setClasses(classesList);
      } catch {
        showError('Failed to load metadata');
      }
    };
    init();
  }, [showError]);

  useEffect(() => {
    dispatch(fetchTests({ page: 1, limit: 10, filters }));
    dispatch(fetchTestStats());
  }, [dispatch, filters]);

  const handleApplyFilters = () => {
    const newFilters: Record<string, unknown> = {};
    if (selectedSubject) newFilters.subject = selectedSubject;
    if (selectedClass) newFilters.class = selectedClass;
    if (statusFilter) newFilters.status = statusFilter;

    dispatch(setFilters(newFilters));
    dispatch(setPage(1));
    dispatch(fetchTests({ page: 1, limit: pagination.limit, filters: newFilters }));
  };

  return (
    <AdminLayout>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Tests</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/tests/create')}>
            Create Test
          </Button>
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
                label="Class"
                size="small"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <MenuItem value="">All Classes</MenuItem>
                {classes.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>
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
        <TestTable
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
          onView={(id) => navigate(`/tests/${id}`)}
          onEdit={(id) => navigate(`/tests/${id}/edit`)}
          onPublish={async (id) => {
            try {
              await dispatch(publishTest(id)).unwrap();
              showSuccess('Test published');
            } catch {
              showError('Failed to publish');
            }
          }}
          onArchive={async (id) => {
            try {
              await dispatch(archiveTest(id)).unwrap();
              showSuccess('Test archived');
            } catch {
              showError('Failed to archive');
            }
          }}
          onDelete={async (id) => {
            try {
              await dispatch(deleteTest(id)).unwrap();
              showSuccess('Test deleted');
              dispatch(fetchTests({ page: pagination.page, limit: pagination.limit, filters }));
            } catch {
              showError('Failed to delete');
            }
          }}
          onPageChange={(page) => {
            dispatch(setPage(page));
            dispatch(fetchTests({ page, limit: pagination.limit, filters }));
          }}
          onLimitChange={(limit) => {
            dispatch(setLimit(limit));
            dispatch(fetchTests({ page: 1, limit, filters }));
          }}
        />
      </Box>
    </AdminLayout>
  );
};

export default TestListPage;

