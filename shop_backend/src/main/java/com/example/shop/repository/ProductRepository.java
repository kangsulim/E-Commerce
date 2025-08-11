package com.example.shop.repository;

import com.example.shop.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    List<Product> findByIsActiveTrueOrderByCreatedAtDesc();
    
    List<Product> findByCategoryIdAndIsActiveTrue(Long categoryId);
    
    List<Product> findByNameContainingIgnoreCaseAndIsActiveTrue(String name);
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND p.stockQuantity > 0")
    List<Product> findAvailableProducts();
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND p.stockQuantity > :minStock")
    List<Product> findByStockQuantityGreaterThan(@Param("minStock") int minStock);
}
