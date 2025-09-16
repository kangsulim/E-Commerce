import React from 'react';
import { SortOption } from '../../data/mockProducts';

interface SortOptionsProps {
  value: SortOption;
  onChange: (sort: SortOption) => void;
  className?: string;
  variant?: 'dropdown' | 'buttons' | 'radio';
}

const SortOptions: React.FC<SortOptionsProps> = ({
  value,
  onChange,
  className = '',
  variant = 'dropdown'
}) => {
  const sortOptions: { value: SortOption; label: string; description?: string }[] = [
    { 
      value: 'popular', 
      label: '인기순', 
      description: '리뷰가 많은 순으로 정렬' 
    },
    { 
      value: 'newest', 
      label: '최신순', 
      description: '새로 등록된 순으로 정렬' 
    },
    { 
      value: 'price-low', 
      label: '낮은가격순', 
      description: '가격이 낮은 순으로 정렬' 
    },
    { 
      value: 'price-high', 
      label: '높은가격순', 
      description: '가격이 높은 순으로 정렬' 
    },
    { 
      value: 'rating', 
      label: '평점순', 
      description: '평점이 높은 순으로 정렬' 
    },
  ];

  const currentOption = sortOptions.find(option => option.value === value);

  if (variant === 'dropdown') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <label htmlFor="sort-select" className="text-sm text-gray-700 font-medium whitespace-nowrap">
          정렬:
        </label>
        <select
          id="sort-select"
          value={value}
          onChange={(e) => onChange(e.target.value as SortOption)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (variant === 'buttons') {
    return (
      <div className={`${className}`}>
        <h4 className="text-sm font-medium text-gray-700 mb-3">정렬</h4>
        <div className="flex flex-wrap gap-2">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                value === option.value
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'radio') {
    return (
      <div className={`space-y-3 ${className}`}>
        <h4 className="text-sm font-medium text-gray-700">정렬</h4>
        <div className="space-y-2">
          {sortOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-start gap-3 cursor-pointer group"
            >
              <input
                type="radio"
                name="sort"
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange(e.target.value as SortOption)}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="text-sm text-gray-900 group-hover:text-blue-600 transition-colors">
                  {option.label}
                </div>
                {option.description && (
                  <div className="text-xs text-gray-500">
                    {option.description}
                  </div>
                )}
              </div>
            </label>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

// 컴팩트한 정렬 드롭다운 (헤더용)
interface CompactSortOptionsProps {
  value: SortOption;
  onChange: (sort: SortOption) => void;
  className?: string;
}

export const CompactSortOptions: React.FC<CompactSortOptionsProps> = ({
  value,
  onChange,
  className = ''
}) => {
  const sortOptions: { value: SortOption; label: string; icon: string }[] = [
    { value: 'popular', label: '인기순', icon: '🔥' },
    { value: 'newest', label: '최신순', icon: '🆕' },
    { value: 'price-low', label: '낮은가격순', icon: '💰' },
    { value: 'price-high', label: '높은가격순', icon: '💎' },
    { value: 'rating', label: '평점순', icon: '⭐' },
  ];

  const currentOption = sortOptions.find(option => option.value === value);

  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.icon} {option.label}
          </option>
        ))}
      </select>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

// 정렬 상태 표시 컴포넌트
interface SortStatusProps {
  value: SortOption;
  totalCount?: number;
  className?: string;
}

export const SortStatus: React.FC<SortStatusProps> = ({
  value,
  totalCount,
  className = ''
}) => {
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'popular', label: '인기순' },
    { value: 'newest', label: '최신순' },
    { value: 'price-low', label: '낮은가격순' },
    { value: 'price-high', label: '높은가격순' },
    { value: 'rating', label: '평점순' },
  ];

  const currentLabel = sortOptions.find(option => option.value === value)?.label || '인기순';

  return (
    <div className={`flex items-center gap-2 text-sm text-gray-600 ${className}`}>
      {totalCount !== undefined && (
        <span>
          총 <span className="font-medium text-gray-900">{totalCount.toLocaleString()}</span>개 상품
        </span>
      )}
      <span className="text-gray-400">•</span>
      <span>
        <span className="font-medium text-gray-900">{currentLabel}</span>으로 정렬됨
      </span>
    </div>
  );
};

export default SortOptions;
