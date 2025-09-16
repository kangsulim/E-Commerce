import React, { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useProductFilter } from '../hooks/useProductFilter';
import ProductGrid from '../components/product/ProductGrid';
import Pagination from '../components/common/Pagination';
import SearchBar from '../components/search/SearchBar';
import FilterSidebar, { MobileFilterModal } from '../components/filter/FilterSidebar';
import { CategoryFilterWithIcons } from '../components/filter/CategoryFilter';
import { CompactSortOptions } from '../components/filter/SortOptions';

const ProductListPage: React.FC = () => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // 필터 상태 관리
  const {
    filters,
    setCategory,
    setSearchQuery,
    setPriceRange,
    setSortBy,
    setPage,
    resetFilters,
    hasActiveFilters,
    getActiveFilterCount
  } = useProductFilter({
    syncWithUrl: true,
    debounceMs: 300
  });

  // 상품 데이터 조회
  const { data: productsData, isLoading: isProductsLoading } = useProducts({
    categoryId: filters.categoryId,
    searchQuery: filters.searchQuery,
    minPrice: filters.priceRange?.min,
    maxPrice: filters.priceRange?.max,
    sortBy: filters.sortBy,
    page: filters.page,
    limit: filters.limit
  });

  // 필터 상태 객체 생성 (FilterSidebar용)
  const filterState = {
    categoryId: filters.categoryId,
    priceRange: filters.priceRange,
    sortBy: filters.sortBy,
    searchQuery: filters.searchQuery
  };

  const handleFiltersChange = (newFilters: typeof filterState) => {
    if (newFilters.categoryId !== filters.categoryId) {
      setCategory(newFilters.categoryId || null);
    }
    if (newFilters.priceRange !== filters.priceRange) {
      setPriceRange(newFilters.priceRange || null);
    }
    if (newFilters.sortBy !== filters.sortBy) {
      setSortBy(newFilters.sortBy);
    }
    if (newFilters.searchQuery !== filters.searchQuery) {
      setSearchQuery(newFilters.searchQuery || null);
    }
  };

  const products = productsData?.products || [];
  const totalCount = productsData?.totalCount || 0;
  const totalPages = productsData?.totalPages || 1;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 상단 검색 및 카테고리 섹션 */}
        <div className="mb-8 space-y-6">
          {/* 검색바 */}
          <div className="max-w-2xl mx-auto">
            <SearchBar
              onSearch={setSearchQuery}
              className="w-full"
              showSuggestions={true}
            />
          </div>

          {/* 카테고리 필터 (수평 레이아웃) */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <CategoryFilterWithIcons
              selectedCategoryId={filters.categoryId}
              onCategoryChange={setCategory}
              variant="horizontal"
              showProductCount={true}
              showAllOption={true}
            />
          </div>
        </div>

        {/* 현재 필터 상태 표시 */}
        {(filters.searchQuery || hasActiveFilters) && (
          <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-gray-600">현재 필터:</span>
              
              {filters.searchQuery && (
                <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  검색: "{filters.searchQuery}"
                  <button
                    onClick={() => setSearchQuery(null)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}
              
              {filters.categoryId && (
                <span className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  카테고리 선택됨
                  <button
                    onClick={() => setCategory(null)}
                    className="text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              )}
              
              {filters.priceRange && (
                <span className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                  가격 범위 설정됨
                  <button
                    onClick={() => setPriceRange(null)}
                    className="text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </span>
              )}
              
              {filters.sortBy !== 'popular' && (
                <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                  정렬 변경됨
                  <button
                    onClick={() => setSortBy('popular')}
                    className="text-orange-600 hover:text-orange-800"
                  >
                    ×
                  </button>
                </span>
              )}
              
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-sm text-red-600 hover:text-red-800 underline"
                >
                  모든 필터 초기화
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* 데스크톱 사이드바 */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <FilterSidebar
              filters={filterState}
              onFiltersChange={handleFiltersChange}
              isCollapsible={true}
              defaultCollapsed={false}
              showClearButton={true}
            />
          </div>

          {/* 메인 콘텐츠 */}
          <div className="flex-1">
            {/* 상단 컨트롤 바 */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* 왼쪽: 결과 수 및 모바일 필터 버튼 */}
                <div className="flex items-center gap-4">
                  {/* 모바일 필터 버튼 */}
                  <button
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    필터
                    {hasActiveFilters && (
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                        {getActiveFilterCount}
                      </span>
                    )}
                  </button>

                  {/* 결과 수 */}
                  <span className="text-sm text-gray-600">
                    총 <span className="font-medium text-gray-900">{totalCount.toLocaleString()}</span>개 상품
                  </span>
                </div>

                {/* 오른쪽: 정렬 및 보기 모드 */}
                <div className="flex items-center gap-4">
                  {/* 정렬 옵션 */}
                  <CompactSortOptions
                    value={filters.sortBy}
                    onChange={setSortBy}
                  />

                  {/* 보기 모드 전환 */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700 font-medium whitespace-nowrap">보기:</span>
                    <div className="flex rounded-md border border-gray-300 overflow-hidden">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`px-3 py-2 text-sm transition-colors ${
                          viewMode === 'grid'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`px-3 py-2 text-sm transition-colors border-l border-gray-300 ${
                          viewMode === 'list'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 상품 목록 */}
            <ProductGrid
              products={products}
              isLoading={isProductsLoading}
              className="mb-8"
            />

            {/* 페이지네이션 */}
            {!isProductsLoading && totalPages > 1 && (
              <Pagination
                currentPage={filters.page}
                totalPages={totalPages}
                totalItems={totalCount}
                itemsPerPage={filters.limit}
                onPageChange={setPage}
                className="mt-8"
              />
            )}

            {/* 빈 상태 */}
            {!isProductsLoading && products.length === 0 && (
              <div className="text-center py-16">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  검색 결과가 없습니다
                </h3>
                <p className="text-gray-500 mb-6">
                  다른 검색어나 필터를 시도해보세요.
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    모든 필터 초기화
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 모바일 필터 모달 */}
        <MobileFilterModal
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
          filters={filterState}
          onFiltersChange={handleFiltersChange}
          showClearButton={true}
        />
      </div>
    </div>
  );
};

export default ProductListPage;
