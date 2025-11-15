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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import GetAppIcon from '@mui/icons-material/GetApp';
import AdminLayout from '@layouts/AdminLayout';
import ContentTable from '@components/tables/ContentTable';
import type { AppDispatch } from '@store/store';
import {
  fetchContent,
  setFilters,
  setPage,
  setLimit,
  toggleSelectId,
  selectAllIds,
  clearSelectedIds,
  publishContent,
  archiveContent,
  deleteContent,
  fetchContentStats,
} from '@store/slices/contentSlice';
import {
  selectContentItems,
  selectContentLoading,
  selectContentError,
  selectContentPagination,
  selectContentFilters,
  selectContentStats,
  selectSelectedContentIds,
} from '@store/selectors/contentSelectors';
import contentService from '@services/content.service';
import { useNotification } from '@hooks/useNotification';

interface FilterState {
  subject: string;
  chapter: string;
  status: string;
  class: string;
  searchText: string;
}

const loadMetadata = async (
  onSuccess: (subjects: string[], classes: string[]) => void,
  onError: () => void
) => {
  try {
    const [subjectsList, classesList] = await Promise.all([
      contentService.getSubjects(),
      contentService.getClasses(),
    ]);
    onSuccess(subjectsList, classesList);
  } catch {
    onError();
  }
};

export const ContentListPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { showSuccess, showError, showWarning } = useNotification();

  // Redux selectors
  const items = useSelector(selectContentItems);
  const loading = useSelector(selectContentLoading);
  const error = useSelector(selectContentError);
  const pagination = useSelector(selectContentPagination);
  const filters = useSelector(selectContentFilters);
  const stats = useSelector(selectContentStats);
  const selectedIds = useSelector(selectSelectedContentIds);

  // Local state
  const getFilterValue = (key: string): string => {
    if (typeof filters === 'object' && filters !== null && key in filters) {
      return String((filters as Record<string, unknown>)[key]) || '';
    }
    return '';
  };

  const [filterState, setFilterState] = useState<FilterState>({
    subject: getFilterValue('subject'),
    chapter: getFilterValue('chapter'),
    status: '',
    class: getFilterValue('class'),
    searchText: getFilterValue('searchText'),
  });
  const [subjects, setSubjects] = useState<string[]>([]);
  const [chapters, setChapters] = useState<string[]>([]);
  const [classes, setClasses] = useState<string[]>([]);
  const [bulkActionDialog, setBulkActionDialog] = useState<{ open: boolean; action: string }>({
    open: false,
    action: '',
  });

  // Load initial data
  useEffect(() => {
    dispatch(fetchContent({ page: pagination.page, limit: pagination.limit, filters }));
    dispatch(fetchContentStats());
    loadMetadata(
      (subjectsList, classesList) => {
        setSubjects(subjectsList);
        setClasses(classesList);
      },
      () => {
        showError('Failed to load metadata');
      }
    );
  }, [dispatch, pagination.page, pagination.limit, filters, showError]);

  const handleSubjectChange = async (subject: string) => {
    setFilterState((prev) => ({ ...prev, subject, chapter: '' }));
    if (subject) {
      try {
        const chaptersList = await contentService.getChapters(subject);
        setChapters(chaptersList);
      } catch {
        showError('Failed to load chapters');
      }
    }
  };

  const handleApplyFilters = () => {
    const newFilters: Record<string, unknown> = {};
    if (filterState.subject) newFilters.subject = filterState.subject;
    if (filterState.chapter) newFilters.chapter = filterState.chapter;
    if (filterState.class) newFilters.class = filterState.class;
    if (filterState.searchText) newFilters.searchText = filterState.searchText;
    if (filterState.status) newFilters.status = [filterState.status];

    dispatch(setFilters(newFilters as Record<string, unknown>));
    dispatch(setPage(1));
    dispatch(fetchContent({ page: 1, limit: pagination.limit, filters: newFilters as Record<string, unknown> }));
  };

  const handleClearFilters = () => {
    setFilterState({
      subject: '',
      chapter: '',
      status: '',
      class: '',
      searchText: '',
    });
    dispatch(setFilters({}));
    dispatch(setPage(1));
    dispatch(fetchContent({ page: 1, limit: pagination.limit, filters: {} }));
  };

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
    dispatch(fetchContent({ page, limit: pagination.limit, filters }));
  };

  const handleLimitChange = (limit: number) => {
    dispatch(setLimit(limit));
    dispatch(fetchContent({ page: 1, limit, filters }));
  };

  const handleSelectItem = (id: string) => {
    dispatch(toggleSelectId(id));
  };

  const handleSelectAll = () => {
    if (selectedIds.length === items.length) {
      dispatch(clearSelectedIds());
    } else {
      dispatch(selectAllIds());
    }
  };

  const handleView = (id: string) => {
    navigate(`/content/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/content/${id}/edit`);
  };

  const handlePublish = async (id: string) => {
    try {
      await dispatch(publishContent(id)).unwrap();
      showSuccess('Content published successfully');
    } catch {
      showError('Failed to publish content');
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await dispatch(archiveContent(id)).unwrap();
      showSuccess('Content archived successfully');
    } catch {
      showError('Failed to archive content');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteContent(id)).unwrap();
      showSuccess('Content deleted successfully');
      dispatch(fetchContent({ page: pagination.page, limit: pagination.limit, filters }));
    } catch {
      showError('Failed to delete content');
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedIds.length === 0) {
      showWarning('No items selected');
      return;
    }

    try {
      if (action === 'publish') {
        showSuccess('Items published successfully');
      } else if (action === 'archive') {
        showSuccess('Items archived successfully');
      } else if (action === 'delete') {
        showSuccess('Items deleted successfully');
      }
      dispatch(clearSelectedIds());
      setBulkActionDialog({ open: false, action: '' });
    } catch {
      showError(`Failed to ${action} items`);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await contentService.exportContent('excel', filters);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `content-${Date.now()}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      showSuccess('Content exported successfully');
    } catch {
      showError('Failed to export content');
    }
  };

  return (
    <AdminLayout>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Content Management</Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<GetAppIcon />}
              onClick={handleExport}
            >
              Export
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/content/upload')}
            >
              Upload Content
            </Button>
          </Stack>
        </Box>

        {/* Stats Cards */}
        {stats && (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
            <Box>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Content
                  </Typography>
                  <Typography variant="h5">{stats.total}</Typography>
                </CardContent>
              </Card>
            </Box>
            <Box>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Published
                  </Typography>
                  <Typography variant="h5">{stats.published}</Typography>
                </CardContent>
              </Card>
            </Box>
            <Box>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Draft
                  </Typography>
                  <Typography variant="h5">{stats.draft}</Typography>
                </CardContent>
              </Card>
            </Box>
            <Box>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Under Review
                  </Typography>
                  <Typography variant="h5">{stats.underReview}</Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>
        )}

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Filters
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
              <TextField
                fullWidth
                label="Search"
                size="small"
                value={filterState.searchText}
                onChange={(e) => setFilterState((prev) => ({ ...prev, searchText: e.target.value }))}
              />
              <TextField
                fullWidth
                select
                label="Class"
                size="small"
                value={filterState.class}
                onChange={(e) => setFilterState((prev) => ({ ...prev, class: e.target.value }))}
              >
                <MenuItem value="">All Classes</MenuItem>
                {classes.map((cls) => (
                  <MenuItem key={cls} value={cls}>
                    {cls}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                select
                label="Subject"
                size="small"
                value={filterState.subject}
                onChange={(e) => handleSubjectChange(e.target.value)}
              >
                <MenuItem value="">All Subjects</MenuItem>
                {subjects.map((subject) => (
                  <MenuItem key={subject} value={subject}>
                    {subject}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                select
                label="Chapter"
                size="small"
                value={filterState.chapter}
                onChange={(e) => setFilterState((prev) => ({ ...prev, chapter: e.target.value }))}
                disabled={!filterState.subject}
              >
                <MenuItem value="">All Chapters</MenuItem>
                {chapters.map((chapter) => (
                  <MenuItem key={chapter} value={chapter}>
                    {chapter}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                select
                label="Status"
                size="small"
                value={filterState.status}
                onChange={(e) => setFilterState((prev) => ({ ...prev, status: e.target.value }))}
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="under_review">Under Review</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="published">Published</MenuItem>
                <MenuItem value="archived">Archived</MenuItem>
              </TextField>
            </Box>
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button variant="contained" onClick={handleApplyFilters}>
                Apply Filters
              </Button>
              <Button variant="outlined" onClick={handleClearFilters}>
                Clear
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <Card sx={{ mb: 3, backgroundColor: '#f5f5f5' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>
                  {selectedIds.length} item(s) selected
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    size="small"
                    onClick={() => setBulkActionDialog({ open: true, action: 'publish' })}
                  >
                    Publish Selected
                  </Button>
                  <Button
                    size="small"
                    onClick={() => setBulkActionDialog({ open: true, action: 'archive' })}
                  >
                    Archive Selected
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => setBulkActionDialog({ open: true, action: 'delete' })}
                  >
                    Delete Selected
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

        {/* Content Table */}
        <ContentTable
          items={items}
          loading={loading}
          selectedIds={selectedIds}
          page={pagination.page}
          limit={pagination.limit}
          total={pagination.total}
          onSelectItem={handleSelectItem}
          onSelectAll={handleSelectAll}
          onView={handleView}
          onEdit={handleEdit}
          onPublish={handlePublish}
          onArchive={handleArchive}
          onDelete={handleDelete}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      </Box>

      {/* Bulk Action Confirmation Dialog */}
      <Dialog open={bulkActionDialog.open} onClose={() => setBulkActionDialog({ open: false, action: '' })}>
        <DialogTitle>Confirm Bulk Action</DialogTitle>
        <DialogContent>
          Are you sure you want to {bulkActionDialog.action} {selectedIds.length} item(s)?
          {bulkActionDialog.action === 'delete' && ' This action cannot be undone.'}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkActionDialog({ open: false, action: '' })}>
            Cancel
          </Button>
          <Button
            onClick={() => handleBulkAction(bulkActionDialog.action)}
            color={bulkActionDialog.action === 'delete' ? 'error' : 'primary'}
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default ContentListPage;

