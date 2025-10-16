import { Order, OrderStatus } from '../types/order';
import { mockProducts } from './mockProducts';
import { Product } from '../types';

// mockProducts를 Product 타입으로 변환
const convertMockProduct = (mockProd: typeof mockProducts[0]): Product => {
  return {
    id: mockProd.id,
    name: mockProd.name,
    description: mockProd.description,
    price: mockProd.price,
    stockQuantity: mockProd.stockQuantity,
    imageUrl: mockProd.images[0],
    category: {
      id: mockProd.categoryId,
      name: mockProd.category,
    },
    createdAt: mockProd.createdAt,
    updatedAt: mockProd.updatedAt,
  };
};

// Mock 사용자
const mockUser = {
  id: 1,
  email: 'user@example.com',
  name: '홍길동',
  role: 'USER' as const,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

// Mock 주문 데이터
export const mockOrders: Order[] = [
  {
    id: 1,
    orderNumber: 'ORD-20241016-001',
    user: mockUser,
    items: [
      {
        id: 1,
        product: convertMockProduct(mockProducts[0]),
        quantity: 2,
        price: mockProducts[0].price,
        subtotal: mockProducts[0].price * 2,
      },
      {
        id: 2,
        product: convertMockProduct(mockProducts[1]),
        quantity: 1,
        price: mockProducts[1].price,
        subtotal: mockProducts[1].price,
      },
    ],
    shippingInfo: {
      recipientName: '홍길동',
      recipientPhone: '010-1234-5678',
      zipCode: '12345',
      address: '서울시 강남구 테헤란로 123',
      addressDetail: '101동 101호',
      deliveryRequest: '문 앞에 놓아주세요',
    },
    paymentInfo: {
      method: 'CARD',
      cardCompany: '신한카드',
      installment: 0,
    },
    subtotal: 130000,
    discountAmount: 6500,
    shippingFee: 0,
    totalAmount: 123500,
    usedPoints: 0,
    earnedPoints: 1235,
    status: 'DELIVERED',
    paymentStatus: 'COMPLETED',
    trackingNumber: '123456789012',
    courier: 'CJ대한통운',
    orderedAt: '2024-10-01T10:00:00Z',
    paidAt: '2024-10-01T10:05:00Z',
    shippedAt: '2024-10-02T14:00:00Z',
    deliveredAt: '2024-10-03T16:30:00Z',
  },
  {
    id: 2,
    orderNumber: 'ORD-20241014-002',
    user: mockUser,
    items: [
      {
        id: 3,
        product: convertMockProduct(mockProducts[2]),
        quantity: 1,
        price: mockProducts[2].price,
        subtotal: mockProducts[2].price,
      },
    ],
    shippingInfo: {
      recipientName: '홍길동',
      recipientPhone: '010-1234-5678',
      zipCode: '12345',
      address: '서울시 강남구 테헤란로 123',
      addressDetail: '101동 101호',
    },
    paymentInfo: {
      method: 'KAKAO',
    },
    subtotal: 45000,
    discountAmount: 0,
    shippingFee: 3000,
    totalAmount: 48000,
    usedPoints: 0,
    earnedPoints: 480,
    status: 'SHIPPED',
    paymentStatus: 'COMPLETED',
    trackingNumber: '987654321098',
    courier: '로젠택배',
    orderedAt: '2024-10-14T15:30:00Z',
    paidAt: '2024-10-14T15:32:00Z',
    shippedAt: '2024-10-15T09:00:00Z',
  },
  {
    id: 3,
    orderNumber: 'ORD-20241015-003',
    user: mockUser,
    items: [
      {
        id: 4,
        product: convertMockProduct(mockProducts[3]),
        quantity: 3,
        price: mockProducts[3].price,
        subtotal: mockProducts[3].price * 3,
      },
    ],
    shippingInfo: {
      recipientName: '김철수',
      recipientPhone: '010-9876-5432',
      zipCode: '54321',
      address: '부산시 해운대구 해운대로 456',
      addressDetail: '202동 303호',
      deliveryRequest: '경비실에 맡겨주세요',
    },
    paymentInfo: {
      method: 'BANK',
      bankName: 'KB국민은행',
    },
    subtotal: 150000,
    discountAmount: 7500,
    shippingFee: 0,
    totalAmount: 142500,
    usedPoints: 0,
    earnedPoints: 1425,
    status: 'PREPARING',
    paymentStatus: 'COMPLETED',
    orderedAt: '2024-10-15T11:00:00Z',
    paidAt: '2024-10-15T11:03:00Z',
  },
  {
    id: 4,
    orderNumber: 'ORD-20241016-004',
    user: mockUser,
    items: [
      {
        id: 5,
        product: convertMockProduct(mockProducts[4]),
        quantity: 1,
        price: mockProducts[4].price,
        subtotal: mockProducts[4].price,
      },
    ],
    shippingInfo: {
      recipientName: '홍길동',
      recipientPhone: '010-1234-5678',
      zipCode: '12345',
      address: '서울시 강남구 테헤란로 123',
      addressDetail: '101동 101호',
    },
    paymentInfo: {
      method: 'TOSS',
    },
    subtotal: 89000,
    discountAmount: 0,
    shippingFee: 0,
    totalAmount: 89000,
    usedPoints: 0,
    earnedPoints: 890,
    status: 'PENDING',
    paymentStatus: 'COMPLETED',
    orderedAt: '2024-10-16T09:00:00Z',
    paidAt: '2024-10-16T09:01:00Z',
  },
  {
    id: 5,
    orderNumber: 'ORD-20240920-005',
    user: mockUser,
    items: [
      {
        id: 6,
        product: convertMockProduct(mockProducts[5]),
        quantity: 2,
        price: mockProducts[5].price,
        subtotal: mockProducts[5].price * 2,
      },
    ],
    shippingInfo: {
      recipientName: '홍길동',
      recipientPhone: '010-1234-5678',
      zipCode: '12345',
      address: '서울시 강남구 테헤란로 123',
      addressDetail: '101동 101호',
    },
    paymentInfo: {
      method: 'CARD',
      cardCompany: '현대카드',
      installment: 3,
    },
    subtotal: 65000,
    discountAmount: 0,
    shippingFee: 0,
    totalAmount: 65000,
    usedPoints: 0,
    earnedPoints: 650,
    status: 'CANCELLED',
    paymentStatus: 'CANCELLED',
    orderedAt: '2024-09-20T14:00:00Z',
    paidAt: '2024-09-20T14:02:00Z',
    cancelledAt: '2024-09-21T10:00:00Z',
    cancelReason: '단순 변심',
  },
];

// 주문 상태별 한글 라벨
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: '주문 접수',
  CONFIRMED: '주문 확인',
  PREPARING: '배송 준비',
  SHIPPED: '배송 중',
  DELIVERED: '배송 완료',
  CANCELLED: '주문 취소',
  REFUNDED: '환불 완료',
};

// 주문 상태별 색상
export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: 'info',
  CONFIRMED: 'primary',
  PREPARING: 'warning',
  SHIPPED: 'secondary',
  DELIVERED: 'success',
  CANCELLED: 'error',
  REFUNDED: 'default',
};

// 결제 상태별 한글 라벨
export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: '결제 대기',
  COMPLETED: '결제 완료',
  FAILED: '결제 실패',
  CANCELLED: '결제 취소',
};

// 주문 필터 옵션
export const ORDER_FILTER_OPTIONS = [
  { value: 'ALL', label: '전체' },
  { value: 'PENDING', label: '주문 접수' },
  { value: 'PREPARING', label: '배송 준비' },
  { value: 'SHIPPED', label: '배송 중' },
  { value: 'DELIVERED', label: '배송 완료' },
  { value: 'CANCELLED', label: '취소/환불' },
];

// 기간 필터 옵션
export const DATE_FILTER_OPTIONS = [
  { value: '1M', label: '최근 1개월' },
  { value: '3M', label: '최근 3개월' },
  { value: '6M', label: '최근 6개월' },
  { value: '1Y', label: '최근 1년' },
  { value: 'ALL', label: '전체' },
];

// 주문 통계 계산
export const calculateOrderStats = (orders: Order[]) => {
  return {
    total: orders.length,
    pending: orders.filter(o => o.status === 'PENDING').length,
    confirmed: orders.filter(o => o.status === 'CONFIRMED').length,
    preparing: orders.filter(o => o.status === 'PREPARING').length,
    shipped: orders.filter(o => o.status === 'SHIPPED').length,
    delivered: orders.filter(o => o.status === 'DELIVERED').length,
    cancelled: orders.filter(o => o.status === 'CANCELLED' || o.status === 'REFUNDED').length,
    totalAmount: orders
      .filter(o => o.status !== 'CANCELLED')
      .reduce((sum, o) => sum + o.totalAmount, 0),
  };
};
