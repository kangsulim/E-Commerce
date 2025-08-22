import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
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
  const navigate = useNavigate();

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
      <div className="auth-form">
        <div className="auth-form-header">
          <h2>회원가입 완료</h2>
        </div>
        <div className="success-message">
          <p>회원가입이 성공적으로 완료되었습니다!</p>
          <p>3초 후 로그인 페이지로 이동합니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-form">
      <div className="auth-form-header">
        <h2>회원가입</h2>
        <p>새 계정을 만들어 쇼핑을 시작하세요</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="auth-form-content">
        {/* 회원가입 에러 메시지 */}
        {registerError && (
          <div className="error-message">
            {registerError}
          </div>
        )}

        {/* 이름 입력 */}
        <div className="form-group">
          <label htmlFor="name">이름</label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className={`form-input ${errors.name ? 'error' : ''}`}
            placeholder="이름을 입력하세요"
          />
          {errors.name && (
            <span className="field-error">{errors.name.message}</span>
          )}
        </div>

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

        {/* 비밀번호 확인 */}
        <div className="form-group">
          <label htmlFor="confirmPassword">비밀번호 확인</label>
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword')}
            className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
            placeholder="비밀번호를 다시 입력하세요"
          />
          {errors.confirmPassword && (
            <span className="field-error">{errors.confirmPassword.message}</span>
          )}
        </div>

        {/* 회원가입 버튼 */}
        <button
          type="submit"
          disabled={!isValid || isLoading}
          className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
        >
          {isLoading ? '가입 중...' : '회원가입'}
        </button>

        {/* 로그인 링크 */}
        <div className="auth-form-footer">
          <p>
            이미 계정이 있으신가요?{' '}
            <Link to="/login" className="link">
              로그인
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};
