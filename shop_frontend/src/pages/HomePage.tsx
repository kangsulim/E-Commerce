import React from 'react';
import { Link } from 'react-router-dom';
import FeaturedProducts from '../components/home/FeaturedProducts';
import CategoryPreview, { SpecialCategoryBanner } from '../components/home/CategoryPreview';
import SearchBar from '../components/search/SearchBar';

const HomePage: React.FC = () => {
  const handleSearch = (query: string) => {
    // 검색 처리는 SearchBar 컴포넌트 내부에서 자동으로 처리됨
  };

  return (
    <div className="min-h-screen">
      {/* 히어로 섹션 */}
      <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white overflow-hidden">
        {/* 배경 패턴 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border border-white rounded-full"></div>
          <div className="absolute top-32 right-20 w-16 h-16 border border-white rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 border border-white rounded-full"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              최고의 쇼핑 경험을<br />
              <span className="text-yellow-300">만나보세요</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              다양한 상품과 빠른 배송으로 새로운 쇼핑의 즐거움을 선사합니다
            </p>
            
            {/* 히어로 검색바 */}
            <div className="max-w-2xl mx-auto mb-8">
              <SearchBar
                onSearch={handleSearch}
                placeholder="어떤 상품을 찾고 계신가요?"
                className="w-full"
                showSuggestions={true}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/products" 
                className="inline-block bg-white text-blue-600 font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                상품 둘러보기
              </Link>
              <Link 
                to="/register" 
                className="inline-block border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-200 transform hover:scale-105"
              >
                회원가입하고 혜택받기
              </Link>
            </div>
            
            {/* 통계 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-16 border-t border-blue-400 border-opacity-30">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">10,000+</div>
                <div className="text-blue-200">등록된 상품</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">50,000+</div>
                <div className="text-blue-200">만족한 고객</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">24시간</div>
                <div className="text-blue-200">빠른 배송</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 특별 카테고리 배너 */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">🎉 특별 기획전</h2>
            <p className="text-gray-600 text-lg">
              한정 기간 특가 혜택을 놓치지 마세요
            </p>
          </div>
          <SpecialCategoryBanner />
        </div>
      </section>

      {/* 인기 카테고리 */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CategoryPreview 
            layout="grid" 
            showProductCount={true}
            maxCategories={6}
          />
        </div>
      </section>

      {/* 추천 상품들 */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FeaturedProducts />
        </div>
      </section>

      {/* 특징 섹션 */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            왜 우리를 선택해야 할까요?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full text-xl mb-4 group-hover:scale-110 transition-transform duration-200">
                🚚
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">빠른 배송</h3>
              <p className="text-gray-600 leading-relaxed">
                주문 후 24시간 내 배송 시작으로<br />빠르게 받아보세요
              </p>
              <div className="mt-4 text-sm text-blue-600 font-medium">
                평균 배송시간: 1-2일
              </div>
            </div>
            
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-full text-xl mb-4 group-hover:scale-110 transition-transform duration-200">
                💎
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">품질 보장</h3>
              <p className="text-gray-600 leading-relaxed">
                엄선된 상품만을 취급하여<br />최고의 품질을 보장합니다
              </p>
              <div className="mt-4 text-sm text-green-600 font-medium">
                품질 불만족시 100% 환불
              </div>
            </div>
            
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 text-purple-600 rounded-full text-xl mb-4 group-hover:scale-110 transition-transform duration-200">
                🛡️
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">안전한 결제</h3>
              <p className="text-gray-600 leading-relaxed">
                다양한 결제 수단과 보안 시스템으로<br />안전하게 쇼핑하세요
              </p>
              <div className="mt-4 text-sm text-purple-600 font-medium">
                SSL 암호화 보안
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 고객 후기 섹션 */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">💬 고객 후기</h2>
            <p className="text-gray-300 text-lg">
              실제 고객들의 생생한 후기를 확인해보세요
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "김민수",
                rating: 5,
                comment: "배송이 정말 빠르고 상품 품질도 만족스러워요. 다음에도 이용할 예정입니다!",
                product: "iPhone 15 Pro Max"
              },
              {
                name: "이하영",
                rating: 5,
                comment: "가격도 합리적이고 고객서비스도 친절해서 좋았습니다. 추천해요!",
                product: "나이키 에어 맥스"
              },
              {
                name: "박준호",
                rating: 4,
                comment: "다양한 상품이 있어서 원하는 걸 쉽게 찾을 수 있었어요. 만족합니다.",
                product: "맥북 에어 M3"
              }
            ].map((review, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {review.name[0]}
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold">{review.name}</div>
                    <div className="flex text-yellow-400 text-sm">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 mb-4 leading-relaxed">
                  "{review.comment}"
                </p>
                <div className="text-sm text-blue-400">
                  구매 상품: {review.product}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">🎁 지금 바로 시작하세요!</h2>
          <p className="text-xl mb-8 text-blue-100">
            회원가입하고 <span className="text-yellow-300 font-bold">10% 할인 쿠폰</span>과 <span className="text-yellow-300 font-bold">무료배송</span> 혜택을 받아보세요
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link 
              to="/register" 
              className="inline-block bg-white text-blue-600 font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              무료 회원가입
            </Link>
            <Link 
              to="/products" 
              className="inline-block border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-200 transform hover:scale-105"
            >
              상품 둘러보기
            </Link>
          </div>
          
          <div className="text-sm text-blue-200">
            이미 회원이신가요? <Link to="/login" className="text-yellow-300 hover:underline font-medium">로그인하기</Link>
          </div>
        </div>
      </section>

      {/* 뉴스레터 구독 섹션 */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg p-8 text-center shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">📧 최신 소식 받아보기</h3>
            <p className="text-gray-600 mb-6">
              신상품 출시, 특별 할인 소식을 가장 먼저 받아보세요
            </p>
            <div className="max-w-md mx-auto flex gap-2">
              <input
                type="email"
                placeholder="이메일 주소를 입력하세요"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                구독
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              언제든지 구독을 취소할 수 있습니다. 개인정보는 안전하게 보호됩니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
