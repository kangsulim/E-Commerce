import React from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';
import { Payment as PaymentIcon } from '@mui/icons-material';

const CheckoutPage: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', py: 4, bgcolor: 'grey.50' }}>
      <Container maxWidth="lg">
        <Paper elevation={1} sx={{ p: 8, textAlign: 'center' }}>
          <PaymentIcon 
            sx={{ 
              fontSize: 80, 
              color: 'success.main', 
              mb: 3 
            }} 
          />
          <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>
            주문/결제
          </Typography>
          <Typography variant="h6" color="text.secondary">
            🚧 4단계에서 구현됩니다
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default CheckoutPage;
