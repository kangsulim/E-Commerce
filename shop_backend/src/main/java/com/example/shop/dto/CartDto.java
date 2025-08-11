package com.example.shop.dto;

import com.example.shop.entity.Cart;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CartDto {
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        @NotNull(message = "상품은 필수입니다")
        private Long productId;
        
        @NotNull(message = "수량은 필수입니다")
        @Min(value = 1, message = "수량은 1 이상이어야 합니다")
        private Integer quantity;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Long id;
        private ProductDto.ListResponse product;
        private Integer quantity;
        private BigDecimal totalPrice;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        
        public static Response from(Cart cart) {
            BigDecimal totalPrice = cart.getProduct().getPrice()
                    .multiply(BigDecimal.valueOf(cart.getQuantity()));
            
            return Response.builder()
                    .id(cart.getId())
                    .product(ProductDto.ListResponse.from(cart.getProduct()))
                    .quantity(cart.getQuantity())
                    .totalPrice(totalPrice)
                    .createdAt(cart.getCreatedAt())
                    .updatedAt(cart.getUpdatedAt())
                    .build();
        }
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRequest {
        @NotNull(message = "수량은 필수입니다")
        @Min(value = 1, message = "수량은 1 이상이어야 합니다")
        private Integer quantity;
    }
}
