import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Button,
  LinearProgress,
  Skeleton as MuiSkeleton,
  Stack,
  Backdrop,
  useTheme
} from '@mui/material';

interface LoadingSpinnerProps {
  size?: number | 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'inherit';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'primary',
  className = ''
}) => {
  return (
    <CircularProgress
      size={size}
      color={color}
      className={className}
    />
  );
};

interface LoadingOverlayProps {
  message?: string;
  open?: boolean;
  className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  message = '로딩 중...',
  open = true,
  className = ''
}) => {
  const theme = useTheme();

  return (
    <Backdrop
      open={open}
      sx={{
        color: '#fff',
        zIndex: theme.zIndex.modal + 1,
        ...className
      }}
    >
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 2,
          p: 4,
          textAlign: 'center',
          boxShadow: theme.shadows[8],
          color: 'text.primary'
        }}
      >
        <CircularProgress size={60} sx={{ mb: 2 }} />
        <Typography variant="h6" fontWeight="medium">
          {message}
        </Typography>
      </Box>
    </Backdrop>
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
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: theme.palette.grey[50],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...className
      }}
    >
      <Box textAlign="center">
        <CircularProgress size={80} sx={{ mb: 3 }} />
        <Typography variant="h5" fontWeight="medium" sx={{ mb: 1 }}>
          {message}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          잠시만 기다려주세요
        </Typography>
      </Box>
    </Box>
  );
};

interface InlineLoadingProps {
  message?: string;
  size?: number | 'small' | 'medium' | 'large';
  className?: string;
}

export const InlineLoading: React.FC<InlineLoadingProps> = ({
  message = '로딩 중...',
  size = 'medium',
  className = ''
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        py: 4,
        ...className
      }}
    >
      <CircularProgress size={size} />
      <Typography color="text.secondary">{message}</Typography>
    </Box>
  );
};

interface ButtonLoadingProps {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  sx?: any;
}

export const ButtonLoading: React.FC<ButtonLoadingProps> = ({
  children,
  loading = false,
  disabled = false,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  onClick,
  type = 'button',
  sx = {}
}) => {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      variant={variant}
      color={color}
      size={size}
      startIcon={loading ? <CircularProgress size={16} color="inherit" /> : undefined}
      sx={{
        position: 'relative',
        ...sx
      }}
    >
      {children}
    </Button>
  );
};

// 스켈레톤 로딩을 위한 컴포넌트들
interface SkeletonProps {
  variant?: 'text' | 'rectangular' | 'rounded' | 'circular';
  width?: number | string;
  height?: number | string;
  animation?: 'pulse' | 'wave' | false;
  sx?: any;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
  sx = {}
}) => {
  return (
    <MuiSkeleton
      variant={variant}
      width={width}
      height={height}
      animation={animation}
      sx={sx}
    />
  );
};

export const SkeletonText: React.FC<{
  lines?: number;
  sx?: any;
}> = ({
  lines = 3,
  sx = {}
}) => {
  return (
    <Stack spacing={1} sx={sx}>
      {Array.from({ length: lines }).map((_, index) => (
        <MuiSkeleton
          key={index}
          variant="text"
          width={index === lines - 1 ? '75%' : '100%'}
          height={20}
        />
      ))}
    </Stack>
  );
};

interface LoadingDotsProps {
  size?: number;
  color?: string;
  sx?: any;
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({
  size = 8,
  color = 'primary.main',
  sx = {}
}) => {
  const theme = useTheme();

  return (
    <Stack direction="row" spacing={0.5} alignItems="center" sx={sx}>
      {[0, 1, 2].map((index) => (
        <Box
          key={index}
          sx={{
            width: size,
            height: size,
            borderRadius: '50%',
            bgcolor: color,
            animation: 'bounce 1s infinite',
            animationDelay: `${index * 0.2}s`,
            '@keyframes bounce': {
              '0%, 80%, 100%': {
                transform: 'scale(0)'
              },
              '40%': {
                transform: 'scale(1)'
              }
            }
          }}
        />
      ))}
    </Stack>
  );
};

// 진행률 표시기
interface ProgressBarProps {
  progress: number; // 0-100
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  showLabel?: boolean;
  variant?: 'determinate' | 'indeterminate';
  sx?: any;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  size = 'medium',
  color = 'primary',
  showLabel = true,
  variant = 'determinate',
  sx = {}
}) => {
  const theme = useTheme();
  const clampedProgress = Math.min(100, Math.max(0, progress));

  const sizeMap = {
    small: 4,
    medium: 6,
    large: 8
  };

  return (
    <Box sx={sx}>
      {showLabel && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            진행률
          </Typography>
          <Typography variant="body2" fontWeight="medium">
            {Math.round(clampedProgress)}%
          </Typography>
        </Box>
      )}
      <LinearProgress
        variant={variant}
        value={clampedProgress}
        color={color}
        sx={{
          height: sizeMap[size],
          borderRadius: 1,
          bgcolor: theme.palette.grey[200]
        }}
      />
    </Box>
  );
};

export default LoadingSpinner;
