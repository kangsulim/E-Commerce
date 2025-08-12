package com.example.shop.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "file")
@Getter
@Setter
public class FileProperties {
    private String uploadDir;
    private long maxFileSize = 10485760L; // 10MB
    private String[] allowedExtensions = {"jpg", "jpeg", "png", "gif", "webp"};
}
