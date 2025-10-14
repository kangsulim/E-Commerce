import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Stack,
  Button,
} from '@mui/material';
import {
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  CheckCircle as ConfirmIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useOrder, useCheckoutProgress } from '../hooks/useOrder';
import { ShippingForm, PaymentForm, OrderSummary } from '../components/checkout';
import Breadcrumb from '../components/common/Breadcrumb';
import { ShippingInfo, PaymentInfo, CreateOrderRequest } from '../types/order';

// 단계 정의
const STEPS = [
  { 
    label: '배송 정보', 
    icon: <ShippingIcon />,
    description: '배송지 정보를 입력하세요'
  },
  { 
    label: '결제 정보', 
    icon: <PaymentIcon />,
    description: '결제 수단을 선택하세요'
  },
  { 
    label: '주문 확인', 
    icon: <ConfirmIcon />,
    description: '주문 내용을 확인하세요'
  },
];

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, calculations, clearCart } = useCart();
  const {
    currentStep,
    shippingInfo,
    paymentInfo,
    isProcessing,
    error,
    setShippingInfo,
    setPaymentInfo,
    nextStep,
    prevStep,
    submitOrder,
    resetCheckout,
    setError,
  } = useOrder();
  const { currentStepIndex, progress } = useCheckoutProgress();

  // 장바구니가 비어있으면 장바구니 페이지로 리다이렉트
  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items.length, navigate]);

  // 페이지 언마운트 시 에러 초기화
  useEffect(() => {
    return () => {
      setError(null);
    };
  }, [setError]);

  const breadcrumbItems = [
    { label: '홈', href: '/' },
    { label: '장바구니', href: '/cart' },
    { label: '주문/결제', current: true },
  ];

  // 배송 정보 제출
  const handleShippingSubmit = (data: ShippingInfo) => {
    setShippingInfo(data);
    nextStep();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 결제 정보 제출
  const handlePaymentSubmit = (data: PaymentInfo) => {
    setPaymentInfo(data);
    nextStep();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 최종 주문 제출
  const handleOrderSubmit = async () => {
    if (!shippingInfo || !paymentInfo) {
      setError('배송 정보와 결제 정보를 모두 입력해주세요.');
      return;
    }

    const orderRequest: CreateOrderRequest = {
      shippingInfo,
      paymentInfo,
      items: items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
      totalAmount: calculations.totalPrice,
      discountAmount: calculations.discount,
      shippingFee: calculations.shippingFee,
    };

    try {
      const order = await submitOrder(orderRequest);
      
      // 주문 성공 시 장바구니 비우기
      await clearCart();
      
      // 주문 완료 페이지로 이동
      navigate(`/order-complete/${order.id}`, {
        state: { order },
      });
    } catch (err) {
      console.error('Order submission error:', err);
      // 에러는 useOrder에서 처리됨
    }
  };

  // 이전 단계로
  const handleBack = () => {
    prevStep();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 장바구니로 돌아가기
  const handleBackToCart = () => {
    if (window.confirm('입력한 정보가 저장됩니다. 장바구니로 돌아가시겠습니까?')) {
      navigate('/cart');
    }
  };

  // 로딩 중이거나 장바구니가 비어있으면 아무것도 렌더링하지 않음
  if (items.length === 0) {
    return null;
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* 브레드크럼 */}
        <Breadcrumb items={breadcrumbItems} className="mb-4" />

        {/* 페이지 헤더 */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Typography variant="h3" fontWeight="bold">
            주문/결제
          </Typography>
          <Button
            variant="outlined"
            startIcon={<BackIcon />}
            onClick={handleBackToCart}
            disabled={isProcessing}
          >
            장바구니로
          </Button>
        </Stack>

        {/* 진행 단계 표시 */}
        <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
          <Stepper activeStep={currentStepIndex} alternativeLabel>
            {STEPS.map((step, index) => (
              <Step key={step.label}>
                <StepLabel
                  StepIconComponent={() => (
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor:
                          index === currentStepIndex
                            ? 'primary.main'
                            : index < currentStepIndex
                            ? 'success.main'
                            : 'grey.300',
                        color: 'white',
                        transition: 'all 0.3s',
                      }}
                    >
                      {step.icon}
                    </Box>
                  )}
                >
                  <Typography variant="subtitle1" fontWeight="medium">
                    {step.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {step.description}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* 진행률 바 */}
          <Box
            sx={{
              mt: 3,
              height: 8,
              bgcolor: 'grey.200',
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                height: '100%',
                width: `${progress}%`,
                bgcolor: 'primary.main',
                transition: 'width 0.3s ease',
              }}
            />
          </Box>
        </Paper>

        {/* 에러 메시지 */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* 안내 메시지 */}
        {currentStep === 'SHIPPING' && (
          <Alert severity="info" sx={{ mb: 3 }}>
            정확한 배송을 위해 배송지 정보를 정확히 입력해주세요.
          </Alert>
        )}
        {currentStep === 'PAYMENT' && (
          <Alert severity="info" sx={{ mb: 3 }}>
            안전한 결제를 위해 SSL 보안 통신을 사용합니다. 🔒
          </Alert>
        )}

        {/* 단계별 컨텐츠 */}
        <Box>
          {currentStep === 'SHIPPING' && (
            <ShippingForm
              initialData={shippingInfo || undefined}
              onSubmit={handleShippingSubmit}
              isLoading={isProcessing}
            />
          )}

          {currentStep === 'PAYMENT' && (
            <PaymentForm
              initialData={paymentInfo || undefined}
              totalAmount={calculations.totalPrice}
              onSubmit={handlePaymentSubmit}
              onBack={handleBack}
              isLoading={isProcessing}
            />
          )}

          {currentStep === 'CONFIRM' && shippingInfo && paymentInfo && (
            <OrderSummary
              items={items}
              shippingInfo={shippingInfo}
              paymentInfo={paymentInfo}
              calculations={calculations}
              onSubmit={handleOrderSubmit}
              onBack={handleBack}
              isLoading={isProcessing}
            />
          )}
        </Box>

        {/* 하단 안내 */}
        <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Typography variant="h6" fontWeight="medium" gutterBottom>
            주문/결제 안내
          </Typography>
          <Stack spacing={1}>
            <Typography variant="body2" color="text.secondary">
              • 주문 후 영업일 기준 2-3일 내 배송됩니다.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • 제주도 및 도서산간 지역은 추가 배송비가 발생할 수 있습니다.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • 결제 완료 후 마이페이지에서 주문 내역을 확인하실 수 있습니다.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • 교환 및 환불은 상품 수령 후 7일 이내 가능합니다.
            </Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default CheckoutPage;
