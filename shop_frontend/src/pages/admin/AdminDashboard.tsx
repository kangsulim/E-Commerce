import React from 'react';
import {
  Box,
  Grid2,
  Paper,
  Typography,
  Stack
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Group as GroupIcon,
  Assignment as AssignmentIcon,
  Inventory as InventoryIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';

const AdminDashboard: React.FC = () => {
  const stats = [
    { 
      title: '총 사용자', 
      value: '1,234', 
      change: '+12%', 
      icon: <GroupIcon sx={{ fontSize: 40 }} />,
      color: 'primary'
    },
    { 
      title: '총 주문', 
      value: '5,678', 
      change: '+8%', 
      icon: <AssignmentIcon sx={{ fontSize: 40 }} />,
      color: 'info'
    },
    { 
      title: '총 상품', 
      value: '2,345', 
      change: '+15%', 
      icon: <InventoryIcon sx={{ fontSize: 40 }} />,
      color: 'warning'
    },
    { 
      title: '총 매출', 
      value: '₩12,345,678', 
      change: '+23%', 
      icon: <MoneyIcon sx={{ fontSize: 40 }} />,
      color: 'success'
    },
  ];

  return (
    <Box>
      {/* 통계 카드들 */}
      <Grid2 container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat) => (
          <Grid2 xs={12} sm={6} lg={3} key={stat.title}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 3,
                height: '100%',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 4
                }
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {stat.title}
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.5 }}>
                    {stat.value}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <TrendingUpIcon 
                      fontSize="small" 
                      color="success" 
                    />
                    <Typography variant="body2" color="success.main" fontWeight="medium">
                      {stat.change}
                    </Typography>
                  </Stack>
                </Box>
                <Box 
                  sx={{ 
                    color: `${stat.color}.main`,
                    opacity: 0.7
                  }}
                >
                  {stat.icon}
                </Box>
              </Stack>
            </Paper>
          </Grid2>
        ))}
      </Grid2>

      {/* 메인 컨텐츠 */}
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
          관리자 대시보드
        </Typography>
        <Typography variant="h6" color="text.secondary">
          🚧 5단계에서 상세 기능이 구현됩니다
        </Typography>
      </Paper>
    </Box>
  );
};

export default AdminDashboard;
