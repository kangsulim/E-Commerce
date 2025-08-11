package com.example.shop.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {
    
    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("온라인 쇼핑몰 API")
                        .description("Spring Boot를 사용한 온라인 쇼핑몰 REST API 문서")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("개발팀")
                                .email("dev@shop.com")
                                .url("https://shop.com")
                        )
                )
                .servers(List.of(
                        new Server().url("http://localhost:8080").description("로컬 개발 서버"),
                        new Server().url("https://api.shop.com").description("운영 서버")
                ));
    }
}
