package com.example.shop.service;

import com.example.shop.dto.ProductDto;
import com.example.shop.entity.Category;
import com.example.shop.entity.Product;
import com.example.shop.repository.CategoryRepository;
import com.example.shop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ProductService {
    
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    
    /**
     * 상품 생성
     */
    public ProductDto.Response createProduct(ProductDto.Request request) {
        log.info("상품 생성 시도: name={}, categoryId={}", request.getName(), request.getCategoryId());
        
        // 카테고리 존재 여부 확인
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 카테고리입니다: " + request.getCategoryId()));
        
        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .stockQuantity(request.getStockQuantity())
                .imageUrl(request.getImageUrl())
                .category(category)
                .isActive(true)
                .build();
        
        Product savedProduct = productRepository.save(product);
        log.info("상품 생성 완료: productId={}, name={}", savedProduct.getId(), savedProduct.getName());
        
        return ProductDto.Response.from(savedProduct);
    }
    
    /**
     * 모든 상품 조회 (페이징)
     */
    @Transactional(readOnly = true)
    public Page<ProductDto.ListResponse> getAllProducts(Pageable pageable) {
        Page<Product> products = productRepository.findAll(pageable);
        return products.map(ProductDto.ListResponse::from);
    }
    
    /**
     * 활성 상품 조회 (페이징)
     */
    @Transactional(readOnly = true)
    public Page<ProductDto.ListResponse> getActiveProducts(Pageable pageable) {
        Page<Product> products = productRepository.findByIsActiveTrue(pageable);
        return products.map(ProductDto.ListResponse::from);
    }
    
    /**
     * 상품 ID로 조회
     */
    @Transactional(readOnly = true)
    public ProductDto.Response getProductById(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 상품입니다: " + productId));
        
        return ProductDto.Response.from(product);
    }
    
    /**
     * 카테고리별 상품 조회 (페이징)
     */
    @Transactional(readOnly = true)
    public Page<ProductDto.ListResponse> getProductsByCategory(Long categoryId, Pageable pageable) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 카테고리입니다: " + categoryId));
        
        Page<Product> products = productRepository.findByCategoryAndIsActiveTrue(category, pageable);
        return products.map(ProductDto.ListResponse::from);
    }
    
    /**
     * 상품명으로 검색 (페이징)
     */
    @Transactional(readOnly = true)
    public Page<ProductDto.ListResponse> searchProductsByName(String keyword, Pageable pageable) {
        Page<Product> products = productRepository.findByNameContainingIgnoreCaseAndIsActiveTrue(keyword, pageable);
        return products.map(ProductDto.ListResponse::from);
    }
    
    /**
     * 가격 범위로 상품 검색 (페이징)
     */
    @Transactional(readOnly = true)
    public Page<ProductDto.ListResponse> getProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
        Page<Product> products = productRepository.findByPriceBetweenAndIsActiveTrue(minPrice, maxPrice, pageable);
        return products.map(ProductDto.ListResponse::from);
    }
    
    /**
     * 재고가 있는 상품 조회 (페이징)
     */
    @Transactional(readOnly = true)
    public Page<ProductDto.ListResponse> getProductsInStock(Pageable pageable) {
        Page<Product> products = productRepository.findByStockQuantityGreaterThanAndIsActiveTrue(0, pageable);
        return products.map(ProductDto.ListResponse::from);
    }
    
    /**
     * 상품 수정
     */
    public ProductDto.Response updateProduct(Long productId, ProductDto.UpdateRequest request) {
        log.info("상품 수정 시도: productId={}", productId);
        
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 상품입니다: " + productId));
        
        // null이 아닌 필드만 업데이트
        if (request.getName() != null) {
            product.setName(request.getName());
        }
        if (request.getDescription() != null) {
            product.setDescription(request.getDescription());
        }
        if (request.getPrice() != null) {
            product.setPrice(request.getPrice());
        }
        if (request.getStockQuantity() != null) {
            product.setStockQuantity(request.getStockQuantity());
        }
        if (request.getImageUrl() != null) {
            product.setImageUrl(request.getImageUrl());
        }
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 카테고리입니다: " + request.getCategoryId()));
            product.setCategory(category);
        }
        
        Product updatedProduct = productRepository.save(product);
        log.info("상품 수정 완료: productId={}, name={}", updatedProduct.getId(), updatedProduct.getName());
        
        return ProductDto.Response.from(updatedProduct);
    }
    
    /**
     * 상품 활성화/비활성화
     */
    public ProductDto.Response toggleProductStatus(Long productId) {
        log.info("상품 상태 변경 시도: productId={}", productId);
        
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 상품입니다: " + productId));
        
        product.setIsActive(!product.getIsActive());
        Product updatedProduct = productRepository.save(product);
        
        log.info("상품 상태 변경 완료: productId={}, isActive={}", updatedProduct.getId(), updatedProduct.getIsActive());
        
        return ProductDto.Response.from(updatedProduct);
    }
    
    /**
     * 상품 삭제 (실제로는 비활성화)
     */
    public void deleteProduct(Long productId) {
        log.info("상품 삭제 시도: productId={}", productId);
        
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 상품입니다: " + productId));
        
        product.setIsActive(false);
        productRepository.save(product);
        
        log.info("상품 삭제 완료: productId={}", productId);
    }
    
    /**
     * 재고 감소
     */
    public void decreaseStock(Long productId, int quantity) {
        log.info("재고 감소 시도: productId={}, quantity={}", productId, quantity);
        
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 상품입니다: " + productId));
        
        product.decreaseStock(quantity);
        productRepository.save(product);
        
        log.info("재고 감소 완료: productId={}, 남은재고={}", productId, product.getStockQuantity());
    }
    
    /**
     * 재고 증가
     */
    public void increaseStock(Long productId, int quantity) {
        log.info("재고 증가 시도: productId={}, quantity={}", productId, quantity);
        
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 상품입니다: " + productId));
        
        product.increaseStock(quantity);
        productRepository.save(product);
        
        log.info("재고 증가 완료: productId={}, 현재재고={}", productId, product.getStockQuantity());
    }
    
    /**
     * 재고 부족 상품 조회
     */
    @Transactional(readOnly = true)
    public List<ProductDto.ListResponse> getLowStockProducts(int threshold) {
        List<Product> products = productRepository.findByStockQuantityLessThanAndIsActiveTrue(threshold);
        return products.stream()
                .map(ProductDto.ListResponse::from)
                .collect(Collectors.toList());
    }
}
