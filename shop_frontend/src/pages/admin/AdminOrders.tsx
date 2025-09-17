import React from 'react';
import { Paper, Typography } from '@mui/material';
import { Assignment as AssignmentIcon } from '@mui/icons-material';

const AdminOrders: React.FC = () => {
  return (
    <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
      <AssignmentIcon 
        sx={{ 
          fontSize: 80, 
          color: 'info.main', 
          mb: 2 
        }} 
      />
      <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>
        주문 관리
      </Typography>
      <Typography variant="h6" color="text.secondary">
        🚧 5단계에서 구현됩니다
      </Typography>
    </Paper>
  );
};

export default AdminOrders;
