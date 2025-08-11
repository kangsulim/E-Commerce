package com.example.shop.controller;

import com.example.shop.dto.UserDto;
import com.example.shop.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "User", description = "사용자 관리 API")
public class UserController {
    
    private final UserService userService;
    
    @Operation(summary = "회원가입", description = "새로운 사용자를 등록합니다")
    @PostMapping("/register")
    public ResponseEntity<UserDto.Response> register(@Valid @RequestBody UserDto.Request request) {
        UserDto.Response response = userService.createUser(request);
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "로그인", description = "이메일과 비밀번호로 로그인합니다")
    @PostMapping("/login")
    public ResponseEntity<UserDto.Response> login(@Valid @RequestBody UserDto.LoginRequest request) {
        UserDto.Response response = userService.login(request);
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "사용자 정보 조회", description = "사용자 ID로 사용자 정보를 조회합니다")
    @GetMapping("/{userId}")
    public ResponseEntity<UserDto.Response> getUser(@PathVariable Long userId) {
        UserDto.Response response = userService.getUserById(userId);
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "이메일로 사용자 조회", description = "이메일로 사용자 정보를 조회합니다")
    @GetMapping("/email/{email}")
    public ResponseEntity<UserDto.Response> getUserByEmail(@PathVariable String email) {
        UserDto.Response response = userService.getUserByEmail(email);
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "모든 사용자 조회", description = "모든 사용자 목록을 조회합니다 (관리자용)")
    @GetMapping
    public ResponseEntity<List<UserDto.Response>> getAllUsers() {
        List<UserDto.Response> responses = userService.getAllUsers();
        return ResponseEntity.ok(responses);
    }
    
    @Operation(summary = "활성 사용자 조회", description = "활성화된 사용자 목록을 조회합니다")
    @GetMapping("/active")
    public ResponseEntity<List<UserDto.Response>> getActiveUsers() {
        List<UserDto.Response> responses = userService.getActiveUsers();
        return ResponseEntity.ok(responses);
    }
    
    @Operation(summary = "사용자 정보 수정", description = "사용자 정보를 수정합니다")
    @PutMapping("/{userId}")
    public ResponseEntity<UserDto.Response> updateUser(
            @PathVariable Long userId,
            @Valid @RequestBody UserDto.UpdateRequest request) {
        UserDto.Response response = userService.updateUser(userId, request);
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "사용자 계정 비활성화", description = "사용자 계정을 비활성화합니다")
    @PatchMapping("/{userId}/deactivate")
    public ResponseEntity<Void> deactivateUser(@PathVariable Long userId) {
        userService.deactivateUser(userId);
        return ResponseEntity.ok().build();
    }
    
    @Operation(summary = "사용자 계정 활성화", description = "사용자 계정을 활성화합니다")
    @PatchMapping("/{userId}/activate")
    public ResponseEntity<Void> activateUser(@PathVariable Long userId) {
        userService.activateUser(userId);
        return ResponseEntity.ok().build();
    }
    
    @Operation(summary = "이메일 중복 체크", description = "이메일 중복 여부를 확인합니다")
    @GetMapping("/check-email/{email}")
    public ResponseEntity<Boolean> checkEmailExists(@PathVariable String email) {
        boolean exists = userService.isEmailExists(email);
        return ResponseEntity.ok(exists);
    }
}
