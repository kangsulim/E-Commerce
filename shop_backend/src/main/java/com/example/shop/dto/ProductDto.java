package com.example.shop.dto;

import com.example.shop.entity.Product;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ProductDto {
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        @NotBlank(message = "상품명은 필수입니다")
        @Size(max = 100, message = "상품명은 100자를 초과할 수 없습니다")
        private String name;
        
        @Size(max = 1000, message = "상품 설명은 1000자를 초과할 수 없습니다")
        private String description;
        
        @NotNull(message = "가격은 필수입니다")
        @DecimalMin(value = "0.0", inclusive = false, message = "가격은 0보다 커야 합니다")
        @Digits(integer = 8, fraction = 2, message = "가격 형식이 올바르지 않습니다")
        private BigDecimal price;
        
        @NotNull(message = "재고 수량은 필수입니다")
        @Min(value = 0, message = "재고 수량은 0 이상이어야 합니다")
        private Integer stockQuantity;
        
        @Size(max = 500, message = "이미지 URL은 500자를 초과할 수 없습니다")
        private String imageUrl;
        
        @NotNull(message = "카테고리는 필수입니다")
        private Long categoryId;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Long id;
        private String name;
        private String description;
        private BigDecimal price;
        private Integer stockQuantity;
        private String imageUrl;
        private Boolean isActive;
        private CategoryDto.Response category;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        
        public static Response from(Product product) {
            return Response.builder()
                    .id(product.getId())
                    .name(product.getName())
                    .description(product.getDescription())
                    .price(product.getPrice())
                    .stockQuantity(product.getStockQuantity())
                    .imageUrl(product.getImageUrl())
                    .isActive(product.getIsActive())
                    .category(product.getCategory() != null ? 
                        CategoryDto.Response.from(product.getCategory()) : null)
                    .createdAt(product.getCreatedAt())
                    .updatedAt(product.getUpdatedAt())
                    .build();
        }
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRequest {
        @Size(max = 100, message = "상품명은 100자를 초과할 수 없습니다")
        private String name;
        
        @Size(max = 1000, message = "상품 설명은 1000자를 초과할 수 없습니다")
        private String description;
        
        @DecimalMin(value = "0.0", inclusive = false, message = "가격은 0보다 커야 합니다")
        @Digits(integer = 8, fraction = 2, message = "가격 형식이 올바르지 않습니다")
        private BigDecimal price;
        
        @Min(value = 0, message = "재고 수량은 0 이상이어야 합니다")
        private Integer stockQuantity;
        
        @Size(max = 500, message = "이미지 URL은 500자를 초과할 수 없습니다")
        private String imageUrl;
        
        private Long categoryId;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ListResponse {
        private Long id;
        private String name;
        private BigDecimal price;
        private String imageUrl;
        private String categoryName;
        private Integer stockQuantity;
        private Boolean isActive;
        
        public static ListResponse from(Product product) {
            return ListResponse.builder()
                    .id(product.getId())
                    .name(product.getName())
                    .price(product.getPrice())
                    .imageUrl(product.getImageUrl())
                    .categoryName(product.getCategory() != null ? 
                        product.getCategory().getName() : null)
                    .stockQuantity(product.getStockQuantity())
                    .isActive(product.getIsActive())
                    .build();
        }
    }
}
