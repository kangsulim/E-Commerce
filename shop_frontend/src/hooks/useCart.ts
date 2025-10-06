import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, CartState, CartActions, CartCalculation, CART_STORAGE_KEY } from '../types/cart';
import { Product } from '../types';
import { cartService } from '../services/cart';
import { calculateCartTotals } from '../data/mockCart';

// 장바구니 Store 타입
interface CartStore extends CartState, CartActions {
  // 계산된 값
  getCalculations: () => CartCalculation;
  
  // 특정 상품이 장바구니에 있는지 확인
  isInCart: (productId: number) => boolean;
  
  // 특정 상품의 수량 가져오기
  getItemQuantity: (productId: number) => number;
}

// Zustand Store 생성
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // 초기 상태
      items: [],
      isLoading: false,
      error: null,

      // 계산된 값 가져오기
      getCalculations: () => {
        const items = get().items;
        return calculateCartTotals(items);
      },

      // 상품이 장바구니에 있는지 확인
      isInCart: (productId: number) => {
        return get().items.some(item => item.product.id === productId);
      },

      // 상품 수량 가져오기
      getItemQuantity: (productId: number) => {
        const item = get().items.find(item => item.product.id === productId);
        return item ? item.quantity : 0;
      },

      // 장바구니 새로고침
      refreshCart: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const cart = await cartService.getCart();
          set({ 
            items: cart.items.map(item => ({ ...item, selected: true })),
            isLoading: false 
          });
        } catch (error) {
          console.error('Failed to refresh cart:', error);
          set({ 
            error: '장바구니를 불러오는데 실패했습니다.',
            isLoading: false 
          });
        }
      },

      // 상품 추가
      addItem: async (product: Product, quantity = 1) => {
        set({ isLoading: true, error: null });
        
        try {
          // 이미 장바구니에 있는 상품인지 확인
          const existingItem = get().items.find(
            item => item.product.id === product.id
          );

          if (existingItem) {
            // 기존 상품 수량 증가
            const newQuantity = existingItem.quantity + quantity;
            await get().updateQuantity(existingItem.id, newQuantity);
          } else {
            // 새 상품 추가
            const newItem = await cartService.addToCart(product.id, quantity);
            
            set(state => ({
              items: [...state.items, { ...newItem, selected: true }],
              isLoading: false,
            }));
          }
        } catch (error) {
          console.error('Failed to add item to cart:', error);
          set({ 
            error: '상품을 장바구니에 추가하는데 실패했습니다.',
            isLoading: false 
          });
          throw error;
        }
      },

      // 수량 업데이트
      updateQuantity: async (itemId: number, quantity: number) => {
        if (quantity < 1) {
          return get().removeItem(itemId);
        }

        set({ isLoading: true, error: null });
        
        try {
          await cartService.updateCartItem(itemId, quantity);
          
          set(state => ({
            items: state.items.map(item =>
              item.id === itemId ? { ...item, quantity } : item
            ),
            isLoading: false,
          }));
        } catch (error) {
          console.error('Failed to update quantity:', error);
          set({ 
            error: '수량 변경에 실패했습니다.',
            isLoading: false 
          });
          throw error;
        }
      },

      // 상품 제거
      removeItem: async (itemId: number) => {
        set({ isLoading: true, error: null });
        
        try {
          await cartService.removeFromCart(itemId);
          
          set(state => ({
            items: state.items.filter(item => item.id !== itemId),
            isLoading: false,
          }));
        } catch (error) {
          console.error('Failed to remove item:', error);
          set({ 
            error: '상품 삭제에 실패했습니다.',
            isLoading: false 
          });
          throw error;
        }
      },

      // 장바구니 비우기
      clearCart: async () => {
        set({ isLoading: true, error: null });
        
        try {
          await cartService.clearCart();
          
          set({ 
            items: [],
            isLoading: false 
          });
        } catch (error) {
          console.error('Failed to clear cart:', error);
          set({ 
            error: '장바구니 비우기에 실패했습니다.',
            isLoading: false 
          });
          throw error;
        }
      },

      // 아이템 선택/해제
      toggleItemSelection: (itemId: number) => {
        set(state => ({
          items: state.items.map(item =>
            item.id === itemId 
              ? { ...item, selected: !item.selected }
              : item
          ),
        }));
      },

      // 전체 선택/해제
      toggleAllSelection: (selected: boolean) => {
        set(state => ({
          items: state.items.map(item => ({ ...item, selected })),
        }));
      },

      // 선택된 아이템 제거
      removeSelectedItems: async () => {
        const selectedItems = get().items.filter(item => item.selected);
        
        if (selectedItems.length === 0) return;

        set({ isLoading: true, error: null });
        
        try {
          // 모든 선택된 아이템 삭제 요청
          await Promise.all(
            selectedItems.map(item => cartService.removeFromCart(item.id))
          );
          
          set(state => ({
            items: state.items.filter(item => !item.selected),
            isLoading: false,
          }));
        } catch (error) {
          console.error('Failed to remove selected items:', error);
          set({ 
            error: '선택한 상품 삭제에 실패했습니다.',
            isLoading: false 
          });
          throw error;
        }
      },
    }),
    {
      name: CART_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      // 저장할 상태만 선택
      partialize: (state) => ({ 
        items: state.items,
      }),
    }
  )
);

// Custom Hook으로 래핑
export const useCart = () => {
  const store = useCartStore();
  
  return {
    // 상태
    items: store.items,
    isLoading: store.isLoading,
    error: store.error,
    
    // 계산된 값
    calculations: store.getCalculations(),
    
    // 헬퍼 메서드
    isInCart: store.isInCart,
    getItemQuantity: store.getItemQuantity,
    
    // 액션
    addItem: store.addItem,
    updateQuantity: store.updateQuantity,
    removeItem: store.removeItem,
    clearCart: store.clearCart,
    toggleItemSelection: store.toggleItemSelection,
    toggleAllSelection: store.toggleAllSelection,
    removeSelectedItems: store.removeSelectedItems,
    refreshCart: store.refreshCart,
  };
};

// 선택자 Hooks (성능 최적화용)
export const useCartItemCount = () => 
  useCartStore(state => state.items.reduce((sum, item) => sum + item.quantity, 0));

export const useCartTotalPrice = () => 
  useCartStore(state => state.getCalculations().totalPrice);

export const useCartSelectedCount = () => 
  useCartStore(state => state.getCalculations().selectedItemsCount);
