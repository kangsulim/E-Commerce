package com.example.shop.repository;

import com.example.shop.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // 이메일로 사용자 조회
    Optional<User> findByEmail(String email);
    
    // 이메일 존재 여부 확인
    boolean existsByEmail(String email);
    
    // 활성 사용자만 조회
    Optional<User> findByEmailAndIsActiveTrue(String email);
    
    // 활성 사용자 목록
    List<User> findByIsActiveTrue();
    
    // 관리자용: 전체 사용자 조회 (페이징, 생성일 역순)
    Page<User> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
