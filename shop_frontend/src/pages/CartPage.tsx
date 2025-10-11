import React, { useEffect } from 'react';
import { Box, Container, Grid2, Typography, Paper, Alert, Button, Stack } from '@mui/material';
import { ArrowBack as BackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { CartList, CartSummary, EmptyCart } from '../components/cart';
import Breadcrumb from '../components/common/Breadcrumb';
import Loading from '../components/common/Loading';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, calculations, isLoading, error, refreshCart } = useCart();

  // 페이지 로드 시 장바구니 새로고침
  useEffect(() => {
    refreshCart();
  }, []);

  const breadcrumbItems = [
    { label: '홈', href: '/' },
    { label: '장바구니', current: true },
  ];

  // 로딩 상태
  if (isLoading && items.length === 0) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Loading />
        </Container>
      </Box>
    );
  }

  // 빈 장바구니
  if (items.length === 0) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Breadcrumb items={breadcrumbItems} className="mb-4" />
          <EmptyCart />
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* 브레드크럼 */}
        <Breadcrumb items={breadcrumbItems} className="mb-4" />

        {/* 페이지 헤더 */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Typography variant="h3" fontWeight="bold">
            장바구니
          </Typography>
          <Button
            variant="outlined"
            startIcon={<BackIcon />}
            onClick={() => navigate(-1)}
          >
            계속 쇼핑하기
          </Button>
        </Stack>

        {/* 에러 메시지 */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* 장바구니 안내 메시지 */}
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>💡 구매 전 확인해주세요!</strong>
          </Typography>
          <Typography variant="body2">
            • 30,000원 이상 구매 시 무료배송 / 100,000원 이상 구매 시 5% 할인
          </Typography>
          <Typography variant="body2">
            • 장바구니에 담긴 상품은 7일간 보관됩니다
          </Typography>
        </Alert>

        {/* 장바구니 메인 컨텐츠 */}
        <Grid2 container spacing={3}>
          {/* 왼쪽: 장바구니 목록 */}
          <Grid2 xs={12} lg={8}>
            <Paper elevation={1} sx={{ p: 3 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                장바구니 상품 ({items.length}개)
              </Typography>
              <CartList 
                items={items}
                showSelectAll={true}
                showDeleteSelected={true}
              />
            </Paper>
          </Grid2>

          {/* 오른쪽: 주문 요약 */}
          <Grid2 xs={12} lg={4}>
            <CartSummary
              calculations={calculations}
              showCheckoutButton={true}
              isLoading={isLoading}
            />
          </Grid2>
        </Grid2>

        {/* 하단 정보 */}
        <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Typography variant="h6" fontWeight="medium" gutterBottom>
            장바구니 이용 안내
          </Typography>
          <Stack spacing={1}>
            <Typography variant="body2" color="text.secondary">
              • 장바구니에 담긴 상품은 최대 7일간 보관됩니다.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • 가격, 옵션 등 정보는 변경될 수 있으니 주문 전 확인해주세요.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • 품절된 상품은 자동으로 장바구니에서 제외됩니다.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • 일부 상품은 함께 배송되지 않을 수 있습니다.
            </Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default CartPage;
