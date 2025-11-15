import type { ReactNode } from 'react';
import { Box, Container, Card } from '@mui/material';

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--background)',
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            p: 4,
            boxShadow: 2,
          }}
        >
          {children}
        </Card>
      </Container>
    </Box>
  );
};

export default AuthLayout;

