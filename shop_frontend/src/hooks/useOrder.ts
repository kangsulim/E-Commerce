import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  CheckoutState,
  CheckoutStep,
  ShippingInfo,
  PaymentInfo,
  CreateOrderRequest,
  Order,
} from '../types/order';
import { useCart } from './useCart';

// 주문 Store 타입
interface OrderStore extends CheckoutState {
  // 단계 이동
  setStep: (step: CheckoutStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  
  // 배송 정보
  setShippingInfo: (info: ShippingInfo) => void;
  
  // 결제 정보
  setPaymentInfo: (info: PaymentInfo) => void;
  
  // 주문 처리
  submitOrder: (request: CreateOrderRequest) => Promise<Order>;
  
  // 초기화
  resetCheckout: () => void;
  
  // 에러 처리
  setError: (error: string | null) => void;
}

// 단계 순서
const STEP_ORDER: CheckoutStep[] = ['SHIPPING', 'PAYMENT', 'CONFIRM'];

// Zustand Store 생성
export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      // 초기 상태
      currentStep: 'SHIPPING',
      shippingInfo: null,
      paymentInfo: null,
      isProcessing: false,
      error: null,

      // 단계 설정
      setStep: (step) => {
        set({ currentStep: step, error: null });
      },

      // 다음 단계
      nextStep: () => {
        const currentIndex = STEP_ORDER.indexOf(get().currentStep);
        if (currentIndex < STEP_ORDER.length - 1) {
          set({ 
            currentStep: STEP_ORDER[currentIndex + 1],
            error: null 
          });
        }
      },

      // 이전 단계
      prevStep: () => {
        const currentIndex = STEP_ORDER.indexOf(get().currentStep);
        if (currentIndex > 0) {
          set({ 
            currentStep: STEP_ORDER[currentIndex - 1],
            error: null 
          });
        }
      },

      // 배송 정보 설정
      setShippingInfo: (info) => {
        set({ shippingInfo: info, error: null });
      },

      // 결제 정보 설정
      setPaymentInfo: (info) => {
        set({ paymentInfo: info, error: null });
      },

      // 주문 제출 (Mock)
      submitOrder: async (request) => {
        set({ isProcessing: true, error: null });

        try {
          // TODO: 실제 API 호출로 교체
          // const response = await orderService.createOrder(request);
          
          // Mock 응답 (2초 지연)
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Mock 주문 생성
          const mockOrder: Order = {
            id: Math.floor(Math.random() * 10000),
            orderNumber: `ORD-${Date.now()}`,
            user: {
              id: 1,
              email: 'user@example.com',
              name: request.shippingInfo.recipientName,
              role: 'USER',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            items: request.items.map((item, index) => ({
              id: index + 1,
              product: {
                id: item.productId,
                name: `상품 ${item.productId}`,
                description: '상품 설명',
                price: 10000,
                stockQuantity: 100,
                category: { id: 1, name: '카테고리' },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
              quantity: item.quantity,
              price: 10000,
              subtotal: 10000 * item.quantity,
            })),
            shippingInfo: request.shippingInfo,
            paymentInfo: request.paymentInfo,
            subtotal: request.totalAmount - request.shippingFee + (request.discountAmount || 0),
            discountAmount: request.discountAmount || 0,
            shippingFee: request.shippingFee,
            totalAmount: request.totalAmount,
            usedPoints: request.usedPoints || 0,
            earnedPoints: Math.floor(request.totalAmount * 0.01), // 1% 적립
            status: 'PENDING',
            paymentStatus: 'COMPLETED',
            orderedAt: new Date().toISOString(),
            paidAt: new Date().toISOString(),
            orderMessage: request.orderMessage,
          };

          set({ isProcessing: false });
          
          // 주문 완료 후 초기화
          get().resetCheckout();
          
          return mockOrder;
        } catch (error) {
          console.error('Order submission failed:', error);
          set({ 
            error: '주문 처리 중 오류가 발생했습니다.',
            isProcessing: false 
          });
          throw error;
        }
      },

      // 체크아웃 초기화
      resetCheckout: () => {
        set({
          currentStep: 'SHIPPING',
          shippingInfo: null,
          paymentInfo: null,
          isProcessing: false,
          error: null,
        });
      },

      // 에러 설정
      setError: (error) => {
        set({ error });
      },
    }),
    {
      name: 'checkout-storage',
      storage: createJSONStorage(() => sessionStorage), // 세션 스토리지 사용
      partialize: (state) => ({
        shippingInfo: state.shippingInfo,
        paymentInfo: state.paymentInfo,
        currentStep: state.currentStep,
      }),
    }
  )
);

// Custom Hook으로 래핑
export const useOrder = () => {
  const store = useOrderStore();
  
  return {
    // 상태
    currentStep: store.currentStep,
    shippingInfo: store.shippingInfo,
    paymentInfo: store.paymentInfo,
    isProcessing: store.isProcessing,
    error: store.error,
    
    // 단계 관리
    setStep: store.setStep,
    nextStep: store.nextStep,
    prevStep: store.prevStep,
    
    // 정보 설정
    setShippingInfo: store.setShippingInfo,
    setPaymentInfo: store.setPaymentInfo,
    
    // 주문 처리
    submitOrder: store.submitOrder,
    
    // 초기화
    resetCheckout: store.resetCheckout,
    setError: store.setError,
  };
};

// 단계별 진행률 계산
export const useCheckoutProgress = () => {
  const currentStep = useOrderStore(state => state.currentStep);
  
  const stepIndex = STEP_ORDER.indexOf(currentStep);
  const progress = ((stepIndex + 1) / STEP_ORDER.length) * 100;
  
  return {
    currentStepIndex: stepIndex,
    totalSteps: STEP_ORDER.length,
    progress,
    isFirstStep: stepIndex === 0,
    isLastStep: stepIndex === STEP_ORDER.length - 1,
  };
};

// 주문 가능 여부 확인
export const useCanCheckout = () => {
  const { items } = useCart();
  const { shippingInfo, paymentInfo } = useOrder();
  
  const hasItems = items.length > 0;
  const hasValidItems = items.every(item => item.product.stockQuantity >= item.quantity);
  const hasShippingInfo = shippingInfo !== null;
  const hasPaymentInfo = paymentInfo !== null;
  
  return {
    canCheckout: hasItems && hasValidItems,
    canProceedToPayment: hasShippingInfo,
    canSubmitOrder: hasShippingInfo && hasPaymentInfo,
    reasons: {
      noItems: !hasItems,
      invalidItems: !hasValidItems,
      noShippingInfo: !hasShippingInfo,
      noPaymentInfo: !hasPaymentInfo,
    },
  };
};
