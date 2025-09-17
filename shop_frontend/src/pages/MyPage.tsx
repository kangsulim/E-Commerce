import React from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';
import { AccountCircle as AccountIcon } from '@mui/icons-material';

const MyPage: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', py: 4, bgcolor: 'grey.50' }}>
      <Container maxWidth="lg">
        <Paper elevation={1} sx={{ p: 8, textAlign: 'center' }}>
          <AccountIcon 
            sx={{ 
              fontSize: 80, 
              color: 'primary.main', 
              mb: 3 
            }} 
          />
          <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>
            마이페이지
          </Typography>
          <Typography variant="h6" color="text.secondary">
            🚧 추후 단계에서 구현됩니다
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default MyPage;
