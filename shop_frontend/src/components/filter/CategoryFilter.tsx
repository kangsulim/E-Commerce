import React from 'react';
import { useCategories } from '../../hooks/useProducts';
import { Category } from '../../data/mockProducts';

interface CategoryFilterProps {
  selectedCategoryId?: number;
  onCategoryChange: (categoryId: number | null) => void;
  className?: string;
  variant?: 'sidebar' | 'horizontal' | 'dropdown';
  showProductCount?: boolean;
  showAllOption?: boolean;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategoryId,
  onCategoryChange,
  className = '',
  variant = 'sidebar',
  showProductCount = true,
  showAllOption = true
}) => {
  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <div className={`${className}`}>
        {variant === 'sidebar' && (
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-8 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        )}
        {variant === 'horizontal' && (
          <div className="flex gap-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        )}
        {variant === 'dropdown' && (
          <div className="h-10 w-40 bg-gray-200 rounded animate-pulse"></div>
        )}
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return null;
  }

  const handleCategoryClick = (categoryId: number | null) => {
    onCategoryChange(categoryId);
  };

  if (variant === 'dropdown') {
    return (
      <div className={`${className}`}>
        <select
          value={selectedCategoryId || ''}
          onChange={(e) => handleCategoryClick(e.target.value ? parseInt(e.target.value) : null)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
        >
          {showAllOption && (
            <option value="">전체 카테고리</option>
          )}
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
              {showProductCount && ` (${category.productCount})`}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (variant === 'horizontal') {
    return (
      <div className={`${className}`}>
        <div className="flex flex-wrap gap-2">
          {showAllOption && (
            <button
              onClick={() => handleCategoryClick(null)}
              className={`px-4 py-2 text-sm rounded-full border transition-colors ${
                !selectedCategoryId
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              전체
            </button>
          )}
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`px-4 py-2 text-sm rounded-full border transition-colors ${
                selectedCategoryId === category.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              {category.name}
              {showProductCount && (
                <span className="ml-1 text-xs opacity-75">
                  ({category.productCount})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // sidebar variant (default)
  return (
    <div className={`${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">카테고리</h3>
      <div className="space-y-2">
        {showAllOption && (
          <button
            onClick={() => handleCategoryClick(null)}
            className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
              !selectedCategoryId
                ? 'bg-blue-100 text-blue-700 font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            전체 상품
          </button>
        )}
        
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center justify-between ${
              selectedCategoryId === category.id
                ? 'bg-blue-100 text-blue-700 font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span>{category.name}</span>
            {showProductCount && (
              <span className="text-sm text-gray-400">
                ({category.productCount})
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

// 카테고리 아이콘과 함께 표시하는 컴포넌트
interface CategoryFilterWithIconsProps extends CategoryFilterProps {
  categoryIcons?: Record<number, string>;
}

export const CategoryFilterWithIcons: React.FC<CategoryFilterWithIconsProps> = ({
  categoryIcons = {},
  ...props
}) => {
  const { data: categories, isLoading } = useCategories();

  // 기본 아이콘 맵핑
  const defaultIcons: Record<string, string> = {
    '전자제품': '📱',
    '의류': '👕',
    '가전제품': '🏠',
    '도서': '📚',
    '스포츠': '⚽',
    '뷰티': '💄',
  };

  if (isLoading || !categories) {
    return <CategoryFilter {...props} />;
  }

  const getCategoryIcon = (category: Category) => {
    return categoryIcons[category.id] || defaultIcons[category.name] || '📦';
  };

  if (props.variant === 'horizontal') {
    return (
      <div className={props.className}>
        <div className="flex flex-wrap gap-3">
          {props.showAllOption && (
            <button
              onClick={() => props.onCategoryChange(null)}
              className={`flex items-center gap-2 px-4 py-3 text-sm rounded-lg border transition-colors ${
                !props.selectedCategoryId
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              <span>🏪</span>
              <span>전체</span>
            </button>
          )}
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => props.onCategoryChange(category.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm rounded-lg border transition-colors ${
                props.selectedCategoryId === category.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              <span>{getCategoryIcon(category)}</span>
              <span>{category.name}</span>
              {props.showProductCount && (
                <span className="ml-1 text-xs opacity-75">
                  ({category.productCount})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 다른 variant는 기본 컴포넌트 사용
  return <CategoryFilter {...props} />;
};

export default CategoryFilter;
