import React from 'react';
import { Paper, Typography } from '@mui/material';
import { Group as GroupIcon } from '@mui/icons-material';

const AdminUsers: React.FC = () => {
  return (
    <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
      <GroupIcon 
        sx={{ 
          fontSize: 80, 
          color: 'primary.main', 
          mb: 2 
        }} 
      />
      <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>
        사용자 관리
      </Typography>
      <Typography variant="h6" color="text.secondary">
        🚧 5단계에서 구현됩니다
      </Typography>
    </Paper>
  );
};

export default AdminUsers;
