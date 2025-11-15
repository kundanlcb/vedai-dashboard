import { Box, Typography } from '@mui/material';
import AdminLayout from '@layouts/AdminLayout';

export const QuestionCreatePage = () => {
  return (
    <AdminLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Create Question
        </Typography>
        <Typography color="textSecondary">
          Create a new question with rich text editor, options, and metadata.
        </Typography>
      </Box>
    </AdminLayout>
  );
};

export default QuestionCreatePage;

