import { Box, Typography } from '@mui/material';
import AdminLayout from '@layouts/AdminLayout';

export const ContentUploadPage = () => {
  return (
    <AdminLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Upload Content
        </Typography>
        <Typography color="textSecondary">
          Upload educational content with metadata. Supports PDF, TXT, MP4, MP3 files up to 100MB.
        </Typography>
      </Box>
    </AdminLayout>
  );
};

export default ContentUploadPage;

