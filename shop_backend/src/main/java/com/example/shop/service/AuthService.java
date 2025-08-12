package com.example.shop.service;

import com.example.shop.dto.AuthDto;
import com.example.shop.entity.User;
import com.example.shop.repository.UserRepository;
import com.example.shop.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {
    
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    /**
     * 로그인
     */
    @Transactional
    public AuthDto.LoginResponse login(AuthDto.LoginRequest request) {
        try {
            // 1. 사용자 인증
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            
            // 2. 사용자 정보 조회
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
            
            // 3. JWT 토큰 생성
            String authorities = "ROLE_" + user.getRole().name();
            String accessToken = jwtTokenProvider.createAccessToken(user.getEmail(), authorities);
            String refreshToken = jwtTokenProvider.createRefreshToken(user.getEmail());
            
            // 4. 사용자 정보 DTO 생성
            AuthDto.UserInfo userInfo = AuthDto.UserInfo.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .name(user.getName())
                    .role(user.getRole().name())
                    .build();
            
            return AuthDto.LoginResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .tokenType("Bearer")
                    .expiresIn(jwtTokenProvider.getExpiration(accessToken))
                    .userInfo(userInfo)
                    .build();
                    
        } catch (AuthenticationException e) {
            throw new RuntimeException("이메일 또는 비밀번호가 잘못되었습니다.");
        }
    }
    
    /**
     * 토큰 갱신
     */
    public AuthDto.RefreshTokenResponse refreshToken(AuthDto.RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();
        
        // 1. Refresh Token 유효성 검증
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new RuntimeException("유효하지 않은 Refresh Token입니다.");
        }
        
        // 2. Refresh Token에서 사용자 정보 추출
        String email = jwtTokenProvider.getUserEmailFromToken(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        // 3. 새로운 Access Token 생성
        String authorities = "ROLE_" + user.getRole().name();
        String newAccessToken = jwtTokenProvider.createAccessToken(user.getEmail(), authorities);
        
        return AuthDto.RefreshTokenResponse.builder()
                .accessToken(newAccessToken)
                .tokenType("Bearer")
                .expiresIn(jwtTokenProvider.getExpiration(newAccessToken))
                .build();
    }
    
    /**
     * 현재 인증된 사용자 정보 조회
     */
    public AuthDto.UserInfo getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        return AuthDto.UserInfo.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole().name())
                .build();
    }
    
    /**
     * 비밀번호 변경
     */
    @Transactional
    public void changePassword(String email, AuthDto.ChangePasswordRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        // 1. 현재 비밀번호 확인
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("현재 비밀번호가 일치하지 않습니다.");
        }
        
        // 2. 새 비밀번호와 확인 비밀번호 일치 확인
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
        }
        
        // 3. 비밀번호 변경
        String encodedNewPassword = passwordEncoder.encode(request.getNewPassword());
        user.setPassword(encodedNewPassword);
        userRepository.save(user);
    }
    
    /**
     * 토큰 유효성 검증
     */
    public boolean validateToken(String token) {
        return jwtTokenProvider.validateToken(token);
    }
}
