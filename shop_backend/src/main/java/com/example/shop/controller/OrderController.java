package com.example.shop.controller;

import com.example.shop.dto.OrderDto;
import com.example.shop.entity.Order;
import com.example.shop.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Order", description = "주문 관리 API")
public class OrderController {
    
    private final OrderService orderService;
    
    @Operation(summary = "장바구니에서 주문 생성", description = "사용자의 장바구니 내용으로 주문을 생성합니다")
    @PostMapping("/users/{userId}/from-cart")
    public ResponseEntity<OrderDto.Response> createOrderFromCart(
            @Parameter(description = "사용자 ID") @PathVariable Long userId,
            @Valid @RequestBody OrderDto.Request request) {
        
        OrderDto.Response response = orderService.createOrderFromCart(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @Operation(summary = "직접 주문 생성", description = "장바구니 없이 직접 상품을 선택하여 주문을 생성합니다")
    @PostMapping("/users/{userId}/direct")
    public ResponseEntity<OrderDto.Response> createDirectOrder(
            @Parameter(description = "사용자 ID") @PathVariable Long userId,
            @Valid @RequestBody OrderDto.Request request) {
        
        OrderDto.Response response = orderService.createDirectOrder(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @Operation(summary = "주문 상세 조회", description = "주문 ID로 주문 상세 정보를 조회합니다")
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDto.Response> getOrder(
            @Parameter(description = "주문 ID") @PathVariable Long orderId) {
        
        OrderDto.Response response = orderService.getOrder(orderId);
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "주문번호로 주문 조회", description = "주문번호로 주문 정보를 조회합니다")
    @GetMapping("/order-number/{orderNumber}")
    public ResponseEntity<OrderDto.Response> getOrderByOrderNumber(
            @Parameter(description = "주문번호") @PathVariable String orderNumber) {
        
        OrderDto.Response response = orderService.getOrderByOrderNumber(orderNumber);
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "사용자별 주문 목록 조회", description = "특정 사용자의 모든 주문 목록을 조회합니다")
    @GetMapping("/users/{userId}")
    public ResponseEntity<List<OrderDto.ListResponse>> getUserOrders(
            @Parameter(description = "사용자 ID") @PathVariable Long userId) {
        
        List<OrderDto.ListResponse> responses = orderService.getUserOrders(userId);
        return ResponseEntity.ok(responses);
    }
    
    @Operation(summary = "모든 주문 목록 조회", description = "모든 주문 목록을 조회합니다 (관리자용)")
    @GetMapping
    public ResponseEntity<List<OrderDto.ListResponse>> getAllOrders() {
        List<OrderDto.ListResponse> responses = orderService.getAllOrders();
        return ResponseEntity.ok(responses);
    }
    
    @Operation(summary = "주문 상태별 조회", description = "특정 상태의 주문들을 조회합니다")
    @GetMapping("/status/{status}")
    public ResponseEntity<List<OrderDto.ListResponse>> getOrdersByStatus(
            @Parameter(description = "주문 상태 (PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED)") 
            @PathVariable Order.OrderStatus status) {
        
        List<OrderDto.ListResponse> responses = orderService.getOrdersByStatus(status);
        return ResponseEntity.ok(responses);
    }
    
    @Operation(summary = "주문 상태 변경", description = "주문의 상태를 변경합니다 (관리자용)")
    @PutMapping("/{orderId}/status")
    public ResponseEntity<OrderDto.Response> updateOrderStatus(
            @Parameter(description = "주문 ID") @PathVariable Long orderId,
            @RequestBody Map<String, String> request) {
        
        Order.OrderStatus status = Order.OrderStatus.valueOf(request.get("status"));
        OrderDto.Response response = orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "주문 취소", description = "주문을 취소합니다")
    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<OrderDto.Response> cancelOrder(
            @Parameter(description = "주문 ID") @PathVariable Long orderId) {
        
        OrderDto.Response response = orderService.cancelOrder(orderId);
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "주문 확인", description = "주문을 확인 상태로 변경합니다")
    @PutMapping("/{orderId}/confirm")
    public ResponseEntity<OrderDto.Response> confirmOrder(
            @Parameter(description = "주문 ID") @PathVariable Long orderId) {
        
        OrderDto.Response response = orderService.updateOrderStatus(orderId, Order.OrderStatus.CONFIRMED);
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "배송 시작", description = "주문을 배송 중 상태로 변경합니다")
    @PutMapping("/{orderId}/ship")
    public ResponseEntity<OrderDto.Response> shipOrder(
            @Parameter(description = "주문 ID") @PathVariable Long orderId) {
        
        OrderDto.Response response = orderService.updateOrderStatus(orderId, Order.OrderStatus.SHIPPED);
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "배송 완료", description = "주문을 배송 완료 상태로 변경합니다")
    @PutMapping("/{orderId}/deliver")
    public ResponseEntity<OrderDto.Response> deliverOrder(
            @Parameter(description = "주문 ID") @PathVariable Long orderId) {
        
        OrderDto.Response response = orderService.updateOrderStatus(orderId, Order.OrderStatus.DELIVERED);
        return ResponseEntity.ok(response);
    }
}
