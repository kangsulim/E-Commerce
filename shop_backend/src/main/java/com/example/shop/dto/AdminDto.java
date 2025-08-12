package com.example.shop.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

public class AdminDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DashboardStats {
        private long totalUsers;
        private long totalProducts;
        private long totalOrders;
        private long totalReviews;
        private double totalRevenue;
        private long todayOrders;
        private double todayRevenue;
        private List<RecentOrder> recentOrders;
        private List<PopularProduct> popularProducts;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentOrder {
        private Long orderId;
        private String userEmail;
        private String userName;
        private Double totalAmount;
        private String status;
        private LocalDateTime createdAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PopularProduct {
        private Long productId;
        private String productName;
        private long orderCount;
        private double rating;
        private long reviewCount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserManagement {
        private Long userId;
        private String email;
        private String name;
        private String role;
        private boolean isActive;
        private LocalDateTime createdAt;
        private LocalDateTime lastLogin;
        private long orderCount;
        private double totalSpent;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderManagement {
        private Long orderId;
        private String userEmail;
        private String userName;
        private Double totalAmount;
        private String status;
        private int itemCount;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private List<OrderItemInfo> items;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemInfo {
        private String productName;
        private int quantity;
        private Double price;
        private Double totalPrice;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderStatusUpdateRequest {
        private String status; // PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserStatusUpdateRequest {
        private boolean isActive;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SalesReport {
        private String period; // daily, weekly, monthly, yearly
        private LocalDateTime startDate;
        private LocalDateTime endDate;
        private double totalRevenue;
        private long totalOrders;
        private double averageOrderValue;
        private List<SalesData> salesData;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SalesData {
        private String date;
        private double revenue;
        private long orderCount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductStats {
        private Long productId;
        private String productName;
        private String categoryName;
        private Double price;
        private Integer stockQuantity;
        private boolean isActive;
        private long totalSold;
        private double revenue;
        private double rating;
        private long reviewCount;
        private LocalDateTime createdAt;
    }
}
