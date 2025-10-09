import React, { useState } from 'react';
import {
  Box,
  Typography,
  Checkbox,
  Button,
  Divider,
  Alert,
  FormControlLabel,
  Stack,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { CartItem as CartItemType } from '../../types/cart';
import CartItem from './CartItem';
import { useCart } from '../../hooks/useCart';
import { filterOutOfStockItems } from '../../utils/cart';

interface CartListProps {
  items: CartItemType[];
  showSelectAll?: boolean;
  showDeleteSelected?: boolean;
}

export const CartList: React.FC<CartListProps> = ({ 
  items,
  showSelectAll = true,
  showDeleteSelected = true,
}) => {
  const { toggleAllSelection, removeSelectedItems } = useCart();
  const [isDeleting, setIsDeleting] = useState(false);

  const { availableItems, outOfStockItems } = filterOutOfStockItems(items);
  
  // 전체 선택 여부 확인
  const allSelected = items.length > 0 && items.every(item => item.selected);
  const someSelected = items.some(item => item.selected);
  const selectedCount = items.filter(item => item.selected).length;

  // 전체 선택/해제
  const handleToggleAll = () => {
    toggleAllSelection(!allSelected);
  };

  // 선택 항목 삭제
  const handleDeleteSelected = async () => {
    if (!window.confirm(`선택한 ${selectedCount}개의 상품을 삭제하시겠습니까?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await removeSelectedItems();
    } catch (error) {
      console.error('Failed to delete selected items:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <Box>
      {/* 헤더: 전체 선택 및 삭제 버튼 */}
      {showSelectAll && (
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 2,
            p: 2,
            backgroundColor: 'background.paper',
            borderRadius: 1,
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={allSelected}
                indeterminate={someSelected && !allSelected}
                onChange={handleToggleAll}
              />
            }
            label={
              <Typography variant="body1" fontWeight="medium">
                전체 선택 ({selectedCount}/{items.length})
              </Typography>
            }
          />

          {showDeleteSelected && someSelected && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteSelected}
              disabled={isDeleting}
            >
              선택 삭제
            </Button>
          )}
        </Box>
      )}

      {/* 재고 부족 경고 */}
      {outOfStockItems.length > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          재고가 부족한 상품이 {outOfStockItems.length}개 있습니다. 
          해당 상품은 주문할 수 없습니다.
        </Alert>
      )}

      {/* 장바구니 아이템 목록 */}
      <Stack spacing={2}>
        {/* 구매 가능한 상품 */}
        {availableItems.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}

        {/* 구매 불가능한 상품 (품절) */}
        {outOfStockItems.length > 0 && (
          <>
            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                구매 불가 상품
              </Typography>
            </Divider>
            
            {outOfStockItems.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </>
        )}
      </Stack>

      {/* 푸터 정보 */}
      <Box sx={{ mt: 3, p: 2, backgroundColor: 'background.paper', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          💡 장바구니에 담긴 상품은 7일간 보관됩니다.
        </Typography>
      </Box>
    </Box>
  );
};

export default CartList;
