import { CartItem } from '../types/cart';
import { Product } from '../types';

/**
 * 상품 가격 포맷팅
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(price);
};

/**
 * 숫자를 천 단위로 구분
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('ko-KR').format(num);
};

/**
 * 재고 확인
 */
export const isInStock = (product: Product, quantity: number = 1): boolean => {
  return product.stockQuantity >= quantity;
};

/**
 * 최대 구매 가능 수량 계산
 */
export const getMaxQuantity = (product: Product): number => {
  // 재고가 10개 이상이면 최대 10개까지만 구매 가능
  return Math.min(product.stockQuantity, 10);
};

/**
 * 장바구니 아이템 유효성 검사
 */
export const validateCartItem = (item: CartItem): {
  isValid: boolean;
  message?: string;
} => {
  const { product, quantity } = item;

  // 재고 확인
  if (!isInStock(product, quantity)) {
    return {
      isValid: false,
      message: `${product.name}의 재고가 부족합니다. (재고: ${product.stockQuantity}개)`,
    };
  }

  // 수량 확인
  if (quantity < 1) {
    return {
      isValid: false,
      message: '수량은 1개 이상이어야 합니다.',
    };
  }

  const maxQuantity = getMaxQuantity(product);
  if (quantity > maxQuantity) {
    return {
      isValid: false,
      message: `최대 구매 가능 수량은 ${maxQuantity}개입니다.`,
    };
  }

  return { isValid: true };
};

/**
 * 장바구니 전체 유효성 검사
 */
export const validateCart = (items: CartItem[]): {
  isValid: boolean;
  invalidItems: Array<{ item: CartItem; message: string }>;
} => {
  const invalidItems: Array<{ item: CartItem; message: string }> = [];

  items.forEach(item => {
    const validation = validateCartItem(item);
    if (!validation.isValid) {
      invalidItems.push({
        item,
        message: validation.message || '유효하지 않은 상품입니다.',
      });
    }
  });

  return {
    isValid: invalidItems.length === 0,
    invalidItems,
  };
};

/**
 * 할인율 계산
 */
export const calculateDiscountRate = (originalPrice: number, discountedPrice: number): number => {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

/**
 * 무료 배송까지 남은 금액 계산
 */
export const getFreeShippingRemaining = (subtotal: number, freeShippingThreshold: number = 30000): number => {
  const remaining = freeShippingThreshold - subtotal;
  return remaining > 0 ? remaining : 0;
};

/**
 * 장바구니 아이템 그룹핑 (카테고리별)
 */
export const groupItemsByCategory = (items: CartItem[]): Record<string, CartItem[]> => {
  return items.reduce((groups, item) => {
    const category = item.product.category.name;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {} as Record<string, CartItem[]>);
};

/**
 * 품절 상품 필터링
 */
export const filterOutOfStockItems = (items: CartItem[]): {
  availableItems: CartItem[];
  outOfStockItems: CartItem[];
} => {
  const availableItems: CartItem[] = [];
  const outOfStockItems: CartItem[] = [];

  items.forEach(item => {
    if (isInStock(item.product, item.quantity)) {
      availableItems.push(item);
    } else {
      outOfStockItems.push(item);
    }
  });

  return { availableItems, outOfStockItems };
};

/**
 * 장바구니 아이템 정렬
 */
export const sortCartItems = (
  items: CartItem[],
  sortBy: 'name' | 'price' | 'date' | 'quantity' = 'date'
): CartItem[] => {
  const sorted = [...items];

  switch (sortBy) {
    case 'name':
      return sorted.sort((a, b) => a.product.name.localeCompare(b.product.name));
    
    case 'price':
      return sorted.sort((a, b) => b.product.price - a.product.price);
    
    case 'quantity':
      return sorted.sort((a, b) => b.quantity - a.quantity);
    
    case 'date':
    default:
      return sorted.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }
};

/**
 * 장바구니 만료 확인 (로컬스토리지용)
 */
export const isCartExpired = (lastUpdated: string, expiryDays: number = 7): boolean => {
  const lastUpdate = new Date(lastUpdated);
  const now = new Date();
  const diffInDays = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24);
  
  return diffInDays > expiryDays;
};
