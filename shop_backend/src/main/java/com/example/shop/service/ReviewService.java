package com.example.shop.service;

import com.example.shop.dto.ReviewDto;
import com.example.shop.entity.Product;
import com.example.shop.entity.Review;
import com.example.shop.entity.User;
import com.example.shop.repository.ProductRepository;
import com.example.shop.repository.ReviewRepository;
import com.example.shop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewService {
    
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    
    /**
     * 리뷰 작성
     */
    @Transactional
    public ReviewDto.Response createReview(Long userId, ReviewDto.Request request) {
        // 사용자 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + userId));
        
        // 상품 조회
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다: " + request.getProductId()));
        
        // 중복 리뷰 체크
        if (reviewRepository.existsByUserIdAndProductId(userId, request.getProductId())) {
            throw new RuntimeException("이미 해당 상품에 대한 리뷰를 작성하셨습니다.");
        }
        
        // 평점 유효성 검사
        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new RuntimeException("평점은 1~5점 사이여야 합니다.");
        }
        
        // 리뷰 생성
        Review review = Review.builder()
                .rating(request.getRating())
                .comment(request.getComment())
                .user(user)
                .product(product)
                .build();
        
        Review savedReview = reviewRepository.save(review);
        return convertToDto(savedReview);
    }
    
    /**
     * 리뷰 수정
     */
    @Transactional
    public ReviewDto.Response updateReview(Long reviewId, Long userId, ReviewDto.UpdateRequest request) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("리뷰를 찾을 수 없습니다: " + reviewId));
        
        // 작성자 확인
        if (!review.getUser().getId().equals(userId)) {
            throw new RuntimeException("본인이 작성한 리뷰만 수정할 수 있습니다.");
        }
        
        // 평점 유효성 검사
        if (request.getRating() != null && (request.getRating() < 1 || request.getRating() > 5)) {
            throw new RuntimeException("평점은 1~5점 사이여야 합니다.");
        }
        
        // 리뷰 수정
        if (request.getRating() != null) {
            review.setRating(request.getRating());
        }
        if (request.getComment() != null) {
            review.setComment(request.getComment());
        }
        
        Review updatedReview = reviewRepository.save(review);
        return convertToDto(updatedReview);
    }
    
    /**
     * 리뷰 삭제
     */
    @Transactional
    public void deleteReview(Long reviewId, Long userId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("리뷰를 찾을 수 없습니다: " + reviewId));
        
        // 작성자 확인
        if (!review.getUser().getId().equals(userId)) {
            throw new RuntimeException("본인이 작성한 리뷰만 삭제할 수 있습니다.");
        }
        
        reviewRepository.delete(review);
    }
    
    /**
     * 상품별 리뷰 조회 (페이징)
     */
    public ReviewDto.ListResponse getProductReviews(Long productId, Pageable pageable) {
        Page<Review> reviewPage = reviewRepository.findByProductIdOrderByCreatedAtDesc(productId, pageable);
        
        List<ReviewDto.Response> reviews = reviewPage.getContent().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        
        double averageRating = calculateAverageRating(productId);
        
        return ReviewDto.ListResponse.builder()
                .reviews(reviews)
                .totalPages(reviewPage.getTotalPages())
                .totalElements(reviewPage.getTotalElements())
                .currentPage(reviewPage.getNumber())
                .size(reviewPage.getSize())
                .hasNext(reviewPage.hasNext())
                .hasPrevious(reviewPage.hasPrevious())
                .averageRating(averageRating)
                .build();
    }
    
    /**
     * 사용자별 리뷰 조회 (페이징)
     */
    public ReviewDto.ListResponse getUserReviews(Long userId, Pageable pageable) {
        Page<Review> reviewPage = reviewRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        
        List<ReviewDto.Response> reviews = reviewPage.getContent().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        
        return ReviewDto.ListResponse.builder()
                .reviews(reviews)
                .totalPages(reviewPage.getTotalPages())
                .totalElements(reviewPage.getTotalElements())
                .currentPage(reviewPage.getNumber())
                .size(reviewPage.getSize())
                .hasNext(reviewPage.hasNext())
                .hasPrevious(reviewPage.hasPrevious())
                .averageRating(0.0) // 사용자별 조회에서는 평균 평점이 의미가 없음
                .build();
    }
    
    /**
     * 특정 리뷰 조회
     */
    public ReviewDto.Response getReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("리뷰를 찾을 수 없습니다: " + reviewId));
        
        return convertToDto(review);
    }
    
    /**
     * 상품의 평균 평점 계산
     */
    public double calculateAverageRating(Long productId) {
        Double average = reviewRepository.findAverageRatingByProductId(productId);
        return average != null ? Math.round(average * 10) / 10.0 : 0.0;
    }
    
    /**
     * 상품의 리뷰 통계 조회
     */
    public ReviewDto.RatingStats getProductRatingStats(Long productId) {
        // 평균 평점
        double averageRating = calculateAverageRating(productId);
        
        // 총 리뷰 개수
        long totalReviews = reviewRepository.countByProductId(productId);
        
        // 평점별 개수 초기화 (1-5점)
        long[] ratingCounts = new long[5];
        Arrays.fill(ratingCounts, 0);
        
        // 평점별 개수 조회
        List<Object[]> ratingData = reviewRepository.countByProductIdGroupByRating(productId);
        for (Object[] data : ratingData) {
            Integer rating = (Integer) data[0];
            Long count = (Long) data[1];
            if (rating >= 1 && rating <= 5) {
                ratingCounts[rating - 1] = count; // 1점 -> index 0, 2점 -> index 1, ...
            }
        }
        
        return ReviewDto.RatingStats.builder()
                .averageRating(averageRating)
                .totalReviews(totalReviews)
                .ratingCounts(ratingCounts)
                .build();
    }
    
    /**
     * 사용자가 특정 상품에 리뷰를 작성했는지 확인
     */
    public boolean hasUserReviewedProduct(Long userId, Long productId) {
        return reviewRepository.existsByUserIdAndProductId(userId, productId);
    }
    
    /**
     * Review Entity를 DTO로 변환
     */
    private ReviewDto.Response convertToDto(Review review) {
        return ReviewDto.Response.builder()
                .id(review.getId())
                .rating(review.getRating())
                .comment(review.getComment())
                .productId(review.getProduct().getId())
                .productName(review.getProduct().getName())
                .userId(review.getUser().getId())
                .userName(review.getUser().getName())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .build();
    }
}
