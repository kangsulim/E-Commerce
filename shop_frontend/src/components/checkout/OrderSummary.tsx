import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Stack,
  Divider,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Chip,
  Alert,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  ShoppingBag as OrderIcon,
} from '@mui/icons-material';
import { ShippingInfo, PaymentInfo } from '../../types/order';
import { CartItem } from '../../types/cart';
import { formatPrice } from '../../utils/cart';

interface OrderSummaryProps {
  items: CartItem[];
  shippingInfo: ShippingInfo;
  paymentInfo: PaymentInfo;
  calculations: {
    subtotal: number;
    discount: number;
    shippingFee: number;
    totalPrice: number;
  };
  onSubmit: () => void;
  onBack?: () => void;
  isLoading?: boolean;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  shippingInfo,
  paymentInfo,
  calculations,
  onSubmit,
  onBack,
  isLoading = false,
}) => {
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

  return (
    <Paper elevation={1} sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <OrderIcon sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} />
        <Typography variant="h5" fontWeight="bold">
          주문 확인
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        주문 내용을 확인하신 후 결제를 진행해주세요.
      </Alert>

      <Stack spacing={3}>
        {/* 주문 상품 */}
        <Box>
          <Typography variant="h6" fontWeight="medium" sx={{ mb: 2 }}>
            주문 상품 ({items.length}개)
          </Typography>
          <List>
            {items.map((item) => (
              <ListItem
                key={item.id}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 1,
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    variant="rounded"
                    src={item.product.imageUrl || 'https://via.placeholder.com/80'}
                    alt={item.product.name}
                    sx={{ width: 60, height: 60 }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={item.product.name}
                  secondary={
                    <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        수량: {item.quantity}개
                      </Typography>
                      <Typography variant="body2" color="primary" fontWeight="medium">
                        {formatPrice(item.product.price * item.quantity)}
                      </Typography>
                    </Stack>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

        <Divider />

        {/* 배송 정보 */}
        <Box>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <ShippingIcon color="primary" />
            <Typography variant="h6" fontWeight="medium">
              배송 정보
            </Typography>
          </Stack>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  받는 사람
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {shippingInfo.recipientName}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  연락처
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {shippingInfo.recipientPhone}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  배송지
                </Typography>
                <Typography variant="body2" fontWeight="medium" textAlign="right">
                  [{shippingInfo.zipCode}] {shippingInfo.address}
                  <br />
                  {shippingInfo.addressDetail}
                </Typography>
              </Box>
              {shippingInfo.deliveryRequest && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    배송 요청사항
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {shippingInfo.deliveryRequest}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Paper>
        </Box>

        <Divider />

        {/* 결제 정보 */}
        <Box>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <PaymentIcon color="primary" />
            <Typography variant="h6" fontWeight="medium">
              결제 정보
            </Typography>
          </Stack>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  결제 수단
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {getPaymentMethodLabel(paymentInfo.method)}
                </Typography>
              </Box>
              {paymentInfo.method === 'CARD' && (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      카드사
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {paymentInfo.cardCompany}
                    </Typography>
                  </Box>
                  {paymentInfo.installment !== undefined && paymentInfo.installment > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        할부
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {paymentInfo.installment}개월 (무이자)
                      </Typography>
                    </Box>
                  )}
                </>
              )}
              {paymentInfo.method === 'BANK' && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    은행
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {paymentInfo.bankName}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Paper>
        </Box>

        <Divider />

        {/* 결제 금액 */}
        <Box>
          <Typography variant="h6" fontWeight="medium" sx={{ mb: 2 }}>
            결제 금액
          </Typography>
          <Stack spacing={1.5}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body1">상품 금액</Typography>
              <Typography variant="body1">
                {formatPrice(calculations.subtotal)}
              </Typography>
            </Box>

            {calculations.discount > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1" color="error">
                  할인 금액
                </Typography>
                <Typography variant="body1" color="error">
                  -{formatPrice(calculations.discount)}
                </Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body1">배송비</Typography>
              <Typography variant="body1" color={calculations.shippingFee === 0 ? 'success.main' : 'text.primary'}>
                {calculations.shippingFee === 0 ? '무료' : formatPrice(calculations.shippingFee)}
              </Typography>
            </Box>

            <Divider />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1 }}>
              <Typography variant="h6" fontWeight="bold">
                최종 결제 금액
              </Typography>
              <Typography variant="h5" color="primary" fontWeight="bold">
                {formatPrice(calculations.totalPrice)}
              </Typography>
            </Box>

            <Box sx={{ p: 2, bgcolor: 'success.lighter', borderRadius: 1 }}>
              <Typography variant="body2" color="success.main" textAlign="center">
                💰 {Math.floor(calculations.totalPrice * 0.01).toLocaleString()}원 적립 예정 (1%)
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* 동의 및 주의사항 */}
        <Alert severity="warning">
          <Typography variant="body2" fontWeight="medium" gutterBottom>
            주문 전 확인사항
          </Typography>
          <Typography variant="caption" display="block">
            • 주문 내용을 확인하였으며, 정보 제공 등에 동의합니다.
          </Typography>
          <Typography variant="caption" display="block">
            • 결제 후 주문 취소는 고객센터를 통해 가능합니다.
          </Typography>
        </Alert>

        {/* 버튼 */}
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          {onBack && (
            <Button
              variant="outlined"
              size="large"
              onClick={onBack}
              disabled={isLoading}
            >
              이전
            </Button>
          )}
          <Button
            variant="contained"
            size="large"
            startIcon={isLoading ? undefined : <CheckIcon />}
            onClick={onSubmit}
            disabled={isLoading}
            sx={{ minWidth: 200, py: 1.5 }}
          >
            {isLoading ? '결제 처리 중...' : `${formatPrice(calculations.totalPrice)} 결제하기`}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default OrderSummary;
