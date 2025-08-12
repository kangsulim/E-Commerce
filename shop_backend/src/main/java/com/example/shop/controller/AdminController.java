package com.example.shop.controller;

import com.example.shop.dto.AdminDto;
import com.example.shop.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "관리자 전용 API")
@PreAuthorize("hasRole('ADMIN')") // 모든 메서드에 ADMIN 권한 필요
public class AdminController {
    
    private final AdminService adminService;
    
    /**
     * 대시보드 통계 조회
     */
    @GetMapping("/dashboard")
    @Operation(summary = "대시보드 통계", description = "관리자 대시보드에 표시할 통계 정보를 조회합니다.")
    public ResponseEntity<AdminDto.DashboardStats> getDashboardStats() {
        AdminDto.DashboardStats stats = adminService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }
    
    /**
     * 전체 주문 관리 (페이징)
     */
    @GetMapping("/orders")
    @Operation(summary = "전체 주문 조회", description = "모든 주문을 페이징으로 조회합니다.")
    public ResponseEntity<Page<AdminDto.OrderManagement>> getAllOrders(
            @Parameter(description = "페이지 번호 (0부터 시작)", example = "0")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "페이지 크기", example = "20")
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<AdminDto.OrderManagement> orders = adminService.getAllOrders(pageable);
        return ResponseEntity.ok(orders);
    }
    
    /**
     * 주문 상태 변경
     */
    @PutMapping("/orders/{orderId}/status")
    @Operation(summary = "주문 상태 변경", description = "특정 주문의 상태를 변경합니다.")
    public ResponseEntity<AdminDto.OrderManagement> updateOrderStatus(
            @Parameter(description = "주문 ID", example = "1")
            @PathVariable Long orderId,
            @Valid @RequestBody AdminDto.OrderStatusUpdateRequest request) {
        
        AdminDto.OrderManagement updatedOrder = adminService.updateOrderStatus(orderId, request);
        return ResponseEntity.ok(updatedOrder);
    }
    
    /**
     * 전체 사용자 관리 (페이징)
     */
    @GetMapping("/users")
    @Operation(summary = "전체 사용자 조회", description = "모든 사용자를 페이징으로 조회합니다.")
    public ResponseEntity<Page<AdminDto.UserManagement>> getAllUsers(
            @Parameter(description = "페이지 번호 (0부터 시작)", example = "0")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "페이지 크기", example = "20")
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<AdminDto.UserManagement> users = adminService.getAllUsers(pageable);
        return ResponseEntity.ok(users);
    }
    
    /**
     * 사용자 활성화/비활성화 토글
     */
    @PutMapping("/users/{userId}/toggle")
    @Operation(summary = "사용자 상태 토글", description = "사용자의 활성화 상태를 토글합니다.")
    public ResponseEntity<AdminDto.UserManagement> toggleUserStatus(
            @Parameter(description = "사용자 ID", example = "1")
            @PathVariable Long userId) {
        
        AdminDto.UserManagement user = adminService.toggleUserStatus(userId);
        return ResponseEntity.ok(user);
    }
    
    /**
     * 상품 통계 조회
     */
    @GetMapping("/products/stats")
    @Operation(summary = "상품 통계 조회", description = "모든 상품의 판매 통계를 조회합니다.")
    public ResponseEntity<Page<AdminDto.ProductStats>> getProductStats(
            @Parameter(description = "페이지 번호 (0부터 시작)", example = "0")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "페이지 크기", example = "20")
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<AdminDto.ProductStats> stats = adminService.getProductStats(pageable);
        return ResponseEntity.ok(stats);
    }
    
    /**
     * 매출 리포트 생성
     */
    @GetMapping("/reports/sales")
    @Operation(summary = "매출 리포트", description = "지정된 기간의 매출 리포트를 생성합니다.")
    public ResponseEntity<AdminDto.SalesReport> generateSalesReport(
            @Parameter(description = "리포트 기간 (daily, weekly, monthly, yearly)", example = "monthly")
            @RequestParam(defaultValue = "monthly") String period,
            @Parameter(description = "시작일 (yyyy-MM-dd'T'HH:mm:ss)", example = "2024-01-01T00:00:00")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @Parameter(description = "종료일 (yyyy-MM-dd'T'HH:mm:ss)", example = "2024-12-31T23:59:59")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        
        AdminDto.SalesReport report = adminService.generateSalesReport(period, startDate, endDate);
        return ResponseEntity.ok(report);
    }
    
    /**
     * 시스템 정보 조회
     */
    @GetMapping("/system/info")
    @Operation(summary = "시스템 정보", description = "시스템 상태 및 정보를 조회합니다.")
    public ResponseEntity<String> getSystemInfo() {
        // 간단한 시스템 정보 반환
        String systemInfo = """
            {
                "status": "healthy",
                "version": "1.0.0",
                "environment": "development",
                "uptime": "system running",
                "javaVersion": "%s",
                "availableProcessors": %d
            }
            """.formatted(
                System.getProperty("java.version"),
                Runtime.getRuntime().availableProcessors()
            );
        
        return ResponseEntity.ok(systemInfo);
    }
}
