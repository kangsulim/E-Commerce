package com.example.shop.service;

import com.example.shop.dto.CategoryDto;
import com.example.shop.entity.Category;
import com.example.shop.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class CategoryService {
    
    private final CategoryRepository categoryRepository;
    
    /**
     * 카테고리 생성
     */
    public CategoryDto.Response createCategory(CategoryDto.Request request) {
        log.info("카테고리 생성 시도: name={}", request.getName());
        
        // 카테고리명 중복 체크
        if (categoryRepository.existsByName(request.getName())) {
            throw new IllegalArgumentException("이미 존재하는 카테고리명입니다: " + request.getName());
        }
        
        Category category = Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();
        
        Category savedCategory = categoryRepository.save(category);
        log.info("카테고리 생성 완료: categoryId={}, name={}", savedCategory.getId(), savedCategory.getName());
        
        return CategoryDto.Response.from(savedCategory);
    }
    
    /**
     * 모든 카테고리 조회
     */
    @Transactional(readOnly = true)
    public List<CategoryDto.Response> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return categories.stream()
                .map(CategoryDto.Response::from)
                .collect(Collectors.toList());
    }
    
    /**
     * 카테고리 ID로 조회
     */
    @Transactional(readOnly = true)
    public CategoryDto.Response getCategoryById(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 카테고리입니다: " + categoryId));
        
        return CategoryDto.Response.from(category);
    }
    
    /**
     * 카테고리명으로 조회
     */
    @Transactional(readOnly = true)
    public CategoryDto.Response getCategoryByName(String name) {
        Category category = categoryRepository.findByName(name)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 카테고리명입니다: " + name));
        
        return CategoryDto.Response.from(category);
    }
    
    /**
     * 카테고리 수정
     */
    public CategoryDto.Response updateCategory(Long categoryId, CategoryDto.UpdateRequest request) {
        log.info("카테고리 수정 시도: categoryId={}", categoryId);
        
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 카테고리입니다: " + categoryId));
        
        // 카테고리명 변경 시 중복 체크
        if (request.getName() != null && !request.getName().equals(category.getName())) {
            if (categoryRepository.existsByName(request.getName())) {
                throw new IllegalArgumentException("이미 존재하는 카테고리명입니다: " + request.getName());
            }
            category.setName(request.getName());
        }
        
        if (request.getDescription() != null) {
            category.setDescription(request.getDescription());
        }
        
        Category updatedCategory = categoryRepository.save(category);
        log.info("카테고리 수정 완료: categoryId={}, name={}", updatedCategory.getId(), updatedCategory.getName());
        
        return CategoryDto.Response.from(updatedCategory);
    }
    
    /**
     * 카테고리 삭제
     */
    public void deleteCategory(Long categoryId) {
        log.info("카테고리 삭제 시도: categoryId={}", categoryId);
        
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 카테고리입니다: " + categoryId));
        
        // 카테고리에 속한 상품이 있는지 확인
        if (!category.getProducts().isEmpty()) {
            throw new IllegalArgumentException("해당 카테고리에 상품이 존재합니다. 먼저 상품을 다른 카테고리로 이동하거나 삭제해주세요.");
        }
        
        categoryRepository.delete(category);
        log.info("카테고리 삭제 완료: categoryId={}", categoryId);
    }
    
    /**
     * 카테고리명 중복 체크
     */
    @Transactional(readOnly = true)
    public boolean isCategoryNameExists(String name) {
        return categoryRepository.existsByName(name);
    }
}
