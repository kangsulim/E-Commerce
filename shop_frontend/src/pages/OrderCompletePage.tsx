import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Stack,
  Divider,
  Alert,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Home as HomeIcon,
  Receipt as ReceiptIcon,
  LocalShipping as ShippingIcon,
} from '@mui/icons-material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Order } from '../types/order';
import { formatPrice } from '../utils/cart';

const OrderCompletePage: React.FC = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const order = location.state?.order as Order | undefined;

  useEffect(() => {
    // 주문 정보가 없으면 홈으로 리다이렉트
    if (!order) {
      navigate('/', { replace: true });
    }
  }, [order, navigate]);

  // 주문 정보가 없으면 렌더링하지 않음
  if (!order) {
    return null;
  }

  // 결제 수단 라벨
  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      CARD: '신용/체크카드',
      BANK: '계좌이체',
      KAKAO: '카카오페이',
      NAVER: '네이버페이',
      TOSS: '토스페이',
      PHONE: '휴대폰 결제',
    };
    return labels[method] || method;
  };

  // 주문 상태 라벨
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: '주문 접수',
      CONFIRMED: '주문 확인',
      PREPARING: '배송 준비',
      SHIPPED: '배송 중',
      DELIVERED: '배송 완료',
      CANCELLED: '주문 취소',
      REFUNDED: '환불 완료',
    };
    return labels[status] || status;
  };

  // 주문일시 포맷
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 6 }}>
      <Container maxWidth="md">
        {/* 완료 아이콘 및 메시지 */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mb: 3,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          }}
        >
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              mb: 2,
            }}
          >
            <CheckIcon sx={{ fontSize: 50 }} />
          </Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            주문이 완료되었습니다!
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            주문번호: <strong>{order.orderNumber}</strong>
          </Typography>
        </Paper>

        {/* 안내 메시지 */}
        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography variant="body2" fontWeight="medium">
            주문이 성공적으로 접수되었습니다. 주문 내역은 마이페이지에서 확인하실 수 있습니다.
          </Typography>
        </Alert>

        {/* 주문 정보 */}
        <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            주문 정보
          </Typography>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                주문번호
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {order.orderNumber}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                주문일시
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {formatDate(order.orderedAt)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                주문상태
              </Typography>
              <Chip
                label={getStatusLabel(order.status)}
                color="primary"
                size="small"
              />
            </Box>
          </Stack>
        </Paper>

        {/* 주문 상품 */}
        <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            주문 상품 ({order.items.length}개)
          </Typography>
          <List>
            {order.items.map((item) => (
              <ListItem
                key={item.id}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 1,
                  '&:last-child': { mb: 0 },
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    variant="rounded"
                    src={item.product.imageUrl || 'https://via.placeholder.com/60'}
                    alt={item.product.name}
                    sx={{ width: 60, height: 60 }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight="medium">
                      {item.product.name}
                    </Typography>
                  }
                  secondary={
                    <Stack direction="row" spacing={2} sx={{ mt: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        수량: {item.quantity}개
                      </Typography>
                      <Typography variant="body2" color="primary" fontWeight="medium">
                        {formatPrice(item.subtotal)}
                      </Typography>
                    </Stack>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* 배송 정보 */}
        <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <ShippingIcon color="primary" />
            <Typography variant="h6" fontWeight="bold">
              배송 정보
            </Typography>
          </Stack>
          <Stack spacing={1.5}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                받는 사람
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {order.shippingInfo.recipientName}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                연락처
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {order.shippingInfo.recipientPhone}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                배송지
              </Typography>
              <Typography variant="body2" fontWeight="medium" textAlign="right">
                [{order.shippingInfo.zipCode}] {order.shippingInfo.address}
                <br />
                {order.shippingInfo.addressDetail}
              </Typography>
            </Box>
            {order.shippingInfo.deliveryRequest && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  배송 요청사항
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {order.shippingInfo.deliveryRequest}
                </Typography>
              </Box>
            )}
          </Stack>
        </Paper>

        {/* 결제 정보 */}
        <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            결제 정보
          </Typography>
          <Stack spacing={1.5}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body1">상품 금액</Typography>
              <Typography variant="body1">
                {formatPrice(order.subtotal)}
              </Typography>
            </Box>

            {order.discountAmount > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1" color="error">
                  할인 금액
                </Typography>
                <Typography variant="body1" color="error">
                  -{formatPrice(order.discountAmount)}
                </Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body1">배송비</Typography>
              <Typography
                variant="body1"
                color={order.shippingFee === 0 ? 'success.main' : 'text.primary'}
              >
                {order.shippingFee === 0 ? '무료' : formatPrice(order.shippingFee)}
              </Typography>
            </Box>

            <Divider />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1 }}>
              <Typography variant="h6" fontWeight="bold">
                결제 금액
              </Typography>
              <Typography variant="h5" color="primary" fontWeight="bold">
                {formatPrice(order.totalAmount)}
              </Typography>
            </Box>

            <Divider />

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                결제 수단
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {getPaymentMethodLabel(order.paymentInfo.method)}
              </Typography>
            </Box>

            {order.earnedPoints > 0 && (
              <Box sx={{ p: 2, bgcolor: 'success.lighter', borderRadius: 1, mt: 2 }}>
                <Typography variant="body2" color="success.main" textAlign="center">
                  💰 {order.earnedPoints.toLocaleString()}원 적립 완료!
                </Typography>
              </Box>
            )}
          </Stack>
        </Paper>

        {/* 배송 안내 */}
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2" fontWeight="medium" gutterBottom>
            배송 안내
          </Typography>
          <Typography variant="caption" display="block">
            • 영업일 기준 2-3일 내 배송됩니다.
          </Typography>
          <Typography variant="caption" display="block">
            • 배송 시작 시 송장번호가 등록되며, 문자 알림이 발송됩니다.
          </Typography>
          <Typography variant="caption" display="block">
            • 주문 내역은 마이페이지에서 확인 가능합니다.
          </Typography>
        </Alert>

        {/* 액션 버튼 */}
        <Stack spacing={2}>
          <Button
            variant="contained"
            size="large"
            startIcon={<ReceiptIcon />}
            onClick={() => navigate(`/orders/${order.id}`)}
            fullWidth
          >
            주문 상세 보기
          </Button>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              size="large"
              startIcon={<HomeIcon />}
              onClick={() => navigate('/')}
              fullWidth
            >
              홈으로
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/orders')}
              fullWidth
            >
              주문 내역
            </Button>
          </Stack>
        </Stack>

        {/* 고객센터 안내 */}
        <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Typography variant="h6" fontWeight="medium" gutterBottom>
            도움이 필요하신가요?
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            주문 관련 문의사항이 있으시면 고객센터로 연락주세요.
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Typography variant="body2" fontWeight="medium">
              📞 고객센터: 1588-1234
            </Typography>
            <Typography variant="body2" color="text.secondary">
              |
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              ⏰ 평일 09:00 - 18:00
            </Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default OrderCompletePage;
