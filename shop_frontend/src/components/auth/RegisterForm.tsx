import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Link as MuiLink,
  Divider,
  Stack,
  useTheme,
  CircularProgress
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  CheckCircle as SuccessIcon
} from '@mui/icons-material';
import { authService, RegisterRequest } from '../../services/auth';

// Yup 스키마 정의
const registerSchema = yup.object({
  name: yup
    .string()
    .min(2, '이름은 최소 2자 이상이어야 합니다')
    .required('이름을 입력해주세요'),
  email: yup
    .string()
    .email('올바른 이메일 형식을 입력해주세요')
    .required('이메일을 입력해주세요'),
  password: yup
    .string()
    .min(6, '비밀번호는 최소 6자 이상이어야 합니다')
    .matches(
      /^(?=.*[a-zA-Z])(?=.*[0-9])/,
      '비밀번호는 영문과 숫자를 포함해야 합니다'
    )
    .required('비밀번호를 입력해주세요'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], '비밀번호가 일치하지 않습니다')
    .required('비밀번호를 다시 입력해주세요'),
});

// 회원가입 폼 데이터 타입
interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

export const RegisterForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string>('');
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setRegisterError('');

      // confirmPassword 제거 후 API 전송
      const { confirmPassword, ...registerData } = data;
      
      await authService.register(registerData);
      
      setRegisterSuccess(true);
      
      // 3초 후 로그인 페이지로 이동
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error: any) {
      setRegisterError(
        error.response?.data?.message || 
        '회원가입에 실패했습니다. 다시 시도해주세요.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (registerSuccess) {
    return (
      <Box
        sx={{
          maxWidth: 400,
          mx: 'auto',
          mt: 4,
          p: 2
        }}
      >
        <Card elevation={3}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <SuccessIcon 
              sx={{ 
                fontSize: 64, 
                color: theme.palette.success.main, 
                mb: 2 
              }} 
            />
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              color="success.main"
              sx={{ mb: 2 }}
            >
              회원가입 완료
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              회원가입이 성공적으로 완료되었습니다!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              3초 후 로그인 페이지로 이동합니다...
            </Typography>
            <CircularProgress size={24} sx={{ mt: 2 }} />
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: 'auto',
        mt: 4,
        p: 2
      }}
    >
      <Card elevation={3}>
        <CardContent sx={{ p: 4 }}>
          {/* 헤더 */}
          <Box textAlign="center" sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              color="primary"
              sx={{ mb: 1 }}
            >
              회원가입
            </Typography>
            <Typography variant="body1" color="text.secondary">
              새 계정을 만들어 쇼핑을 시작하세요
            </Typography>
          </Box>

          {/* 폼 */}
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            {/* 회원가입 에러 메시지 */}
            {registerError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {registerError}
              </Alert>
            )}

            {/* 이름 입력 */}
            <TextField
              fullWidth
              id="name"
              label="이름"
              type="text"
              variant="outlined"
              margin="normal"
              placeholder="이름을 입력하세요"
              error={!!errors.name}
              helperText={errors.name?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color={errors.name ? 'error' : 'action'} />
                  </InputAdornment>
                ),
              }}
              {...register('name')}
              sx={{ mb: 2 }}
            />

            {/* 이메일 입력 */}
            <TextField
              fullWidth
              id="email"
              label="이메일"
              type="email"
              variant="outlined"
              margin="normal"
              placeholder="이메일을 입력하세요"
              error={!!errors.email}
              helperText={errors.email?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color={errors.email ? 'error' : 'action'} />
                  </InputAdornment>
                ),
              }}
              {...register('email')}
              sx={{ mb: 2 }}
            />

            {/* 비밀번호 입력 */}
            <TextField
              fullWidth
              id="password"
              label="비밀번호"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              margin="normal"
              placeholder="비밀번호를 입력하세요"
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color={errors.password ? 'error' : 'action'} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              {...register('password')}
              sx={{ mb: 2 }}
            />

            {/* 비밀번호 확인 */}
            <TextField
              fullWidth
              id="confirmPassword"
              label="비밀번호 확인"
              type={showConfirmPassword ? 'text' : 'password'}
              variant="outlined"
              margin="normal"
              placeholder="비밀번호를 다시 입력하세요"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color={errors.confirmPassword ? 'error' : 'action'} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              {...register('confirmPassword')}
              sx={{ mb: 3 }}
            />

            {/* 회원가입 버튼 */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={!isValid || isLoading}
              startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : undefined}
              sx={{
                py: 1.5,
                mb: 3,
                fontWeight: 'bold',
                textTransform: 'none',
                borderRadius: 2,
                boxShadow: theme.shadows[4],
                '&:hover': {
                  boxShadow: theme.shadows[8],
                  transform: 'translateY(-1px)'
                },
                '&:disabled': {
                  bgcolor: theme.palette.grey[300]
                }
              }}
            >
              {isLoading ? '가입 중...' : '회원가입'}
            </Button>

            <Divider sx={{ my: 3 }}>또는</Divider>

            {/* 로그인 링크 */}
            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                이미 계정이 있으신가요?{' '}
                <MuiLink
                  component={Link}
                  to="/login"
                  variant="body2"
                  sx={{
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  로그인
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
