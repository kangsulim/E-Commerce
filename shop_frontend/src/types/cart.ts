import { Product, CartItem as BaseCartItem } from './index';

// 확장된 장바구니 아이템 타입
export interface CartItem extends BaseCartItem {
  // 기존 타입 확장
  selected?: boolean; // 선택 여부 (부분 결제용)
  maxQuantity?: number; // 최대 수량 제한
}

// 장바구니 상태 인터페이스
export interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
}

// 장바구니 액션 타입
export interface CartActions {
  // 상품 추가
  addItem: (product: Product, quantity?: number) => Promise<void>;
  
  // 수량 업데이트
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  
  // 상품 제거
  removeItem: (itemId: number) => Promise<void>;
  
  // 장바구니 비우기
  clearCart: () => Promise<void>;
  
  // 아이템 선택/해제
  toggleItemSelection: (itemId: number) => void;
  
  // 전체 선택/해제
  toggleAllSelection: (selected: boolean) => void;
  
  // 선택된 아이템 제거
  removeSelectedItems: () => Promise<void>;
  
  // 장바구니 새로고침
  refreshCart: () => Promise<void>;
}

// 장바구니 계산 타입
export interface CartCalculation {
  subtotal: number; // 소계
  discount: number; // 할인액
  shippingFee: number; // 배송비
  totalPrice: number; // 총 결제 금액
  totalItems: number; // 총 상품 개수
  selectedItemsCount: number; // 선택된 상품 개수
  selectedItemsPrice: number; // 선택된 상품 금액
}

// 장바구니 알림 타입
export type CartNotificationType = 'success' | 'error' | 'warning' | 'info';

export interface CartNotification {
  type: CartNotificationType;
  message: string;
  duration?: number;
}

// 장바구니 로컬 스토리지 키
export const CART_STORAGE_KEY = 'ecommerce_cart';
export const CART_EXPIRY_DAYS = 7; // 7일 후 만료
