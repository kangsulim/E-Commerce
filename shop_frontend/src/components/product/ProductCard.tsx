import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../data/mockProducts';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
  const discountPrice = product.originalPrice 
    ? product.originalPrice - product.price 
    : 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="text-yellow-400">★</span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-yellow-400">☆</span>
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-300">☆</span>
      );
    }

    return stars;
  };

  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group ${className}`}>
      <Link to={`/products/${product.id}`} className="block">
        {/* 상품 이미지 */}
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          
          {/* 할인 배지 */}
          {product.discount && product.discount > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              {product.discount}% OFF
            </div>
          )}
          
          {/* 재고 부족 표시 */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">품절</span>
            </div>
          )}
          
          {/* 태그들 */}
          {product.tags.length > 0 && (
            <div className="absolute top-2 right-2 flex flex-col gap-1">
              {product.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-500 text-white text-xs px-2 py-1 rounded text-center"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 상품 정보 */}
        <div className="p-4">
          {/* 카테고리 */}
          <div className="text-sm text-gray-500 mb-1">
            {product.category}
          </div>
          
          {/* 상품명 */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
          
          {/* 평점 및 리뷰 */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {renderStars(product.rating)}
            </div>
            <span className="text-sm text-gray-600">
              {product.rating}
            </span>
            <span className="text-sm text-gray-400">
              ({product.reviewCount})
            </span>
          </div>
          
          {/* 가격 정보 */}
          <div className="space-y-1">
            {product.originalPrice && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}원
                </span>
                <span className="text-sm text-red-500 font-medium">
                  {formatPrice(discountPrice)}원 할인
                </span>
              </div>
            )}
            <div className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}원
            </div>
          </div>
          
          {/* 무료배송 표시 */}
          {product.tags.includes('무료배송') && (
            <div className="mt-2">
              <span className="text-sm text-green-600 font-medium">
                🚚 무료배송
              </span>
            </div>
          )}
          
          {/* 재고 정보 */}
          {product.inStock && product.stockQuantity <= 5 && (
            <div className="mt-2">
              <span className="text-sm text-orange-600 font-medium">
                ⚠️ 재고 {product.stockQuantity}개 남음
              </span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
