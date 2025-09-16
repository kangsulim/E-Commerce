import React from 'react';

interface ProductSkeletonProps {
  className?: string;
}

const ProductSkeleton: React.FC<ProductSkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden animate-pulse ${className}`}>
      {/* 이미지 스켈레톤 */}
      <div className="aspect-square bg-gray-200"></div>
      
      {/* 콘텐츠 스켈레톤 */}
      <div className="p-4 space-y-3">
        {/* 카테고리 */}
        <div className="h-4 bg-gray-200 rounded w-16"></div>
        
        {/* 상품명 (2줄) */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
        
        {/* 평점 및 리뷰 */}
        <div className="flex items-center gap-2">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-4 bg-gray-200 rounded w-8"></div>
          <div className="h-4 bg-gray-200 rounded w-12"></div>
        </div>
        
        {/* 가격 정보 */}
        <div className="space-y-1">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-6 bg-gray-200 rounded w-32"></div>
        </div>
        
        {/* 배송 정보 */}
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  );
};

// 그리드 스켈레톤 (여러 개의 ProductSkeleton 표시)
interface ProductGridSkeletonProps {
  count?: number;
  className?: string;
}

export const ProductGridSkeleton: React.FC<ProductGridSkeletonProps> = ({ 
  count = 8, 
  className = '' 
}) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </div>
  );
};

// 리스트 형태 스켈레톤
export const ProductListSkeleton: React.FC<ProductGridSkeletonProps> = ({ 
  count = 5, 
  className = '' 
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
          <div className="flex">
            {/* 이미지 */}
            <div className="w-48 h-48 bg-gray-200 flex-shrink-0"></div>
            
            {/* 콘텐츠 */}
            <div className="flex-1 p-6 space-y-4">
              {/* 카테고리 */}
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              
              {/* 상품명 */}
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              
              {/* 평점 */}
              <div className="flex items-center gap-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
              
              {/* 가격 */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-8 bg-gray-200 rounded w-40"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductSkeleton;
