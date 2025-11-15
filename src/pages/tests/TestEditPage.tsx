import { useEffect, useState, useCallback } from 'react';
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
  FormControlLabel,
  Switch,
  Divider,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AdminLayout from '@layouts/AdminLayout';
import testService from '@services/test.service';
import { useNotification } from '@hooks/useNotification';
import { fetchTestById } from '@store/slices/testSlice';
import { selectCurrentTest, selectTestLoading } from '@store/selectors/testSelectors';
import type { AppDispatch } from '@store/store';

interface EditFormData {
  name: string;
  description: string;
  class: string;
  subject: string;
  chapter: string;
  totalMarks: string;
  duration: string;
  passingPercentage: string;
  correctAnswerMarks: string;
  negativeMarkValue: string;
  showAnswersAfter: boolean;
  showScoreAfter: boolean;
  allowReview: boolean;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  negativeMarking: boolean;
}

export const TestEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { showSuccess, showError } = useNotification();

  const test = useSelector(selectCurrentTest);
  const loading = useSelector(selectTestLoading);

  const { control, handleSubmit, reset, watch } = useForm<EditFormData>({
    defaultValues: {
      name: '',
      description: '',
      class: '',
      subject: '',
      chapter: '',
      totalMarks: '',
      duration: '',
      passingPercentage: '',
      correctAnswerMarks: '',
      negativeMarkValue: '',
      showAnswersAfter: false,
      showScoreAfter: false,
      allowReview: false,
      shuffleQuestions: false,
      shuffleOptions: false,
      negativeMarking: false,
    },
  });

  const [subjects, setSubjects] = useState<string[]>([]);
  const [chapters, setChapters] = useState<string[]>([]);
  const [classes, setClasses] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const selectedSubject = watch('subject');
  const negativeMarking = watch('negativeMarking');

  // Load test data
  useEffect(() => {
    if (id) {
      dispatch(fetchTestById(id));
    }
  }, [dispatch, id]);

  // Reset form when test loads
  useEffect(() => {
    if (test) {
      reset({
        name: test.name || '',
        description: test.description || '',
        class: test.class || '',
        subject: test.subject || '',
        chapter: test.chapter || '',
        totalMarks: String(test.totalMarks) || '',
        duration: String(test.duration) || '',
        passingPercentage: String(test.passingPercentage) || '',
        correctAnswerMarks: String(test.correctAnswerMarks) || '',
        negativeMarkValue: String(test.negativeMarkValue) || '',
        showAnswersAfter: test.showAnswersAfter || false,
        showScoreAfter: test.showScoreAfter || false,
        allowReview: test.allowReview || false,
        shuffleQuestions: test.shuffleQuestions || false,
        shuffleOptions: test.shuffleOptions || false,
        negativeMarking: test.negativeMarking || false,
      });
      loadChapters(test.subject);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [test, reset]);

  const loadMetadata = useCallback(async () => {
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
  }, [showError]);

  const loadChapters = useCallback(async (subject: string) => {
    if (!subject) return;
    try {
      const chaptersList = await testService.getChapters(subject);
      setChapters(chaptersList);
    } catch {
      showError('Failed to load chapters');
    }
  }, [showError]);

  useEffect(() => {
    loadMetadata();
  }, [loadMetadata]);

  useEffect(() => {
    if (selectedSubject) {
      loadChapters(selectedSubject);
    }
  }, [selectedSubject, loadChapters]);

  const onSubmit = async (data: EditFormData) => {
    if (!id) return;
    setSubmitting(true);
    try {
      await testService.updateTest(id, {
        name: data.name,
        description: data.description,
        class: data.class,
        subject: data.subject,
        chapter: data.chapter,
        totalMarks: parseInt(data.totalMarks, 10),
        duration: parseInt(data.duration, 10),
        passingPercentage: parseInt(data.passingPercentage, 10),
        correctAnswerMarks: parseInt(data.correctAnswerMarks, 10),
        negativeMarkValue: parseInt(data.negativeMarkValue, 10),
        showAnswersAfter: data.showAnswersAfter,
        showScoreAfter: data.showScoreAfter,
        allowReview: data.allowReview,
        shuffleQuestions: data.shuffleQuestions,
        shuffleOptions: data.shuffleOptions,
        negativeMarking: data.negativeMarking,
        questions: test?.questions || [],
        visibleToRoles: ['teacher', 'student'],
        passwordProtected: false,
      });
      showSuccess('Test updated successfully');
      navigate(`/tests/${id}`);
      } catch {
        showError('Failed to update test');
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

  if (!test) {
    return (
      <AdminLayout>
        <Alert severity="error">Test not found</Alert>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Card sx={{ maxWidth: 900, mx: 'auto' }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Edit Test
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Controller
              name="name"
              control={control}
              rules={{ required: 'Test name is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Test Name"
                  fullWidth
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                />
              )}
            />

            <Controller
              name="class"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Class"
                  select
                  fullWidth
                >
                  {classes.map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Controller
                name="subject"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Subject"
                    select
                    sx={{ flex: 1 }}
                  >
                    {subjects.map((s) => (
                      <MenuItem key={s} value={s}>
                        {s}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <Controller
                name="chapter"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Chapter"
                    select
                    sx={{ flex: 1 }}
                  >
                    {chapters.map((ch) => (
                      <MenuItem key={ch} value={ch}>
                        {ch}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Stack>

            <Divider sx={{ my: 2 }} />
            <Typography variant="h6">Test Configuration</Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Controller
                name="totalMarks"
                control={control}
                rules={{ required: 'Total marks is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Total Marks"
                    type="number"
                    sx={{ flex: 1 }}
                  />
                )}
              />
              <Controller
                name="duration"
                control={control}
                rules={{ required: 'Duration is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Duration (minutes)"
                    type="number"
                    sx={{ flex: 1 }}
                  />
                )}
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Controller
                name="passingPercentage"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Passing Percentage"
                    type="number"
                    sx={{ flex: 1 }}
                  />
                )}
              />
              <Controller
                name="correctAnswerMarks"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Correct Answer Marks"
                    type="number"
                    sx={{ flex: 1 }}
                  />
                )}
              />
            </Stack>

            {/* Negative Marking */}
            <FormControlLabel
              control={
                <Controller
                  name="negativeMarking"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      {...field}
                      checked={field.value}
                    />
                  )}
                />
              }
              label="Enable Negative Marking"
            />

            {negativeMarking && (
              <Controller
                name="negativeMarkValue"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Negative Marks per Wrong Answer"
                    type="number"
                  />
                )}
              />
            )}

            {/* Display Options */}
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6">Display Options</Typography>

            <FormControlLabel
              control={
                <Controller
                  name="showAnswersAfter"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      {...field}
                      checked={field.value}
                    />
                  )}
                />
              }
              label="Show Answers After Test"
            />

            <FormControlLabel
              control={
                <Controller
                  name="showScoreAfter"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      {...field}
                      checked={field.value}
                    />
                  )}
                />
              }
              label="Show Score After Test"
            />

            <FormControlLabel
              control={
                <Controller
                  name="allowReview"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      {...field}
                      checked={field.value}
                    />
                  )}
                />
              }
              label="Allow Review"
            />

            <FormControlLabel
              control={
                <Controller
                  name="shuffleQuestions"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      {...field}
                      checked={field.value}
                    />
                  )}
                />
              }
              label="Shuffle Questions"
            />

            <FormControlLabel
              control={
                <Controller
                  name="shuffleOptions"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      {...field}
                      checked={field.value}
                    />
                  )}
                />
              }
              label="Shuffle Options"
            />

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
                onClick={() => navigate(`/tests/${id}`)}
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

export default TestEditPage;

