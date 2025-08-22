import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
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
  const navigate = useNavigate();

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

  return (
    <div className="auth-form">
      <div className="auth-form-header">
        <h2>로그인</h2>
        <p>계정에 로그인하여 쇼핑을 시작하세요</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="auth-form-content">
        {/* 로그인 에러 메시지 */}
        {loginError && (
          <div className="error-message">
            {loginError}
          </div>
        )}

        {/* 이메일 입력 */}
        <div className="form-group">
          <label htmlFor="email">이메일</label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className={`form-input ${errors.email ? 'error' : ''}`}
            placeholder="이메일을 입력하세요"
          />
          {errors.email && (
            <span className="field-error">{errors.email.message}</span>
          )}
        </div>

        {/* 비밀번호 입력 */}
        <div className="form-group">
          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            type="password"
            {...register('password')}
            className={`form-input ${errors.password ? 'error' : ''}`}
            placeholder="비밀번호를 입력하세요"
          />
          {errors.password && (
            <span className="field-error">{errors.password.message}</span>
          )}
        </div>

        {/* 로그인 버튼 */}
        <button
          type="submit"
          disabled={!isValid || isLoading}
          className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
        >
          {isLoading ? '로그인 중...' : '로그인'}
        </button>

        {/* 회원가입 링크 */}
        <div className="auth-form-footer">
          <p>
            아직 계정이 없으신가요?{' '}
            <Link to="/register" className="link">
              회원가입
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};
