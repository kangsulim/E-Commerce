import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { router } from './router';
import ErrorBoundary from './components/common/ErrorBoundary';

const App: React.FC = () => {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // 에러 로깅 (실제 프로덕션에서는 Sentry 등의 서비스 사용)
    console.error('Application Error:', error);
    console.error('Error Info:', errorInfo);
    
    // 에러 발생 시 추가 로직 (예: 에러 리포팅)
    if (process.env.NODE_ENV === 'production') {
      // Sentry.captureException(error, { extra: errorInfo });
    }
  };

  return (
    <ErrorBoundary onError={handleError}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
