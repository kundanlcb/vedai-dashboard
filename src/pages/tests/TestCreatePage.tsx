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
  Switch,
  FormControlLabel,
  CircularProgress,
  Divider,
} from '@mui/material';
import AdminLayout from '@layouts/AdminLayout';
import testService from '@services/test.service';
import { useNotification } from '@hooks/useNotification';

interface TestFormData {
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

export const TestCreatePage = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const { control, handleSubmit, watch } = useForm<TestFormData>({
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
    if (selectedSubject) {
      const init = async () => {
        try {
          const chaptersList = await testService.getChapters(selectedSubject);
          setChapters(chaptersList);
        } catch {
          showError('Failed to load chapters');
        }
      };
      init();
    }
  }, [selectedSubject, showError]);

  const onSubmit = async (data: TestFormData) => {
    setSubmitting(true);
    try {
      await testService.createTest({
        name: data.name,
        description: data.description,
        class: data.class,
        subject: data.subject,
        chapter: data.chapter,
        totalMarks: parseInt(data.totalMarks),
        duration: parseInt(data.duration),
        passingPercentage: parseInt(data.passingPercentage),
        correctAnswerMarks: parseInt(data.correctAnswerMarks),
        negativeMarkValue: parseInt(data.negativeMarkValue),
        showAnswersAfter: data.showAnswersAfter,
        showScoreAfter: data.showScoreAfter,
        allowReview: data.allowReview,
        shuffleQuestions: data.shuffleQuestions,
        shuffleOptions: data.shuffleOptions,
        negativeMarking: data.negativeMarking,
        questions: [],
        visibleToRoles: [],
        passwordProtected: false,
      });
      showSuccess('Test created successfully!');
      navigate('/tests');
    } catch {
      showError('Failed to create test');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Create Test
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
                    name="name"
                    control={control}
                    rules={{ required: 'Test name is required' }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Test Name"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        multiline
                        rows={3}
                        label="Description"
                      />
                    )}
                  />
                </Box>
              </CardContent>
            </Card>

            {/* Organization */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Organization
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  <Controller
                    name="class"
                    control={control}
                    rules={{ required: 'Class is required' }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        select
                        label="Class"
                        size="small"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      >
                        <MenuItem value="">Select Class</MenuItem>
                        {classes.map((c) => (
                          <MenuItem key={c} value={c}>
                            {c}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                  <Controller
                    name="subject"
                    control={control}
                    rules={{ required: 'Subject is required' }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        select
                        label="Subject"
                        size="small"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      >
                        <MenuItem value="">Select Subject</MenuItem>
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
                    rules={{ required: 'Chapter is required' }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        select
                        label="Chapter"
                        size="small"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        disabled={!selectedSubject}
                      >
                        <MenuItem value="">Select Chapter</MenuItem>
                        {chapters.map((c) => (
                          <MenuItem key={c} value={c}>
                            {c}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Box>
              </CardContent>
            </Card>

            {/* Configuration */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Configuration
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  <Controller
                    name="totalMarks"
                    control={control}
                    rules={{ required: 'Total marks are required' }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        type="number"
                        label="Total Marks"
                        size="small"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                  <Controller
                    name="duration"
                    control={control}
                    rules={{ required: 'Duration is required' }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        type="number"
                        label="Duration (minutes)"
                        size="small"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                  <Controller
                    name="passingPercentage"
                    control={control}
                    rules={{ required: 'Passing percentage is required' }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        type="number"
                        label="Passing Percentage"
                        size="small"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                  <Controller
                    name="correctAnswerMarks"
                    control={control}
                    rules={{ required: 'Marks per correct answer required' }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        type="number"
                        label="Marks per Correct Answer"
                        size="small"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                </Box>
              </CardContent>
            </Card>

            {/* Marking Scheme */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Marking Scheme
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                    <Controller
                      name="negativeMarking"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={<Switch {...field} checked={field.value} />}
                          label="Enable Negative Marking"
                        />
                      )}
                    />
                  </Box>
                  {watch('negativeMarking') && (
                    <Controller
                      name="negativeMarkValue"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="number"
                          label="Negative Marks per Wrong Answer"
                          size="small"
                        />
                      )}
                    />
                  )}
                </Box>
              </CardContent>
            </Card>

            {/* Test Settings */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Test Settings
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Controller
                    name="showAnswersAfter"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Switch {...field} checked={field.value} />}
                        label="Show Answers After Test"
                      />
                    )}
                  />
                  <Controller
                    name="showScoreAfter"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Switch {...field} checked={field.value} />}
                        label="Show Score After Submission"
                      />
                    )}
                  />
                  <Controller
                    name="allowReview"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Switch {...field} checked={field.value} />}
                        label="Allow Test Review"
                      />
                    )}
                  />
                  <Divider sx={{ my: 2 }} />
                  <Controller
                    name="shuffleQuestions"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Switch {...field} checked={field.value} />}
                        label="Shuffle Questions"
                      />
                    )}
                  />
                  <Controller
                    name="shuffleOptions"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Switch {...field} checked={field.value} />}
                        label="Shuffle Options"
                      />
                    )}
                  />
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
                  {submitting ? <CircularProgress size={24} /> : 'Create Test'}
                </Button>
                <Button variant="outlined" onClick={() => navigate('/tests')}>
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

export default TestCreatePage;

