import * as yup from 'yup';

/**
 * 휴대폰 번호 유효성 검사
 */
export const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;

/**
 * 이메일 유효성 검사
 */
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * 우편번호 유효성 검사 (한국 5자리)
 */
export const zipCodeRegex = /^[0-9]{5}$/;

/**
 * 카드번호 유효성 검사 (16자리)
 */
export const cardNumberRegex = /^[0-9]{16}$/;

/**
 * 계좌번호 유효성 검사 (10-14자리)
 */
export const accountNumberRegex = /^[0-9]{10,14}$/;

/**
 * 배송 정보 유효성 검사 스키마
 */
export const shippingValidationSchema = yup.object().shape({
  recipientName: yup
    .string()
    .required('받는 사람 이름을 입력해주세요')
    .min(2, '이름은 최소 2글자 이상이어야 합니다')
    .max(50, '이름은 최대 50글자까지 입력 가능합니다'),
  
  recipientPhone: yup
    .string()
    .required('연락처를 입력해주세요')
    .matches(phoneRegex, '올바른 휴대폰 번호를 입력해주세요 (예: 010-1234-5678)'),
  
  zipCode: yup
    .string()
    .required('우편번호를 입력해주세요')
    .matches(zipCodeRegex, '5자리 숫자를 입력해주세요'),
  
  address: yup
    .string()
    .required('주소를 입력해주세요')
    .min(5, '주소는 최소 5글자 이상이어야 합니다')
    .max(200, '주소는 최대 200글자까지 입력 가능합니다'),
  
  addressDetail: yup
    .string()
    .required('상세주소를 입력해주세요')
    .min(2, '상세주소는 최소 2글자 이상이어야 합니다')
    .max(100, '상세주소는 최대 100글자까지 입력 가능합니다'),
  
  deliveryRequest: yup
    .string()
    .max(200, '배송 요청사항은 최대 200글자까지 입력 가능합니다'),
});

/**
 * 결제 정보 유효성 검사 스키마
 */
export const paymentValidationSchema = yup.object().shape({
  method: yup
    .string()
    .required('결제 방법을 선택해주세요')
    .oneOf(['CARD', 'BANK', 'VIRTUAL', 'PHONE', 'KAKAO', 'NAVER', 'TOSS'], 
      '올바른 결제 방법을 선택해주세요'),
  
  // 카드 결제
  cardNumber: yup.string().when('method', {
    is: 'CARD',
    then: (schema) => schema
      .required('카드번호를 입력해주세요')
      .matches(cardNumberRegex, '16자리 숫자를 입력해주세요')
      .test('luhn-check', '유효하지 않은 카드번호입니다', (value) => {
        if (!value) return false;
        return luhnCheck(value);
      }),
    otherwise: (schema) => schema.notRequired(),
  }),
  
  cardCompany: yup.string().when('method', {
    is: 'CARD',
    then: (schema) => schema.required('카드사를 선택해주세요'),
    otherwise: (schema) => schema.notRequired(),
  }),
  
  installment: yup.number()
    .min(0, '할부 개월은 0 이상이어야 합니다')
    .max(12, '할부는 최대 12개월까지 가능합니다'),
  
  // 계좌이체
  bankName: yup.string().when('method', {
    is: 'BANK',
    then: (schema) => schema.required('은행을 선택해주세요'),
    otherwise: (schema) => schema.notRequired(),
  }),
  
  accountNumber: yup.string().when('method', {
    is: 'BANK',
    then: (schema) => schema
      .matches(accountNumberRegex, '10-14자리 숫자를 입력해주세요'),
    otherwise: (schema) => schema.notRequired(),
  }),
  
  depositorName: yup.string().when('method', {
    is: 'BANK',
    then: (schema) => schema
      .min(2, '입금자명은 최소 2글자 이상이어야 합니다')
      .max(50, '입금자명은 최대 50글자까지 입력 가능합니다'),
    otherwise: (schema) => schema.notRequired(),
  }),
});

/**
 * Luhn 알고리즘을 사용한 카드번호 유효성 검사
 */
export function luhnCheck(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, '').split('').map(Number);
  
  if (digits.length !== 16) return false;
  
  let sum = 0;
  let isEven = false;
  
  // 오른쪽에서 왼쪽으로 순회
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = digits[i];
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}

/**
 * 휴대폰 번호 포맷팅 (010-1234-5678)
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3,4})(\d{4})$/);
  
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  
  return phone;
}

/**
 * 카드번호 마스킹 (1234-****-****-5678)
 */
export function maskCardNumber(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\D/g, '');
  
  if (cleaned.length !== 16) return cardNumber;
  
  return `${cleaned.slice(0, 4)}-****-****-${cleaned.slice(-4)}`;
}

/**
 * 계좌번호 마스킹 (123-****-5678)
 */
export function maskAccountNumber(accountNumber: string): string {
  if (accountNumber.length < 8) return accountNumber;
  
  const start = accountNumber.slice(0, 3);
  const end = accountNumber.slice(-4);
  const masked = '*'.repeat(accountNumber.length - 7);
  
  return `${start}-${masked}-${end}`;
}

/**
 * 주소 유효성 검사
 */
export function validateAddress(address: string, detail: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!address || address.trim().length < 5) {
    errors.push('주소는 최소 5글자 이상이어야 합니다');
  }
  
  if (!detail || detail.trim().length < 2) {
    errors.push('상세주소는 최소 2글자 이상이어야 합니다');
  }
  
  if (address.length > 200) {
    errors.push('주소는 최대 200글자까지 입력 가능합니다');
  }
  
  if (detail.length > 100) {
    errors.push('상세주소는 최대 100글자까지 입력 가능합니다');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * 결제 금액 유효성 검사
 */
export function validatePaymentAmount(amount: number): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (amount <= 0) {
    errors.push('결제 금액은 0보다 커야 합니다');
  }
  
  if (amount > 100000000) {
    errors.push('결제 금액은 1억원을 초과할 수 없습니다');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * 할부 가능 여부 확인
 */
export function isInstallmentAvailable(amount: number): boolean {
  return amount >= 50000; // 5만원 이상부터 할부 가능
}

/**
 * 배송비 무료 조건 확인
 */
export function isFreeShipping(amount: number, threshold: number = 50000): boolean {
  return amount >= threshold;
}

/**
 * 적립 포인트 계산 (1% 기본)
 */
export function calculateEarnedPoints(
  amount: number, 
  rate: number = 0.01
): number {
  return Math.floor(amount * rate);
}

/**
 * 전화번호 자동 하이픈 추가
 */
export function autoHyphenPhone(value: string): string {
  const cleaned = value.replace(/\D/g, '');
  
  if (cleaned.length <= 3) {
    return cleaned;
  } else if (cleaned.length <= 7) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  } else if (cleaned.length <= 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;
  }
}

/**
 * 카드번호 자동 하이픈 추가
 */
export function autoHyphenCard(value: string): string {
  const cleaned = value.replace(/\D/g, '');
  const chunks = cleaned.match(/.{1,4}/g) || [];
  return chunks.join('-').slice(0, 19); // 16자리 + 3개 하이픈
}

/**
 * 우편번호 자동 포맷
 */
export function formatZipCode(value: string): string {
  return value.replace(/\D/g, '').slice(0, 5);
}

/**
 * 입력값 정제 (특수문자 제거)
 */
export function sanitizeInput(value: string): string {
  return value.replace(/[<>]/g, '');
}

/**
 * 주문 정보 전체 검증
 */
export function validateCheckoutData(data: {
  shippingInfo: any;
  paymentInfo: any;
  items: any[];
  totalAmount: number;
}): {
  isValid: boolean;
  errors: Record<string, string[]>;
} {
  const errors: Record<string, string[]> = {};
  
  // 배송 정보 검증
  try {
    shippingValidationSchema.validateSync(data.shippingInfo, { abortEarly: false });
  } catch (err: any) {
    errors.shipping = err.errors;
  }
  
  // 결제 정보 검증
  try {
    paymentValidationSchema.validateSync(data.paymentInfo, { abortEarly: false });
  } catch (err: any) {
    errors.payment = err.errors;
  }
  
  // 상품 검증
  if (!data.items || data.items.length === 0) {
    errors.items = ['주문할 상품이 없습니다'];
  }
  
  // 금액 검증
  const amountValidation = validatePaymentAmount(data.totalAmount);
  if (!amountValidation.isValid) {
    errors.amount = amountValidation.errors;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
