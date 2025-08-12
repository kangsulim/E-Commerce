package com.example.shop.repository;

import com.example.shop.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    // 상품별 리뷰 조회 (페이징)
    Page<Review> findByProductIdOrderByCreatedAtDesc(Long productId, Pageable pageable);
    
    // 사용자별 리뷰 조회 (페이징)
    Page<Review> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    
    // 상품별 리뷰 조회 (리스트)
    List<Review> findByProductIdOrderByCreatedAtDesc(Long productId);
    
    // 사용자별 리뷰 조회 (리스트)
    List<Review> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    // 특정 사용자가 특정 상품에 대해 작성한 리뷰 조회
    Optional<Review> findByUserIdAndProductId(Long userId, Long productId);
    
    // 상품 평균 평점 계산
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.id = :productId")
    Double findAverageRatingByProductId(@Param("productId") Long productId);
    
    // 상품별 리뷰 개수
    long countByProductId(Long productId);
    
    // 평점별 리뷰 개수 (통계용)
    @Query("SELECT r.rating, COUNT(r) FROM Review r WHERE r.product.id = :productId GROUP BY r.rating ORDER BY r.rating")
    List<Object[]> countByProductIdGroupByRating(@Param("productId") Long productId);
    
    // 사용자가 작성한 총 리뷰 개수
    long countByUserId(Long userId);
    
    // 리뷰 존재 여부 확인
    boolean existsByUserIdAndProductId(Long userId, Long productId);
}
