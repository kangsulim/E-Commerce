import React from 'react';
import { Product } from '../../data/mockProducts';
import ProductCard from './ProductCard';
import { ProductGridSkeleton } from '../common/ProductSkeleton';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  className?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  isLoading = false, 
  className = '' 
}) => {
  if (isLoading) {
    // 로딩 스켈레톤 표시
    return <ProductGridSkeleton className={className} />;
  }

  if (products.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-16 ${className}`}>
        <div className="text-gray-400 text-6xl mb-4">📦</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          상품이 없습니다
        </h3>
        <p className="text-gray-500 text-center">
          검색 조건을 변경하거나 다른 카테고리를 확인해보세요.
        </p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product}
          className="h-full"
        />
      ))}
    </div>
  );
};

export default ProductGrid;
