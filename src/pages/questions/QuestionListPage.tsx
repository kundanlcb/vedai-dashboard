import { Box, Typography } from '@mui/material';
import AdminLayout from '@layouts/AdminLayout';

export const QuestionListPage = () => {
  return (
    <AdminLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Question Bank
        </Typography>
        <Typography color="textSecondary">
          View and manage all questions in the question bank with filtering by difficulty, type, and status.
        </Typography>
      </Box>
    </AdminLayout>
  );
};

export default QuestionListPage;

