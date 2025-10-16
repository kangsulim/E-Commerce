import { api } from './api';
import {
  Order,
  CreateOrderRequest,
  OrderFilters,
  OrderCancellationRequest,
  DeliveryTracking,
} from '../types/order';
import { mockOrders } from '../data/mockOrders';

/**
 * 주문 서비스
 */
export const orderService = {
  /**
   * 주문 목록 조회
   */
  getOrders: async (filters?: OrderFilters): Promise<Order[]> => {
    try {
      // TODO: 실제 API 호출
      // const response = await api.get('/orders', { params: filters });
      // return response.data;

      // Mock 데이터 사용
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredOrders = [...mockOrders];
      
      // 상태 필터
      if (filters?.status) {
        filteredOrders = filteredOrders.filter(
          order => order.status === filters.status
        );
      }
      
      // 날짜 필터
      if (filters?.startDate) {
        filteredOrders = filteredOrders.filter(
          order => new Date(order.orderedAt) >= new Date(filters.startDate!)
        );
      }
      
      if (filters?.endDate) {
        filteredOrders = filteredOrders.filter(
          order => new Date(order.orderedAt) <= new Date(filters.endDate!)
        );
      }
      
      // 검색어 필터
      if (filters?.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        filteredOrders = filteredOrders.filter(
          order =>
            order.orderNumber.toLowerCase().includes(query) ||
            order.items.some(item =>
              item.product.name.toLowerCase().includes(query)
            )
        );
      }
      
      // 최신순 정렬
      return filteredOrders.sort(
        (a, b) => new Date(b.orderedAt).getTime() - new Date(a.orderedAt).getTime()
      );
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      throw error;
    }
  },

  /**
   * 주문 상세 조회
   */
  getOrderById: async (orderId: number): Promise<Order> => {
    try {
      // TODO: 실제 API 호출
      // const response = await api.get(`/orders/${orderId}`);
      // return response.data;

      // Mock 데이터 사용
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const order = mockOrders.find(o => o.id === orderId);
      
      if (!order) {
        throw new Error('주문을 찾을 수 없습니다.');
      }
      
      return order;
    } catch (error) {
      console.error('Failed to fetch order:', error);
      throw error;
    }
  },

  /**
   * 주문 생성
   */
  createOrder: async (request: CreateOrderRequest): Promise<Order> => {
    try {
      // TODO: 실제 API 호출
      // const response = await api.post('/orders', request);
      // return response.data;

      // Mock 주문 생성
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newOrder: Order = {
        id: Math.floor(Math.random() * 10000),
        orderNumber: `ORD-${Date.now()}`,
        user: {
          id: 1,
          email: 'user@example.com',
          name: request.shippingInfo.recipientName,
          role: 'USER',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        items: request.items.map((item, index) => ({
          id: index + 1,
          product: {
            id: item.productId,
            name: `상품 ${item.productId}`,
            description: '상품 설명',
            price: 10000,
            stockQuantity: 100,
            category: { id: 1, name: '카테고리' },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          quantity: item.quantity,
          price: 10000,
          subtotal: 10000 * item.quantity,
        })),
        shippingInfo: request.shippingInfo,
        paymentInfo: request.paymentInfo,
        subtotal: request.totalAmount - request.shippingFee + (request.discountAmount || 0),
        discountAmount: request.discountAmount || 0,
        shippingFee: request.shippingFee,
        totalAmount: request.totalAmount,
        usedPoints: request.usedPoints || 0,
        earnedPoints: Math.floor(request.totalAmount * 0.01),
        status: 'PENDING',
        paymentStatus: 'COMPLETED',
        orderedAt: new Date().toISOString(),
        paidAt: new Date().toISOString(),
        orderMessage: request.orderMessage,
      };
      
      return newOrder;
    } catch (error) {
      console.error('Failed to create order:', error);
      throw error;
    }
  },

  /**
   * 주문 취소
   */
  cancelOrder: async (request: OrderCancellationRequest): Promise<Order> => {
    try {
      // TODO: 실제 API 호출
      // const response = await api.post(`/orders/${request.orderId}/cancel`, request);
      // return response.data;

      // Mock 취소 처리
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const order = mockOrders.find(o => o.id === request.orderId);
      
      if (!order) {
        throw new Error('주문을 찾을 수 없습니다.');
      }
      
      // 주문 상태 업데이트
      const cancelledOrder: Order = {
        ...order,
        status: 'CANCELLED',
        paymentStatus: 'CANCELLED',
        cancelledAt: new Date().toISOString(),
        cancelReason: request.reason,
      };
      
      return cancelledOrder;
    } catch (error) {
      console.error('Failed to cancel order:', error);
      throw error;
    }
  },

  /**
   * 배송 추적 정보 조회
   */
  getDeliveryTracking: async (orderId: number): Promise<DeliveryTracking> => {
    try {
      // TODO: 실제 API 호출
      // const response = await api.get(`/orders/${orderId}/tracking`);
      // return response.data;

      // Mock 배송 추적 정보
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const order = mockOrders.find(o => o.id === orderId);
      
      if (!order || !order.trackingNumber) {
        throw new Error('배송 정보를 찾을 수 없습니다.');
      }
      
      // 주문 상태에 따른 배송 추적 이벤트
      const events: DeliveryTracking['events'] = [];
      
      if (order.orderedAt) {
        events.push({
          status: '주문 접수',
          location: '온라인',
          message: '주문이 접수되었습니다.',
          timestamp: order.orderedAt,
        });
      }
      
      if (order.paidAt) {
        events.push({
          status: '결제 완료',
          location: '온라인',
          message: '결제가 완료되었습니다.',
          timestamp: order.paidAt,
        });
      }
      
      if (order.status !== 'PENDING') {
        events.push({
          status: '상품 준비',
          location: '물류센터',
          message: '상품 준비 중입니다.',
          timestamp: order.shippedAt || new Date().toISOString(),
        });
      }
      
      if (order.shippedAt) {
        events.push({
          status: '배송 시작',
          location: '서울 물류센터',
          message: '배송이 시작되었습니다.',
          timestamp: order.shippedAt,
        });
        
        events.push({
          status: '배송 중',
          location: order.shippingInfo.address.split(' ')[0] + ' 터미널',
          message: '배송 중입니다.',
          timestamp: new Date(
            new Date(order.shippedAt).getTime() + 3600000
          ).toISOString(),
        });
      }
      
      if (order.deliveredAt) {
        events.push({
          status: '배송 완료',
          location: order.shippingInfo.address,
          message: '배송이 완료되었습니다.',
          timestamp: order.deliveredAt,
        });
      }
      
      return {
        orderId: order.id,
        trackingNumber: order.trackingNumber,
        courier: order.courier || '',
        status: order.status,
        events: events.reverse(), // 최신순으로 정렬
      };
    } catch (error) {
      console.error('Failed to fetch delivery tracking:', error);
      throw error;
    }
  },

  /**
   * 구매 확정
   */
  confirmPurchase: async (orderId: number): Promise<Order> => {
    try {
      // TODO: 실제 API 호출
      // const response = await api.post(`/orders/${orderId}/confirm`);
      // return response.data;

      // Mock 구매 확정
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const order = mockOrders.find(o => o.id === orderId);
      
      if (!order) {
        throw new Error('주문을 찾을 수 없습니다.');
      }
      
      return {
        ...order,
        status: 'DELIVERED',
      };
    } catch (error) {
      console.error('Failed to confirm purchase:', error);
      throw error;
    }
  },

  /**
   * 영수증 다운로드 URL 생성
   */
  getReceiptUrl: (orderId: number): string => {
    // TODO: 실제 영수증 URL
    return `/api/orders/${orderId}/receipt`;
  },
};
