package com.example.shop.repository;

import com.example.shop.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    // 사용자별 주문 조회
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    // 주문 번호로 조회
    Optional<Order> findByOrderNumber(String orderNumber);
    
    // 상태별 주문 조회
    List<Order> findByStatusOrderByCreatedAtDesc(Order.OrderStatus status);
    
    // 관리자용: 전체 주문 조회 (페이징, 생성일 역순)
    Page<Order> findAllByOrderByCreatedAtDesc(Pageable pageable);
    
    // 관리자용: 최근 주문 10개 조회
    List<Order> findTop10ByOrderByCreatedAtDesc();
    
    // 관리자용: 기간별 주문 조회
    List<Order> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    // 사용자 ID로 주문 조회 (통계용)
    List<Order> findByUserId(Long userId);
}
