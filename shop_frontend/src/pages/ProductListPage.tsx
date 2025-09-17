import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Stack,
  Chip,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Drawer,
  useTheme,
  useMediaQuery,
  alpha
} from '@mui/material';
import {
  Tune as FilterIcon,
  ViewModule as GridIcon,
  ViewList as ListIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { useProducts } from '../hooks/useProducts';
import { useProductFilter } from '../hooks/useProductFilter';
import ProductGrid from '../components/product/ProductGrid';
import Pagination from '../components/common/Pagination';
import SearchBar from '../components/search/SearchBar';
import FilterSidebar, { MobileFilterModal } from '../components/filter/FilterSidebar';
import { CategoryFilterWithIcons } from '../components/filter/CategoryFilter';
import { CompactSortOptions } from '../components/filter/SortOptions';

const ProductListPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  
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
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* 상단 검색 및 카테고리 섹션 */}
        <Stack spacing={3} sx={{ mb: 4 }}>
          {/* 검색바 */}
          <Box sx={{ maxWidth: 600, mx: 'auto' }}>
            <SearchBar
              onSearch={setSearchQuery}
              className="w-full"
              showSuggestions={true}
            />
          </Box>

          {/* 카테고리 필터 (수평 레이아웃) */}
          <Paper elevation={1} sx={{ p: 3 }}>
            <CategoryFilterWithIcons
              selectedCategoryId={filters.categoryId}
              onCategoryChange={setCategory}
              variant="horizontal"
              showProductCount={true}
              showAllOption={true}
            />
          </Paper>
        </Stack>

        {/* 현재 필터 상태 표시 */}
        {(filters.searchQuery || hasActiveFilters) && (
          <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                현재 필터:
              </Typography>
              
              {filters.searchQuery && (
                <Chip
                  label={`검색: "${filters.searchQuery}"`}
                  onDelete={() => setSearchQuery(null)}
                  color="primary"
                  variant="outlined"
                />
              )}
              
              {filters.categoryId && (
                <Chip
                  label="카테고리 선택됨"
                  onDelete={() => setCategory(null)}
                  color="success"
                  variant="outlined"
                />
              )}
              
              {filters.priceRange && (
                <Chip
                  label="가격 범위 설정됨"
                  onDelete={() => setPriceRange(null)}
                  color="secondary"
                  variant="outlined"
                />
              )}
              
              {filters.sortBy !== 'popular' && (
                <Chip
                  label="정렬 변경됨"
                  onDelete={() => setSortBy('popular')}
                  color="warning"
                  variant="outlined"
                />
              )}
              
              {hasActiveFilters && (
                <Button
                  size="small"
                  color="error"
                  onClick={resetFilters}
                  startIcon={<ClearIcon />}
                >
                  모든 필터 초기화
                </Button>
              )}
            </Stack>
          </Paper>
        )}

        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* 데스크톱 사이드바 */}
          {!isMobile && (
            <Box sx={{ width: 320, flexShrink: 0 }}>
              <FilterSidebar
                filters={filterState}
                onFiltersChange={handleFiltersChange}
                isCollapsible={true}
                defaultCollapsed={false}
                showClearButton={true}
              />
            </Box>
          )}

          {/* 메인 콘텐츠 */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* 상단 컨트롤 바 */}
            <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                alignItems={{ xs: 'stretch', sm: 'center' }}
                justifyContent="space-between"
                spacing={2}
              >
                {/* 왼쪽: 결과 수 및 모바일 필터 버튼 */}
                <Stack direction="row" alignItems="center" spacing={2}>
                  {/* 모바일 필터 버튼 */}
                  {isMobile && (
                    <Button
                      variant="outlined"
                      startIcon={<FilterIcon />}
                      onClick={() => setIsMobileFilterOpen(true)}
                      size="small"
                    >
                      필터
                      {hasActiveFilters && (
                        <Chip
                          label={getActiveFilterCount}
                          size="small"
                          color="primary"
                          sx={{ ml: 1, height: 20, minWidth: 20 }}
                        />
                      )}
                    </Button>
                  )}

                  {/* 결과 수 */}
                  <Typography variant="body2" color="text.secondary">
                    총 <Box component="span" fontWeight="medium">{totalCount.toLocaleString()}</Box>개 상품
                  </Typography>
                </Stack>

                {/* 오른쪽: 정렬 및 보기 모드 */}
                <Stack direction="row" alignItems="center" spacing={2}>
                  {/* 정렬 옵션 */}
                  <CompactSortOptions
                    value={filters.sortBy}
                    onChange={setSortBy}
                  />

                  {/* 보기 모드 전환 */}
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                      보기:
                    </Typography>
                    <ToggleButtonGroup
                      value={viewMode}
                      exclusive
                      onChange={(_, newMode) => newMode && setViewMode(newMode)}
                      size="small"
                    >
                      <ToggleButton value="grid">
                        <GridIcon fontSize="small" />
                      </ToggleButton>
                      <ToggleButton value="list">
                        <ListIcon fontSize="small" />
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Stack>
                </Stack>
              </Stack>
            </Paper>

            {/* 상품 목록 */}
            <Box sx={{ mb: 4 }}>
              <ProductGrid
                products={products}
                isLoading={isProductsLoading}
              />
            </Box>

            {/* 페이지네이션 */}
            {!isProductsLoading && totalPages > 1 && (
              <Box sx={{ mt: 4 }}>
                <Pagination
                  currentPage={filters.page}
                  totalPages={totalPages}
                  totalItems={totalCount}
                  itemsPerPage={filters.limit}
                  onPageChange={setPage}
                />
              </Box>
            )}

            {/* 빈 상태 */}
            {!isProductsLoading && products.length === 0 && (
              <Paper elevation={1} sx={{ p: 8, textAlign: 'center' }}>
                <Typography variant="h1" sx={{ fontSize: '4rem', mb: 2 }}>
                  🔍
                </Typography>
                <Typography variant="h5" fontWeight="medium" sx={{ mb: 1 }}>
                  검색 결과가 없습니다
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                  다른 검색어나 필터를 시도해보세요.
                </Typography>
                {hasActiveFilters && (
                  <Button
                    variant="contained"
                    onClick={resetFilters}
                    startIcon={<ClearIcon />}
                  >
                    모든 필터 초기화
                  </Button>
                )}
              </Paper>
            )}
          </Box>
        </Box>

        {/* 모바일 필터 모달 */}
        <MobileFilterModal
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
          filters={filterState}
          onFiltersChange={handleFiltersChange}
          showClearButton={true}
        />
      </Container>
    </Box>
  );
};

export default ProductListPage;
