import React, { useState } from 'react';
import CategoryFilter from './CategoryFilter';
import PriceRangeFilter from './PriceRangeFilter';
import SortOptions from './SortOptions';
import { SortOption } from '../../data/mockProducts';

interface FilterState {
  categoryId?: number;
  priceRange?: {
    min: number;
    max: number;
  };
  sortBy: SortOption;
  searchQuery?: string;
}

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  className?: string;
  isCollapsible?: boolean;
  defaultCollapsed?: boolean;
  showClearButton?: boolean;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFiltersChange,
  className = '',
  isCollapsible = false,
  defaultCollapsed = false,
  showClearButton = true
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    category: true,
    price: true,
    sort: true
  });

  const handleCategoryChange = (categoryId: number | null) => {
    onFiltersChange({
      ...filters,
      categoryId: categoryId || undefined
    });
  };

  const handlePriceRangeChange = (priceRange: { min: number; max: number }) => {
    onFiltersChange({
      ...filters,
      priceRange
    });
  };

  const handleSortChange = (sortBy: SortOption) => {
    onFiltersChange({
      ...filters,
      sortBy
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      sortBy: 'popular'
    });
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const hasActiveFilters = !!(
    filters.categoryId ||
    filters.priceRange ||
    filters.searchQuery ||
    filters.sortBy !== 'popular'
  );

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.categoryId) count++;
    if (filters.priceRange) count++;
    if (filters.searchQuery) count++;
    if (filters.sortBy !== 'popular') count++;
    return count;
  };

  const CollapsibleSection: React.FC<{
    title: string;
    section: string;
    children: React.ReactNode;
    defaultExpanded?: boolean;
  }> = ({ title, section, children, defaultExpanded = true }) => {
    const isExpanded = expandedSections[section] ?? defaultExpanded;

    return (
      <div className="border-b border-gray-200 last:border-b-0">
        <button
          onClick={() => toggleSection(section)}
          className="w-full flex items-center justify-between py-4 text-left hover:bg-gray-50 transition-colors"
        >
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        
        {isExpanded && (
          <div className="pb-6">
            {children}
          </div>
        )}
      </div>
    );
  };

  if (isCollapsible && isCollapsed) {
    return (
      <div className={`bg-white rounded-lg shadow-sm ${className}`}>
        <button
          onClick={() => setIsCollapsed(false)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="font-medium text-gray-900">필터</span>
            {hasActiveFilters && (
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                {getActiveFilterCount()}
              </span>
            )}
          </div>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm ${className}`}>
      {/* 헤더 */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-900">필터</h2>
            {hasActiveFilters && (
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                {getActiveFilterCount()}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {showClearButton && hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="text-sm text-gray-500 hover:text-red-600 transition-colors"
              >
                초기화
              </button>
            )}
            
            {isCollapsible && (
              <button
                onClick={() => setIsCollapsed(true)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 필터 섹션들 */}
      <div>
        {/* 카테고리 필터 */}
        <CollapsibleSection title="카테고리" section="category">
          <CategoryFilter
            selectedCategoryId={filters.categoryId}
            onCategoryChange={handleCategoryChange}
            variant="sidebar"
            showProductCount={true}
            showAllOption={true}
          />
        </CollapsibleSection>

        {/* 가격 범위 필터 */}
        <CollapsibleSection title="가격 범위" section="price">
          <PriceRangeFilter
            initialRange={filters.priceRange || { min: 0, max: 2000000 }}
            onChange={handlePriceRangeChange}
          />
        </CollapsibleSection>

        {/* 정렬 옵션 */}
        <CollapsibleSection title="정렬" section="sort">
          <SortOptions
            value={filters.sortBy}
            onChange={handleSortChange}
            variant="radio"
          />
        </CollapsibleSection>
      </div>

      {/* 하단 액션 버튼들 */}
      {hasActiveFilters && (
        <div className="p-6 border-t border-gray-200 space-y-3">
          <div className="text-sm text-gray-600">
            {getActiveFilterCount()}개의 필터가 적용됨
          </div>
          
          {showClearButton && (
            <button
              onClick={handleClearFilters}
              className="w-full py-2 px-4 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              모든 필터 초기화
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// 모바일용 필터 모달
interface MobileFilterModalProps extends FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileFilterModal: React.FC<MobileFilterModalProps> = ({
  isOpen,
  onClose,
  ...filterProps
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* 오버레이 */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* 모달 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-lg max-h-[80vh] overflow-y-auto">
        {/* 모달 헤더 */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">필터</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* 필터 내용 */}
        <FilterSidebar
          {...filterProps}
          className="border-0 shadow-none rounded-none"
          isCollapsible={false}
        />
        
        {/* 모달 하단 버튼 */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            필터 적용
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
