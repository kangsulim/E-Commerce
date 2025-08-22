import React from 'react';
import { RegisterForm } from '../components/auth/RegisterForm';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // 이미 로그인된 사용자는 홈으로 리다이렉트
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner">로딩 중...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
