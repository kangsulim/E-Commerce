import React from 'react';
import { Link } from 'react-router-dom';
import { useFeaturedProducts, useDiscountedProducts } from '../../hooks/useProducts';
import ProductCard from '../product/ProductCard';
import { ProductGridSkeleton } from '../common/ProductSkeleton';

interface FeaturedProductsProps {
  className?: string;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ className = '' }) => {
  const { data: featuredProducts, isLoading: isFeaturedLoading } = useFeaturedProducts(8);
  const { data: discountedProducts, isLoading: isDiscountedLoading } = useDiscountedProducts(6);

  return (
    <div className={`space-y-16 ${className}`}>
      {/* 베스트셀러 섹션 */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">🔥 베스트셀러</h2>
            <p className="text-gray-600">가장 인기 있는 상품들을 만나보세요</p>
          </div>
          <Link 
            to="/products?sort=popular" 
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors"
          >
            더 보기
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {isFeaturedLoading ? (
          <ProductGridSkeleton count={8} />
        ) : featuredProducts && featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-gray-400 text-4xl mb-4">📦</div>
            <p className="text-gray-500">추천 상품이 없습니다.</p>
          </div>
        )}
      </section>

      {/* 할인 상품 섹션 */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">💰 특가 할인</h2>
            <p className="text-gray-600">놓치면 후회할 특별 할인 상품</p>
          </div>
          <Link 
            to="/products" 
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors"
          >
            더 보기
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {isDiscountedLoading ? (
          <ProductGridSkeleton count={6} />
        ) : discountedProducts && discountedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {discountedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-gray-400 text-4xl mb-4">💸</div>
            <p className="text-gray-500">할인 상품이 없습니다.</p>
          </div>
        )}
      </section>

      {/* 신상품 섹션 */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">✨ 신상품</h2>
            <p className="text-gray-600">새롭게 출시된 따끈따끈한 상품들</p>
          </div>
          <Link 
            to="/products?sort=newest" 
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors"
          >
            더 보기
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {isFeaturedLoading ? (
          <ProductGridSkeleton count={4} />
        ) : featuredProducts && featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 4)
              .map((product) => (
                <ProductCard key={`new-${product.id}`} product={product} />
              ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-gray-400 text-4xl mb-4">🆕</div>
            <p className="text-gray-500">신상품이 없습니다.</p>
          </div>
        )}
      </section>
    </div>
  );
};

// 컴팩트한 추천 상품 섹션 (사이드바 등에 사용)
interface CompactFeaturedProductsProps {
  title?: string;
  limit?: number;
  className?: string;
}

export const CompactFeaturedProducts: React.FC<CompactFeaturedProductsProps> = ({
  title = "추천 상품",
  limit = 4,
  className = ''
}) => {
  const { data: featuredProducts, isLoading } = useFeaturedProducts(limit);

  return (
    <div className={`${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: limit }).map((_, index) => (
            <div key={index} className="flex gap-3 animate-pulse">
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : featuredProducts && featuredProducts.length > 0 ? (
        <div className="space-y-4">
          {featuredProducts.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-lg flex-shrink-0 group-hover:scale-105 transition-transform"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h4>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                  <span className="text-yellow-400">★</span>
                  <span>{product.rating}</span>
                  <span>({product.reviewCount})</span>
                </div>
                <div className="font-semibold text-gray-900 mt-1">
                  {new Intl.NumberFormat('ko-KR').format(product.price)}원
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 text-sm">
          상품이 없습니다
        </div>
      )}
    </div>
  );
};

export default FeaturedProducts;
