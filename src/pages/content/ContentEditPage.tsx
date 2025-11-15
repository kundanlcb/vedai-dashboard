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
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AdminLayout from '@layouts/AdminLayout';
import contentService from '@services/content.service';
import { useNotification } from '@hooks/useNotification';
import { fetchContentById } from '@store/slices/contentSlice';
import { selectCurrentContent, selectContentLoading } from '@store/selectors/contentSelectors';
import type { AppDispatch } from '@store/store';

interface EditFormData {
  title: string;
  description: string;
  class: string;
  subject: string;
  chapter: string;
  topic: string;
  tags: string;
  learningOutcomes: string;
}

export const ContentEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { showSuccess, showError } = useNotification();

  const content = useSelector(selectCurrentContent);
  const loading = useSelector(selectContentLoading);

  const { control, handleSubmit, reset, formState: { errors }, watch } = useForm<EditFormData>({
    defaultValues: {
      title: '',
      description: '',
      class: '',
      subject: '',
      chapter: '',
      topic: '',
      tags: '',
      learningOutcomes: '',
    },
  });

  const [subjects, setSubjects] = useState<string[]>([]);
  const [chapters, setChapters] = useState<string[]>([]);
  const [classes, setClasses] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const selectedSubject = watch('subject');

  // Load content data
  useEffect(() => {
    if (id) {
      dispatch(fetchContentById(id));
    }
  }, [dispatch, id]);

  // Reset form when content loads
  useEffect(() => {
    if (content) {
      reset({
        title: content.title || '',
        description: content.description || '',
        class: content.class || '',
        subject: content.subject || '',
        chapter: content.chapter || '',
        topic: content.topic || '',
        tags: content.tags?.join(', ') || '',
        learningOutcomes: content.learningOutcomes?.join(', ') || '',
      });
      loadChapters(content.subject);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, reset]);

  const loadMetadata = useCallback(async () => {
    try {
      const [subjectsList, classesList] = await Promise.all([
        contentService.getSubjects(),
        contentService.getClasses(),
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
      const chaptersList = await contentService.getChapters(subject);
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
      await contentService.updateContentMetadata(id, {
        title: data.title,
        description: data.description,
        class: data.class,
        subject: data.subject,
        chapter: data.chapter,
        topic: data.topic,
        tags: data.tags.split(',').map((t) => t.trim()).filter(Boolean),
        learningOutcomes: data.learningOutcomes.split(',').map((lo) => lo.trim()).filter(Boolean),
      });
      showSuccess('Content updated successfully');
      navigate(`/content/${id}`);
    } catch {
      showError('Failed to update content');
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

  if (!content) {
    return (
      <AdminLayout>
        <Alert severity="error">Content not found</Alert>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Card sx={{ maxWidth: 800, mx: 'auto' }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Edit Content
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Controller
              name="title"
              control={control}
              rules={{ required: 'Title is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Title"
                  fullWidth
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              rules={{ required: 'Description is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              )}
            />

            <Controller
              name="class"
              control={control}
              rules={{ required: 'Class is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Class"
                  select
                  fullWidth
                  error={!!errors.class}
                  helperText={errors.class?.message}
                >
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
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Subject"
                  select
                  fullWidth
                  error={!!errors.subject}
                  helperText={errors.subject?.message}
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
              rules={{ required: 'Chapter is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Chapter"
                  select
                  fullWidth
                  error={!!errors.chapter}
                  helperText={errors.chapter?.message}
                >
                  {chapters.map((ch) => (
                    <MenuItem key={ch} value={ch}>
                      {ch}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

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

            <Controller
              name="learningOutcomes"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Learning Outcomes (comma-separated)"
                  fullWidth
                  multiline
                  rows={2}
                />
              )}
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
                onClick={() => navigate(`/content/${id}`)}
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

export default ContentEditPage;
