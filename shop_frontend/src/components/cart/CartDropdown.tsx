import React from 'react';
import {
  Box,
  Popover,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
  Badge,
  Stack,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Delete as DeleteIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart, useCartItemCount } from '../../hooks/useCart';
import { formatPrice } from '../../utils/cart';

interface CartDropdownProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
}

export const CartDropdown: React.FC<CartDropdownProps> = ({
  anchorEl,
  open,
  onClose,
}) => {
  const navigate = useNavigate();
  const { items, calculations, removeItem } = useCart();
  const itemCount = useCartItemCount();

  const displayItems = items.slice(0, 3); // 최대 3개만 표시
  const hasMoreItems = items.length > 3;

  const handleGoToCart = () => {
    navigate('/cart');
    onClose();
  };

  const handleRemove = async (itemId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('이 상품을 장바구니에서 제거하시겠습니까?')) {
      await removeItem(itemId);
    }
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      PaperProps={{
        sx: { width: 400, maxHeight: 600 }
      }}
    >
      <Box sx={{ p: 2 }}>
        {/* 헤더 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            장바구니
          </Typography>
          <Badge badgeContent={itemCount} color="primary">
            <CartIcon />
          </Badge>
        </Box>

        <Divider />

        {/* 장바구니 아이템 */}
        {items.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              장바구니가 비어있습니다
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                navigate('/products');
                onClose();
              }}
              sx={{ mt: 2 }}
            >
              쇼핑 시작하기
            </Button>
          </Box>
        ) : (
          <>
            <List sx={{ maxHeight: 300, overflow: 'auto' }}>
              {displayItems.map((item) => (
                <ListItem
                  key={item.id}
                  alignItems="flex-start"
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      size="small"
                      onClick={(e) => handleRemove(item.id, e)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  }
                  sx={{
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                    cursor: 'pointer',
                  }}
                  onClick={handleGoToCart}
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
                    primary={
                      <Typography variant="body2" noWrap>
                        {item.product.name}
                      </Typography>
                    }
                    secondary={
                      <Stack spacing={0.5}>
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

            {hasMoreItems && (
              <Box sx={{ textAlign: 'center', py: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  외 {items.length - 3}개 상품
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            {/* 요약 정보 */}
            <Box sx={{ px: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  상품 금액
                </Typography>
                <Typography variant="body2">
                  {formatPrice(calculations.subtotal)}
                </Typography>
              </Box>

              {calculations.shippingFee > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    배송비
                  </Typography>
                  <Typography variant="body2">
                    {formatPrice(calculations.shippingFee)}
                  </Typography>
                </Box>
              )}

              {calculations.discount > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="error">
                    할인
                  </Typography>
                  <Typography variant="body2" color="error">
                    -{formatPrice(calculations.discount)}
                  </Typography>
                </Box>
              )}

              <Divider sx={{ my: 1 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  합계
                </Typography>
                <Typography variant="subtitle1" color="primary" fontWeight="bold">
                  {formatPrice(calculations.totalPrice)}
                </Typography>
              </Box>

              {/* 무료 배송 안내 */}
              {calculations.shippingFee > 0 && (
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                  {formatPrice(30000 - calculations.subtotal)} 더 담으면 무료배송!
                </Typography>
              )}

              {/* 액션 버튼 */}
              <Stack spacing={1}>
                <Button
                  variant="contained"
                  fullWidth
                  endIcon={<ArrowIcon />}
                  onClick={handleGoToCart}
                >
                  장바구니 가기
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => {
                    navigate('/checkout');
                    onClose();
                  }}
                >
                  바로 주문하기
                </Button>
              </Stack>
            </Box>
          </>
        )}
      </Box>
    </Popover>
  );
};

export default CartDropdown;
