package com.example.shop.service;

import com.example.shop.dto.UserDto;
import com.example.shop.entity.User;
import com.example.shop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    /**
     * 회원가입
     */
    public UserDto.Response createUser(UserDto.Request request) {
        log.info("회원가입 시도: email={}", request.getEmail());
        
        // 이메일 중복 체크
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다: " + request.getEmail());
        }
        
        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(request.getPassword());
        
        // 사용자 생성
        User user = User.builder()
                .email(request.getEmail())
                .password(encodedPassword)
                .name(request.getName())
                .phone(request.getPhone())
                .address(request.getAddress())
                .role(User.Role.USER)
                .isActive(true)
                .build();
        
        User savedUser = userRepository.save(user);
        log.info("회원가입 완료: userId={}, email={}", savedUser.getId(), savedUser.getEmail());
        
        return UserDto.Response.from(savedUser);
    }
    
    /**
     * 로그인 (이메일과 비밀번호 검증)
     */
    @Transactional(readOnly = true)
    public UserDto.Response login(UserDto.LoginRequest request) {
        log.info("로그인 시도: email={}", request.getEmail());
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 이메일입니다: " + request.getEmail()));
        
        if (!user.getIsActive()) {
            throw new IllegalArgumentException("비활성화된 계정입니다");
        }
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 올바르지 않습니다");
        }
        
        log.info("로그인 성공: userId={}, email={}", user.getId(), user.getEmail());
        return UserDto.Response.from(user);
    }
    
    /**
     * 사용자 정보 조회
     */
    @Transactional(readOnly = true)
    public UserDto.Response getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다: " + userId));
        
        return UserDto.Response.from(user);
    }
    
    /**
     * 이메일로 사용자 조회
     */
    @Transactional(readOnly = true)
    public UserDto.Response getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 이메일입니다: " + email));
        
        return UserDto.Response.from(user);
    }
    
    /**
     * 모든 사용자 목록 조회 (관리자용)
     */
    @Transactional(readOnly = true)
    public List<UserDto.Response> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(UserDto.Response::from)
                .collect(Collectors.toList());
    }
    
    /**
     * 활성 사용자 목록 조회
     */
    @Transactional(readOnly = true)
    public List<UserDto.Response> getActiveUsers() {
        List<User> users = userRepository.findByIsActiveTrue();
        return users.stream()
                .map(UserDto.Response::from)
                .collect(Collectors.toList());
    }
    
    /**
     * 사용자 정보 수정
     */
    public UserDto.Response updateUser(Long userId, UserDto.UpdateRequest request) {
        log.info("사용자 정보 수정: userId={}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다: " + userId));
        
        // null이 아닌 필드만 업데이트
        if (request.getName() != null) {
            user.setName(request.getName());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }
        
        User updatedUser = userRepository.save(user);
        log.info("사용자 정보 수정 완료: userId={}", updatedUser.getId());
        
        return UserDto.Response.from(updatedUser);
    }
    
    /**
     * 사용자 계정 비활성화
     */
    public void deactivateUser(Long userId) {
        log.info("사용자 계정 비활성화: userId={}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다: " + userId));
        
        user.setIsActive(false);
        userRepository.save(user);
        
        log.info("사용자 계정 비활성화 완료: userId={}", userId);
    }
    
    /**
     * 사용자 계정 활성화
     */
    public void activateUser(Long userId) {
        log.info("사용자 계정 활성화: userId={}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다: " + userId));
        
        user.setIsActive(true);
        userRepository.save(user);
        
        log.info("사용자 계정 활성화 완료: userId={}", userId);
    }
    
    /**
     * 이메일 중복 체크
     */
    @Transactional(readOnly = true)
    public boolean isEmailExists(String email) {
        return userRepository.existsByEmail(email);
    }
}
