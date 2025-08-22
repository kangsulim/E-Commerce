import { apiClient } from './api';
import {
  Product,
  Category,
  PaginatedResponse,
} from '../types';

export const productService = {
  // 상품 목록 조회 (페이징)
  getProducts: async (params: {
    page?: number;
    size?: number;
    category?: string;
    search?: string;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
  } = {}): Promise<PaginatedResponse<Product>> => {
    const queryParams = new URLSearchParams();
    
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());
    if (params.category) queryParams.append('category', params.category);
    if (params.search) queryParams.append('search', params.search);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);

    return apiClient.get<PaginatedResponse<Product>>(`/products?${queryParams.toString()}`);
  },

  // 상품 상세 조회
  getProduct: async (id: number): Promise<Product> => {
    return apiClient.get<Product>(`/products/${id}`);
  },

  // 카테고리 목록 조회
  getCategories: async (): Promise<Category[]> => {
    return apiClient.get<Category[]>('/categories');
  },
};
