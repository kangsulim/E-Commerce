package com.example.shop.dto;

import com.example.shop.entity.Order;
import com.example.shop.entity.OrderItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class OrderDto {
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        private String shippingAddress;
        private List<OrderItemRequest> orderItems;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemRequest {
        private Long productId;
        private Integer quantity;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Long id;
        private String orderNumber;
        private BigDecimal totalAmount;
        private Order.OrderStatus status;
        private String shippingAddress;
        private List<OrderItemResponse> orderItems;
        private UserDto.Response user;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        
        public static Response from(Order order) {
            return Response.builder()
                    .id(order.getId())
                    .orderNumber(order.getOrderNumber())
                    .totalAmount(order.getTotalAmount())
                    .status(order.getStatus())
                    .shippingAddress(order.getShippingAddress())
                    .orderItems(order.getOrderItems().stream()
                            .map(OrderItemResponse::from)
                            .collect(Collectors.toList()))
                    .user(UserDto.Response.from(order.getUser()))
                    .createdAt(order.getCreatedAt())
                    .updatedAt(order.getUpdatedAt())
                    .build();
        }
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemResponse {
        private Long id;
        private ProductDto.ListResponse product;
        private Integer quantity;
        private BigDecimal price;
        private BigDecimal totalPrice;
        
        public static OrderItemResponse from(OrderItem orderItem) {
            return OrderItemResponse.builder()
                    .id(orderItem.getId())
                    .product(ProductDto.ListResponse.from(orderItem.getProduct()))
                    .quantity(orderItem.getQuantity())
                    .price(orderItem.getPrice())
                    .totalPrice(orderItem.getPrice()
                            .multiply(BigDecimal.valueOf(orderItem.getQuantity())))
                    .build();
        }
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ListResponse {
        private Long id;
        private String orderNumber;
        private BigDecimal totalAmount;
        private Order.OrderStatus status;
        private LocalDateTime createdAt;
        
        public static ListResponse from(Order order) {
            return ListResponse.builder()
                    .id(order.getId())
                    .orderNumber(order.getOrderNumber())
                    .totalAmount(order.getTotalAmount())
                    .status(order.getStatus())
                    .createdAt(order.getCreatedAt())
                    .build();
        }
    }
}
