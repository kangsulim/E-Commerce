import React from 'react';
import { Box, Container, CircularProgress, Typography } from '@mui/material';
import { RegisterForm } from '../components/auth/RegisterForm';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // 이미 로그인된 사용자는 홈으로 리다이렉트
  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'grey.50'
        }}
      >
        <Box textAlign="center">
          <CircularProgress size={48} sx={{ mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            로딩 중...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'grey.50',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <RegisterForm />
      </Container>
    </Box>
  );
};

export default RegisterPage;
