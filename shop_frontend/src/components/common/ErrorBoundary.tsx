import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });
    
    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // You can also log the error to an error reporting service here
    // Example: Sentry.captureException(error);
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8 text-center">
            {/* Error Icon */}
            <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>

            {/* Error Message */}
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              앗! 문제가 발생했습니다
            </h1>
            <p className="text-gray-600 mb-6">
              예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
            </p>

            {/* Error Details (in development) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left mb-6 p-4 bg-gray-100 rounded-lg">
                <summary className="cursor-pointer font-medium text-sm text-gray-700 mb-2">
                  개발자 정보 (클릭하여 펼치기)
                </summary>
                <div className="text-xs text-gray-600 space-y-2">
                  <div>
                    <strong>Error:</strong> {this.state.error.message}
                  </div>
                  <div>
                    <strong>Stack:</strong>
                    <pre className="whitespace-pre-wrap bg-gray-50 p-2 rounded mt-1 text-xs">
                      {this.state.error.stack}
                    </pre>
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="whitespace-pre-wrap bg-gray-50 p-2 rounded mt-1 text-xs">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                다시 시도
              </button>
              <Link
                to="/"
                onClick={this.handleGoHome}
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                홈으로 이동
              </Link>
            </div>

            {/* Support Link */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                문제가 계속 발생한다면{' '}
                <a
                  href="mailto:support@example.com"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  고객지원
                </a>
                으로 문의해주세요.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook version for functional components (React 16.8+)
export const useErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { captureError, resetError };
};

// Simple error boundary for specific components
interface SimpleErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error) => void;
}

export const SimpleErrorBoundary: React.FC<SimpleErrorBoundaryProps> = ({
  children,
  fallback,
  onError
}) => {
  const [hasError, setHasError] = React.useState(false);

  const resetError = () => setHasError(false);

  if (hasError) {
    return (
      fallback || (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-red-800 mb-2">로딩 오류</h3>
          <p className="text-red-600 mb-4">컴포넌트를 불러오는 중 오류가 발생했습니다.</p>
          <button
            onClick={resetError}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            다시 시도
          </button>
        </div>
      )
    );
  }

  return (
    <ErrorBoundary
      onError={(error) => {
        setHasError(true);
        onError?.(error);
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundary;
