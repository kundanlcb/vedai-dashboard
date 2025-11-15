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
import UserTable from '@components/tables/UserTable';
import type { AppDispatch } from '@store/store';
import {
  fetchUsers,
  setFilters,
  setPage,
  setLimit,
  toggleSelectId,
  selectAllIds,
  clearSelectedIds,
  deactivateUser,
  activateUser,
  deleteUser,
  fetchUserStats,
} from '@store/slices/userSlice';
import {
  selectUserItems,
  selectUserLoading,
  selectUserError,
  selectUserPagination,
  selectUserFilters,
  selectUserStats,
  selectSelectedUserIds,
} from '@store/selectors/userSelectors';
import { useNotification } from '@hooks/useNotification';

export const UserListPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  const items = useSelector(selectUserItems);
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);
  const pagination = useSelector(selectUserPagination);
  const filters = useSelector(selectUserFilters);
  const stats = useSelector(selectUserStats);
  const selectedIds = useSelector(selectSelectedUserIds);

  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    dispatch(fetchUsers({ page: 1, limit: 10, filters }));
    dispatch(fetchUserStats());
  }, [dispatch, filters]);

  const handleApplyFilters = () => {
    const newFilters: Record<string, unknown> = {};
    if (roleFilter) newFilters.role = roleFilter;
    if (statusFilter) newFilters.status = statusFilter;

    dispatch(setFilters(newFilters));
    dispatch(setPage(1));
    dispatch(fetchUsers({ page: 1, limit: pagination.limit, filters: newFilters }));
  };

  return (
    <AdminLayout>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Users</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/users/create')}>
            Create User
          </Button>
        </Box>

        {/* Stats */}
        {stats && (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Users
                </Typography>
                <Typography variant="h5">{stats.total}</Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Active
                </Typography>
                <Typography variant="h5">{stats.active}</Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Inactive
                </Typography>
                <Typography variant="h5">{stats.inactive}</Typography>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Pending
                </Typography>
                <Typography variant="h5">{stats.pending}</Typography>
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
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
              <TextField
                select
                label="Role"
                size="small"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <MenuItem value="">All Roles</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="teacher">Teacher</MenuItem>
                <MenuItem value="content_creator">Content Creator</MenuItem>
                <MenuItem value="question_creator">Question Creator</MenuItem>
              </TextField>
              <TextField
                select
                label="Status"
                size="small"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
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
                <Typography>{selectedIds.length} user(s) selected</Typography>
                <Stack direction="row" spacing={1}>
                  <Button size="small">Deactivate</Button>
                  <Button size="small">Activate</Button>
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
        <UserTable
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
          onView={(id) => navigate(`/users/${id}`)}
          onEdit={(id) => navigate(`/users/${id}/edit`)}
          onDeactivate={async (id) => {
            try {
              await dispatch(deactivateUser(id)).unwrap();
              showSuccess('User deactivated');
            } catch {
              showError('Failed to deactivate');
            }
          }}
          onActivate={async (id) => {
            try {
              await dispatch(activateUser(id)).unwrap();
              showSuccess('User activated');
            } catch {
              showError('Failed to activate');
            }
          }}
          onDelete={async (id) => {
            try {
              await dispatch(deleteUser(id)).unwrap();
              showSuccess('User deleted');
              dispatch(fetchUsers({ page: pagination.page, limit: pagination.limit, filters }));
            } catch {
              showError('Failed to delete');
            }
          }}
          onPageChange={(page) => {
            dispatch(setPage(page));
            dispatch(fetchUsers({ page, limit: pagination.limit, filters }));
          }}
          onLimitChange={(limit) => {
            dispatch(setLimit(limit));
            dispatch(fetchUsers({ page: 1, limit, filters }));
          }}
        />
      </Box>
    </AdminLayout>
  );
};

export default UserListPage;

