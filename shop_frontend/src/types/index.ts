// 사용자 관련 타입
export interface User {
  id: number;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// 상품 관련 타입
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

// 장바구니 관련 타입
export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  createdAt: string;
}

export interface Cart {
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
}

// 주문 관련 타입
export interface Order {
  id: number;
  user: User;
  items: OrderItem[];
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  price: number;
}

export interface CreateOrderRequest {
  shippingAddress: string;
}

// 리뷰 관련 타입
export interface Review {
  id: number;
  user: User;
  product: Product;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CreateReviewRequest {
  productId: number;
  rating: number;
  comment: string;
}

// API 응답 타입
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// 관리자 대시보드 타입
export interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
  recentOrders: Order[];
}

// 에러 타입
export interface ApiError {
  message: string;
  status: number;
  timestamp: string;
}

// 파일 업로드 타입
export interface FileUploadResponse {
  fileName: string;
  originalName: string;
  size: number;
  url: string;
}
