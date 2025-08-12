package com.example.shop.controller;

import com.example.shop.dto.ReviewDto;
import com.example.shop.service.ReviewService;
import com.example.shop.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@Tag(name = "Review", description = "리뷰 관리 API")
public class ReviewController {
    
    private final ReviewService reviewService;
    private final SecurityUtil securityUtil;
    
    /**
     * 리뷰 작성
     */
    @PostMapping
    @Operation(summary = "리뷰 작성", description = "상품에 대한 리뷰를 작성합니다.")
    public ResponseEntity<ReviewDto.Response> createReview(
            @Valid @RequestBody ReviewDto.Request request) {
        
        Long userId = securityUtil.getCurrentUserId();
        ReviewDto.Response response = reviewService.createReview(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    /**
     * 리뷰 수정
     */
    @PutMapping("/{reviewId}")
    @Operation(summary = "리뷰 수정", description = "작성한 리뷰를 수정합니다.")
    public ResponseEntity<ReviewDto.Response> updateReview(
            @Parameter(description = "리뷰 ID", example = "1")
            @PathVariable Long reviewId,
            @Valid @RequestBody ReviewDto.UpdateRequest request) {
        
        Long userId = securityUtil.getCurrentUserId();
        ReviewDto.Response response = reviewService.updateReview(reviewId, userId, request);
        return ResponseEntity.ok(response);
    }
    
    /**
     * 리뷰 삭제
     */
    @DeleteMapping("/{reviewId}")
    @Operation(summary = "리뷰 삭제", description = "작성한 리뷰를 삭제합니다.")
    public ResponseEntity<Void> deleteReview(
            @Parameter(description = "리뷰 ID", example = "1")
            @PathVariable Long reviewId) {
        
        Long userId = securityUtil.getCurrentUserId();
        reviewService.deleteReview(reviewId, userId);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * 특정 리뷰 조회
     */
    @GetMapping("/{reviewId}")
    @Operation(summary = "리뷰 조회", description = "특정 리뷰의 상세 정보를 조회합니다.")
    public ResponseEntity<ReviewDto.Response> getReview(
            @Parameter(description = "리뷰 ID", example = "1")
            @PathVariable Long reviewId) {
        
        ReviewDto.Response response = reviewService.getReview(reviewId);
        return ResponseEntity.ok(response);
    }
    
    /**
     * 상품별 리뷰 목록 조회 (페이징)
     */
    @GetMapping("/products/{productId}")
    @Operation(summary = "상품별 리뷰 목록 조회", description = "특정 상품의 리뷰 목록을 조회합니다.")
    public ResponseEntity<ReviewDto.ListResponse> getProductReviews(
            @Parameter(description = "상품 ID", example = "1")
            @PathVariable Long productId,
            @Parameter(description = "페이지 번호 (0부터 시작)", example = "0")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "페이지 크기", example = "10")
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        ReviewDto.ListResponse response = reviewService.getProductReviews(productId, pageable);
        return ResponseEntity.ok(response);
    }
    
    /**
     * 사용자별 리뷰 목록 조회 (페이징)
     */
    @GetMapping("/users/{userId}")
    @Operation(summary = "사용자별 리뷰 목록 조회", description = "특정 사용자가 작성한 리뷰 목록을 조회합니다.")
    public ResponseEntity<ReviewDto.ListResponse> getUserReviews(
            @Parameter(description = "사용자 ID", example = "1")
            @PathVariable Long userId,
            @Parameter(description = "페이지 번호 (0부터 시작)", example = "0")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "페이지 크기", example = "10")
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        ReviewDto.ListResponse response = reviewService.getUserReviews(userId, pageable);
        return ResponseEntity.ok(response);
    }
    
    /**
     * 내가 작성한 리뷰 목록 조회
     */
    @GetMapping("/my")
    @Operation(summary = "내 리뷰 목록 조회", description = "현재 로그인한 사용자가 작성한 리뷰 목록을 조회합니다.")
    public ResponseEntity<ReviewDto.ListResponse> getMyReviews(
            @Parameter(description = "페이지 번호 (0부터 시작)", example = "0")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "페이지 크기", example = "10")
            @RequestParam(defaultValue = "10") int size) {
        
        Long userId = securityUtil.getCurrentUserId();
        Pageable pageable = PageRequest.of(page, size);
        ReviewDto.ListResponse response = reviewService.getUserReviews(userId, pageable);
        return ResponseEntity.ok(response);
    }
    
    /**
     * 상품의 리뷰 통계 조회
     */
    @GetMapping("/products/{productId}/stats")
    @Operation(summary = "상품 리뷰 통계 조회", description = "상품의 평균 평점, 총 리뷰 수, 평점별 분포를 조회합니다.")
    public ResponseEntity<ReviewDto.RatingStats> getProductRatingStats(
            @Parameter(description = "상품 ID", example = "1")
            @PathVariable Long productId) {
        
        ReviewDto.RatingStats stats = reviewService.getProductRatingStats(productId);
        return ResponseEntity.ok(stats);
    }
    
    /**
     * 내가 특정 상품에 리뷰를 작성했는지 확인
     */
    @GetMapping("/check")
    @Operation(summary = "리뷰 작성 여부 확인", description = "현재 사용자가 특정 상품에 리뷰를 작성했는지 확인합니다.")
    public ResponseEntity<Boolean> checkMyReview(
            @Parameter(description = "상품 ID", example = "1")
            @RequestParam Long productId) {
        
        Long userId = securityUtil.getCurrentUserId();
        boolean hasReviewed = reviewService.hasUserReviewedProduct(userId, productId);
        return ResponseEntity.ok(hasReviewed);
    }
}
