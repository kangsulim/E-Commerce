import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SortOption } from '../data/mockProducts';

export interface ProductFilters {
  categoryId?: number;
  searchQuery?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  sortBy: SortOption;
  page: number;
  limit: number;
}

interface UseProductFilterOptions {
  defaultFilters?: Partial<ProductFilters>;
  debounceMs?: number;
  syncWithUrl?: boolean;
}

export const useProductFilter = (options: UseProductFilterOptions = {}) => {
  const {
    defaultFilters = {},
    debounceMs = 300,
    syncWithUrl = true
  } = options;

  const [searchParams, setSearchParams] = useSearchParams();
  
  // URL에서 초기 필터 상태 추출
  const getFiltersFromUrl = useCallback((): ProductFilters => {
    const categoryId = searchParams.get('category') 
      ? parseInt(searchParams.get('category')!) 
      : undefined;
    const searchQuery = searchParams.get('search') || undefined;
    const sortBy = (searchParams.get('sort') || 'popular') as SortOption;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    
    // 가격 범위 파싱
    let priceRange: { min: number; max: number } | undefined;
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    if (minPrice || maxPrice) {
      priceRange = {
        min: minPrice ? parseInt(minPrice) : 0,
        max: maxPrice ? parseInt(maxPrice) : 2000000
      };
    }

    return {
      categoryId,
      searchQuery,
      priceRange,
      sortBy,
      page,
      limit,
      ...defaultFilters
    };
  }, [searchParams, defaultFilters]);

  const [filters, setFilters] = useState<ProductFilters>(getFiltersFromUrl);
  const [isLoading, setIsLoading] = useState(false);
  
  // 디바운스를 위한 타이머
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  // URL 업데이트 함수
  const updateUrl = useCallback((newFilters: ProductFilters) => {
    if (!syncWithUrl) return;

    const newParams = new URLSearchParams();
    
    if (newFilters.categoryId) {
      newParams.set('category', newFilters.categoryId.toString());
    }
    
    if (newFilters.searchQuery) {
      newParams.set('search', newFilters.searchQuery);
    }
    
    if (newFilters.priceRange) {
      if (newFilters.priceRange.min > 0) {
        newParams.set('minPrice', newFilters.priceRange.min.toString());
      }
      if (newFilters.priceRange.max < 2000000) {
        newParams.set('maxPrice', newFilters.priceRange.max.toString());
      }
    }
    
    if (newFilters.sortBy !== 'popular') {
      newParams.set('sort', newFilters.sortBy);
    }
    
    if (newFilters.page > 1) {
      newParams.set('page', newFilters.page.toString());
    }
    
    if (newFilters.limit !== 12) {
      newParams.set('limit', newFilters.limit.toString());
    }

    setSearchParams(newParams);
  }, [setSearchParams, syncWithUrl]);

  // 필터 업데이트 함수 (디바운스 적용)
  const updateFilters = useCallback((
    updater: Partial<ProductFilters> | ((prev: ProductFilters) => ProductFilters),
    immediate = false
  ) => {
    const newFilters = typeof updater === 'function' 
      ? updater(filters)
      : { ...filters, ...updater };

    // 필터 변경 시 페이지를 1로 리셋 (페이지 변경이 아닌 경우)
    if (!('page' in (typeof updater === 'function' ? {} : updater))) {
      newFilters.page = 1;
    }

    setFilters(newFilters);

    // 디바운스 처리
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    if (immediate || debounceMs === 0) {
      updateUrl(newFilters);
    } else {
      const timer = setTimeout(() => {
        updateUrl(newFilters);
      }, debounceMs);
      setDebounceTimer(timer);
    }
  }, [filters, updateUrl, debounceMs, debounceTimer]);

  // 개별 필터 업데이트 함수들
  const setCategory = useCallback((categoryId: number | null) => {
    updateFilters({ categoryId: categoryId || undefined }, true);
  }, [updateFilters]);

  const setSearchQuery = useCallback((searchQuery: string | null) => {
    updateFilters({ searchQuery: searchQuery || undefined });
  }, [updateFilters]);

  const setPriceRange = useCallback((priceRange: { min: number; max: number } | null) => {
    updateFilters({ priceRange: priceRange || undefined });
  }, [updateFilters]);

  const setSortBy = useCallback((sortBy: SortOption) => {
    updateFilters({ sortBy }, true);
  }, [updateFilters]);

  const setPage = useCallback((page: number) => {
    updateFilters({ page }, true);
  }, [updateFilters]);

  const setLimit = useCallback((limit: number) => {
    updateFilters({ limit }, true);
  }, [updateFilters]);

  // 필터 초기화
  const resetFilters = useCallback(() => {
    const resetFilters: ProductFilters = {
      sortBy: 'popular',
      page: 1,
      limit: 12,
      ...defaultFilters
    };
    setFilters(resetFilters);
    updateUrl(resetFilters);
  }, [defaultFilters, updateUrl]);

  // 활성 필터 확인
  const hasActiveFilters = useCallback(() => {
    return !!(
      filters.categoryId ||
      filters.searchQuery ||
      filters.priceRange ||
      filters.sortBy !== 'popular'
    );
  }, [filters]);

  // 활성 필터 개수
  const getActiveFilterCount = useCallback(() => {
    let count = 0;
    if (filters.categoryId) count++;
    if (filters.searchQuery) count++;
    if (filters.priceRange) count++;
    if (filters.sortBy !== 'popular') count++;
    return count;
  }, [filters]);

  // URL 변경 감지 (뒤로가기/앞으로가기 대응)
  useEffect(() => {
    const urlFilters = getFiltersFromUrl();
    setFilters(urlFilters);
  }, [getFiltersFromUrl]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  return {
    // 현재 필터 상태
    filters,
    isLoading,
    
    // 필터 업데이트 함수들
    updateFilters,
    setCategory,
    setSearchQuery,
    setPriceRange,
    setSortBy,
    setPage,
    setLimit,
    resetFilters,
    
    // 유틸리티 함수들
    hasActiveFilters: hasActiveFilters(),
    getActiveFilterCount: getActiveFilterCount(),
    
    // 로딩 상태 제어
    setIsLoading
  };
};

// 필터 상태를 쿼리 문자열로 변환하는 헬퍼 함수
export const filtersToQueryString = (filters: ProductFilters): string => {
  const params = new URLSearchParams();
  
  if (filters.categoryId) {
    params.set('category', filters.categoryId.toString());
  }
  
  if (filters.searchQuery) {
    params.set('search', filters.searchQuery);
  }
  
  if (filters.priceRange) {
    if (filters.priceRange.min > 0) {
      params.set('minPrice', filters.priceRange.min.toString());
    }
    if (filters.priceRange.max < 2000000) {
      params.set('maxPrice', filters.priceRange.max.toString());
    }
  }
  
  if (filters.sortBy !== 'popular') {
    params.set('sort', filters.sortBy);
  }
  
  if (filters.page > 1) {
    params.set('page', filters.page.toString());
  }
  
  if (filters.limit !== 12) {
    params.set('limit', filters.limit.toString());
  }

  return params.toString();
};

// 쿼리 문자열을 필터 상태로 변환하는 헬퍼 함수
export const queryStringToFilters = (queryString: string): Partial<ProductFilters> => {
  const params = new URLSearchParams(queryString);
  const filters: Partial<ProductFilters> = {};
  
  const categoryId = params.get('category');
  if (categoryId) {
    filters.categoryId = parseInt(categoryId);
  }
  
  const searchQuery = params.get('search');
  if (searchQuery) {
    filters.searchQuery = searchQuery;
  }
  
  const minPrice = params.get('minPrice');
  const maxPrice = params.get('maxPrice');
  if (minPrice || maxPrice) {
    filters.priceRange = {
      min: minPrice ? parseInt(minPrice) : 0,
      max: maxPrice ? parseInt(maxPrice) : 2000000
    };
  }
  
  const sortBy = params.get('sort');
  if (sortBy) {
    filters.sortBy = sortBy as SortOption;
  }
  
  const page = params.get('page');
  if (page) {
    filters.page = parseInt(page);
  }
  
  const limit = params.get('limit');
  if (limit) {
    filters.limit = parseInt(limit);
  }

  return filters;
};

export default useProductFilter;
