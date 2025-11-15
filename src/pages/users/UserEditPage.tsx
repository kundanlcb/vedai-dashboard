import { useEffect, useState , useCallback} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Stack,
  Typography,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Chip,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AdminLayout from '@layouts/AdminLayout';
import userService from '@services/user.service';
import { useNotification } from '@hooks/useNotification';
import { fetchUserById } from '@store/slices/userSlice';
import { selectCurrentUser, selectUserLoading } from '@store/selectors/userSelectors';
import type { AppDispatch } from '@store/store';

interface EditFormData {
  email: string;
  fullName: string;
  role: string;
  phone: string;
}

export const UserEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { showSuccess, showError } = useNotification();

  const user = useSelector(selectCurrentUser);
  const loading = useSelector(selectUserLoading);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<EditFormData>({
    defaultValues: {
      email: '',
      fullName: '',
      role: '',
      phone: '',
    },
  });

  const [subjects, setSubjects] = useState<string[]>([]);
  const [classes, setClasses] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Load user data
  useEffect(() => {
    if (id) {
      dispatch(fetchUserById(id));
    }
  }, [dispatch, id]);

  // Reset form when user loads
  useEffect(() => {
    if (user) {
      reset({
        email: user.email || '',
        fullName: user.fullName || '',
        role: user.role || '',
        phone: user.phone || '',
      });
      setSelectedSubjects(user.assignedSubjects || []);
      setSelectedClasses(user.assignedClasses || []);
    }
  }, [user, reset]);

  const loadMetadata = useCallback(async () => {
    try {
      const [subjectsList, classesList] = await Promise.all([
        userService.getSubjects(),
        userService.getClasses(),
      ]);
      setSubjects(subjectsList);
      setClasses(classesList);
    } catch {
      showError('Failed to load metadata');
    }
  }, [showError]);

  useEffect(() => {
    loadMetadata();
  }, [loadMetadata]);

  const onSubmit = async (data: EditFormData) => {
    if (!id) return;
    setSubmitting(true);
    try {
      await userService.updateUser(id, {
        fullName: data.fullName,
        phone: data.phone,
        role: data.role as 'admin' | 'teacher' | 'content_creator' | 'question_creator',
        assignedSubjects: selectedSubjects,
        assignedClasses: selectedClasses,
      });
      showSuccess('User updated successfully');
      navigate(`/users/${id}`);
      } catch {
        showError('Failed to update user');
    } finally {
      setSubmitting(false);
    }
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

  if (!user) {
    return (
      <AdminLayout>
        <Alert severity="error">User not found</Alert>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Card sx={{ maxWidth: 800, mx: 'auto' }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Edit User
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  fullWidth
                  disabled
                  helperText="Email cannot be changed"
                  error={!!errors.email}
                />
              )}
            />

            <Controller
              name="fullName"
              control={control}
              rules={{ required: 'Full name is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Full Name"
                  fullWidth
                  error={!!errors.fullName}
                  helperText={errors.fullName?.message}
                />
              )}
            />

            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Phone"
                  fullWidth
                />
              )}
            />

            <Controller
              name="role"
              control={control}
              rules={{ required: 'Role is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Role"
                  select
                  fullWidth
                  error={!!errors.role}
                  helperText={errors.role?.message}
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="teacher">Teacher</MenuItem>
                  <MenuItem value="content_creator">Content Creator</MenuItem>
                  <MenuItem value="question_creator">Question Creator</MenuItem>
                </TextField>
              )}
            />

            {/* Subjects Selection */}
            <FormControl fullWidth>
              <InputLabel>Assigned Subjects</InputLabel>
              <Select
                multiple
                value={selectedSubjects}
                onChange={(e) => setSelectedSubjects(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
                input={<OutlinedInput label="Assigned Subjects" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {subjects.map((subject) => (
                  <MenuItem key={subject} value={subject}>
                    {subject}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Classes Selection */}
            <FormControl fullWidth>
              <InputLabel>Assigned Classes</InputLabel>
              <Select
                multiple
                value={selectedClasses}
                onChange={(e) => setSelectedClasses(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
                input={<OutlinedInput label="Assigned Classes" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {classes.map((cls) => (
                  <MenuItem key={cls} value={cls}>
                    {cls}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                disabled={submitting}
              >
                {submitting ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={() => navigate(`/users/${id}`)}
                disabled={submitting}
              >
                Cancel
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default UserEditPage;

