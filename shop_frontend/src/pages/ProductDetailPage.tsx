import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct, useProducts } from '../hooks/useProducts';
import Breadcrumb from '../components/common/Breadcrumb';
import ProductImageGallery from '../components/product/ProductImageGallery';
import ProductCard from '../components/product/ProductCard';
import { ProductGridSkeleton } from '../components/common/ProductSkeleton';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const productId = id ? parseInt(id) : 0;
  
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState<'description' | 'specifications' | 'reviews'>('description');
  
  // 상품 데이터 조회
  const { data: product, isLoading, error } = useProduct(productId);
  
  // 관련 상품 조회 (같은 카테고리)
  const { data: relatedProductsData } = useProducts({
    categoryId: product?.categoryId,
    limit: 4
  });

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

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stockQuantity || 1)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    // 장바구니 추가 로직 (추후 구현)
    alert(`${product.name} ${quantity}개가 장바구니에 추가되었습니다.`);
  };

  const handleBuyNow = () => {
    if (!product) return;
    
    // 즉시 구매 로직 (추후 구현)
    alert(`${product.name} ${quantity}개 즉시 구매로 이동합니다.`);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl text-gray-400 mb-4">😞</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">상품을 찾을 수 없습니다</h2>
          <p className="text-gray-500 mb-6">요청하신 상품이 존재하지 않거나 삭제되었습니다.</p>
          <Link 
            to="/products" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            상품 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 로딩 스켈레톤 */}
          <div className="animate-pulse">
            {/* 브레드크럼 스켈레톤 */}
            <div className="h-4 bg-gray-200 rounded w-64 mb-8"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* 이미지 스켈레톤 */}
              <div className="space-y-4">
                <div className="aspect-square bg-gray-200 rounded-lg"></div>
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
              
              {/* 상품 정보 스켈레톤 */}
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-32"></div>
                <div className="h-10 bg-gray-200 rounded w-48"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
                <div className="flex gap-4">
                  <div className="h-12 bg-gray-200 rounded flex-1"></div>
                  <div className="h-12 bg-gray-200 rounded flex-1"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: '홈', href: '/' },
    { label: '상품', href: '/products' },
    { label: product.category, href: `/products?category=${product.categoryId}` },
    { label: product.name, current: true }
  ];

  const discountPrice = product.originalPrice ? product.originalPrice - product.price : 0;
  const discountPercentage = product.discount || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 브레드크럼 */}
        <Breadcrumb items={breadcrumbItems} className="mb-8" />

        {/* 상품 상세 정보 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
            {/* 상품 이미지 */}
            <ProductImageGallery 
              images={product.images} 
              productName={product.name}
            />

            {/* 상품 정보 */}
            <div className="space-y-6">
              {/* 카테고리 */}
              <div className="text-sm text-blue-600 font-medium">
                {product.category}
              </div>

              {/* 상품명 */}
              <h1 className="text-3xl font-bold text-gray-900">
                {product.name}
              </h1>

              {/* 평점 및 리뷰 */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {renderStars(product.rating)}
                  <span className="text-sm text-gray-600 ml-2">
                    {product.rating}
                  </span>
                </div>
                <span className="text-sm text-gray-400">
                  ({product.reviewCount}개 리뷰)
                </span>
              </div>

              {/* 가격 정보 */}
              <div className="space-y-2">
                {product.originalPrice && (
                  <div className="flex items-center gap-3">
                    <span className="text-lg text-gray-400 line-through">
                      {formatPrice(product.originalPrice)}원
                    </span>
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
                      {discountPercentage}% 할인
                    </span>
                  </div>
                )}
                <div className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.price)}원
                </div>
                {discountPrice > 0 && (
                  <div className="text-sm text-green-600 font-medium">
                    {formatPrice(discountPrice)}원 절약
                  </div>
                )}
              </div>

              {/* 재고 상태 */}
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  product.inStock ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className={`text-sm font-medium ${
                  product.inStock ? 'text-green-600' : 'text-red-600'
                }`}>
                  {product.inStock 
                    ? `재고 ${product.stockQuantity}개 남음` 
                    : '품절'
                  }
                </span>
              </div>

              {/* 태그들 */}
              {product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* 수량 선택 */}
              {product.inStock && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-gray-700">
                      수량:
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                        className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= product.stockQuantity}
                        className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* 총 가격 */}
                  <div className="text-lg font-semibold text-gray-900">
                    총 가격: {formatPrice(product.price * quantity)}원
                  </div>
                </div>
              )}

              {/* 구매 버튼들 */}
              <div className="space-y-3">
                {product.inStock ? (
                  <>
                    <button
                      onClick={handleAddToCart}
                      className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      장바구니 담기
                    </button>
                    <button
                      onClick={handleBuyNow}
                      className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                    >
                      바로 구매
                    </button>
                  </>
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-300 text-gray-500 py-3 px-6 rounded-lg font-medium cursor-not-allowed"
                  >
                    품절
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 상품 상세 탭 */}
          <div className="border-t border-gray-200">
            {/* 탭 헤더 */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setSelectedTab('description')}
                className={`px-6 py-4 text-sm font-medium transition-colors ${
                  selectedTab === 'description'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                상품 설명
              </button>
              <button
                onClick={() => setSelectedTab('specifications')}
                className={`px-6 py-4 text-sm font-medium transition-colors ${
                  selectedTab === 'specifications'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                상품 정보
              </button>
              <button
                onClick={() => setSelectedTab('reviews')}
                className={`px-6 py-4 text-sm font-medium transition-colors ${
                  selectedTab === 'reviews'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                리뷰 ({product.reviewCount})
              </button>
            </div>

            {/* 탭 내용 */}
            <div className="p-6 lg:p-8">
              {selectedTab === 'description' && (
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {selectedTab === 'specifications' && (
                <div className="space-y-4">
                  {product.specifications ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600 font-medium">{key}</span>
                          <span className="text-gray-900">{value}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">상품 정보가 없습니다.</p>
                  )}
                </div>
              )}

              {selectedTab === 'reviews' && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-4xl mb-4">💬</div>
                  <p className="text-gray-500">리뷰 기능은 추후 구현됩니다.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 관련 상품 */}
        {relatedProductsData && relatedProductsData.products.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                같은 카테고리 상품
              </h2>
              <Link 
                to={`/products?category=${product.categoryId}`}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                더 보기 →
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProductsData.products
                .filter(p => p.id !== product.id)
                .slice(0, 4)
                .map((relatedProduct) => (
                  <ProductCard 
                    key={relatedProduct.id} 
                    product={relatedProduct}
                  />
                ))
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
