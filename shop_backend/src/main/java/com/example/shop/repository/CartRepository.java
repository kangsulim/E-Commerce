package com.example.shop.repository;

import com.example.shop.entity.Cart;
import com.example.shop.entity.Product;
import com.example.shop.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    
    List<Cart> findByUserId(Long userId);
    
    List<Cart> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    List<Cart> findByUserOrderByCreatedAtDesc(User user);
    
    Optional<Cart> findByUserIdAndProductId(Long userId, Long productId);
    
    Optional<Cart> findByUserAndProduct(User user, Product product);
    
    void deleteByUserId(Long userId);
    
    void deleteByUser(User user);
    
    void deleteByUserIdAndProductId(Long userId, Long productId);
    
    int countByUser(User user);
}
