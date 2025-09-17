import React from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';
import { History as HistoryIcon } from '@mui/icons-material';

const OrderHistoryPage: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', py: 4, bgcolor: 'grey.50' }}>
      <Container maxWidth="lg">
        <Paper elevation={1} sx={{ p: 8, textAlign: 'center' }}>
          <HistoryIcon 
            sx={{ 
              fontSize: 80, 
              color: 'info.main', 
              mb: 3 
            }} 
          />
          <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>
            주문 내역
          </Typography>
          <Typography variant="h6" color="text.secondary">
            🚧 추후 단계에서 구현됩니다
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default OrderHistoryPage;
