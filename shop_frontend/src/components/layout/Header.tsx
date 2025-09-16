import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useIsAdmin } from '../../hooks/useAuth';
import SearchBar from '../search/SearchBar';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const isAdmin = useIsAdmin();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleSearch = (query: string) => {
    navigate(`/products?search=${encodeURIComponent(query)}`);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* 로고 */}
          <Link 
            to="/" 
            className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors flex-shrink-0"
          >
            {import.meta.env.VITE_APP_NAME || '온라인 쇼핑몰'}
          </Link>

          {/* 중앙 검색바 (데스크톱) */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
            <SearchBar
              onSearch={handleSearch}
              placeholder="상품명, 브랜드명으로 검색"
              className="w-full"
              showSuggestions={true}
            />
          </div>

          {/* 네비게이션 (데스크톱) */}
          <nav className="hidden md:flex items-center space-x-8 flex-shrink-0">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              홈
            </Link>
            <Link 
              to="/products" 
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              상품
            </Link>
            {isAuthenticated && (
              <Link 
                to="/cart" 
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors relative"
              >
                장바구니
                {/* 장바구니 아이콘 */}
                <svg className="w-4 h-4 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5M7 13h10m0 0l1.1 5M9 19.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm10 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                </svg>
              </Link>
            )}
            {isAdmin && (
              <Link 
                to="/admin" 
                className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
              >
                관리자
              </Link>
            )}
          </nav>

          {/* 우측 메뉴 */}
          <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-600">
                  안녕하세요, <span className="font-medium text-gray-900">{user?.name}</span>님
                </span>
                <Link 
                  to="/my-page" 
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  마이페이지
                </Link>
                <button 
                  onClick={handleLogout}
                  className="btn-secondary text-sm"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  로그인
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary text-sm"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>

          {/* 모바일 검색 + 메뉴 버튼 */}
          <div className="flex items-center gap-2 md:hidden">
            {/* 모바일 검색 버튼 */}
            <Link
              to="/products"
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
            
            {/* 모바일 메뉴 버튼 */}
            <button 
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* 모바일 검색바 (lg 미만에서만 표시) */}
        <div className="lg:hidden pb-4">
          <SearchBar
            onSearch={handleSearch}
            placeholder="상품 검색"
            className="w-full"
            showSuggestions={false}
          />
        </div>

        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                홈
              </Link>
              <Link 
                to="/products" 
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                상품
              </Link>
              {isAuthenticated && (
                <Link 
                  to="/cart" 
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  장바구니
                </Link>
              )}
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  관리자
                </Link>
              )}
              
              <div className="pt-4 border-t border-gray-200">
                {isAuthenticated ? (
                  <>
                    <div className="text-sm text-gray-600 mb-4">
                      안녕하세요, <span className="font-medium text-gray-900">{user?.name}</span>님
                    </div>
                    <Link 
                      to="/my-page" 
                      className="block text-gray-700 hover:text-primary-600 font-medium transition-colors mb-4"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      마이페이지
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="btn-secondary text-sm w-full"
                    >
                      로그아웃
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      className="block text-gray-700 hover:text-primary-600 font-medium transition-colors mb-4"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      로그인
                    </Link>
                    <Link 
                      to="/register" 
                      className="btn-primary text-sm w-full inline-block text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      회원가입
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
