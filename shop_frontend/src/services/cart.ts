import { apiClient } from './api';
import {
  Cart,
  CartItem,
} from '../types';

export const cartService = {
  // 장바구니 조회
  getCart: async (): Promise<Cart> => {
    return apiClient.get<Cart>('/cart');
  },

  // 장바구니에 상품 추가
  addToCart: async (productId: number, quantity: number): Promise<CartItem> => {
    return apiClient.post<CartItem>('/cart', { productId, quantity });
  },

  // 장바구니 상품 수량 업데이트
  updateCartItem: async (itemId: number, quantity: number): Promise<CartItem> => {
    return apiClient.put<CartItem>(`/cart/${itemId}`, { quantity });
  },

  // 장바구니 상품 제거
  removeFromCart: async (itemId: number): Promise<void> => {
    return apiClient.delete<void>(`/cart/${itemId}`);
  },

  // 장바구니 비우기
  clearCart: async (): Promise<void> => {
    return apiClient.delete<void>('/cart');
  },
};
