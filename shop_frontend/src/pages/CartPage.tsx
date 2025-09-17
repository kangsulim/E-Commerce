import React from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';
import { Construction as ConstructionIcon } from '@mui/icons-material';

const CartPage: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', py: 4, bgcolor: 'grey.50' }}>
      <Container maxWidth="lg">
        <Paper elevation={1} sx={{ p: 8, textAlign: 'center' }}>
          <ConstructionIcon 
            sx={{ 
              fontSize: 80, 
              color: 'warning.main', 
              mb: 3 
            }} 
          />
          <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>
            장바구니
          </Typography>
          <Typography variant="h6" color="text.secondary">
            🚧 4단계에서 구현됩니다
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default CartPage;
