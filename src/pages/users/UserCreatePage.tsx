import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
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
  LinearProgress,
  Alert,
} from '@mui/material';
import AdminLayout from '@layouts/AdminLayout';
import userService from '@services/user.service';
import { useNotification } from '@hooks/useNotification';

interface UserFormData {
  email: string;
  fullName: string;
  password: string;
  confirmPassword: string;
  role: string;
  phone: string;
}

const validatePasswordStrength = (password: string): { valid: boolean; strength: number } => {
  let strength = 0;
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[0-9]/.test(password),
    /[!@#$%^&*]/.test(password),
  ];

  checks.forEach((check) => {
    if (check) strength += 20;
  });

  return { valid: strength >= 60, strength };
};

export const UserCreatePage = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const { control, handleSubmit, watch } = useForm<UserFormData>({
    defaultValues: {
      email: '',
      fullName: '',
      password: '',
      confirmPassword: '',
      role: '',
      phone: '',
    },
  });

  const [submitting, setSubmitting] = useState(false);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [classes, setClasses] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);

  const password = watch('password');
  const passwordStrength = validatePasswordStrength(password);

  useEffect(() => {
    const init = async () => {
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
    };
    init();
  }, [showError]);

  const onSubmit = async (data: UserFormData) => {
    if (!passwordStrength.valid) {
      showError('Password does not meet strength requirements');
      return;
    }

    if (data.password !== data.confirmPassword) {
      showError('Passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      await userService.createUser({
        email: data.email,
        fullName: data.fullName,
        password: data.password,
        role: data.role as 'admin' | 'teacher' | 'content_creator' | 'question_creator',
        phone: data.phone,
        assignedSubjects: selectedSubjects,
        assignedClasses: selectedClasses,
      });
      showSuccess('User created successfully!');
      navigate('/users');
    } catch {
      showError('Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <Box sx={{ maxWidth: 900, mx: 'auto' }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Create User
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Basic Information */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Basic Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: 'Email is required',
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email format' },
                    }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Email"
                        type="email"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                  <Controller
                    name="fullName"
                    control={control}
                    rules={{ required: 'Full name is required' }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Full Name"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Phone (Optional)"
                      />
                    )}
                  />
                </Box>
              </CardContent>
            </Card>

            {/* Password */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Password
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Controller
                    name="password"
                    control={control}
                    rules={{ required: 'Password is required' }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="password"
                        label="Password"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                  {password && (
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="caption">Password Strength</Typography>
                        <Typography variant="caption" sx={{ color: passwordStrength.valid ? 'success.main' : 'warning.main' }}>
                          {passwordStrength.strength}%
                        </Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={passwordStrength.strength} />
                    </Box>
                  )}
                  <Alert severity="info" sx={{ mt: 1 }}>
                    Password must be at least 8 characters with uppercase, lowercase, number, and special character.
                  </Alert>
                  <Controller
                    name="confirmPassword"
                    control={control}
                    rules={{ required: 'Please confirm password' }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="password"
                        label="Confirm Password"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                </Box>
              </CardContent>
            </Card>

            {/* Role & Organization */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Role & Organization
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
                  <Controller
                    name="role"
                    control={control}
                    rules={{ required: 'Role is required' }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        select
                        label="Role"
                        size="small"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      >
                        <MenuItem value="">Select Role</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="teacher">Teacher</MenuItem>
                        <MenuItem value="content_creator">Content Creator</MenuItem>
                        <MenuItem value="question_creator">Question Creator</MenuItem>
                      </TextField>
                    )}
                  />
                </Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Assigned Subjects
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '2fr' }, gap: 1, mb: 2 }}>
                  {subjects.map((subject) => (
                    <Button
                      key={subject}
                      variant={selectedSubjects.includes(subject) ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => {
                        setSelectedSubjects((prev) =>
                          prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
                        );
                      }}
                    >
                      {subject}
                    </Button>
                  ))}
                </Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Assigned Classes
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '2fr' }, gap: 1 }}>
                  {classes.map((cls) => (
                    <Button
                      key={cls}
                      variant={selectedClasses.includes(cls) ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => {
                        setSelectedClasses((prev) =>
                          prev.includes(cls) ? prev.filter((c) => c !== cls) : [...prev, cls]
                        );
                      }}
                    >
                      {cls}
                    </Button>
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Box>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? <CircularProgress size={24} /> : 'Create User'}
                </Button>
                <Button variant="outlined" onClick={() => navigate('/users')}>
                  Cancel
                </Button>
              </Stack>
            </Box>
          </Box>
        </form>
      </Box>
    </AdminLayout>
  );
};

export default UserCreatePage;

