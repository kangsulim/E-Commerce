import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  IconButton, 
  Typography, 
  TextField,
  Checkbox,
  Button,
  Alert,
} from '@mui/material';
import { 
  Delete as DeleteIcon, 
  Add as AddIcon, 
  Remove as RemoveIcon 
} from '@mui/icons-material';
import { CartItem as CartItemType } from '../../types/cart';
import { useCart } from '../../hooks/useCart';
import { formatPrice, isInStock, getMaxQuantity } from '../../utils/cart';

interface CartItemProps {
  item: CartItemType;
  onRemove?: (itemId: number) => void;
  onQuantityChange?: (itemId: number, quantity: number) => void;
  onSelect?: (itemId: number) => void;
}

export const CartItem: React.FC<CartItemProps> = ({ 
  item, 
  onRemove, 
  onQuantityChange,
  onSelect 
}) => {
  const { updateQuantity, removeItem, toggleItemSelection } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { product, quantity, selected = true } = item;
  const maxQuantity = getMaxQuantity(product);
  const inStock = isInStock(product, quantity);
  const subtotal = product.price * quantity;

  // 수량 증가
  const handleIncrease = async () => {
    if (quantity >= maxQuantity) {
      setError(`최대 ${maxQuantity}개까지 구매 가능합니다.`);
      return;
    }

    setIsUpdating(true);
    setError(null);
    
    try {
      await updateQuantity(item.id, quantity + 1);
      onQuantityChange?.(item.id, quantity + 1);
    } catch (err) {
      setError('수량 변경에 실패했습니다.');
    } finally {
      setIsUpdating(false);
    }
  };

  // 수량 감소
  const handleDecrease = async () => {
    if (quantity <= 1) return;

    setIsUpdating(true);
    setError(null);
    
    try {
      await updateQuantity(item.id, quantity - 1);
      onQuantityChange?.(item.id, quantity - 1);
    } catch (err) {
      setError('수량 변경에 실패했습니다.');
    } finally {
      setIsUpdating(false);
    }
  };

  // 직접 수량 입력
  const handleQuantityChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value) || 1;
    
    if (newQuantity < 1 || newQuantity > maxQuantity) return;

    setIsUpdating(true);
    setError(null);
    
    try {
      await updateQuantity(item.id, newQuantity);
      onQuantityChange?.(item.id, newQuantity);
    } catch (err) {
      setError('수량 변경에 실패했습니다.');
    } finally {
      setIsUpdating(false);
    }
  };

  // 삭제
  const handleRemove = async () => {
    if (!window.confirm('이 상품을 장바구니에서 제거하시겠습니까?')) return;

    setIsUpdating(true);
    
    try {
      await removeItem(item.id);
      onRemove?.(item.id);
    } catch (err) {
      setError('상품 삭제에 실패했습니다.');
      setIsUpdating(false);
    }
  };

  // 선택/해제
  const handleToggleSelect = () => {
    toggleItemSelection(item.id);
    onSelect?.(item.id);
  };

  return (
    <Card 
      sx={{ 
        mb: 2, 
        opacity: !inStock ? 0.6 : selected ? 1 : 0.8,
        border: selected ? '2px solid' : '1px solid',
        borderColor: selected ? 'primary.main' : 'divider',
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* 체크박스 */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', pt: 1 }}>
            <Checkbox
              checked={selected}
              onChange={handleToggleSelect}
              disabled={!inStock || isUpdating}
              color="primary"
            />
          </Box>

          {/* 상품 이미지 */}
          <Box
            component="img"
            src={product.imageUrl || 'https://via.placeholder.com/150'}
            alt={product.name}
            sx={{
              width: 120,
              height: 120,
              objectFit: 'cover',
              borderRadius: 1,
              flexShrink: 0,
            }}
          />

          {/* 상품 정보 */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              {product.name}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {product.description}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              카테고리: {product.category.name}
            </Typography>

            {!inStock && (
              <Alert severity="error" sx={{ mb: 1 }}>
                재고가 부족합니다 (재고: {product.stockQuantity}개)
              </Alert>
            )}

            {error && (
              <Alert severity="warning" sx={{ mb: 1 }} onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            {/* 수량 조절 */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
              <IconButton
                size="small"
                onClick={handleDecrease}
                disabled={quantity <= 1 || isUpdating || !inStock}
              >
                <RemoveIcon />
              </IconButton>

              <TextField
                size="small"
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                disabled={isUpdating || !inStock}
                inputProps={{
                  min: 1,
                  max: maxQuantity,
                  style: { textAlign: 'center', width: '60px' }
                }}
              />

              <IconButton
                size="small"
                onClick={handleIncrease}
                disabled={quantity >= maxQuantity || isUpdating || !inStock}
              >
                <AddIcon />
              </IconButton>

              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                (최대 {maxQuantity}개)
              </Typography>
            </Box>
          </Box>

          {/* 가격 및 삭제 버튼 */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: 150 }}>
            <IconButton
              color="error"
              onClick={handleRemove}
              disabled={isUpdating}
              sx={{ mb: 1 }}
            >
              <DeleteIcon />
            </IconButton>

            <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
              {formatPrice(product.price)}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              소계
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              {formatPrice(subtotal)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CartItem;
