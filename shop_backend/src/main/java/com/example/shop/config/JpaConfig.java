package com.example.shop.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@Configuration
@EnableJpaAuditing  // 자동 시간 설정, entity의 수정·생성 시간 자동 추적
public class JpaConfig {
}
