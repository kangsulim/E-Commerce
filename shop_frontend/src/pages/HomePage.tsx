import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* 히어로 섹션 */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto container-padding text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            최고의 쇼핑 경험을 만나보세요
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100">
            다양한 상품과 빠른 배송으로 새로운 쇼핑의 즐거움을 선사합니다
          </p>
          <div className="space-x-4">
            <Link 
              to="/products" 
              className="inline-block bg-white text-primary-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              상품 둘러보기
            </Link>
            <Link 
              to="/register" 
              className="inline-block border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white hover:text-primary-600 transition-all"
            >
              회원가입
            </Link>
          </div>
        </div>
      </section>

      {/* 특징 섹션 */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <h2 className="text-3xl font-bold text-center mb-12">왜 우리를 선택해야 할까요?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-2">빠른 배송</h3>
              <p className="text-gray-600">주문 후 24시간 내 배송 시작으로 빠르게 받아보세요</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💎</div>
              <h3 className="text-xl font-semibold mb-2">품질 보장</h3>
              <p className="text-gray-600">엄선된 상품만을 취급하여 최고의 품질을 보장합니다</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold mb-2">안전한 결제</h3>
              <p className="text-gray-600">다양한 결제 수단과 보안 시스템으로 안전하게 쇼핑하세요</p>
            </div>
          </div>
        </div>
      </section>

      {/* 인기 카테고리 섹션 */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto container-padding">
          <h2 className="text-3xl font-bold text-center mb-12">인기 카테고리</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: '전자제품', icon: '📱', count: '1,234' },
              { name: '패션', icon: '👕', count: '2,456' },
              { name: '홈&리빙', icon: '🏠', count: '987' },
              { name: '스포츠', icon: '⚽', count: '654' },
            ].map((category) => (
              <Link
                key={category.name}
                to={`/products?category=${category.name}`}
                className="card p-6 text-center hover:shadow-medium transition-all duration-200 group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="font-semibold mb-1">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.count}개 상품</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto container-padding text-center">
          <h2 className="text-3xl font-bold mb-4">지금 바로 시작하세요!</h2>
          <p className="text-xl mb-8 text-primary-100">
            회원가입하고 특별 할인 혜택을 받아보세요
          </p>
          <Link 
            to="/register" 
            className="inline-block bg-white text-primary-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            무료 회원가입
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
