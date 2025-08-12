package com.example.shop.config;

import com.example.shop.security.JwtAuthenticationEntryPoint;
import com.example.shop.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint(jwtAuthenticationEntryPoint)
            )
            .authorizeHttpRequests(auth -> auth
                // 공개 API
                .requestMatchers("/", "/health", "/actuator/**").permitAll()
                
                // 인증 관련 API
                .requestMatchers("/api/auth/**").permitAll()
                
                // 사용자 등록은 공개, 나머지는 인증 필요
                .requestMatchers("/api/users/register").permitAll()
                .requestMatchers("/api/users/**").authenticated()
                
                // 상품 조회는 공개, 관리는 ADMIN만
                .requestMatchers("/api/products", "/api/products/*", "/api/products/*/reviews").permitAll()
                .requestMatchers("/api/products/admin/**").hasRole("ADMIN")
                
                // 카테고리 조회는 공개, 관리는 ADMIN만
                .requestMatchers("/api/categories", "/api/categories/*").permitAll()
                .requestMatchers("/api/categories/admin/**").hasRole("ADMIN")
                
                // 리뷰 조회는 공개, 작성/수정/삭제는 인증 필요
                .requestMatchers("/api/reviews/products/**", "/api/reviews/*/stats").permitAll()
                .requestMatchers("/api/reviews/**").authenticated()
                
                // 장바구니, 주문은 인증 필요
                .requestMatchers("/api/cart/**", "/api/orders/**").authenticated()
                
                // 관리자 API
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                
                // Swagger 관련
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                
                // H2 Console (개발용)
                .requestMatchers("/h2-console/**").permitAll()
                
                // 기타 모든 요청은 인증 필요
                .anyRequest().authenticated()
            )
            .headers(headers -> headers
                .frameOptions(frameOptions -> frameOptions.disable()) // H2 Console을 위해 필요
            )
            // JWT 필터 추가
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
