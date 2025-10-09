import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
} from '@mui/material';
import {
  ShoppingCartOutlined as EmptyCartIcon,
  ArrowBack as BackIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface EmptyCartProps {
  title?: string;
  message?: string;
  showRecommendations?: boolean;
}

export const EmptyCart: React.FC<EmptyCartProps> = ({
  title = '장바구니가 비어있습니다',
  message = '원하시는 상품을 담아보세요!',
  showRecommendations = true,
}) => {
  const navigate = useNavigate();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 6,
        textAlign: 'center',
        backgroundColor: 'background.default',
        minHeight: 400,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* 빈 장바구니 아이콘 */}
      <Box
        sx={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          backgroundColor: 'action.hover',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <EmptyCartIcon sx={{ fontSize: 64, color: 'text.secondary' }} />
      </Box>

      {/* 메시지 */}
      <Typography variant="h5" gutterBottom fontWeight="bold">
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {message}
      </Typography>

      {/* 액션 버튼 */}
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          size="large"
          startIcon={<SearchIcon />}
          onClick={() => navigate('/products')}
          sx={{ px: 4 }}
        >
          상품 둘러보기
        </Button>
        
        <Button
          variant="outlined"
          size="large"
          startIcon={<BackIcon />}
          onClick={() => navigate('/')}
        >
          홈으로 가기
        </Button>
      </Stack>

      {/* 추천 섹션 */}
      {showRecommendations && (
        <Box sx={{ mt: 6, maxWidth: 600 }}>
          <Typography variant="h6" gutterBottom fontWeight="medium">
            이런 상품은 어떠세요?
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
            <Box
              component="button"
              onClick={() => navigate('/products?category=electronics')}
              sx={{
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                backgroundColor: 'background.paper',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <Typography variant="body2" fontWeight="medium">
                🔌 전자제품
              </Typography>
            </Box>

            <Box
              component="button"
              onClick={() => navigate('/products?category=fashion')}
              sx={{
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                backgroundColor: 'background.paper',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <Typography variant="body2" fontWeight="medium">
                👕 패션
              </Typography>
            </Box>

            <Box
              component="button"
              onClick={() => navigate('/products?category=home')}
              sx={{
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                backgroundColor: 'background.paper',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <Typography variant="body2" fontWeight="medium">
                🏠 홈/리빙
              </Typography>
            </Box>
          </Stack>
        </Box>
      )}

      {/* 추가 정보 */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="caption" color="text.secondary" display="block">
          💡 Tip: 장바구니에 담은 상품은 7일간 보관됩니다
        </Typography>
      </Box>
    </Paper>
  );
};

export default EmptyCart;
