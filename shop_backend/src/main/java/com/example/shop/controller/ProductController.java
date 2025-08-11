package com.example.shop.controller;

import com.example.shop.dto.ProductDto;
import com.example.shop.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Product", description = "상품 관리 API")
public class ProductController {
    
    private final ProductService productService;
    
    @Operation(summary = "상품 생성", description = "새로운 상품을 생성합니다")
    @PostMapping
    public ResponseEntity<ProductDto.Response> createProduct(@Valid @RequestBody ProductDto.Request request) {
        ProductDto.Response response = productService.createProduct(request);
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "모든 상품 조회", description = "모든 상품을 페이징으로 조회합니다")
    @GetMapping
    public ResponseEntity<Page<ProductDto.ListResponse>> getAllProducts(
            @Parameter(description = "페이지 번호 (0부터 시작)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "페이지 크기") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "정렬 기준") @RequestParam(defaultValue = "createdAt") String sort,
            @Parameter(description = "정렬 방향") @RequestParam(defaultValue = "desc") String direction) {
        
        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));
        
        Page<ProductDto.ListResponse> responses = productService.getAllProducts(pageable);
        return ResponseEntity.ok(responses);
    }
    
    @Operation(summary = "활성 상품 조회", description = "활성화된 상품을 페이징으로 조회합니다")
    @GetMapping("/active")
    public ResponseEntity<Page<ProductDto.ListResponse>> getActiveProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "desc") String direction) {
        
        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));
        
        Page<ProductDto.ListResponse> responses = productService.getActiveProducts(pageable);
        return ResponseEntity.ok(responses);
    }
    
    @Operation(summary = "상품 상세 조회", description = "상품 ID로 상품 상세 정보를 조회합니다")
    @GetMapping("/{productId}")
    public ResponseEntity<ProductDto.Response> getProduct(@PathVariable Long productId) {
        ProductDto.Response response = productService.getProductById(productId);
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "카테고리별 상품 조회", description = "특정 카테고리의 상품을 조회합니다")
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<Page<ProductDto.ListResponse>> getProductsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "desc") String direction) {
        
        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));
        
        Page<ProductDto.ListResponse> responses = productService.getProductsByCategory(categoryId, pageable);
        return ResponseEntity.ok(responses);
    }
    
    @Operation(summary = "상품 검색", description = "상품명으로 상품을 검색합니다")
    @GetMapping("/search")
    public ResponseEntity<Page<ProductDto.ListResponse>> searchProducts(
            @Parameter(description = "검색 키워드") @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "desc") String direction) {
        
        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));
        
        Page<ProductDto.ListResponse> responses = productService.searchProductsByName(keyword, pageable);
        return ResponseEntity.ok(responses);
    }
    
    @Operation(summary = "가격대별 상품 조회", description = "가격 범위로 상품을 조회합니다")
    @GetMapping("/price-range")
    public ResponseEntity<Page<ProductDto.ListResponse>> getProductsByPriceRange(
            @Parameter(description = "최소 가격") @RequestParam BigDecimal minPrice,
            @Parameter(description = "최대 가격") @RequestParam BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "price") String sort,
            @RequestParam(defaultValue = "asc") String direction) {
        
        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));
        
        Page<ProductDto.ListResponse> responses = productService.getProductsByPriceRange(minPrice, maxPrice, pageable);
        return ResponseEntity.ok(responses);
    }
    
    @Operation(summary = "재고 있는 상품 조회", description = "재고가 있는 상품을 조회합니다")
    @GetMapping("/in-stock")
    public ResponseEntity<Page<ProductDto.ListResponse>> getProductsInStock(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "stockQuantity") String sort,
            @RequestParam(defaultValue = "desc") String direction) {
        
        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));
        
        Page<ProductDto.ListResponse> responses = productService.getProductsInStock(pageable);
        return ResponseEntity.ok(responses);
    }
    
    @Operation(summary = "재고 부족 상품 조회", description = "재고가 부족한 상품을 조회합니다")
    @GetMapping("/low-stock")
    public ResponseEntity<List<ProductDto.ListResponse>> getLowStockProducts(
            @Parameter(description = "재고 임계값") @RequestParam(defaultValue = "10") int threshold) {
        List<ProductDto.ListResponse> responses = productService.getLowStockProducts(threshold);
        return ResponseEntity.ok(responses);
    }
    
    @Operation(summary = "상품 수정", description = "상품 정보를 수정합니다")
    @PutMapping("/{productId}")
    public ResponseEntity<ProductDto.Response> updateProduct(
            @PathVariable Long productId,
            @Valid @RequestBody ProductDto.UpdateRequest request) {
        ProductDto.Response response = productService.updateProduct(productId, request);
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "상품 상태 변경", description = "상품의 활성화/비활성화 상태를 변경합니다")
    @PatchMapping("/{productId}/toggle-status")
    public ResponseEntity<ProductDto.Response> toggleProductStatus(@PathVariable Long productId) {
        ProductDto.Response response = productService.toggleProductStatus(productId);
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "상품 삭제", description = "상품을 삭제(비활성화)합니다")
    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long productId) {
        productService.deleteProduct(productId);
        return ResponseEntity.ok().build();
    }
    
    @Operation(summary = "재고 감소", description = "상품의 재고를 감소시킵니다")
    @PatchMapping("/{productId}/decrease-stock")
    public ResponseEntity<Void> decreaseStock(
            @PathVariable Long productId,
            @Parameter(description = "감소할 수량") @RequestParam int quantity) {
        productService.decreaseStock(productId, quantity);
        return ResponseEntity.ok().build();
    }
    
    @Operation(summary = "재고 증가", description = "상품의 재고를 증가시킵니다")
    @PatchMapping("/{productId}/increase-stock")
    public ResponseEntity<Void> increaseStock(
            @PathVariable Long productId,
            @Parameter(description = "증가할 수량") @RequestParam int quantity) {
        productService.increaseStock(productId, quantity);
        return ResponseEntity.ok().build();
    }
}
