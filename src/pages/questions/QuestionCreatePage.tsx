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
  Paper,
  CircularProgress,
} from '@mui/material';
import AdminLayout from '@layouts/AdminLayout';
import questionService from '@services/question.service';
import { useNotification } from '@hooks/useNotification';
import type { QuestionOption } from '../../types/question.types';

interface CreateFormData {
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

export const QuestionCreatePage = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const { control, handleSubmit, watch } = useForm<CreateFormData>({
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
  const [options, setOptions] = useState<QuestionOption[]>([
    { id: 'a', text: '', isCorrect: true },
    { id: 'b', text: '', isCorrect: false },
    { id: 'c', text: '', isCorrect: false },
    { id: 'd', text: '', isCorrect: false },
  ]);
  const [submitting, setSubmitting] = useState(false);

  const questionType = watch('type');
  const selectedSubject = watch('subject');

  useEffect(() => {
    const init = async () => {
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
    };
    init();
  }, [showError]);

  useEffect(() => {
    if (selectedSubject) {
      const init = async () => {
        try {
          const chaptersList = await questionService.getChapters(selectedSubject);
          setChapters(chaptersList);
        } catch {
          showError('Failed to load chapters');
        }
      };
      init();
    }
  }, [selectedSubject, showError]);

  const handleOptionChange = (id: string, field: 'text' | 'isCorrect', value: unknown) => {
    setOptions((prev) =>
      prev.map((opt) => {
        if (opt.id === id) {
          if (field === 'isCorrect') {
            return { ...opt, [field]: value as boolean };
          }
          return { ...opt, [field]: String(value) };
        }
        if (field === 'isCorrect' && (value as boolean)) {
          return { ...opt, isCorrect: false };
        }
        return opt;
      })
    );
  };

  const onSubmit = async (data: CreateFormData) => {
    if (questionType === 'mcq' && !options.some((o) => o.isCorrect)) {
      showError('Please select a correct option');
      return;
    }

    setSubmitting(true);
    try {
      await questionService.createQuestion({
        text: data.text,
        explanation: data.explanation,
        type: data.type as 'mcq' | 'true_false' | 'short_answer' | 'essay',
        marks: parseInt(data.marks),
        class: data.class,
        subject: data.subject,
        chapter: data.chapter,
        topic: data.topic,
        difficultyLevel: data.difficultyLevel as 'easy' | 'medium' | 'hard',
        bloomsLevel: data.bloomsLevel as 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create',
        learningOutcomes: [],
        options: questionType === 'mcq' ? options : [],
        tags: data.tags ? data.tags.split(',').map((t) => t.trim()) : [],
        keywords: [],
      });
      showSuccess('Question created successfully!');
      navigate('/questions');
    } catch {
      showError('Failed to create question');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Create Question
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Question Details */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Question Details
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Controller
                    name="text"
                    control={control}
                    rules={{ required: 'Question text is required' }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        multiline
                        rows={3}
                        label="Question Text"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                  <Controller
                    name="explanation"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        multiline
                        rows={3}
                        label="Explanation"
                      />
                    )}
                  />
                </Box>
              </CardContent>
            </Card>

            {/* Question Configuration */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Configuration
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        label="Question Type"
                        size="small"
                      >
                        <MenuItem value="mcq">Multiple Choice</MenuItem>
                        <MenuItem value="true_false">True/False</MenuItem>
                        <MenuItem value="short_answer">Short Answer</MenuItem>
                        <MenuItem value="essay">Essay</MenuItem>
                      </TextField>
                    )}
                  />
                  <Controller
                    name="marks"
                    control={control}
                    rules={{ required: 'Marks are required' }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        type="number"
                        label="Marks"
                        size="small"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                  <Controller
                    name="difficultyLevel"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        label="Difficulty"
                        size="small"
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
                        select
                        label="Bloom's Level"
                        size="small"
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
                  <Controller
                    name="topic"
                    control={control}
                    render={({ field }) => <TextField {...field} label="Topic" size="small" />}
                  />
                </Box>
              </CardContent>
            </Card>

            {/* MCQ Options */}
            {questionType === 'mcq' && (
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Options
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {options.map((option) => (
                      <Paper key={option.id} sx={{ p: 2, backgroundColor: '#f9f9f9' }}>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                          <Box sx={{ flex: 1 }}>
                            <TextField
                              fullWidth
                              label={`Option ${option.id.toUpperCase()}`}
                              value={option.text}
                              onChange={(e) => handleOptionChange(option.id, 'text', e.target.value)}
                              multiline
                              rows={2}
                              size="small"
                            />
                          </Box>
                          <Box sx={{ pt: 1 }}>
                            <input
                              type="radio"
                              name="correct"
                              checked={option.isCorrect}
                              onChange={(e) => handleOptionChange(option.id, 'isCorrect', e.target.checked)}
                              style={{ cursor: 'pointer' }}
                            />
                          </Box>
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <Box>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? <CircularProgress size={24} /> : 'Create Question'}
                </Button>
                <Button variant="outlined" onClick={() => navigate('/questions')}>
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

export default QuestionCreatePage;

