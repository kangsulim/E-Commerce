import { apiClient } from './api';
import {
  LoginRequest,
  LoginResponse,
  User,
  ApiResponse,
} from '../types';

// 회원가입 요청 타입
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export const authService = {
  // 회원가입
  register: async (userData: RegisterRequest): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>('/auth/register', userData);
  },

  // 로그인
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>('/auth/login', credentials);
  },

  // 토큰 갱신
  refreshToken: async (refreshToken: string): Promise<{ accessToken: string }> => {
    return apiClient.post<{ accessToken: string }>('/auth/refresh', { refreshToken });
  },

  // 현재 사용자 정보 조회
  getCurrentUser: async (): Promise<User> => {
    return apiClient.get<User>('/auth/me');
  },

  // 로그아웃 (로컬 토큰 제거)
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  // 토큰 저장
  saveTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  },

  // 토큰 확인
  getAccessToken: () => {
    return localStorage.getItem('accessToken');
  },

  // 리프레시 토큰 확인
  getRefreshToken: () => {
    return localStorage.getItem('refreshToken');
  },

  // 인증 상태 확인
  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  },
};
