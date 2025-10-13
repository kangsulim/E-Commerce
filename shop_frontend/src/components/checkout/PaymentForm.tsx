import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Divider,
  Alert,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  InputLabel,
  Grid2,
  Chip,
} from '@mui/material';
import {
  Payment as PaymentIcon,
  CreditCard as CardIcon,
  AccountBalance as BankIcon,
  PhoneAndroid as PhoneIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { PaymentInfo, PaymentMethod } from '../../types/order';

// 결제 수단 옵션
const PAYMENT_METHODS: Array<{
  value: PaymentMethod;
  label: string;
  icon: React.ReactNode;
  description: string;
}> = [
  {
    value: 'CARD',
    label: '신용/체크카드',
    icon: <CardIcon />,
    description: '모든 카드사 사용 가능',
  },
  {
    value: 'BANK',
    label: '계좌이체',
    icon: <BankIcon />,
    description: '실시간 계좌이체',
  },
  {
    value: 'KAKAO',
    label: '카카오페이',
    icon: '💛',
    description: '간편결제',
  },
  {
    value: 'NAVER',
    label: '네이버페이',
    icon: '💚',
    description: '간편결제',
  },
  {
    value: 'TOSS',
    label: '토스페이',
    icon: '💙',
    description: '간편결제',
  },
  {
    value: 'PHONE',
    label: '휴대폰 결제',
    icon: <PhoneIcon />,
    description: '통신사 결제',
  },
];

// 카드사 목록
const CARD_COMPANIES = [
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
];

// 할부 개월 옵션
const INSTALLMENT_OPTIONS = [
  { value: 0, label: '일시불' },
  { value: 2, label: '2개월' },
  { value: 3, label: '3개월' },
  { value: 6, label: '6개월' },
  { value: 12, label: '12개월' },
];

// 은행 목록
const BANKS = [
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
];

// 유효성 검사 스키마
const paymentSchema = yup.object().shape({
  method: yup.string().required('결제 방법을 선택해주세요'),
  cardNumber: yup.string().when('method', {
    is: 'CARD',
    then: (schema) =>
      schema
        .required('카드번호를 입력해주세요')
        .matches(/^[0-9]{16}$/, '16자리 숫자를 입력해주세요'),
    otherwise: (schema) => schema.notRequired(),
  }),
  cardCompany: yup.string().when('method', {
    is: 'CARD',
    then: (schema) => schema.required('카드사를 선택해주세요'),
    otherwise: (schema) => schema.notRequired(),
  }),
  installment: yup.number(),
  bankName: yup.string().when('method', {
    is: 'BANK',
    then: (schema) => schema.required('은행을 선택해주세요'),
    otherwise: (schema) => schema.notRequired(),
  }),
});

interface PaymentFormProps {
  initialData?: PaymentInfo;
  totalAmount: number;
  onSubmit: (data: PaymentInfo) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  initialData,
  totalAmount,
  onSubmit,
  onBack,
  isLoading = false,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(
    initialData?.method || 'CARD'
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PaymentInfo>({
    resolver: yupResolver(paymentSchema),
    defaultValues: initialData || {
      method: 'CARD',
      installment: 0,
    },
  });

  const watchMethod = watch('method');

  // 폼 제출
  const handleFormSubmit = (data: PaymentInfo) => {
    onSubmit(data);
  };

  // 간편결제 처리
  const handleSimplePayment = (method: PaymentMethod) => {
    onSubmit({ method });
  };

  // 간편결제 여부 확인
  const isSimplePayment = ['KAKAO', 'NAVER', 'TOSS'].includes(selectedMethod);

  return (
    <Paper elevation={1} sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <PaymentIcon sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} />
        <Typography variant="h5" fontWeight="bold">
          결제 정보
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        결제 금액: <strong>{totalAmount.toLocaleString()}원</strong>
      </Alert>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Stack spacing={3}>
          {/* 결제 수단 선택 */}
          <FormControl component="fieldset">
            <FormLabel component="legend" sx={{ mb: 2, fontWeight: 'bold' }}>
              결제 수단
            </FormLabel>
            <Grid2 container spacing={2}>
              {PAYMENT_METHODS.map((method) => (
                <Grid2 xs={12} sm={6} key={method.value}>
                  <Controller
                    name="method"
                    control={control}
                    render={({ field }) => (
                      <Box
                        onClick={() => {
                          field.onChange(method.value);
                          setSelectedMethod(method.value);
                        }}
                        sx={{
                          p: 2,
                          border: 2,
                          borderColor:
                            field.value === method.value
                              ? 'primary.main'
                              : 'divider',
                          borderRadius: 2,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          '&:hover': {
                            borderColor: 'primary.main',
                            bgcolor: 'action.hover',
                          },
                        }}
                      >
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box sx={{ fontSize: 24 }}>{method.icon}</Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" fontWeight="medium">
                              {method.label}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {method.description}
                            </Typography>
                          </Box>
                          {field.value === method.value && (
                            <Chip label="선택됨" color="primary" size="small" />
                          )}
                        </Stack>
                      </Box>
                    )}
                  />
                </Grid2>
              ))}
            </Grid2>
          </FormControl>

          <Divider />

          {/* 카드 결제 */}
          {watchMethod === 'CARD' && (
            <Stack spacing={3}>
              <Typography variant="h6" fontWeight="medium">
                카드 정보 입력
              </Typography>

              <Controller
                name="cardNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="카드번호"
                    placeholder="1234567812345678"
                    fullWidth
                    required
                    error={!!errors.cardNumber}
                    helperText={errors.cardNumber?.message}
                    disabled={isLoading}
                    inputProps={{ maxLength: 16 }}
                  />
                )}
              />

              <Controller
                name="cardCompany"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth required error={!!errors.cardCompany}>
                    <InputLabel>카드사</InputLabel>
                    <Select {...field} label="카드사" disabled={isLoading}>
                      {CARD_COMPANIES.map((company) => (
                        <MenuItem key={company} value={company}>
                          {company}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />

              {totalAmount >= 50000 && (
                <Controller
                  name="installment"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>할부</InputLabel>
                      <Select {...field} label="할부" disabled={isLoading}>
                        {INSTALLMENT_OPTIONS.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                            {option.value > 0 && ' (무이자)'}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              )}
            </Stack>
          )}

          {/* 계좌이체 */}
          {watchMethod === 'BANK' && (
            <Stack spacing={3}>
              <Typography variant="h6" fontWeight="medium">
                계좌이체 정보
              </Typography>

              <Controller
                name="bankName"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth required error={!!errors.bankName}>
                    <InputLabel>은행</InputLabel>
                    <Select {...field} label="은행" disabled={isLoading}>
                      {BANKS.map((bank) => (
                        <MenuItem key={bank} value={bank}>
                          {bank}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />

              <Alert severity="info">
                결제하기 버튼을 누르시면 실시간 계좌이체 화면으로 이동합니다.
              </Alert>
            </Stack>
          )}

          {/* 간편결제 */}
          {isSimplePayment && (
            <Alert severity="success">
              {selectedMethod === 'KAKAO' && '카카오페이 '}
              {selectedMethod === 'NAVER' && '네이버페이 '}
              {selectedMethod === 'TOSS' && '토스페이 '}
              앱으로 이동하여 결제를 진행합니다.
            </Alert>
          )}

          {/* 버튼 */}
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            {onBack && (
              <Button
                variant="outlined"
                size="large"
                onClick={onBack}
                disabled={isLoading}
              >
                이전
              </Button>
            )}
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{ minWidth: 200 }}
            >
              {isLoading ? '처리 중...' : '다음 단계'}
            </Button>
          </Stack>
        </Stack>
      </form>
    </Paper>
  );
};

export default PaymentForm;
