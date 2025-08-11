package com.example.shop.controller;

import com.example.shop.dto.CartDto;
import com.example.shop.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Cart", description = "장바구니 관리 API")
public class CartController {
    
    private final CartService cartService;
    
    @Operation(summary = "장바구니에 상품 추가", description = "사용자의 장바구니에 상품을 추가합니다")
    @PostMapping("/users/{userId}")
    public ResponseEntity<CartDto.Response> addToCart(
            @Parameter(description = "사용자 ID") @PathVariable Long userId,
            @Valid @RequestBody CartDto.Request request) {
        CartDto.Response response = cartService.addToCart(userId, request);
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "장바구니 목록 조회", description = "사용자의 장바구니 목록을 조회합니다")
    @GetMapping("/users/{userId}")
    public ResponseEntity<List<CartDto.Response>> getCartItems(
            @Parameter(description = "사용자 ID") @PathVariable Long userId) {
        List<CartDto.Response> responses = cartService.getCartItems(userId);
        return ResponseEntity.ok(responses);
    }
    
    @Operation(summary = "장바구니 상품 수량 수정", description = "장바구니 상품의 수량을 수정합니다")
    @PutMapping("/users/{userId}/items/{cartId}")
    public ResponseEntity<CartDto.Response> updateCartItem(
            @Parameter(description = "사용자 ID") @PathVariable Long userId,
            @Parameter(description = "장바구니 항목 ID") @PathVariable Long cartId,
            @Valid @RequestBody CartDto.UpdateRequest request) {
        CartDto.Response response = cartService.updateCartItem(userId, cartId, request);
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "장바구니에서 상품 제거", description = "장바구니에서 특정 상품을 제거합니다")
    @DeleteMapping("/users/{userId}/items/{cartId}")
    public ResponseEntity<Void> removeFromCart(
            @Parameter(description = "사용자 ID") @PathVariable Long userId,
            @Parameter(description = "장바구니 항목 ID") @PathVariable Long cartId) {
        cartService.removeFromCart(userId, cartId);
        return ResponseEntity.ok().build();
    }
    
    @Operation(summary = "장바구니 전체 비우기", description = "사용자의 장바구니를 전체 비웁니다")
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> clearCart(
            @Parameter(description = "사용자 ID") @PathVariable Long userId) {
        cartService.clearCart(userId);
        return ResponseEntity.ok().build();
    }
    
    @Operation(summary = "장바구니 항목 수 조회", description = "사용자의 장바구니 항목 수를 조회합니다")
    @GetMapping("/users/{userId}/count")
    public ResponseEntity<Integer> getCartItemCount(
            @Parameter(description = "사용자 ID") @PathVariable Long userId) {
        int count = cartService.getCartItemCount(userId);
        return ResponseEntity.ok(count);
    }
    
    @Operation(summary = "상품이 장바구니에 있는지 확인", description = "특정 상품이 사용자의 장바구니에 있는지 확인합니다")
    @GetMapping("/users/{userId}/products/{productId}/exists")
    public ResponseEntity<Boolean> isProductInCart(
            @Parameter(description = "사용자 ID") @PathVariable Long userId,
            @Parameter(description = "상품 ID") @PathVariable Long productId) {
        boolean exists = cartService.isProductInCart(userId, productId);
        return ResponseEntity.ok(exists);
    }
}
