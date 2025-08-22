import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const menuItems = [
    { path: '/admin/dashboard', label: '대시보드', icon: '📊' },
    { path: '/admin/products', label: '상품 관리', icon: '📦' },
    { path: '/admin/orders', label: '주문 관리', icon: '📋' },
    { path: '/admin/users', label: '사용자 관리', icon: '👥' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* 사이드바 */}
      <aside className={`bg-white shadow-lg transition-all duration-300 ${
        isSidebarOpen ? 'w-64' : 'w-16'
      }`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className={`font-bold text-xl text-gray-800 transition-opacity ${
              isSidebarOpen ? 'opacity-100' : 'opacity-0'
            }`}>
              관리자 패널
            </h1>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center p-3 rounded-lg transition-colors group ${
                    location.pathname === item.path
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl mr-3">{item.icon}</span>
                  <span className={`font-medium transition-opacity ${
                    isSidebarOpen ? 'opacity-100' : 'opacity-0'
                  }`}>
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <Link
              to="/"
              className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors group"
            >
              <span className="text-xl mr-3">🏠</span>
              <span className={`font-medium transition-opacity ${
                isSidebarOpen ? 'opacity-100' : 'opacity-0'
              }`}>
                쇼핑몰로 이동
              </span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors group"
            >
              <span className="text-xl mr-3">🚪</span>
              <span className={`font-medium transition-opacity ${
                isSidebarOpen ? 'opacity-100' : 'opacity-0'
              }`}>
                로그아웃
              </span>
            </button>
          </div>
        </nav>
      </aside>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col">
        {/* 헤더 */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-800">
              {menuItems.find(item => item.path === location.pathname)?.label || '관리자'}
            </h2>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">관리자님 환영합니다</span>
            </div>
          </div>
        </header>

        {/* 페이지 컨텐츠 */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
