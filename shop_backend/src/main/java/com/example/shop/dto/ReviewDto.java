package com.example.shop.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

public class ReviewDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        private Integer rating; // 1-5점
        private String comment;
        private Long productId;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Long id;
        private Integer rating;
        private String comment;
        private Long productId;
        private String productName;
        private Long userId;
        private String userName;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRequest {
        private Integer rating;
        private String comment;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ListResponse {
        private List<Response> reviews;
        private int totalPages;
        private long totalElements;
        private int currentPage;
        private int size;
        private boolean hasNext;
        private boolean hasPrevious;
        private double averageRating;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RatingStats {
        private double averageRating;
        private long totalReviews;
        private long[] ratingCounts; // [0]=1점 개수, [1]=2점 개수, ..., [4]=5점 개수
    }
}
