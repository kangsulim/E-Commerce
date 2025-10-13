import { Product, User } from './index';

// 주문 상태
export type OrderStatus = 
  | 'PENDING'      // 주문 접수
  | 'CONFIRMED'    // 주문 확인
  | 'PREPARING'    // 배송 준비
  | 'SHIPPED'      // 배송 중
  | 'DELIVERED'    // 배송 완료
  | 'CANCELLED'    // 주문 취소
  | 'REFUNDED';    // 환불 완료

// 결제 방법
export type PaymentMethod = 
  | 'CARD'         // 신용/체크카드
  | 'BANK'         // 계좌이체
  | 'VIRTUAL'      // 가상계좌
  | 'PHONE'        // 휴대폰 결제
  | 'KAKAO'        // 카카오페이
  | 'NAVER'        // 네이버페이
  | 'TOSS';        // 토스페이

// 배송 정보
export interface ShippingInfo {
  recipientName: string;        // 받는 사람
  recipientPhone: string;       // 연락처
  zipCode: string;              // 우편번호
  address: string;              // 주소
  addressDetail: string;        // 상세주소
  deliveryRequest?: string;     // 배송 요청사항
}

// 결제 정보
export interface PaymentInfo {
  method: PaymentMethod;
  cardNumber?: string;          // 카드번호 (마스킹)
  cardCompany?: string;         // 카드사
  installment?: number;         // 할부 개월 (0: 일시불)
  bankName?: string;            // 은행명
  accountNumber?: string;       // 계좌번호
  depositorName?: string;       // 입금자명
}

// 주문 아이템
export interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  price: number;                // 주문 당시 가격
  subtotal: number;             // 소계 (price * quantity)
}

// 주문 생성 요청
export interface CreateOrderRequest {
  shippingInfo: ShippingInfo;
  paymentInfo: PaymentInfo;
  items: Array<{
    productId: number;
    quantity: number;
  }>;
  totalAmount: number;
  discountAmount?: number;
  shippingFee: number;
  usedPoints?: number;          // 사용한 포인트
  orderMessage?: string;        // 주문 메시지
}

// 주문 상세 정보
export interface Order {
  id: number;
  orderNumber: string;          // 주문번호
  user: User;
  items: OrderItem[];
  shippingInfo: ShippingInfo;
  paymentInfo: PaymentInfo;
  
  // 금액 정보
  subtotal: number;             // 상품 금액
  discountAmount: number;       // 할인 금액
  shippingFee: number;          // 배송비
  totalAmount: number;          // 총 결제 금액
  usedPoints: number;           // 사용 포인트
  earnedPoints: number;         // 적립 포인트
  
  // 상태 정보
  status: OrderStatus;
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  
  // 추적 정보
  trackingNumber?: string;      // 송장번호
  courier?: string;             // 택배사
  
  // 타임스탬프
  orderedAt: string;
  paidAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  
  // 메모
  orderMessage?: string;
  cancelReason?: string;
}

// 주문 목록 필터
export interface OrderFilters {
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;
  searchQuery?: string;
}

// 주문 통계
export interface OrderStats {
  total: number;
  pending: number;
  confirmed: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

// 주문 상태 변경 이력
export interface OrderStatusHistory {
  status: OrderStatus;
  message: string;
  createdAt: string;
}

// 주문 취소/반품 요청
export interface OrderCancellationRequest {
  orderId: number;
  reason: string;
  refundMethod: 'ORIGINAL' | 'POINTS';  // 원결제수단 | 포인트
  refundAccount?: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  };
}

// 배송 추적 정보
export interface DeliveryTracking {
  orderId: number;
  trackingNumber: string;
  courier: string;
  status: OrderStatus;
  events: Array<{
    status: string;
    location: string;
    message: string;
    timestamp: string;
  }>;
}

// 결제 단계
export type CheckoutStep = 
  | 'SHIPPING'     // 배송 정보 입력
  | 'PAYMENT'      // 결제 정보 입력
  | 'CONFIRM';     // 주문 확인

// 결제 진행 상태
export interface CheckoutState {
  currentStep: CheckoutStep;
  shippingInfo: ShippingInfo | null;
  paymentInfo: PaymentInfo | null;
  isProcessing: boolean;
  error: string | null;
}

// 주문 완료 응답
export interface OrderCompleteResponse {
  order: Order;
  message: string;
  redirectUrl?: string;
}

// 주문서 검증
export interface OrderValidation {
  isValid: boolean;
  errors: {
    shipping?: string[];
    payment?: string[];
    items?: string[];
  };
}
