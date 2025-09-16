import React from 'react';
import { Link } from 'react-router-dom';
import { useCategories } from '../../hooks/useProducts';

interface CategoryPreviewProps {
  className?: string;
  layout?: 'grid' | 'carousel' | 'list';
  showProductCount?: boolean;
  maxCategories?: number;
}

const CategoryPreview: React.FC<CategoryPreviewProps> = ({
  className = '',
  layout = 'grid',
  showProductCount = true,
  maxCategories = 6
}) => {
  const { data: categories, isLoading } = useCategories();

  // 카테고리별 아이콘 매핑
  const categoryIcons: Record<string, string> = {
    '전자제품': '📱',
    '의류': '👕',
    '가전제품': '🏠',
    '도서': '📚',
    '스포츠': '⚽',
    '뷰티': '💄',
  };

  const getCategoryIcon = (categoryName: string) => {
    return categoryIcons[categoryName] || '📦';
  };

  const getCategoryGradient = (index: number) => {
    const gradients = [
      'from-blue-400 to-blue-600',
      'from-green-400 to-green-600',
      'from-purple-400 to-purple-600',
      'from-pink-400 to-pink-600',
      'from-yellow-400 to-yellow-600',
      'from-red-400 to-red-600',
    ];
    return gradients[index % gradients.length];
  };

  if (isLoading) {
    return (
      <div className={className}>
        <div className="text-center mb-8">
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
        </div>
        
        {layout === 'grid' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-gray-400 text-4xl mb-4">📂</div>
        <p className="text-gray-500">카테고리가 없습니다.</p>
      </div>
    );
  }

  const displayCategories = categories.slice(0, maxCategories);

  if (layout === 'grid') {
    return (
      <div className={className}>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">🛍️ 인기 카테고리</h2>
          <p className="text-gray-600 text-lg">
            다양한 카테고리에서 원하는 상품을 찾아보세요
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {displayCategories.map((category, index) => (
            <Link
              key={category.id}
              to={`/products?category=${category.id}`}
              className="group"
            >
              <div className="relative overflow-hidden rounded-xl bg-white shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                {/* 배경 그라데이션 */}
                <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryGradient(index)} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                
                {/* 카테고리 내용 */}
                <div className="relative p-6 text-center">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {getCategoryIcon(category.name)}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  {showProductCount && (
                    <p className="text-sm text-gray-500">
                      {category.productCount.toLocaleString()}개 상품
                    </p>
                  )}
                </div>

                {/* 호버 오버레이 */}
                <div className="absolute inset-0 bg-blue-600 bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-300 rounded-xl"></div>
              </div>
            </Link>
          ))}
        </div>

        {/* 모든 카테고리 보기 버튼 */}
        <div className="text-center mt-8">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            모든 상품 보기
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  if (layout === 'carousel') {
    return (
      <div className={className}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">카테고리 둘러보기</h2>
            <p className="text-gray-600">관심 있는 카테고리를 선택해보세요</p>
          </div>
          <Link 
            to="/products" 
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            전체 보기
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {displayCategories.map((category, index) => (
            <Link
              key={category.id}
              to={`/products?category=${category.id}`}
              className="flex-shrink-0 w-32 group"
            >
              <div className="bg-white rounded-lg border border-gray-200 p-4 text-center hover:shadow-md transition-all duration-200 group-hover:-translate-y-1">
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                  {getCategoryIcon(category.name)}
                </div>
                <h3 className="font-medium text-gray-900 text-sm mb-1 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
                {showProductCount && (
                  <p className="text-xs text-gray-500">
                    {category.productCount}개
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // list layout
  return (
    <div className={className}>
      <h2 className="text-xl font-bold text-gray-900 mb-6">카테고리</h2>
      <div className="space-y-2">
        {displayCategories.map((category) => (
          <Link
            key={category.id}
            to={`/products?category=${category.id}`}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl group-hover:scale-110 transition-transform">
                {getCategoryIcon(category.name)}
              </span>
              <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                {category.name}
              </span>
            </div>
            {showProductCount && (
              <span className="text-sm text-gray-500">
                {category.productCount}개
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

// 특별 카테고리 배너 컴포넌트
interface SpecialCategoryBannerProps {
  className?: string;
}

export const SpecialCategoryBanner: React.FC<SpecialCategoryBannerProps> = ({
  className = ''
}) => {
  const specialCategories = [
    {
      id: 'electronics',
      name: '전자제품',
      description: '최신 스마트폰, 노트북, 가전제품',
      image: 'https://via.placeholder.com/600x300?text=Electronics',
      gradient: 'from-blue-500 to-purple-600',
      href: '/products?category=1'
    },
    {
      id: 'fashion',
      name: '패션',
      description: '트렌디한 의류, 신발, 액세서리',
      image: 'https://via.placeholder.com/600x300?text=Fashion',
      gradient: 'from-pink-500 to-red-600',
      href: '/products?category=2'
    }
  ];

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`}>
      {specialCategories.map((category) => (
        <Link
          key={category.id}
          to={category.href}
          className="relative overflow-hidden rounded-2xl group"
        >
          <div className={`absolute inset-0 bg-gradient-to-r ${category.gradient} opacity-90`}></div>
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
            <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
            <p className="text-sm opacity-90 mb-4">{category.description}</p>
            <div className="flex items-center text-sm font-medium">
              <span>지금 쇼핑하기</span>
              <svg className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryPreview;
