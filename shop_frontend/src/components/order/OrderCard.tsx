import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from '@mui/material';
import {
  LocalShipping as ShippingIcon,
  Receipt as ReceiptIcon,
  Cancel as CancelIcon,
  KeyboardArrowRight as ArrowIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Order } from '../../types/order';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../../data/mockOrders';
import { formatPrice } from '../../utils/cart';

interface OrderCardProps {
  order: Order;
  onCancel?: (orderId: number) => void;
  onViewTracking?: (orderId: number) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onCancel,
  onViewTracking,
}) => {
  const navigate = useNavigate();

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // 취소 가능 여부
  const canCancel = ['PENDING', 'CONFIRMED'].includes(order.status);

  // 배송 추적 가능 여부
  const canTrack = ['SHIPPED', 'DELIVERED'].includes(order.status) && order.trackingNumber;

  return (
    <Card
      elevation={2}
      sx={{
        mb: 2,
        '&:hover': {
          boxShadow: 6,
          transition: 'box-shadow 0.3s',
        },
      }}
    >
      <CardContent>
        {/* 주문 헤더 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {formatDate(order.orderedAt)}
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {order.orderNumber}
            </Typography>
          </Box>
          <Chip
            label={ORDER_STATUS_LABELS[order.status]}
            color={ORDER_STATUS_COLORS[order.status] as any}
            size="medium"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* 주문 상품 목록 */}
        <List disablePadding>
          {order.items.slice(0, 2).map((item, index) => (
            <ListItem
              key={item.id}
              disablePadding
              sx={{
                mb: index < order.items.length - 1 ? 1 : 0,
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

        {/* 더 많은 상품이 있을 경우 */}
        {order.items.length > 2 && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            외 {order.items.length - 2}개 상품
          </Typography>
        )}

        <Divider sx={{ my: 2 }} />

        {/* 주문 금액 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="body1" color="text.secondary">
            총 결제 금액
          </Typography>
          <Typography variant="h6" color="primary" fontWeight="bold">
            {formatPrice(order.totalAmount)}
          </Typography>
        </Box>

        {/* 배송 정보 */}
        {order.trackingNumber && (
          <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, mb: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <ShippingIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {order.courier}
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {order.trackingNumber}
              </Typography>
            </Stack>
          </Box>
        )}

        {/* 액션 버튼 */}
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            size="small"
            endIcon={<ArrowIcon />}
            onClick={() => navigate(`/orders/${order.id}`)}
            fullWidth
          >
            주문 상세
          </Button>

          {canTrack && onViewTracking && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<ShippingIcon />}
              onClick={() => onViewTracking(order.id)}
              fullWidth
            >
              배송 조회
            </Button>
          )}

          {canCancel && onCancel && (
            <Button
              variant="outlined"
              size="small"
              color="error"
              startIcon={<CancelIcon />}
              onClick={() => onCancel(order.id)}
              fullWidth
            >
              주문 취소
            </Button>
          )}

          <Button
            variant="text"
            size="small"
            startIcon={<ReceiptIcon />}
            onClick={() => window.open(`/api/orders/${order.id}/receipt`, '_blank')}
          >
            영수증
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
