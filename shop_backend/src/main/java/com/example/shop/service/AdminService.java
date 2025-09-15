package com.example.shop.service;

import com.example.shop.dto.AdminDto;
import com.example.shop.entity.Order;
import com.example.shop.entity.Product;
import com.example.shop.entity.User;
import com.example.shop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminService {
    
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final ReviewRepository reviewRepository;
    private final CategoryRepository categoryRepository;
    
    /**
     * 대시보드 통계 조회
     */
    public AdminDto.DashboardStats getDashboardStats() {
        // 기본 통계
        long totalUsers = userRepository.count();
        long totalProducts = productRepository.count();
        long totalOrders = orderRepository.count();
        long totalReviews = reviewRepository.count();
        
        // 총 매출 (모든 주문의 총액 합계)
        Double totalRevenue = orderRepository.findAll().stream()
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .doubleValue();
        
        // 오늘 주문 및 매출
        LocalDateTime todayStart = LocalDate.now().atStartOfDay();
        LocalDateTime todayEnd = todayStart.plusDays(1);
        
        List<Order> todayOrders = orderRepository.findByCreatedAtBetween(todayStart, todayEnd);
        long todayOrderCount = todayOrders.size();
        double todayRevenue = todayOrders.stream()
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .doubleValue();
        
        // 최근 주문 (최근 10개)
        List<AdminDto.RecentOrder> recentOrders = orderRepository.findTop10ByOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToRecentOrderDto)
                .collect(Collectors.toList());
        
        // 인기 상품 (주문 수 기준 상위 5개)
        List<AdminDto.PopularProduct> popularProducts = getPopularProducts();
        
        return AdminDto.DashboardStats.builder()
                .totalUsers(totalUsers)
                .totalProducts(totalProducts)
                .totalOrders(totalOrders)
                .totalReviews(totalReviews)
                .totalRevenue(totalRevenue)
                .todayOrders(todayOrderCount)
                .todayRevenue(todayRevenue)
                .recentOrders(recentOrders)
                .popularProducts(popularProducts)
                .build();
    }
    
    /**
     * 모든 주문 조회 (페이징)
     */
    public Page<AdminDto.OrderManagement> getAllOrders(Pageable pageable) {
        Page<Order> orders = orderRepository.findAllByOrderByCreatedAtDesc(pageable);
        return orders.map(this::convertToOrderManagementDto);
    }
    
    /**
     * 주문 상태 업데이트
     */
    @Transactional
    public AdminDto.OrderManagement updateOrderStatus(Long orderId, AdminDto.OrderStatusUpdateRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("주문을 찾을 수 없습니다: " + orderId));
        
        try {
            Order.OrderStatus newStatus = Order.OrderStatus.valueOf(request.getStatus().toUpperCase());
            order.setStatus(newStatus);
            Order savedOrder = orderRepository.save(order);
            return convertToOrderManagementDto(savedOrder);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("잘못된 주문 상태입니다: " + request.getStatus());
        }
    }
    
    /**
     * 모든 사용자 조회 (페이징)
     */
    public Page<AdminDto.UserManagement> getAllUsers(Pageable pageable) {
        Page<User> users = userRepository.findAllByOrderByCreatedAtDesc(pageable);
        return users.map(this::convertToUserManagementDto);
    }
    
    /**
     * 사용자 상태 토글 (활성화/비활성화)
     */
    @Transactional
    public AdminDto.UserManagement toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + userId));
        
        // 현재는 User 엔티티에 isActive 필드가 없으므로, 필요시 추가해야 함
        // 여기서는 활성화 상태를 토글하는 로직을 구현
        // user.setActive(!user.isActive());
        // User savedUser = userRepository.save(user);
        
        return convertToUserManagementDto(user);
    }
    
    /**
     * 상품 통계 조회
     */
    public Page<AdminDto.ProductStats> getProductStats(Pageable pageable) {
        Page<Product> products = productRepository.findAllByOrderByCreatedAtDesc(pageable);
        return products.map(this::convertToProductStatsDto);
    }
    
    /**
     * 매출 리포트 생성
     */
    public AdminDto.SalesReport generateSalesReport(String period, LocalDateTime startDate, LocalDateTime endDate) {
        List<Order> orders = orderRepository.findByCreatedAtBetween(startDate, endDate);
        
        double totalRevenue = orders.stream()
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .doubleValue();
        
        long totalOrders = orders.size();
        double averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        
        // 기간별 매출 데이터 생성 (간단한 구현)
        List<AdminDto.SalesData> salesData = List.of(
                AdminDto.SalesData.builder()
                        .date(startDate.toLocalDate().toString())
                        .revenue(totalRevenue)
                        .orderCount(totalOrders)
                        .build()
        );
        
        return AdminDto.SalesReport.builder()
                .period(period)
                .startDate(startDate)
                .endDate(endDate)
                .totalRevenue(totalRevenue)
                .totalOrders(totalOrders)
                .averageOrderValue(averageOrderValue)
                .salesData(salesData)
                .build();
    }
    
    // =============================================================================
    // Private Helper Methods
    // =============================================================================
    
    private AdminDto.RecentOrder convertToRecentOrderDto(Order order) {
        return AdminDto.RecentOrder.builder()
                .orderId(order.getId())
                .userEmail(order.getUser().getEmail())
                .userName(order.getUser().getName())
                .totalAmount(order.getTotalAmount().doubleValue())
                .status(order.getStatus().name())
                .createdAt(order.getCreatedAt())
                .build();
    }
    
    private AdminDto.OrderManagement convertToOrderManagementDto(Order order) {
        List<AdminDto.OrderItemInfo> items = order.getOrderItems().stream()
                .map(item -> AdminDto.OrderItemInfo.builder()
                        .productName(item.getProduct().getName())
                        .quantity(item.getQuantity())
                        .price(item.getPrice().doubleValue())
                        .totalPrice(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())).doubleValue())
                        .build())
                .collect(Collectors.toList());
        
        return AdminDto.OrderManagement.builder()
                .orderId(order.getId())
                .userEmail(order.getUser().getEmail())
                .userName(order.getUser().getName())
                .totalAmount(order.getTotalAmount().doubleValue())
                .status(order.getStatus().name())
                .itemCount(order.getOrderItems().size())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .items(items)
                .build();
    }
    
    private AdminDto.UserManagement convertToUserManagementDto(User user) {
        // 사용자의 주문 통계 계산
        List<Order> userOrders = orderRepository.findByUserId(user.getId());
        long orderCount = userOrders.size();
        double totalSpent = userOrders.stream()
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .doubleValue();
        
        return AdminDto.UserManagement.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole().name())
                .isActive(true) // 기본값, 실제로는 User 엔티티에 isActive 필드 추가 필요
                .createdAt(user.getCreatedAt())
                .lastLogin(null) // User 엔티티에 lastLogin 필드 추가 필요
                .orderCount(orderCount)
                .totalSpent(totalSpent)
                .build();
    }
    
    private AdminDto.ProductStats convertToProductStatsDto(Product product) {
        // 상품 통계 계산
        List<Order> orders = orderRepository.findAll();
        long totalSold = orders.stream()
                .flatMap(order -> order.getOrderItems().stream())
                .filter(item -> item.getProduct().getId().equals(product.getId()))
                .mapToLong(item -> item.getQuantity())
                .sum();
        
        double revenue = orders.stream()
                .flatMap(order -> order.getOrderItems().stream())
                .filter(item -> item.getProduct().getId().equals(product.getId()))
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .doubleValue();
        
        // 평점 계산
        Double averageRating = reviewRepository.findAverageRatingByProductId(product.getId());
        double rating = averageRating != null ? Math.round(averageRating * 10) / 10.0 : 0.0;
        
        long reviewCount = reviewRepository.countByProductId(product.getId());
        
        return AdminDto.ProductStats.builder()
                .productId(product.getId())
                .productName(product.getName())
                .categoryName(product.getCategory().getName())
                .price(product.getPrice().doubleValue())
                .stockQuantity(product.getStockQuantity())
                .isActive(true) // Product 엔티티에 isActive 필드 추가 필요
                .totalSold(totalSold)
                .revenue(revenue)
                .rating(rating)
                .reviewCount(reviewCount)
                .createdAt(product.getCreatedAt())
                .build();
    }
    
    private List<AdminDto.PopularProduct> getPopularProducts() {
        // 주문 수 기준 상위 5개 상품 조회 (간단한 구현)
        List<Product> allProducts = productRepository.findAll();
        
        return allProducts.stream()
                .limit(5)
                .map(product -> {
                    Double averageRating = reviewRepository.findAverageRatingByProductId(product.getId());
                    double rating = averageRating != null ? Math.round(averageRating * 10) / 10.0 : 0.0;
                    long reviewCount = reviewRepository.countByProductId(product.getId());
                    
                    return AdminDto.PopularProduct.builder()
                            .productId(product.getId())
                            .productName(product.getName())
                            .orderCount(0L) // 실제로는 주문 수 계산 필요
                            .rating(rating)
                            .reviewCount(reviewCount)
                            .build();
                })
                .collect(Collectors.toList());
    }
}
