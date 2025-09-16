import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'blue' | 'gray' | 'white';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'blue',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colorClasses = {
    blue: 'text-blue-600',
    gray: 'text-gray-600',
    white: 'text-white'
  };

  return (
    <svg
      className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

interface LoadingOverlayProps {
  message?: string;
  className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  message = '로딩 중...',
  className = ''
}) => {
  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${className}`}>
      <div className="bg-white rounded-lg p-8 text-center shadow-xl">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-gray-700 font-medium">{message}</p>
      </div>
    </div>
  );
};

interface PageLoadingProps {
  message?: string;
  className?: string;
}

export const PageLoading: React.FC<PageLoadingProps> = ({
  message = '페이지를 불러오는 중...',
  className = ''
}) => {
  return (
    <div className={`min-h-screen bg-gray-50 flex items-center justify-center ${className}`}>
      <div className="text-center">
        <LoadingSpinner size="xl" className="mx-auto mb-6" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">{message}</h2>
        <p className="text-gray-500">잠시만 기다려주세요</p>
      </div>
    </div>
  );
};

interface InlineLoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const InlineLoading: React.FC<InlineLoadingProps> = ({
  message = '로딩 중...',
  size = 'md',
  className = ''
}) => {
  return (
    <div className={`flex items-center justify-center gap-3 py-8 ${className}`}>
      <LoadingSpinner size={size} />
      <span className="text-gray-600">{message}</span>
    </div>
  );
};

interface ButtonLoadingProps {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export const ButtonLoading: React.FC<ButtonLoadingProps> = ({
  children,
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button'
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`relative inline-flex items-center justify-center gap-2 transition-all duration-200 ${
        loading || disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      {loading && (
        <LoadingSpinner size="sm" color="white" className="absolute" />
      )}
      <span className={loading ? 'opacity-0' : 'opacity-100'}>
        {children}
      </span>
    </button>
  );
};

// 스켈레톤 로딩을 위한 컴포넌트들
interface SkeletonProps {
  className?: string;
  animate?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  animate = true
}) => {
  return (
    <div
      className={`bg-gray-200 rounded ${animate ? 'animate-pulse' : ''} ${className}`}
    />
  );
};

export const SkeletonText: React.FC<{
  lines?: number;
  className?: string;
}> = ({
  lines = 3,
  className = ''
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={`h-4 ${
            index === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
};

interface LoadingDotsProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'gray' | 'white';
  className?: string;
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({
  size = 'md',
  color = 'blue',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  };

  const colorClasses = {
    blue: 'bg-blue-600',
    gray: 'bg-gray-600',
    white: 'bg-white'
  };

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce`}
          style={{
            animationDelay: `${index * 0.2}s`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  );
};

// 진행률 표시기
interface ProgressBarProps {
  progress: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'red';
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  size = 'md',
  color = 'blue',
  showLabel = true,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    red: 'bg-red-600'
  };

  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">진행률</span>
          <span className="text-sm font-medium text-gray-900">
            {Math.round(clampedProgress)}%
          </span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]}`}>
        <div
          className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};

export default LoadingSpinner;
