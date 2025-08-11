package com.example.shop.dto;

import com.example.shop.entity.Category;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class CategoryDto {
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        @NotBlank(message = "카테고리명은 필수입니다")
        @Size(max = 50, message = "카테고리명은 50자를 초과할 수 없습니다")
        private String name;
        
        @Size(max = 200, message = "카테고리 설명은 200자를 초과할 수 없습니다")
        private String description;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Long id;
        private String name;
        private String description;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        
        public static Response from(Category category) {
            return Response.builder()
                    .id(category.getId())
                    .name(category.getName())
                    .description(category.getDescription())
                    .createdAt(category.getCreatedAt())
                    .updatedAt(category.getUpdatedAt())
                    .build();
        }
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRequest {
        @Size(max = 50, message = "카테고리명은 50자를 초과할 수 없습니다")
        private String name;
        
        @Size(max = 200, message = "카테고리 설명은 200자를 초과할 수 없습니다")
        private String description;
    }
}
