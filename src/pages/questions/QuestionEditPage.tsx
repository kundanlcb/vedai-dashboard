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
  Checkbox,
  Divider,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AdminLayout from '@layouts/AdminLayout';
import questionService from '@services/question.service';
import { useNotification } from '@hooks/useNotification';
import { fetchQuestionById } from '@store/slices/questionSlice';
import { selectCurrentQuestion, selectQuestionLoading } from '@store/selectors/questionSelectors';
import type { AppDispatch } from '@store/store';
import type { QuestionOption, QuestionType, DifficultyLevel, BloomsLevel } from 'src/types/question.types';

interface EditFormData {
  text: string;
  explanation: string;
  type: string;
  marks: string;
  class: string;
  subject: string;
  chapter: string;
  topic: string;
  difficultyLevel: string;
  bloomsLevel: string;
  tags: string;
}

export const QuestionEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { showSuccess, showError } = useNotification();

  const question = useSelector(selectCurrentQuestion);
  const loading = useSelector(selectQuestionLoading);

  const { control, handleSubmit, reset, watch } = useForm<EditFormData>({
    defaultValues: {
      text: '',
      explanation: '',
      type: 'mcq',
      marks: '',
      class: '',
      subject: '',
      chapter: '',
      topic: '',
      difficultyLevel: 'medium',
      bloomsLevel: 'understand',
      tags: '',
    },
  });

  const [subjects, setSubjects] = useState<string[]>([]);
  const [chapters, setChapters] = useState<string[]>([]);
  const [classes, setClasses] = useState<string[]>([]);
  const [options, setOptions] = useState<QuestionOption[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const questionType = watch('type');
  const selectedSubject = watch('subject');

  // Load question data
  useEffect(() => {
    if (id) {
      dispatch(fetchQuestionById(id));
    }
  }, [dispatch, id]);

  // Reset form when question loads
  useEffect(() => {
    if (question) {
      reset({
        text: question.text || '',
        explanation: question.explanation || '',
        type: question.type || 'mcq',
        marks: String(question.marks) || '',
        class: question.class || '',
        subject: question.subject || '',
        chapter: question.chapter || '',
        topic: question.topic || '',
        difficultyLevel: question.difficultyLevel || 'medium',
        bloomsLevel: question.bloomsLevel || 'understand',
        tags: question.tags?.join(', ') || '',
      });
      setOptions(question.options || []);
      loadChapters(question.subject);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question, reset]);

  const loadMetadata = useCallback(async () => {
    try {
      const [subjectsList, classesList] = await Promise.all([
        questionService.getSubjects(),
        questionService.getClasses(),
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
      const chaptersList = await questionService.getChapters(subject);
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

  const handleOptionChange = (optionId: string, field: 'text' | 'isCorrect', value: unknown) => {
    setOptions((prev) =>
      prev.map((opt) => {
        if (opt.id === optionId) {
          if (field === 'isCorrect') {
            return { ...opt, isCorrect: value as boolean };
          }
          return { ...opt, text: value as string };
        }
        return opt;
      })
    );
  };

  const onSubmit = async (data: EditFormData) => {
    if (!id) return;

    // Validate at least one option is correct
    if (data.type === 'mcq' && !options.some((opt) => opt.isCorrect)) {
      showError('At least one option must be marked as correct');
      return;
    }

    setSubmitting(true);
    try {
      await questionService.updateQuestion(id, {
        text: data.text,
        explanation: data.explanation,
        type: data.type as QuestionType,
        marks: parseInt(data.marks, 10),
        class: data.class,
        subject: data.subject,
        chapter: data.chapter,
        topic: data.topic,
        difficultyLevel: data.difficultyLevel as DifficultyLevel,
        bloomsLevel: data.bloomsLevel as BloomsLevel,
        options: data.type === 'mcq' ? options : [],
        tags: data.tags.split(',').map((t) => t.trim()).filter(Boolean),
        learningOutcomes: [],
        keywords: [],
      });
      showSuccess('Question updated successfully');
      navigate(`/questions/${id}`);
      } catch {
        showError('Failed to update question');
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

  if (!question) {
    return (
      <AdminLayout>
        <Alert severity="error">Question not found</Alert>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Card sx={{ maxWidth: 900, mx: 'auto' }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Edit Question
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Controller
              name="text"
              control={control}
              rules={{ required: 'Question text is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Question Text"
                  fullWidth
                  multiline
                  rows={4}
                />
              )}
            />

            <Controller
              name="explanation"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Explanation"
                  fullWidth
                  multiline
                  rows={3}
                />
              )}
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Type"
                    select
                    sx={{ flex: 1 }}
                  >
                    <MenuItem value="mcq">MCQ</MenuItem>
                    <MenuItem value="true_false">True/False</MenuItem>
                    <MenuItem value="short_answer">Short Answer</MenuItem>
                    <MenuItem value="essay">Essay</MenuItem>
                  </TextField>
                )}
              />
              <Controller
                name="marks"
                control={control}
                rules={{ required: 'Marks is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Marks"
                    type="number"
                    sx={{ flex: 1 }}
                  />
                )}
              />
            </Stack>

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

            <Controller
              name="topic"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Topic (Optional)"
                  fullWidth
                />
              )}
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Controller
                name="difficultyLevel"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Difficulty Level"
                    select
                    sx={{ flex: 1 }}
                  >
                    <MenuItem value="easy">Easy</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="hard">Hard</MenuItem>
                  </TextField>
                )}
              />
              <Controller
                name="bloomsLevel"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Bloom's Level"
                    select
                    sx={{ flex: 1 }}
                  >
                    <MenuItem value="remember">Remember</MenuItem>
                    <MenuItem value="understand">Understand</MenuItem>
                    <MenuItem value="apply">Apply</MenuItem>
                    <MenuItem value="analyze">Analyze</MenuItem>
                    <MenuItem value="evaluate">Evaluate</MenuItem>
                    <MenuItem value="create">Create</MenuItem>
                  </TextField>
                )}
              />
            </Stack>

            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Tags (comma-separated)"
                  fullWidth
                  multiline
                  rows={2}
                />
              )}
            />

            {/* MCQ Options */}
            {questionType === 'mcq' && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6">Options</Typography>
                {options.map((option, idx) => (
                  <Box key={option.id} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                    <TextField
                      label={`Option ${idx + 1}`}
                      value={option.text}
                      onChange={(e) => handleOptionChange(option.id, 'text', e.target.value)}
                      fullWidth
                      multiline
                      rows={2}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={option.isCorrect}
                          onChange={(e) => handleOptionChange(option.id, 'isCorrect', e.target.checked)}
                        />
                      }
                      label="Correct"
                      sx={{ whiteSpace: 'nowrap' }}
                    />
                  </Box>
                ))}
              </>
            )}

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
                onClick={() => navigate(`/questions/${id}`)}
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

export default QuestionEditPage;

