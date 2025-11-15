import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Stack,
  Typography,
  LinearProgress,
  Paper,
  CircularProgress,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import AdminLayout from '@layouts/AdminLayout';
import contentService from '@services/content.service';
import { useNotification } from '@hooks/useNotification';

interface UploadFormData {
  title: string;
  description: string;
  class: string;
  subject: string;
  chapter: string;
  topic: string;
  tags: string;
  learningOutcomes: string;
}
yup.object().shape({
    title: yup.string().required('Title is required'),
    description: yup.string().required('Description is required'),
    class: yup.string().required('Class is required'),
    subject: yup.string().required('Subject is required'),
    chapter: yup.string().required('Chapter is required'),
    topic: yup.string().optional(),
    tags: yup.string().optional(),
    learningOutcomes: yup.string().optional(),
});
interface FileInfo {
  file: File;
  name: string;
  size: string;
  type: string;
}

export const ContentUploadPage = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const { control, handleSubmit, formState: { errors }, watch } = useForm<UploadFormData>({
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

  // Local state
  const [selectedFile, setSelectedFile] = useState<FileInfo | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [chapters, setChapters] = useState<string[]>([]);
  const [classes, setClasses] = useState<string[]>([]);

  const selectedSubject = watch('subject');

  const loadMetadata = async () => {
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
  };

  const loadChapters = async (subject: string) => {
    try {
      const chaptersList = await contentService.getChapters(subject);
      setChapters(chaptersList);
    } catch {
      showError('Failed to load chapters');
    }
  };

  useEffect(() => {
    loadMetadata();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      loadChapters(selectedSubject);
    }
  }, [selectedSubject]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const validateFile = (file: File): boolean => {
    const maxSize = 100 * 1024 * 1024; // 100MB
    const allowedTypes = ['application/pdf', 'text/plain', 'video/mp4', 'audio/mpeg'];

    if (file.size > maxSize) {
      showError('File size must be less than 100MB');
      return false;
    }

    if (!allowedTypes.includes(file.type)) {
      showError('Allowed file types: PDF, TXT, MP4, MP3');
      return false;
    }

    return true;
  };

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      setSelectedFile({
        file,
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type.split('/')[1].toUpperCase(),
      });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const onSubmit = async (data: UploadFormData) => {
    if (!selectedFile) {
      showError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadData = {
        file: selectedFile.file,
        title: String(data.title),
        description: String(data.description),
        class: String(data.class),
        subject: String(data.subject),
        chapter: String(data.chapter),
        topic: String(data.topic),
        tags: data.tags ? String(data.tags).split(',').map((tag) => tag.trim()) : [],
        learningOutcomes: data.learningOutcomes ? String(data.learningOutcomes).split(',').map((outcome) => outcome.trim()) : [],
      };

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + Math.random() * 30;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 500);

      await contentService.uploadContent(uploadData);

      clearInterval(progressInterval);
      setUploadProgress(100);

      showSuccess('Content uploaded successfully!');
      setTimeout(() => {
        navigate('/content');
      }, 2000);
    } catch {
      showError('Failed to upload content');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <AdminLayout>
      <Box sx={{ maxWidth: 900, mx: 'auto' }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Upload Educational Content
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* File Upload Section */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Select File
                </Typography>

                {!selectedFile ? (
                  <Paper
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    sx={{
                      p: 4,
                      textAlign: 'center',
                      border: '2px dashed',
                      borderColor: dragActive ? 'primary.main' : 'divider',
                      backgroundColor: dragActive ? 'action.hover' : 'background.paper',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: 'primary.main',
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    <input
                      type="file"
                      onChange={handleFileInput}
                      accept=".pdf,.txt,.mp4,.mp3"
                      style={{ display: 'none' }}
                      id="file-input"
                    />
                    <label htmlFor="file-input" style={{ cursor: 'pointer', width: '100%' }}>
                      <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        Drag and drop your file here
                      </Typography>
                      <Typography color="textSecondary" sx={{ mb: 2 }}>
                        or click to select
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Supported formats: PDF, TXT, MP4, MP3 (Max 100MB)
                      </Typography>
                    </label>
                  </Paper>
                ) : (
                  <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="subtitle1">{selectedFile.name}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {selectedFile.size} • {selectedFile.type}
                        </Typography>
                      </Box>
                      <Button
                        startIcon={<DeleteIcon />}
                        color="error"
                        size="small"
                        onClick={handleRemoveFile}
                        disabled={uploading}
                      >
                        Remove
                      </Button>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* File Information Section */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  File Information
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Title"
                        error={!!errors.title}
                        helperText={errors.title?.message}
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
                        label="Description"
                        multiline
                        rows={3}
                        error={!!errors.description}
                        helperText={errors.description?.message}
                      />
                    )}
                  />
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                    <Controller
                      name="class"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          select
                          label="Class"
                          error={!!errors.class}
                          helperText={errors.class?.message}
                        >
                          <MenuItem value="">Select Class</MenuItem>
                          {classes.map((cls) => (
                            <MenuItem key={cls} value={cls}>
                              {cls}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                    <Controller
                      name="subject"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          select
                          label="Subject"
                          error={!!errors.subject}
                          helperText={errors.subject?.message}
                        >
                          <MenuItem value="">Select Subject</MenuItem>
                          {subjects.map((subject) => (
                            <MenuItem key={subject} value={subject}>
                              {subject}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Box>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                    <Controller
                      name="chapter"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          select
                          label="Chapter"
                          error={!!errors.chapter}
                          helperText={errors.chapter?.message}
                          disabled={!selectedSubject}
                        >
                          <MenuItem value="">Select Chapter</MenuItem>
                          {chapters.map((chapter) => (
                            <MenuItem key={chapter} value={chapter}>
                              {chapter}
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
                          fullWidth
                          label="Topic (Optional)"
                        />
                      )}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Additional Metadata Section */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Additional Information
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Controller
                    name="tags"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Tags (comma-separated)"
                        placeholder="e.g., algebra, equations, linear"
                      />
                    )}
                  />
                  <Controller
                    name="learningOutcomes"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Learning Outcomes (comma-separated)"
                        placeholder="e.g., understand basic algebra, solve equations"
                      />
                    )}
                  />
                </Box>
              </CardContent>
            </Card>

            {/* Upload Progress */}
            {uploading && (
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CircularProgress size={24} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2">Uploading...</Typography>
                      <LinearProgress variant="determinate" value={uploadProgress} sx={{ mt: 1 }} />
                    </Box>
                    <Typography variant="caption">{Math.round(uploadProgress)}%</Typography>
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
                  disabled={uploading}
                  sx={{ minWidth: 120 }}
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/content')}
                  disabled={uploading}
                >
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

export default ContentUploadPage;

