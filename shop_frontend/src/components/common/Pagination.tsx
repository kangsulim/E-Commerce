import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className = ''
}) => {
  // 페이지 번호 생성 로직
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // 전체 페이지가 5개 이하면 모두 표시
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 전체 페이지가 5개 초과인 경우
      if (currentPage <= 3) {
        // 현재 페이지가 앞쪽에 있는 경우
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // 현재 페이지가 뒤쪽에 있는 경우
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // 현재 페이지가 중간에 있는 경우
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`flex flex-col sm:flex-row justify-between items-center gap-4 ${className}`}>
      {/* 현재 표시 중인 항목 정보 */}
      <div className="text-sm text-gray-700">
        <span className="font-medium">{startItem.toLocaleString()}</span>
        {' - '}
        <span className="font-medium">{endItem.toLocaleString()}</span>
        {' / '}
        <span className="font-medium">{totalItems.toLocaleString()}</span>
        개 상품
      </div>

      {/* 페이지네이션 버튼들 */}
      <div className="flex items-center gap-1">
        {/* 이전 페이지 버튼 */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            currentPage === 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          ← 이전
        </button>

        {/* 페이지 번호들 */}
        <div className="flex gap-1">
          {getPageNumbers().map((page, index) => {
            if (typeof page === 'string') {
              // 말줄임표
              return (
                <span key={index} className="px-3 py-2 text-sm text-gray-400">
                  {page}
                </span>
              );
            }

            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* 다음 페이지 버튼 */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            currentPage === totalPages
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          다음 →
        </button>
      </div>
    </div>
  );
};

export default Pagination;
