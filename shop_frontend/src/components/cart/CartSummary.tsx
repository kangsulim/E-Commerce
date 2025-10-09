import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Button,
  Stack,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  LocalShipping as ShippingIcon,
  Discount as DiscountIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { CartCalculation } from '../../types/cart';
import { formatPrice, getFreeShippingRemaining } from '../../utils/cart';

interface CartSummaryProps {
  calculations: CartCalculation;
  showCheckoutButton?: boolean;
  isLoading?: boolean;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  calculations,
  showCheckoutButton = true,
  isLoading = false,
}) => {
  const navigate = useNavigate();
  
  const {
    subtotal,
    discount,
    shippingFee,
    totalPrice,
    selectedItemsCount,
    selectedItemsPrice,
  } = calculations;

  // 무료 배송까지 남은 금액
  const freeShippingRemaining = getFreeShippingRemaining(subtotal);
  const freeShippingProgress = Math.min((subtotal / 30000) * 100, 100);

  // 결제하기 버튼 클릭
  const handleCheckout = () => {
    if (selectedItemsCount === 0) {
      alert('결제할 상품을 선택해주세요.');
      return;
    }
    navigate('/checkout');
  };

  return (
    <Card sx={{ position: 'sticky', top: 20 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          <CartIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          주문 요약
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* 무료 배송 진행률 */}
        {freeShippingRemaining > 0 && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                무료 배송까지
              </Typography>
              <Typography variant="body2" color="primary" fontWeight="medium">
                {formatPrice(freeShippingRemaining)} 남음
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={freeShippingProgress} 
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
        )}

        {freeShippingRemaining === 0 && (
          <Chip
            icon={<ShippingIcon />}
            label="무료 배송"
            color="success"
            sx={{ mb: 2, width: '100%' }}
          />
        )}

        {/* 주문 내역 */}
        <Stack spacing={2}>
          {/* 상품 금액 */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body1">
              상품 금액 ({selectedItemsCount}개)
            </Typography>
            <Typography variant="body1">
              {formatPrice(selectedItemsPrice)}
            </Typography>
          </Box>

          {/* 할인 금액 */}
          {discount > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body1" color="error">
                <DiscountIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                할인 금액
              </Typography>
              <Typography variant="body1" color="error">
                - {formatPrice(discount)}
              </Typography>
            </Box>
          )}

          {/* 배송비 */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body1">
              <ShippingIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
              배송비
            </Typography>
            <Typography variant="body1" color={shippingFee === 0 ? 'success.main' : 'text.primary'}>
              {shippingFee === 0 ? '무료' : formatPrice(shippingFee)}
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* 총 결제 금액 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6" fontWeight="bold">
            총 결제 금액
          </Typography>
          <Typography variant="h5" color="primary" fontWeight="bold">
            {formatPrice(totalPrice)}
          </Typography>
        </Box>

        {/* 할인 안내 */}
        {subtotal < 100000 && (
          <Box sx={{ mb: 2, p: 1.5, backgroundColor: 'info.lighter', borderRadius: 1 }}>
            <Typography variant="body2" color="info.main">
              💰 {formatPrice(100000 - subtotal)} 더 구매하시면 5% 할인!
            </Typography>
          </Box>
        )}

        {/* 결제하기 버튼 */}
        {showCheckoutButton && (
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleCheckout}
            disabled={selectedItemsCount === 0 || isLoading}
            sx={{ py: 1.5 }}
          >
            {selectedItemsCount === 0 
              ? '상품을 선택해주세요' 
              : `${selectedItemsCount}개 상품 결제하기`}
          </Button>
        )}

        {/* 추가 안내 */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary" display="block">
            • 30,000원 이상 구매 시 무료배송
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            • 100,000원 이상 구매 시 5% 할인
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            • 안전결제 시스템으로 보호됩니다
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CartSummary;
