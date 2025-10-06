import { Cart, CartItem } from '../types';
import { mockProducts } from './mockProducts';

// Mock 장바구니 아이템 데이터
export const mockCartItems: CartItem[] = [
  {
    id: 1,
    product: mockProducts[0], // 첫 번째 상품
    quantity: 2,
    createdAt: new Date().toISOString(),
    selected: true,
  },
  {
    id: 2,
    product: mockProducts[1], // 두 번째 상품
    quantity: 1,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1일 전
    selected: true,
  },
  {
    id: 3,
    product: mockProducts[2], // 세 번째 상품
    quantity: 3,
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2일 전
    selected: false,
  },
];

// Mock 장바구니 데이터
export const mockCart: Cart = {
  items: mockCartItems,
  totalPrice: mockCartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  ),
  totalItems: mockCartItems.reduce((sum, item) => sum + item.quantity, 0),
};

// 장바구니 계산 헬퍼 함수
export const calculateCartTotals = (items: CartItem[]) => {
  const selectedItems = items.filter(item => item.selected !== false);
  
  const subtotal = selectedItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const selectedItemsCount = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  
  // 배송비 계산 (30,000원 이상 무료배송)
  const shippingFee = subtotal >= 30000 ? 0 : 3000;
  
  // 할인 계산 (100,000원 이상 5% 할인)
  const discount = subtotal >= 100000 ? Math.floor(subtotal * 0.05) : 0;
  
  const totalPrice = subtotal + shippingFee - discount;
  
  return {
    subtotal,
    discount,
    shippingFee,
    totalPrice,
    totalItems,
    selectedItemsCount,
    selectedItemsPrice: subtotal,
  };
};

// 빈 장바구니
export const emptyCart: Cart = {
  items: [],
  totalPrice: 0,
  totalItems: 0,
};
