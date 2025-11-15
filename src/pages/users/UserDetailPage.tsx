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
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AdminLayout from '@layouts/AdminLayout';
import type { AppDispatch } from '@store/store';
import {
  fetchUserById,
  deactivateUser,
  activateUser,
  deleteUser,
} from '@store/slices/userSlice';
import {
  selectCurrentUser,
  selectUserLoading,
  selectUserError,
} from '@store/selectors/userSelectors';
import { useNotification } from '@hooks/useNotification';

export const UserDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { showSuccess, showError } = useNotification();

  const user = useSelector(selectCurrentUser);
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchUserById(id));
    }
  }, [dispatch, id]);

  const handleDeactivate = async () => {
    if (!id) return;
    try {
      await dispatch(deactivateUser(id)).unwrap();
      showSuccess('User deactivated successfully');
    } catch {
      showError('Failed to deactivate user');
    }
  };

  const handleActivate = async () => {
    if (!id) return;
    try {
      await dispatch(activateUser(id)).unwrap();
      showSuccess('User activated successfully');
    } catch {
      showError('Failed to activate user');
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await dispatch(deleteUser(id)).unwrap();
      showSuccess('User deleted successfully');
      navigate('/users');
    } catch {
      showError('Failed to delete user');
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

  if (!user) {
    return (
      <AdminLayout>
        <Typography color="textSecondary">User not found</Typography>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ mb: 1 }}>
              {user.fullName}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              {user.email}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label={user.role.replace(/_/g, ' ')}
                size="small"
                variant="outlined"
              />
              <Chip
                label={user.status}
                size="small"
                color={user.status === 'active' ? 'success' : 'error'}
              />
            </Box>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/users/${id}/edit`)}
            >
              Edit
            </Button>
            {user.status === 'active' ? (
              <Button
                variant="outlined"
                size="small"
                color="warning"
                startIcon={<BlockIcon />}
                onClick={handleDeactivate}
              >
                Deactivate
              </Button>
            ) : (
              <Button
                variant="outlined"
                size="small"
                color="success"
                startIcon={<CheckCircleIcon />}
                onClick={handleActivate}
              >
                Activate
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

        {/* Personal Information */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Personal Information
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Full Name
                </Typography>
                <Typography variant="body2">{user.fullName}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Email
                </Typography>
                <Typography variant="body2">{user.email}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Phone
                </Typography>
                <Typography variant="body2">{user.phone || 'Not provided'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Status
                </Typography>
                <Chip
                  label={user.status}
                  color={user.status === 'active' ? 'success' : 'error'}
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Role & Permissions */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Role & Permissions
            </Typography>
            <Box>
              <Typography variant="caption" color="textSecondary">
                Role
              </Typography>
              <Chip
                label={user.role.replace(/_/g, ' ')}
                variant="outlined"
                size="small"
                sx={{ mt: 0.5 }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Assigned Resources */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Assigned Subjects & Classes
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <Box>
                <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 1 }}>
                  Subjects
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {user.assignedSubjects && user.assignedSubjects.length > 0 ? (
                    user.assignedSubjects.map((subject) => (
                      <Chip key={subject} label={subject} size="small" />
                    ))
                  ) : (
                    <Typography variant="caption" color="textSecondary">
                      No subjects assigned
                    </Typography>
                  )}
                </Box>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 1 }}>
                  Classes
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {user.assignedClasses && user.assignedClasses.length > 0 ? (
                    user.assignedClasses.map((cls) => (
                      <Chip key={cls} label={cls} size="small" />
                    ))
                  ) : (
                    <Typography variant="caption" color="textSecondary">
                      No classes assigned
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Activity Information */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Activity Information
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Created Date
                </Typography>
                <Typography variant="body2">
                  {new Date(user.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Last Updated
                </Typography>
                <Typography variant="body2">
                  {new Date(user.updatedAt).toLocaleDateString()}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Last Login
                </Typography>
                <Typography variant="body2">
                  {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Created By
                </Typography>
                <Typography variant="body2">{user.createdBy}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this user? This action cannot be undone.
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

export default UserDetailPage;

