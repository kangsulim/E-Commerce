package com.example.shop.dto;

import lombok.*;

public class FileDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UploadResponse {
        private String fileName;
        private String originalFileName;
        private String fileUrl;
        private String fileType;
        private long fileSize;
        private boolean success;
        private String message;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FileInfo {
        private String fileName;
        private String originalFileName;
        private String fileUrl;
        private String fileType;
        private long fileSize;
        private java.time.LocalDateTime uploadedAt;
    }
}
