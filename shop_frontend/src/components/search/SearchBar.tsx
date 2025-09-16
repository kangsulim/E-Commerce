import React, { useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
  showSuggestions?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = '상품명, 브랜드명으로 검색해보세요',
  className = '',
  onSearch,
  showSuggestions = true
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') || '');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // 인기 검색어 (실제로는 API에서 가져와야 함)
  const popularSearches = [
    'iPhone', 'MacBook', '에어팟', '나이키', '유니클로', 
    '설화수', '다이슨', '요가매트', '아토미 해빗', 'LG'
  ];

  // 최근 검색어 (localStorage에서 관리)
  const getRecentSearches = useCallback(() => {
    try {
      const recent = localStorage.getItem('recentSearches');
      return recent ? JSON.parse(recent) : [];
    } catch {
      return [];
    }
  }, []);

  const saveRecentSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    try {
      const recent = getRecentSearches();
      const updated = [
        searchQuery,
        ...recent.filter((item: string) => item !== searchQuery)
      ].slice(0, 10); // 최대 10개까지만 저장
      
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    } catch {
      // localStorage 사용 불가시 무시
    }
  }, [getRecentSearches]);

  const handleSearch = useCallback((searchQuery: string) => {
    const trimmedQuery = searchQuery.trim();
    
    if (trimmedQuery) {
      saveRecentSearch(trimmedQuery);
      
      if (onSearch) {
        onSearch(trimmedQuery);
      } else {
        // 기본 동작: 상품 목록 페이지로 이동
        navigate(`/products?search=${encodeURIComponent(trimmedQuery)}`);
      }
    }
    
    setShowDropdown(false);
  }, [navigate, onSearch, saveRecentSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (showSuggestions && value.length > 0) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleFocus = () => {
    setIsExpanded(true);
    if (showSuggestions) {
      setShowDropdown(true);
    }
  };

  const handleBlur = () => {
    // 약간의 지연을 두어 클릭 이벤트가 처리되도록 함
    setTimeout(() => {
      setIsExpanded(false);
      setShowDropdown(false);
    }, 200);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  const clearRecentSearches = () => {
    try {
      localStorage.removeItem('recentSearches');
      setShowDropdown(false);
    } catch {
      // localStorage 사용 불가시 무시
    }
  };

  const recentSearches = getRecentSearches();

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className={`relative transition-all duration-200 ${
          isExpanded ? 'shadow-lg' : 'shadow-sm'
        }`}>
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
          
          {/* 검색 아이콘 */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <svg
              className="w-3 h-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* 입력 내용 지우기 버튼 */}
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* 검색 버튼 */}
          <button
            type="submit"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
            </svg>
          </button>
        </div>

        {/* 검색 제안 드롭다운 */}
        {showDropdown && showSuggestions && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
            {/* 최근 검색어 */}
            {recentSearches.length > 0 && (
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-700">최근 검색어</h4>
                  <button
                    type="button"
                    onClick={clearRecentSearches}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    전체 삭제
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.slice(0, 5).map((item: string, index: number) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestionClick(item)}
                      className="text-sm text-gray-600 hover:text-blue-600 bg-gray-100 hover:bg-blue-50 px-3 py-1 rounded-full transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 인기 검색어 */}
            <div className="p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">인기 검색어</h4>
              <div className="space-y-2">
                {popularSearches.map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(item)}
                    className="flex items-center w-full text-left px-2 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded transition-colors"
                  >
                    <span className="text-blue-600 font-medium mr-3 w-4">
                      {index + 1}
                    </span>
                    <span>{item}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 현재 입력값과 일치하는 제안 */}
            {query.trim() && (
              <div className="p-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => handleSuggestionClick(query)}
                  className="flex items-center w-full text-left px-2 py-2 text-sm text-gray-900 hover:bg-gray-50 rounded transition-colors"
                >
                  <svg className="w-3 h-3 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>'{query}' 검색</span>
                </button>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;
