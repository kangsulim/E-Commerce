package com.example.shop.repository;

import com.example.shop.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    
    List<Cart> findByUserId(Long userId);
    
    Optional<Cart> findByUserIdAndProductId(Long userId, Long productId);
    
    void deleteByUserId(Long userId);
    
    void deleteByUserIdAndProductId(Long userId, Long productId);
}
