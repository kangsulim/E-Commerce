package com.example.shop.controller;

import com.example.shop.dto.CategoryDto;
import com.example.shop.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Category", description = "카테고리 관리 API")
public class CategoryController {
    
    private final CategoryService categoryService;
    
    @Operation(summary = "카테고리 생성", description = "새로운 카테고리를 생성합니다")
    @PostMapping
    public ResponseEntity<CategoryDto.Response> createCategory(@Valid @RequestBody CategoryDto.Request request) {
        CategoryDto.Response response = categoryService.createCategory(request);
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "모든 카테고리 조회", description = "모든 카테고리 목록을 조회합니다")
    @GetMapping
    public ResponseEntity<List<CategoryDto.Response>> getAllCategories() {
        List<CategoryDto.Response> responses = categoryService.getAllCategories();
        return ResponseEntity.ok(responses);
    }
    
    @Operation(summary = "카테고리 조회", description = "카테고리 ID로 카테고리를 조회합니다")
    @GetMapping("/{categoryId}")
    public ResponseEntity<CategoryDto.Response> getCategory(@PathVariable Long categoryId) {
        CategoryDto.Response response = categoryService.getCategoryById(categoryId);
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "카테고리명으로 조회", description = "카테고리명으로 카테고리를 조회합니다")
    @GetMapping("/name/{name}")
    public ResponseEntity<CategoryDto.Response> getCategoryByName(@PathVariable String name) {
        CategoryDto.Response response = categoryService.getCategoryByName(name);
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "카테고리 수정", description = "카테고리 정보를 수정합니다")
    @PutMapping("/{categoryId}")
    public ResponseEntity<CategoryDto.Response> updateCategory(
            @PathVariable Long categoryId,
            @Valid @RequestBody CategoryDto.UpdateRequest request) {
        CategoryDto.Response response = categoryService.updateCategory(categoryId, request);
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "카테고리 삭제", description = "카테고리를 삭제합니다")
    @DeleteMapping("/{categoryId}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long categoryId) {
        categoryService.deleteCategory(categoryId);
        return ResponseEntity.ok().build();
    }
    
    @Operation(summary = "카테고리명 중복 체크", description = "카테고리명 중복 여부를 확인합니다")
    @GetMapping("/check-name/{name}")
    public ResponseEntity<Boolean> checkCategoryNameExists(@PathVariable String name) {
        boolean exists = categoryService.isCategoryNameExists(name);
        return ResponseEntity.ok(exists);
    }
}
