package com.example.shop.service;

import com.example.shop.dto.OrderDto;
import com.example.shop.entity.*;
import com.example.shop.repository.CartRepository;
import com.example.shop.repository.OrderRepository;
import com.example.shop.repository.ProductRepository;
import com.example.shop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;
    
    /**
     * 장바구니에서 주문 생성
     */
    @Transactional
    public OrderDto.Response createOrderFromCart(Long userId, OrderDto.Request request) {
        log.info("장바구니에서 주문 생성 시작: userId = {}", userId);
        
        // 사용자 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + userId));
        
        // 사용자의 장바구니 조회
        List<Cart> cartItems = cartRepository.findByUserIdOrderByCreatedAtDesc(userId);
        if (cartItems.isEmpty()) {
            throw new IllegalArgumentException("장바구니가 비어있습니다.");
        }
        
        // 주문 생성
        Order order = Order.builder()
                .orderNumber(generateOrderNumber())
                .totalAmount(BigDecimal.ZERO)
                .status(Order.OrderStatus.PENDING)
                .shippingAddress(request.getShippingAddress())
                .shippingPhone(user.getPhone())
                .user(user)
                .build();
        
        // 장바구니 아이템들을 주문 아이템으로 변환
        for (Cart cartItem : cartItems) {
            Product product = cartItem.getProduct();
            
            // 재고 확인
            if (product.getStockQuantity() < cartItem.getQuantity()) {
                throw new IllegalArgumentException(
                    String.format("상품 '%s'의 재고가 부족합니다. (요청: %d, 재고: %d)", 
                        product.getName(), cartItem.getQuantity(), product.getStockQuantity())
                );
            }
            
            // 주문 아이템 생성
            OrderItem orderItem = OrderItem.builder()
                    .quantity(cartItem.getQuantity())
                    .price(product.getPrice())
                    .product(product)
                    .build();
            
            order.addOrderItem(orderItem);
            
            // 재고 차감
            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            productRepository.save(product);
        }
        
        // 주문 저장
        Order savedOrder = orderRepository.save(order);
        
        // 장바구니 비우기
        cartRepository.deleteAll(cartItems);
        
        log.info("주문 생성 완료: orderNumber = {}, totalAmount = {}", 
                savedOrder.getOrderNumber(), savedOrder.getTotalAmount());
        
        return OrderDto.Response.from(savedOrder);
    }
    
    /**
     * 직접 주문 생성 (장바구니 없이)
     */
    @Transactional
    public OrderDto.Response createDirectOrder(Long userId, OrderDto.Request request) {
        log.info("직접 주문 생성 시작: userId = {}", userId);
        
        // 사용자 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + userId));
        
        if (request.getOrderItems() == null || request.getOrderItems().isEmpty()) {
            throw new IllegalArgumentException("주문할 상품이 없습니다.");
        }
        
        // 주문 생성
        Order order = Order.builder()
                .orderNumber(generateOrderNumber())
                .totalAmount(BigDecimal.ZERO)
                .status(Order.OrderStatus.PENDING)
                .shippingAddress(request.getShippingAddress())
                .shippingPhone(user.getPhone())
                .user(user)
                .build();
        
        // 주문 아이템들 처리
        for (OrderDto.OrderItemRequest itemRequest : request.getOrderItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다: " + itemRequest.getProductId()));
            
            // 재고 확인
            if (product.getStockQuantity() < itemRequest.getQuantity()) {
                throw new IllegalArgumentException(
                    String.format("상품 '%s'의 재고가 부족합니다. (요청: %d, 재고: %d)", 
                        product.getName(), itemRequest.getQuantity(), product.getStockQuantity())
                );
            }
            
            // 주문 아이템 생성
            OrderItem orderItem = OrderItem.builder()
                    .quantity(itemRequest.getQuantity())
                    .price(product.getPrice())
                    .product(product)
                    .build();
            
            order.addOrderItem(orderItem);
            
            // 재고 차감
            product.setStockQuantity(product.getStockQuantity() - itemRequest.getQuantity());
            productRepository.save(product);
        }
        
        // 주문 저장
        Order savedOrder = orderRepository.save(order);
        
        log.info("직접 주문 생성 완료: orderNumber = {}, totalAmount = {}", 
                savedOrder.getOrderNumber(), savedOrder.getTotalAmount());
        
        return OrderDto.Response.from(savedOrder);
    }
    
    /**
     * 주문 상세 조회
     */
    public OrderDto.Response getOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다: " + orderId));
        
        return OrderDto.Response.from(order);
    }
    
    /**
     * 사용자별 주문 목록 조회
     */
    public List<OrderDto.ListResponse> getUserOrders(Long userId) {
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return orders.stream()
                .map(OrderDto.ListResponse::from)
                .collect(Collectors.toList());
    }
    
    /**
     * 모든 주문 목록 조회 (관리자용)
     */
    public List<OrderDto.ListResponse> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .map(OrderDto.ListResponse::from)
                .collect(Collectors.toList());
    }
    
    /**
     * 주문 상태별 조회
     */
    public List<OrderDto.ListResponse> getOrdersByStatus(Order.OrderStatus status) {
        List<Order> orders = orderRepository.findByStatusOrderByCreatedAtDesc(status);
        return orders.stream()
                .map(OrderDto.ListResponse::from)
                .collect(Collectors.toList());
    }
    
    /**
     * 주문 상태 변경
     */
    @Transactional
    public OrderDto.Response updateOrderStatus(Long orderId, Order.OrderStatus status) {
        log.info("주문 상태 변경: orderId = {}, status = {}", orderId, status);
        
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다: " + orderId));
        
        // 상태 변경 검증
        validateStatusChange(order.getStatus(), status);
        
        order.setStatus(status);
        Order savedOrder = orderRepository.save(order);
        
        log.info("주문 상태 변경 완료: orderNumber = {}, status = {}", 
                savedOrder.getOrderNumber(), savedOrder.getStatus());
        
        return OrderDto.Response.from(savedOrder);
    }
    
    /**
     * 주문 취소
     */
    @Transactional
    public OrderDto.Response cancelOrder(Long orderId) {
        log.info("주문 취소 요청: orderId = {}", orderId);
        
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다: " + orderId));
        
        // 취소 가능한 상태인지 확인
        if (order.getStatus() == Order.OrderStatus.SHIPPED || 
            order.getStatus() == Order.OrderStatus.DELIVERED) {
            throw new IllegalArgumentException("배송 중이거나 배송 완료된 주문은 취소할 수 없습니다.");
        }
        
        if (order.getStatus() == Order.OrderStatus.CANCELLED) {
            throw new IllegalArgumentException("이미 취소된 주문입니다.");
        }
        
        // 재고 복구
        for (OrderItem orderItem : order.getOrderItems()) {
            Product product = orderItem.getProduct();
            product.setStockQuantity(product.getStockQuantity() + orderItem.getQuantity());
            productRepository.save(product);
        }
        
        // 주문 상태를 취소로 변경
        order.setStatus(Order.OrderStatus.CANCELLED);
        Order savedOrder = orderRepository.save(order);
        
        log.info("주문 취소 완료: orderNumber = {}", savedOrder.getOrderNumber());
        
        return OrderDto.Response.from(savedOrder);
    }
    
    /**
     * 주문번호로 주문 조회
     */
    public OrderDto.Response getOrderByOrderNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다: " + orderNumber));
        
        return OrderDto.Response.from(order);
    }
    
    /**
     * 주문번호 생성
     */
    private String generateOrderNumber() {
        LocalDateTime now = LocalDateTime.now();
        String dateTime = now.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String randomSuffix = String.valueOf((int)(Math.random() * 1000));
        return "ORD-" + dateTime + "-" + String.format("%03d", Integer.parseInt(randomSuffix));
    }
    
    /**
     * 주문 상태 변경 검증
     */
    private void validateStatusChange(Order.OrderStatus currentStatus, Order.OrderStatus newStatus) {
        // 취소된 주문은 상태 변경 불가
        if (currentStatus == Order.OrderStatus.CANCELLED) {
            throw new IllegalArgumentException("취소된 주문의 상태는 변경할 수 없습니다.");
        }
        
        // 배송 완료 후에는 취소만 가능
        if (currentStatus == Order.OrderStatus.DELIVERED && newStatus != Order.OrderStatus.CANCELLED) {
            throw new IllegalArgumentException("배송 완료된 주문은 취소만 가능합니다.");
        }
        
        // 정상적인 주문 흐름: PENDING -> CONFIRMED -> SHIPPED -> DELIVERED
        switch (currentStatus) {
            case PENDING:
                if (newStatus != Order.OrderStatus.CONFIRMED && newStatus != Order.OrderStatus.CANCELLED) {
                    throw new IllegalArgumentException("대기 중인 주문은 확인 또는 취소만 가능합니다.");
                }
                break;
            case CONFIRMED:
                if (newStatus != Order.OrderStatus.SHIPPED && newStatus != Order.OrderStatus.CANCELLED) {
                    throw new IllegalArgumentException("확인된 주문은 배송 시작 또는 취소만 가능합니다.");
                }
                break;
            case SHIPPED:
                if (newStatus != Order.OrderStatus.DELIVERED) {
                    throw new IllegalArgumentException("배송 중인 주문은 배송 완료만 가능합니다.");
                }
                break;
        }
    }
}
