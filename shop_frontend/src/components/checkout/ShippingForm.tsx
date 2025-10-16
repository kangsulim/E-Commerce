import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,

  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stack,
  Divider,
  Alert,
} from '@mui/material';
import {
  LocalShipping as ShippingIcon,
  MyLocation as LocationIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import * as yup from 'yup';
import { ShippingInfo } from '../../types/order';

// 배송 요청사항 옵션
const DELIVERY_REQUESTS = [
  '문 앞에 놓아주세요',
  '경비실에 맡겨주세요',
  '택배함에 넣어주세요',
  '배송 전 연락주세요',
  '부재 시 휴대폰으로 연락주세요',
  '직접 입력',
];

// 유효성 검사 스키마
const shippingSchema = yup.object().shape({
  recipientName: yup
    .string()
    .required('받는 사람 이름을 입력해주세요')
    .min(2, '이름은 최소 2글자 이상이어야 합니다'),
  recipientPhone: yup
    .string()
    .required('연락처를 입력해주세요')
    .matches(
      /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/,
      '올바른 휴대폰 번호를 입력해주세요 (예: 010-1234-5678)'
    ),
  zipCode: yup
    .string()
    .required('우편번호를 입력해주세요')
    .matches(/^[0-9]{5}$/, '5자리 숫자를 입력해주세요'),
  address: yup
    .string()
    .required('주소를 입력해주세요')
    .min(5, '주소는 최소 5글자 이상이어야 합니다'),
  addressDetail: yup
    .string()
    .required('상세주소를 입력해주세요')
    .min(2, '상세주소는 최소 2글자 이상이어야 합니다'),
  deliveryRequest: yup.string(),
});

interface ShippingFormProps {
  initialData?: ShippingInfo;
  onSubmit: (data: ShippingInfo) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

export const ShippingForm: React.FC<ShippingFormProps> = ({
  initialData,
  onSubmit,
  onBack,
  isLoading = false,
}) => {
  const [selectedRequest, setSelectedRequest] = useState<string>(
    initialData?.deliveryRequest || DELIVERY_REQUESTS[0]
  );
  const [customRequest, setCustomRequest] = useState<string>('');

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ShippingInfo>({
    resolver: yupResolver(shippingSchema),
    defaultValues: initialData || {
      recipientName: '',
      recipientPhone: '',
      zipCode: '',
      address: '',
      addressDetail: '',
      deliveryRequest: '',
    },
  });

  // 주소 검색 (Mock)
  const handleSearchAddress = () => {
    // TODO: 실제 주소 검색 API 연동 (Daum 우편번호 서비스 등)
    alert('주소 검색 기능은 추후 구현됩니다.\n\n임시로 직접 입력해주세요.');
  };

  // 폼 제출
  const handleFormSubmit = (data: ShippingInfo) => {
    const finalData = {
      ...data,
      deliveryRequest:
        selectedRequest === '직접 입력' ? customRequest : selectedRequest,
    };
    onSubmit(finalData);
  };

  return (
    <Paper elevation={1} sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <ShippingIcon sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} />
        <Typography variant="h5" fontWeight="bold">
          배송 정보
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        정확한 배송을 위해 배송지 정보를 꼼꼼히 확인해주세요.
      </Alert>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Stack spacing={3}>
          {/* 받는 사람 */}
          <Controller
            name="recipientName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="받는 사람"
                placeholder="이름을 입력하세요"
                fullWidth
                required
                error={!!errors.recipientName}
                helperText={errors.recipientName?.message}
                disabled={isLoading}
              />
            )}
          />

          {/* 연락처 */}
          <Controller
            name="recipientPhone"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="연락처"
                placeholder="010-1234-5678"
                fullWidth
                required
                error={!!errors.recipientPhone}
                helperText={errors.recipientPhone?.message}
                disabled={isLoading}
              />
            )}
          />

          <Divider />

          {/* 주소 */}
          <Box>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Controller
                name="zipCode"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="우편번호"
                    placeholder="12345"
                    required
                    error={!!errors.zipCode}
                    helperText={errors.zipCode?.message}
                    disabled={isLoading}
                    sx={{ width: 150 }}
                  />
                )}
              />
              <Button
                variant="outlined"
                startIcon={<LocationIcon />}
                onClick={handleSearchAddress}
                disabled={isLoading}
              >
                주소 검색
              </Button>
            </Stack>

            <Stack spacing={2}>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="주소"
                    placeholder="도로명 주소 또는 지번 주소"
                    fullWidth
                    required
                    error={!!errors.address}
                    helperText={errors.address?.message}
                    disabled={isLoading}
                  />
                )}
              />

              <Controller
                name="addressDetail"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="상세주소"
                    placeholder="동/호수, 건물명 등"
                    fullWidth
                    required
                    error={!!errors.addressDetail}
                    helperText={errors.addressDetail?.message}
                    disabled={isLoading}
                  />
                )}
              />
            </Stack>
          </Box>

          <Divider />

          {/* 배송 요청사항 */}
          <FormControl component="fieldset">
            <FormLabel component="legend">배송 요청사항</FormLabel>
            <RadioGroup
              value={selectedRequest}
              onChange={(e) => setSelectedRequest(e.target.value)}
            >
              {DELIVERY_REQUESTS.map((request) => (
                <FormControlLabel
                  key={request}
                  value={request}
                  control={<Radio />}
                  label={request}
                  disabled={isLoading}
                />
              ))}
            </RadioGroup>

            {selectedRequest === '직접 입력' && (
              <TextField
                value={customRequest}
                onChange={(e) => setCustomRequest(e.target.value)}
                placeholder="요청사항을 입력하세요"
                fullWidth
                multiline
                rows={2}
                disabled={isLoading}
                sx={{ mt: 2 }}
              />
            )}
          </FormControl>

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

export default ShippingForm;
