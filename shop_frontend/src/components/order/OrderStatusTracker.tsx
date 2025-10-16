import React from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Typography,
  Paper,
  Chip,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  LocalShipping as ShippingIcon,
  Inventory as PackageIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { OrderStatus } from '../../types/order';
import { ORDER_STATUS_LABELS } from '../../data/mockOrders';

interface OrderStatusTrackerProps {
  status: OrderStatus;
  orderedAt: string;
  paidAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
}

// 주문 상태 단계 정의
const ORDER_STEPS = [
  { status: 'PENDING', label: '주문 접수', icon: <PackageIcon /> },
  { status: 'CONFIRMED', label: '주문 확인', icon: <CheckIcon /> },
  { status: 'PREPARING', label: '배송 준비', icon: <PackageIcon /> },
  { status: 'SHIPPED', label: '배송 중', icon: <ShippingIcon /> },
  { status: 'DELIVERED', label: '배송 완료', icon: <CheckIcon /> },
];

export const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({
  status,
  orderedAt,
  paidAt,
  shippedAt,
  deliveredAt,
  cancelledAt,
}) => {
  // 취소된 주문
  if (status === 'CANCELLED' || status === 'REFUNDED') {
    return (
      <Paper elevation={1} sx={{ p: 3, bgcolor: 'error.lighter' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CancelIcon sx={{ fontSize: 32, mr: 2, color: 'error.main' }} />
          <Box>
            <Typography variant="h6" fontWeight="bold" color="error">
              주문 취소
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {cancelledAt
                ? new Date(cancelledAt).toLocaleString('ko-KR')
                : '취소 처리됨'}
            </Typography>
          </Box>
        </Box>
      </Paper>
    );
  }

  // 현재 활성 단계 찾기
  const activeStep = ORDER_STEPS.findIndex(step => step.status === status);

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Paper elevation={1} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ flex: 1 }}>
          배송 진행 상태
        </Typography>
        <Chip
          label={ORDER_STATUS_LABELS[status]}
          color={
            status === 'DELIVERED'
              ? 'success'
              : status === 'SHIPPED'
              ? 'primary'
              : 'default'
          }
          size="small"
        />
      </Box>

      <Stepper activeStep={activeStep} orientation="vertical">
        {ORDER_STEPS.map((step, index) => {
          const isCompleted = index <= activeStep;
          let timestamp: string | undefined;

          // 각 단계별 타임스탬프 매칭
          if (step.status === 'PENDING') timestamp = orderedAt;
          else if (step.status === 'CONFIRMED') timestamp = paidAt;
          else if (step.status === 'PREPARING') timestamp = paidAt;
          else if (step.status === 'SHIPPED') timestamp = shippedAt;
          else if (step.status === 'DELIVERED') timestamp = deliveredAt;

          return (
            <Step key={step.status} completed={isCompleted}>
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
                      bgcolor: isCompleted ? 'primary.main' : 'grey.300',
                      color: 'white',
                    }}
                  >
                    {step.icon}
                  </Box>
                )}
              >
                <Typography variant="subtitle1" fontWeight="medium">
                  {step.label}
                </Typography>
                {timestamp && isCompleted && (
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(timestamp)}
                  </Typography>
                )}
              </StepLabel>
              <StepContent>
                {isCompleted && (
                  <Typography variant="body2" color="text.secondary">
                    {step.status === 'PENDING' && '주문이 접수되었습니다.'}
                    {step.status === 'CONFIRMED' && '결제가 완료되었습니다.'}
                    {step.status === 'PREPARING' && '상품을 준비하고 있습니다.'}
                    {step.status === 'SHIPPED' && '배송이 시작되었습니다.'}
                    {step.status === 'DELIVERED' && '배송이 완료되었습니다.'}
                  </Typography>
                )}
              </StepContent>
            </Step>
          );
        })}
      </Stepper>

      {/* 예상 배송일 (배송 중일 때만 표시) */}
      {status === 'SHIPPED' && shippedAt && (
        <Box sx={{ mt: 3, p: 2, bgcolor: 'info.lighter', borderRadius: 1 }}>
          <Typography variant="body2" color="info.main">
            📦 예상 배송일:{' '}
            {new Date(
              new Date(shippedAt).getTime() + 2 * 24 * 60 * 60 * 1000
            ).toLocaleDateString('ko-KR', {
              month: 'long',
              day: 'numeric',
            })}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default OrderStatusTracker;
