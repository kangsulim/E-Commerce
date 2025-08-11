package com.example.shop.service;

import com.example.shop.dto.CartDto;
import com.example.shop.entity.Cart;
import com.example.shop.entity.Product;
import com.example.shop.entity.User;
import com.example.shop.repository.CartRepository;
import com.example.shop.repository.ProductRepository;
import com.example.shop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class CartService {
    
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    
    /**
     * 장바구니에 상품 추가
     */
    public CartDto.Response addToCart(Long userId, CartDto.Request request) {
        log.info("장바구니에 상품 추가 시도: userId={}, productId={}, quantity={}", 
                userId, request.getProductId(), request.getQuantity());
        
        // 사용자 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다: " + userId));
        
        // 상품 조회
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 상품입니다: " + request.getProductId()));
        
        // 상품 활성화 상태 확인
        if (!product.getIsActive()) {
            throw new IllegalArgumentException("비활성화된 상품입니다");
        }
        
        // 재고 확인
        if (product.getStockQuantity() < request.getQuantity()) {
            throw new IllegalArgumentException("재고가 부족합니다. 현재 재고: " + product.getStockQuantity());
        }
        
        // 이미 장바구니에 있는지 확인
        Optional<Cart> existingCart = cartRepository.findByUserAndProduct(user, product);
        
        Cart cart;
        if (existingCart.isPresent()) {
            // 이미 존재하면 수량 증가
            cart = existingCart.get();
            int newQuantity = cart.getQuantity() + request.getQuantity();
            
            // 새로운 수량으로 재고 확인
            if (product.getStockQuantity() < newQuantity) {
                throw new IllegalArgumentException("재고가 부족합니다. 현재 재고: " + product.getStockQuantity() + 
                        ", 장바구니 수량: " + cart.getQuantity());
            }
            
            cart.setQuantity(newQuantity);
            log.info("기존 장바구니 상품 수량 증가: cartId={}, newQuantity={}", cart.getId(), newQuantity);
        } else {
            // 새로 추가
            cart = Cart.builder()
                    .user(user)
                    .product(product)
                    .quantity(request.getQuantity())
                    .build();
            log.info("새 상품 장바구니 추가");
        }
        
        Cart savedCart = cartRepository.save(cart);
        log.info("장바구니 추가 완료: cartId={}", savedCart.getId());
        
        return CartDto.Response.from(savedCart);
    }
    
    /**
     * 사용자의 장바구니 목록 조회
     */
    @Transactional(readOnly = true)
    public List<CartDto.Response> getCartItems(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다: " + userId));
        
        List<Cart> cartItems = cartRepository.findByUserOrderByCreatedAtDesc(user);
        return cartItems.stream()
                .map(CartDto.Response::from)
                .collect(Collectors.toList());
    }
    
    /**
     * 장바구니 상품 수량 수정
     */
    public CartDto.Response updateCartItem(Long userId, Long cartId, CartDto.UpdateRequest request) {
        log.info("장바구니 상품 수량 수정 시도: userId={}, cartId={}, quantity={}", 
                userId, cartId, request.getQuantity());
        
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 장바구니 항목입니다: " + cartId));
        
        // 사용자 권한 확인
        if (!cart.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("해당 장바구니 항목에 대한 권한이 없습니다");
        }
        
        // 재고 확인
        if (cart.getProduct().getStockQuantity() < request.getQuantity()) {
            throw new IllegalArgumentException("재고가 부족합니다. 현재 재고: " + cart.getProduct().getStockQuantity());
        }
        
        cart.setQuantity(request.getQuantity());
        Cart updatedCart = cartRepository.save(cart);
        
        log.info("장바구니 상품 수량 수정 완료: cartId={}, newQuantity={}", cartId, request.getQuantity());
        
        return CartDto.Response.from(updatedCart);
    }
    
    /**
     * 장바구니에서 상품 제거
     */
    public void removeFromCart(Long userId, Long cartId) {
        log.info("장바구니에서 상품 제거 시도: userId={}, cartId={}", userId, cartId);
        
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 장바구니 항목입니다: " + cartId));
        
        // 사용자 권한 확인
        if (!cart.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("해당 장바구니 항목에 대한 권한이 없습니다");
        }
        
        cartRepository.delete(cart);
        log.info("장바구니에서 상품 제거 완료: cartId={}", cartId);
    }
    
    /**
     * 사용자의 장바구니 전체 비우기
     */
    public void clearCart(Long userId) {
        log.info("장바구니 전체 비우기 시도: userId={}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다: " + userId));
        
        cartRepository.deleteByUser(user);
        log.info("장바구니 전체 비우기 완료: userId={}", userId);
    }
    
    /**
     * 장바구니 항목 수 조회
     */
    @Transactional(readOnly = true)
    public int getCartItemCount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다: " + userId));
        
        return cartRepository.countByUser(user);
    }
    
    /**
     * 특정 상품이 장바구니에 있는지 확인
     */
    @Transactional(readOnly = true)
    public boolean isProductInCart(Long userId, Long productId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다: " + userId));
        
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 상품입니다: " + productId));
        
        return cartRepository.findByUserAndProduct(user, product).isPresent();
    }
}
