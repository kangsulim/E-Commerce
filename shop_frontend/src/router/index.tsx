import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuth, useIsAdmin } from '../hooks/useAuth';

// 레이아웃 컴포넌트들
import Layout from '../components/layout/Layout';
import AdminLayout from '../components/layout/AdminLayout';

// 페이지 컴포넌트들
import HomePage from '../pages/HomePage';
import ProductListPage from '../pages/ProductListPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import MyPage from '../pages/MyPage';
import OrderHistoryPage from '../pages/OrderHistoryPage';
import OrderCompletePage from '../pages/OrderCompletePage';

// 관리자 페이지들
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminProducts from '../pages/admin/AdminProducts';
import AdminOrders from '../pages/admin/AdminOrders';
import AdminUsers from '../pages/admin/AdminUsers';

// 에러 페이지
import NotFoundPage from '../pages/NotFoundPage';

// 보호된 라우트 컴포넌트
interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = false, 
  requireAdmin = false 
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const isAdmin = useIsAdmin();
  
  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner">로딩 중...</div>
      </div>
    );
  }

  // 인증이 필요한 페이지인데 로그인하지 않은 경우
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 관리자 권한이 필요한 페이지인데 관리자가 아닌 경우
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// 관리자 전용 라우트 래퍼
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ProtectedRoute requireAuth requireAdmin>
      {children}
    </ProtectedRoute>
  );
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'products',
        element: <ProductListPage />,
      },
      {
        path: 'products/:id',
        element: <ProductDetailPage />,
      },
      {
        path: 'cart',
        element: (
          <ProtectedRoute requireAuth>
            <CartPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'checkout',
        element: (
          <ProtectedRoute requireAuth>
            <CheckoutPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'my-page',
        element: (
          <ProtectedRoute requireAuth>
            <MyPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'orders',
        element: (
          <ProtectedRoute requireAuth>
            <OrderHistoryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'order-complete/:orderId',
        element: (
          <ProtectedRoute requireAuth>
            <OrderCompletePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'orders/:orderId',
        element: (
          <ProtectedRoute requireAuth>
            <OrderHistoryPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  // 인증 관련 페이지들 (별도 레이아웃)
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  // 관리자 페이지들
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <AdminDashboard />,
      },
      {
        path: 'products',
        element: <AdminProducts />,
      },
      {
        path: 'orders',
        element: <AdminOrders />,
      },
      {
        path: 'users',
        element: <AdminUsers />,
      },
    ],
  },
  // 404 페이지
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
