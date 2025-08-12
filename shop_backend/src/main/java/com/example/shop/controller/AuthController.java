package com.example.shop.controller;

import com.example.shop.dto.AuthDto;
import com.example.shop.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "인증 관리 API")
public class AuthController {
    
    private final AuthService authService;
    
    /**
     * 로그인
     */
    @PostMapping("/login")
    @Operation(summary = "로그인", description = "이메일과 비밀번호로 로그인합니다.")
    public ResponseEntity<AuthDto.LoginResponse> login(
            @Valid @RequestBody AuthDto.LoginRequest request) {
        
        AuthDto.LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
    
    /**
     * 토큰 갱신
     */
    @PostMapping("/refresh")
    @Operation(summary = "토큰 갱신", description = "Refresh Token을 사용하여 새로운 Access Token을 발급받습니다.")
    public ResponseEntity<AuthDto.RefreshTokenResponse> refreshToken(
            @Valid @RequestBody AuthDto.RefreshTokenRequest request) {
        
        AuthDto.RefreshTokenResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(response);
    }
    
    /**
     * 로그아웃
     */
    @PostMapping("/logout")
    @Operation(summary = "로그아웃", description = "현재 세션을 종료합니다.")
    public ResponseEntity<String> logout() {
        // JWT 토큰 기반에서는 클라이언트 측에서 토큰을 삭제하는 것으로 충분
        // 서버 측에서는 토큰 블랙리스트를 관리할 수도 있지만, 간단한 구현에서는 생략
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok("로그아웃이 완료되었습니다.");
    }
    
    /**
     * 현재 사용자 정보 조회
     */
    @GetMapping("/me")
    @Operation(summary = "현재 사용자 정보 조회", description = "현재 인증된 사용자의 정보를 조회합니다.")
    public ResponseEntity<AuthDto.UserInfo> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.unauthorized().build();
        }
        
        String email = authentication.getName();
        AuthDto.UserInfo userInfo = authService.getCurrentUser(email);
        return ResponseEntity.ok(userInfo);
    }
    
    /**
     * 비밀번호 변경
     */
    @PutMapping("/password")
    @Operation(summary = "비밀번호 변경", description = "현재 사용자의 비밀번호를 변경합니다.")
    public ResponseEntity<String> changePassword(
            @Valid @RequestBody AuthDto.ChangePasswordRequest request) {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.unauthorized().build();
        }
        
        String email = authentication.getName();
        authService.changePassword(email, request);
        return ResponseEntity.ok("비밀번호가 성공적으로 변경되었습니다.");
    }
    
    /**
     * 토큰 유효성 검증
     */
    @PostMapping("/validate")
    @Operation(summary = "토큰 유효성 검증", description = "제공된 토큰의 유효성을 검증합니다.")
    public ResponseEntity<Boolean> validateToken(
            @Parameter(description = "검증할 JWT 토큰")
            @RequestParam String token) {
        
        boolean isValid = authService.validateToken(token);
        return ResponseEntity.ok(isValid);
    }
}
