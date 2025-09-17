import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Alert,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme
} from '@mui/material';
import {
  Error as ErrorIcon,
  ExpandMore as ExpandMoreIcon,
  Home as HomeIcon,
  Refresh as RefreshIcon,
  Email as EmailIcon
} from '@mui/icons-material';

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
        <Box
          sx={{
            minHeight: '100vh',
            bgcolor: 'grey.50',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4
          }}
        >
          <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
              {/* Error Icon */}
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 3,
                  bgcolor: 'error.light',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ErrorIcon sx={{ fontSize: 40, color: 'error.main' }} />
              </Box>

              {/* Error Message */}
              <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
                앗! 문제가 발생했습니다
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
              </Typography>

              {/* Error Details (in development) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <Box sx={{ mb: 4, textAlign: 'left' }}>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle2">
                        개발자 정보 (클릭하여 펼치기)
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            Error:
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {this.state.error.message}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            Stack:
                          </Typography>
                          <Paper
                            variant="outlined"
                            sx={{
                              p: 2,
                              bgcolor: 'grey.50',
                              maxHeight: 200,
                              overflow: 'auto'
                            }}
                          >
                            <Typography
                              variant="caption"
                              component="pre"
                              sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}
                            >
                              {this.state.error.stack}
                            </Typography>
                          </Paper>
                        </Box>
                        {this.state.errorInfo && (
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold">
                              Component Stack:
                            </Typography>
                            <Paper
                              variant="outlined"
                              sx={{
                                p: 2,
                                bgcolor: 'grey.50',
                                maxHeight: 200,
                                overflow: 'auto'
                              }}
                            >
                              <Typography
                                variant="caption"
                                component="pre"
                                sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}
                              >
                                {this.state.errorInfo.componentStack}
                              </Typography>
                            </Paper>
                          </Box>
                        )}
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              )}

              {/* Action Buttons */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                justifyContent="center"
                sx={{ mb: 4 }}
              >
                <Button
                  variant="contained"
                  startIcon={<RefreshIcon />}
                  onClick={this.handleReload}
                  size="large"
                >
                  다시 시도
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<HomeIcon />}
                  component={Link}
                  to="/"
                  onClick={this.handleGoHome}
                  size="large"
                >
                  홈으로 이동
                </Button>
              </Stack>

              {/* Support Link */}
              <Box sx={{ pt: 3, borderTop: 1, borderColor: 'divider' }}>
                <Typography variant="body2" color="text.secondary">
                  문제가 계속 발생한다면{' '}
                  <Button
                    variant="text"
                    size="small"
                    startIcon={<EmailIcon />}
                    href="mailto:support@example.com"
                    sx={{ p: 0, minWidth: 'auto' }}
                  >
                    고객지원
                  </Button>
                  으로 문의해주세요.
                </Typography>
              </Box>
            </Paper>
          </Container>
        </Box>
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
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={resetError}>
              다시 시도
            </Button>
          }
          sx={{ m: 2 }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            로딩 오류
          </Typography>
          <Typography variant="body2">
            컴포넌트를 불러오는 중 오류가 발생했습니다.
          </Typography>
        </Alert>
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
