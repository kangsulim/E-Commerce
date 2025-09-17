import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
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
  Stack,
  Divider,
  useTheme
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { LoginRequest } from '../../types';
import { authService } from '../../services/auth';
import { useNavigate, Link } from 'react-router-dom';

// Yup 스키마 정의
const loginSchema = yup.object({
  email: yup
    .string()
    .email('올바른 이메일 형식을 입력해주세요')
    .required('이메일을 입력해주세요'),
  password: yup
    .string()
    .min(6, '비밀번호는 최소 6자 이상이어야 합니다')
    .required('비밀번호를 입력해주세요'),
});

interface LoginFormProps {
  onLoginSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginRequest>({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginRequest) => {
    try {
      setIsLoading(true);
      setLoginError('');

      const response = await authService.login(data);
      
      // 토큰 저장
      authService.saveTokens(response.accessToken, response.refreshToken);
      
      // 로그인 성공 콜백 실행
      if (onLoginSuccess) {
        onLoginSuccess();
      }

      // 홈페이지로 리다이렉트
      navigate('/');
      
    } catch (error: any) {
      setLoginError(
        error.response?.data?.message || 
        '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
              로그인
            </Typography>
            <Typography variant="body1" color="text.secondary">
              계정에 로그인하여 쇼핑을 시작하세요
            </Typography>
          </Box>

          {/* 폼 */}
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            {/* 로그인 에러 메시지 */}
            {loginError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {loginError}
              </Alert>
            )}

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
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              {...register('password')}
              sx={{ mb: 3 }}
            />

            {/* 로그인 버튼 */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={!isValid || isLoading}
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
              {isLoading ? '로그인 중...' : '로그인'}
            </Button>

            <Divider sx={{ my: 3 }}>또는</Divider>

            {/* 회원가입 링크 */}
            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                아직 계정이 없으신가요?{' '}
                <MuiLink
                  component={Link}
                  to="/register"
                  variant="body2"
                  sx={{
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  회원가입
                </MuiLink>
              </Typography>
            </Box>

            {/* 추가 링크들 */}
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ mt: 2 }}
            >
              <MuiLink
                href="#"
                variant="body2"
                color="text.secondary"
                sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                비밀번호 찾기
              </MuiLink>
              <MuiLink
                href="#"
                variant="body2"
                color="text.secondary"
                sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                이메일 찾기
              </MuiLink>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
