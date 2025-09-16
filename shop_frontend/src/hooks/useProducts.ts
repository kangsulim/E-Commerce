import { useQuery } from '@tanstack/react-query';
import { 
  mockProducts, 
  mockCategories, 
  searchProducts, 
  getProductsByCategory,
  getProductsByPriceRange,
  sortProducts,
  SortOption,
  Product,
  Category
} from '../data/mockProducts';

// 상품 목록 조회
export const useProducts = (options?: {
  categoryId?: number;
  searchQuery?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: SortOption;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['products', options],
    queryFn: async () => {
      // Mock API 시뮬레이션을 위한 지연
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredProducts = [...mockProducts];
      
      // 카테고리 필터링
      if (options?.categoryId) {
        filteredProducts = getProductsByCategory(options.categoryId);
      }
      
      // 검색 필터링
      if (options?.searchQuery) {
        filteredProducts = searchProducts(options.searchQuery);
      }
      
      // 가격 범위 필터링
      if (options?.minPrice !== undefined || options?.maxPrice !== undefined) {
        const minPrice = options.minPrice ?? 0;
        const maxPrice = options.maxPrice ?? Infinity;
        filteredProducts = getProductsByPriceRange(minPrice, maxPrice);
      }
      
      // 정렬
      if (options?.sortBy) {
        filteredProducts = sortProducts(filteredProducts, options.sortBy);
      }
      
      // 페이지네이션
      const page = options?.page ?? 1;
      const limit = options?.limit ?? 12;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
      
      return {
        products: paginatedProducts,
        totalCount: filteredProducts.length,
        totalPages: Math.ceil(filteredProducts.length / limit),
        currentPage: page,
        hasNextPage: endIndex < filteredProducts.length,
        hasPreviousPage: page > 1,
      };
    },
    staleTime: 5 * 60 * 1000, // 5분
  });
};

// 단일 상품 조회
export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      // Mock API 시뮬레이션을 위한 지연
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const product = mockProducts.find(p => p.id === id);
      if (!product) {
        throw new Error('상품을 찾을 수 없습니다.');
      }
      return product;
    },
    staleTime: 10 * 60 * 1000, // 10분
  });
};

// 카테고리 목록 조회
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      // Mock API 시뮬레이션을 위한 지연
      await new Promise(resolve => setTimeout(resolve, 200));
      return mockCategories;
    },
    staleTime: 30 * 60 * 1000, // 30분
  });
};

// 추천 상품 조회
export const useFeaturedProducts = (limit: number = 8) => {
  return useQuery({
    queryKey: ['featured-products', limit],
    queryFn: async () => {
      // Mock API 시뮬레이션을 위한 지연
      await new Promise(resolve => setTimeout(resolve, 400));
      
      return mockProducts
        .filter(product => product.tags.includes('베스트셀러') || product.rating >= 4.5)
        .slice(0, limit);
    },
    staleTime: 15 * 60 * 1000, // 15분
  });
};

// 할인 상품 조회
export const useDiscountedProducts = (limit: number = 6) => {
  return useQuery({
    queryKey: ['discounted-products', limit],
    queryFn: async () => {
      // Mock API 시뮬레이션을 위한 지연
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return mockProducts
        .filter(product => product.discount && product.discount > 0)
        .slice(0, limit);
    },
    staleTime: 10 * 60 * 1000, // 10분
  });
};
