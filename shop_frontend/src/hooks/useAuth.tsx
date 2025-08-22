import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '../types';
import { authService } from '../services/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 인증 상태 확인
  const isAuthenticated = !!user;

  // 초기 로드 시 토큰으로 사용자 정보 조회
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        // 토큰이 유효하지 않으면 로그아웃
        authService.logout();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // 로그인 처리
  const login = async (accessToken: string, refreshToken: string) => {
    try {
      setIsLoading(true);
      
      // 토큰 저장
      authService.saveTokens(accessToken, refreshToken);
      
      // 사용자 정보 조회
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      // 로그인 실패 시 토큰 제거
      authService.logout();
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 로그아웃 처리
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // 사용자 정보 업데이트
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 관리자 권한 체크 훅
export const useIsAdmin = () => {
  const { user } = useAuth();
  return user?.role === 'ADMIN';
};

// 로그인 체크 훅 (리다이렉트 포함)
export const useRequireAuth = (redirectTo: string = '/login') => {
  const { isAuthenticated, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = redirectTo;
    }
  }, [isAuthenticated, isLoading, redirectTo]);

  return { isAuthenticated, isLoading };
};

// 관리자 권한 체크 훅 (리다이렉트 포함)
export const useRequireAdmin = (redirectTo: string = '/') => {
  const { user, isLoading } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  
  useEffect(() => {
    if (!isLoading && !isAdmin) {
      window.location.href = redirectTo;
    }
  }, [isAdmin, isLoading, redirectTo]);

  return { isAdmin, isLoading };
};
