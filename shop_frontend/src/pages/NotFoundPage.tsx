import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Container } from '@mui/material';
import { Home as HomeIcon, Search as SearchIcon } from '@mui/icons-material';

const NotFoundPage: React.FC = () => {
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
      <Container maxWidth="sm">
        <Box textAlign="center">
          <SearchIcon 
            sx={{ 
              fontSize: 120, 
              color: 'text.disabled', 
              mb: 2 
            }} 
          />
          <Typography 
            variant="h1" 
            sx={{ 
              fontSize: { xs: '4rem', sm: '6rem' },
              fontWeight: 'bold',
              color: 'text.primary',
              mb: 2
            }}
          >
            404
          </Typography>
          <Typography 
            variant="h5" 
            color="text.secondary" 
            sx={{ mb: 4 }}
          >
            죄송합니다. 찾으시는 페이지를 찾을 수 없습니다.
          </Typography>
          <Button
            component={Link}
            to="/"
            variant="contained"
            size="large"
            startIcon={<HomeIcon />}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              borderRadius: 2,
              textTransform: 'none'
            }}
          >
            홈으로 돌아가기
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default NotFoundPage;
