package com.example.shop.repository;

import com.example.shop.entity.Category;
import com.example.shop.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    List<Product> findByIsActiveTrueOrderByCreatedAtDesc();
    
    Page<Product> findByIsActiveTrue(Pageable pageable);
    
    List<Product> findByCategoryIdAndIsActiveTrue(Long categoryId);
    
    Page<Product> findByCategoryAndIsActiveTrue(Category category, Pageable pageable);
    
    List<Product> findByNameContainingIgnoreCaseAndIsActiveTrue(String name);
    
    Page<Product> findByNameContainingIgnoreCaseAndIsActiveTrue(String name, Pageable pageable);
    
    Page<Product> findByPriceBetweenAndIsActiveTrue(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);
    
    Page<Product> findByStockQuantityGreaterThanAndIsActiveTrue(int minStock, Pageable pageable);
    
    List<Product> findByStockQuantityLessThanAndIsActiveTrue(int threshold);
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND p.stockQuantity > 0")
    List<Product> findAvailableProducts();
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND p.stockQuantity > :minStock")
    List<Product> findByStockQuantityGreaterThan(@Param("minStock") int minStock);
}
