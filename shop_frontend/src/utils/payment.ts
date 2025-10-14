import { PaymentMethod } from '../types/order';

/**
 * 결제 수단별 아이콘 및 정보
 */
export const PAYMENT_METHOD_INFO: Record<
  PaymentMethod,
  {
    label: string;
    description: string;
    icon: string;
    color: string;
  }
> = {
  CARD: {
    label: '신용/체크카드',
    description: '모든 카드사 사용 가능',
    icon: '💳',
    color: '#1976d2',
  },
  BANK: {
    label: '계좌이체',
    description: '실시간 계좌이체',
    icon: '🏦',
    color: '#2e7d32',
  },
  VIRTUAL: {
    label: '가상계좌',
    description: '가상계좌 입금',
    icon: '💰',
    color: '#ed6c02',
  },
  PHONE: {
    label: '휴대폰 결제',
    description: '통신사 결제',
    icon: '📱',
    color: '#9c27b0',
  },
  KAKAO: {
    label: '카카오페이',
    description: '간편결제',
    icon: '💛',
    color: '#FEE500',
  },
  NAVER: {
    label: '네이버페이',
    description: '간편결제',
    icon: '💚',
    color: '#03C75A',
  },
  TOSS: {
    label: '토스페이',
    description: '간편결제',
    icon: '💙',
    color: '#0064FF',
  },
};

/**
 * 결제 수단 라벨 가져오기
 */
export function getPaymentMethodLabel(method: PaymentMethod): string {
  return PAYMENT_METHOD_INFO[method]?.label || method;
}

/**
 * 결제 수단 아이콘 가져오기
 */
export function getPaymentMethodIcon(method: PaymentMethod): string {
  return PAYMENT_METHOD_INFO[method]?.icon || '💳';
}

/**
 * 간편결제 여부 확인
 */
export function isSimplePayment(method: PaymentMethod): boolean {
  return ['KAKAO', 'NAVER', 'TOSS'].includes(method);
}

/**
 * 카드사 목록
 */
export const CARD_COMPANIES = [
  '삼성카드',
  '신한카드',
  '현대카드',
  '우리카드',
  'KB국민카드',
  '하나카드',
  'NH농협카드',
  'BC카드',
  '롯데카드',
  'IBK기업은행',
  '씨티카드',
  '카카오뱅크',
  '케이뱅크',
  '토스뱅크',
];

/**
 * 은행 목록
 */
export const BANKS = [
  'KB국민은행',
  '신한은행',
  '우리은행',
  'NH농협은행',
  '하나은행',
  'IBK기업은행',
  'SC제일은행',
  '한국씨티은행',
  '카카오뱅크',
  '토스뱅크',
  '케이뱅크',
  '새마을금고',
  '신협',
  '우체국',
];

/**
 * 할부 개월 옵션
 */
export const INSTALLMENT_OPTIONS = [
  { value: 0, label: '일시불' },
  { value: 2, label: '2개월' },
  { value: 3, label: '3개월' },
  { value: 6, label: '6개월' },
  { value: 12, label: '12개월' },
];

/**
 * 무이자 할부 가능 여부 확인
 */
export function isInterestFreeInstallment(
  cardCompany: string,
  installment: number,
  amount: number
): boolean {
  // 임시: 5만원 이상, 2-12개월 할부 시 무이자
  // 실제로는 카드사별, 프로모션별로 다름
  return amount >= 50000 && installment >= 2 && installment <= 12;
}

/**
 * 결제 금액에 따른 수수료 계산
 */
export function calculatePaymentFee(
  method: PaymentMethod,
  amount: number
): number {
  switch (method) {
    case 'CARD':
      return 0; // 카드는 수수료 없음 (가맹점 부담)
    case 'BANK':
      return 0; // 계좌이체 무료
    case 'VIRTUAL':
      return 500; // 가상계좌 수수료
    case 'PHONE':
      return Math.floor(amount * 0.035); // 휴대폰 결제 3.5%
    case 'KAKAO':
    case 'NAVER':
    case 'TOSS':
      return 0; // 간편결제 무료
    default:
      return 0;
  }
}

/**
 * 할부 수수료 계산
 */
export function calculateInstallmentFee(
  amount: number,
  installment: number,
  isInterestFree: boolean = true
): number {
  if (installment === 0 || isInterestFree) {
    return 0;
  }
  
  // 일반 할부 이자율 (연 15% 가정)
  const monthlyRate = 0.15 / 12;
  const totalAmount = amount * (1 + monthlyRate * installment);
  
  return Math.floor(totalAmount - amount);
}

/**
 * 월 할부금 계산
 */
export function calculateMonthlyPayment(
  amount: number,
  installment: number
): number {
  if (installment === 0) {
    return amount;
  }
  
  return Math.floor(amount / installment);
}

/**
 * 결제 정보 마스킹
 */
export function maskPaymentInfo(
  method: PaymentMethod,
  info: Record<string, any>
): Record<string, any> {
  const masked = { ...info };
  
  if (method === 'CARD' && masked.cardNumber) {
    // 카드번호 마스킹
    const cleaned = masked.cardNumber.replace(/\D/g, '');
    masked.cardNumber = `${cleaned.slice(0, 4)}-****-****-${cleaned.slice(-4)}`;
  }
  
  if (method === 'BANK' && masked.accountNumber) {
    // 계좌번호 마스킹
    const number = masked.accountNumber;
    if (number.length >= 8) {
      masked.accountNumber = `${number.slice(0, 3)}-****-${number.slice(-4)}`;
    }
  }
  
  return masked;
}

/**
 * 결제 가능 여부 확인
 */
export function validatePayment(
  method: PaymentMethod,
  amount: number,
  info: Record<string, any>
): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // 최소 결제 금액 확인
  if (amount < 100) {
    errors.push('최소 결제 금액은 100원입니다');
  }
  
  // 최대 결제 금액 확인
  if (amount > 100000000) {
    errors.push('결제 금액은 1억원을 초과할 수 없습니다');
  }
  
  // 결제 수단별 검증
  switch (method) {
    case 'CARD':
      if (!info.cardNumber || info.cardNumber.replace(/\D/g, '').length !== 16) {
        errors.push('유효한 카드번호를 입력해주세요');
      }
      if (!info.cardCompany) {
        errors.push('카드사를 선택해주세요');
      }
      break;
      
    case 'BANK':
      if (!info.bankName) {
        errors.push('은행을 선택해주세요');
      }
      break;
      
    case 'PHONE':
      if (amount > 500000) {
        errors.push('휴대폰 결제는 50만원까지 가능합니다');
      }
      break;
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * 결제 상태 메시지
 */
export function getPaymentStatusMessage(status: string): string {
  const messages: Record<string, string> = {
    PENDING: '결제 대기 중',
    PROCESSING: '결제 처리 중',
    COMPLETED: '결제 완료',
    FAILED: '결제 실패',
    CANCELLED: '결제 취소',
    REFUNDED: '환불 완료',
  };
  
  return messages[status] || status;
}

/**
 * 결제 영수증 URL 생성
 */
export function getReceiptUrl(orderId: number, paymentId: string): string {
  return `/api/orders/${orderId}/receipt?paymentId=${paymentId}`;
}

/**
 * 결제 에러 메시지 파싱
 */
export function parsePaymentError(error: any): string {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  const errorCodes: Record<string, string> = {
    INSUFFICIENT_FUNDS: '잔액이 부족합니다',
    INVALID_CARD: '유효하지 않은 카드입니다',
    EXPIRED_CARD: '만료된 카드입니다',
    DECLINED: '카드사 승인이 거부되었습니다',
    LIMIT_EXCEEDED: '한도가 초과되었습니다',
    NETWORK_ERROR: '네트워크 오류가 발생했습니다',
    TIMEOUT: '결제 시간이 초과되었습니다',
  };
  
  return errorCodes[error?.code] || '결제 처리 중 오류가 발생했습니다';
}

/**
 * PG사 결제창 열기 (Mock)
 */
export function openPaymentWindow(
  method: PaymentMethod,
  amount: number,
  orderInfo: {
    orderId: string;
    productName: string;
    buyerName: string;
    buyerPhone: string;
    buyerEmail: string;
  }
): Promise<{
  success: boolean;
  transactionId?: string;
  message?: string;
}> {
  return new Promise((resolve) => {
    // Mock 결제창
    console.log('결제 정보:', {
      method,
      amount,
      ...orderInfo,
    });
    
    // 간편결제는 바로 성공
    if (isSimplePayment(method)) {
      setTimeout(() => {
        resolve({
          success: true,
          transactionId: `TXN${Date.now()}`,
        });
      }, 1500);
      return;
    }
    
    // 일반 결제는 3초 후 성공
    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% 성공률
      
      resolve({
        success,
        transactionId: success ? `TXN${Date.now()}` : undefined,
        message: success ? '결제가 완료되었습니다' : '결제에 실패했습니다',
      });
    }, 3000);
  });
}

/**
 * 결제 취소 가능 여부 확인
 */
export function canCancelPayment(
  paymentStatus: string,
  orderedAt: string
): boolean {
  // 결제 완료 상태이고, 주문 후 24시간 이내
  if (paymentStatus !== 'COMPLETED') {
    return false;
  }
  
  const orderDate = new Date(orderedAt);
  const now = new Date();
  const hoursDiff = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60);
  
  return hoursDiff < 24;
}

/**
 * 환불 예상 일수 계산
 */
export function getRefundDays(method: PaymentMethod): number {
  const days: Record<PaymentMethod, number> = {
    CARD: 3, // 3-5 영업일
    BANK: 1, // 1 영업일
    VIRTUAL: 1, // 1 영업일
    PHONE: 7, // 7일
    KAKAO: 1, // 1 영업일
    NAVER: 1, // 1 영업일
    TOSS: 1, // 1 영업일
  };
  
  return days[method] || 3;
}
