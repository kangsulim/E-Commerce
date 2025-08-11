package com.example.shop.dto;

import com.example.shop.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class UserDto {
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        @Email(message = "올바른 이메일 형식이 아닙니다")
        @NotBlank(message = "이메일은 필수입니다")
        private String email;
        
        @NotBlank(message = "비밀번호는 필수입니다")
        @Size(min = 6, message = "비밀번호는 최소 6자 이상이어야 합니다")
        private String password;
        
        @NotBlank(message = "이름은 필수입니다")
        @Size(max = 30, message = "이름은 30자를 초과할 수 없습니다")
        private String name;
        
        @Size(max = 20, message = "전화번호는 20자를 초과할 수 없습니다")
        private String phone;
        
        @Size(max = 100, message = "주소는 100자를 초과할 수 없습니다")
        private String address;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Long id;
        private String email;
        private String name;
        private String phone;
        private String address;
        private User.Role role;
        private Boolean isActive;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        
        public static Response from(User user) {
            return Response.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .name(user.getName())
                    .phone(user.getPhone())
                    .address(user.getAddress())
                    .role(user.getRole())
                    .isActive(user.getIsActive())
                    .createdAt(user.getCreatedAt())
                    .updatedAt(user.getUpdatedAt())
                    .build();
        }
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        @Email(message = "올바른 이메일 형식이 아닙니다")
        @NotBlank(message = "이메일은 필수입니다")
        private String email;
        
        @NotBlank(message = "비밀번호는 필수입니다")
        private String password;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRequest {
        @Size(max = 30, message = "이름은 30자를 초과할 수 없습니다")
        private String name;
        
        @Size(max = 20, message = "전화번호는 20자를 초과할 수 없습니다")
        private String phone;
        
        @Size(max = 100, message = "주소는 100자를 초과할 수 없습니다")
        private String address;
    }
}
