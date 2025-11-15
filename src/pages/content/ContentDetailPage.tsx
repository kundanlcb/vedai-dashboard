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
  fetchContentById,
  publishContent,
  archiveContent,
  deleteContent,
} from '@store/slices/contentSlice';
import {
  selectCurrentContent,
  selectContentLoading,
  selectContentError,
} from '@store/selectors/contentSelectors';
import { useNotification } from '@hooks/useNotification';

export const ContentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { showSuccess, showError } = useNotification();

  const content = useSelector(selectCurrentContent);
  const loading = useSelector(selectContentLoading);
  const error = useSelector(selectContentError);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchContentById(id));
    }
  }, [dispatch, id]);

  const handlePublish = async () => {
    if (!id) return;
    try {
      await dispatch(publishContent(id)).unwrap();
      showSuccess('Content published successfully');
    } catch {
      showError('Failed to publish content');
    }
  };

  const handleArchive = async () => {
    if (!id) return;
    try {
      await dispatch(archiveContent(id)).unwrap();
      showSuccess('Content archived successfully');
    } catch {
      showError('Failed to archive content');
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await dispatch(deleteContent(id)).unwrap();
      showSuccess('Content deleted successfully');
      navigate('/content');
    } catch {
      showError('Failed to delete content');
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

  if (!content) {
    return (
      <AdminLayout>
        <Typography color="textSecondary">Content not found</Typography>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">{content.title}</Typography>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/content/${id}/edit`)}
            >
              Edit
            </Button>
            {content.status !== 'published' && (
              <Button
                variant="outlined"
                color="success"
                startIcon={<PublishIcon />}
                onClick={handlePublish}
              >
                Publish
              </Button>
            )}
            {content.status !== 'archived' && (
              <Button
                variant="outlined"
                color="warning"
                startIcon={<ArchiveIcon />}
                onClick={handleArchive}
              >
                Archive
              </Button>
            )}
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete
            </Button>
          </Stack>
        </Box>

        {/* Basic Info */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Basic Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    File Name
                  </Typography>
                  <Typography variant="body2">{content.fileName}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    File Type
                  </Typography>
                  <Typography variant="body2">{content.fileType}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    File Size
                  </Typography>
                  <Typography variant="body2">{content.fileSize}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Status
                  </Typography>
                  <Chip
                    label={content.status}
                    color={content.status === 'published' ? 'success' : 'default'}
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Organization
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Class
                  </Typography>
                  <Typography variant="body2">{content.class}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Subject
                  </Typography>
                  <Typography variant="body2">{content.subject}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Chapter
                  </Typography>
                  <Typography variant="body2">{content.chapter}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Topic
                  </Typography>
                  <Typography variant="body2">{content.topic || 'N/A'}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Description */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Description
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {content.description || 'No description provided'}
            </Typography>
          </CardContent>
        </Card>

        {/* Metadata */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Metadata
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Upload Date
                </Typography>
                <Typography variant="body2">
                  {new Date(content.uploadDate).toLocaleDateString()}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Last Updated
                </Typography>
                <Typography variant="body2">
                  {new Date(content.lastUpdated).toLocaleDateString()}
                </Typography>
              </Box>
              {content.publishDate && (
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Published Date
                  </Typography>
                  <Typography variant="body2">
                    {new Date(content.publishDate).toLocaleDateString()}
                  </Typography>
                </Box>
              )}
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Uploaded By
                </Typography>
                <Typography variant="body2">{content.uploadedBy}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Download Button */}
        {/* Note: ContentFile type doesn't have a url/download property */}
        {/* Download functionality would need to be implemented with file ID */}
      </Box>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this content? This action cannot be undone.
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

export default ContentDetailPage;

