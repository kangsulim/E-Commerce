import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Receipt as ReceiptIcon,
  Cancel as CancelIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../services/order';
import { Order, DeliveryTracking } from '../types/order';
import { OrderStatusTracker } from '../components/order/OrderStatusTracker';
import { formatPrice } from '../utils/cart';
import { getPaymentMethodLabel } from '../utils/payment';
import Breadcrumb from '../components/common/Breadcrumb';

const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  // 상태 관리
  const [order, setOrder] = useState<Order | null>(null);
  const [tracking, setTracking] = useState<DeliveryTracking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  // 주문 정보 조회
  useEffect(() => {
    if (orderId) {
      fetchOrderDetail(parseInt(orderId));
    }
  }, [orderId]);

  const fetchOrderDetail = async (id: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const orderData = await orderService.getOrderById(id);
      setOrder(orderData);

      // 배송 추적 정보 조회 (배송 중이거나 완료된 경우)
      if (
        orderData.status === 'SHIPPED' ||
        orderData.status === 'DELIVERED'
      ) {
        try {
          const trackingData = await orderService.getDeliveryTracking(id);
          setTracking(trackingData);
        } catch (err) {
          console.error('Failed to fetch tracking:', err);
        }
      }
    } catch (err) {
      setError('주문 정보를 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 주문 취소
  const handleCancelOrder = async () => {
    if (!order || !cancelReason.trim()) return;

    try {
      await orderService.cancelOrder({
        orderId: order.id,
        reason: cancelReason,
        refundMethod: 'ORIGINAL',
      });

      // 주문 정보 새로고침
      await fetchOrderDetail(order.id);

      // 다이얼로그 닫기
      setCancelDialogOpen(false);
      setCancelReason('');

      alert('주문이 취소되었습니다.');
    } catch (err) {
      console.error(err);
      alert('주문 취소에 실패했습니다.');
    }
  };

  // 영수증 출력
  const handlePrintReceipt = () => {
    if (order) {
      window.open(orderService.getReceiptUrl(order.id), '_blank');
    }
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const breadcrumbItems = [
    { label: '홈', href: '/' },
    { label: '주문 내역', href: '/orders' },
    { label: '주문 상세', current: true },
  ];

  // 로딩 중
  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // 에러 또는 주문 없음
  if (error || !order) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 4 }}>
        <Container maxWidth="md">
          <Alert severity="error">
            {error || '주문을 찾을 수 없습니다.'}
          </Alert>
          <Button
            variant="contained"
            startIcon={<BackIcon />}
            onClick={() => navigate('/orders')}
            sx={{ mt: 2 }}
          >
            주문 내역으로
          </Button>
        </Container>
      </Box>
    );
  }

  const canCancel = ['PENDING', 'CONFIRMED'].includes(order.status);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 4 }}>
      <Container maxWidth="md">
        {/* 브레드크럼 */}
        <Breadcrumb items={breadcrumbItems} className="mb-4" />

        {/* 페이지 헤더 */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold">
              주문 상세
            </Typography>
            <Typography variant="body2" color="text.secondary">
              주문번호: {order.orderNumber}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<BackIcon />}
            onClick={() => navigate('/orders')}
          >
            목록으로
          </Button>
        </Stack>

        {/* 주문 상태 추적 */}
        <OrderStatusTracker
          status={order.status}
          orderedAt={order.orderedAt}
          paidAt={order.paidAt}
          shippedAt={order.shippedAt}
          deliveredAt={order.deliveredAt}
          cancelledAt={order.cancelledAt}
        />

        {/* 배송 추적 정보 */}
        {tracking && (
          <Paper elevation={1} sx={{ p: 3, mt: 3 }} id="tracking">
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <ShippingIcon color="primary" />
              <Typography variant="h6" fontWeight="bold">
                배송 추적
              </Typography>
            </Stack>
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                택배사: {tracking.courier}
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                송장번호: {tracking.trackingNumber}
              </Typography>
            </Box>
            <List>
              {tracking.events.map((event, index) => (
                <ListItem
                  key={index}
                  sx={{
                    bgcolor: index === 0 ? 'primary.lighter' : 'transparent',
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" fontWeight="medium">
                        {event.status}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          {event.location}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(event.timestamp)}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}

        {/* 주문 상품 */}
        <Paper elevation={1} sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            주문 상품 ({order.items.length}개)
          </Typography>
          <List>
            {order.items.map(item => (
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
        <Paper elevation={1} sx={{ p: 3, mt: 3 }}>
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
        <Paper elevation={1} sx={{ p: 3, mt: 3 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <PaymentIcon color="primary" />
            <Typography variant="h6" fontWeight="bold">
              결제 정보
            </Typography>
          </Stack>
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
                총 결제 금액
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

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                결제일시
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {order.paidAt ? formatDate(order.paidAt) : '-'}
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

        {/* 액션 버튼 */}
        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Button
            variant="outlined"
            startIcon={<ReceiptIcon />}
            onClick={handlePrintReceipt}
            fullWidth
          >
            영수증 출력
          </Button>
          {canCancel && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<CancelIcon />}
              onClick={() => setCancelDialogOpen(true)}
              fullWidth
            >
              주문 취소
            </Button>
          )}
        </Stack>

        {/* 취소 안내 */}
        {order.status === 'CANCELLED' && order.cancelReason && (
          <Alert severity="error" sx={{ mt: 3 }}>
            <Typography variant="body2" fontWeight="medium" gutterBottom>
              취소 사유
            </Typography>
            <Typography variant="body2">{order.cancelReason}</Typography>
            {order.cancelledAt && (
              <Typography variant="caption" color="text.secondary">
                취소일시: {formatDate(order.cancelledAt)}
              </Typography>
            )}
          </Alert>
        )}
      </Container>

      {/* 주문 취소 다이얼로그 */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>주문 취소</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            주문을 취소하시겠습니까? 취소 사유를 입력해주세요.
          </Typography>
          <TextField
            autoFocus
            multiline
            rows={4}
            fullWidth
            placeholder="취소 사유를 입력하세요"
            value={cancelReason}
            onChange={e => setCancelReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>취소</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleCancelOrder}
            disabled={!cancelReason.trim()}
          >
            주문 취소
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderDetailPage;
