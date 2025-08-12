package com.example.shop.service;

import com.example.shop.config.FileProperties;
import com.example.shop.dto.FileDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileService {
    
    private final FileProperties fileProperties;
    
    /**
     * 파일 업로드
     */
    public FileDto.UploadResponse uploadFile(MultipartFile file) {
        try {
            // 파일 유효성 검사
            validateFile(file);
            
            // 업로드 디렉토리 생성
            Path uploadPath = Paths.get(fileProperties.getUploadDir()).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);
            
            // 파일명 생성 (UUID + 원본 확장자)
            String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
            String fileExtension = getFileExtension(originalFileName);
            String storedFileName = UUID.randomUUID().toString() + "." + fileExtension;
            
            // 파일 저장
            Path targetLocation = uploadPath.resolve(storedFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            
            // 파일 URL 생성
            String fileUrl = "/api/files/" + storedFileName;
            
            log.info("파일 업로드 성공: {} -> {}", originalFileName, storedFileName);
            
            return FileDto.UploadResponse.builder()
                    .fileName(storedFileName)
                    .originalFileName(originalFileName)
                    .fileUrl(fileUrl)
                    .fileType(file.getContentType())
                    .fileSize(file.getSize())
                    .success(true)
                    .message("파일 업로드가 완료되었습니다.")
                    .build();
                    
        } catch (Exception e) {
            log.error("파일 업로드 실패: {}", e.getMessage(), e);
            return FileDto.UploadResponse.builder()
                    .success(false)
                    .message("파일 업로드에 실패했습니다: " + e.getMessage())
                    .build();
        }
    }
    
    /**
     * 파일 다운로드 (파일 경로 반환)
     */
    public Path getFilePath(String fileName) {
        Path uploadPath = Paths.get(fileProperties.getUploadDir()).toAbsolutePath().normalize();
        Path filePath = uploadPath.resolve(fileName).normalize();
        
        // 보안: 업로드 디렉토리 외부 접근 방지
        if (!filePath.startsWith(uploadPath)) {
            throw new RuntimeException("잘못된 파일 경로입니다.");
        }
        
        if (!Files.exists(filePath)) {
            throw new RuntimeException("파일을 찾을 수 없습니다: " + fileName);
        }
        
        return filePath;
    }
    
    /**
     * 파일 삭제
     */
    public boolean deleteFile(String fileName) {
        try {
            Path filePath = getFilePath(fileName);
            Files.deleteIfExists(filePath);
            log.info("파일 삭제 완료: {}", fileName);
            return true;
        } catch (Exception e) {
            log.error("파일 삭제 실패: {}", e.getMessage(), e);
            return false;
        }
    }
    
    /**
     * 파일 정보 조회
     */
    public FileDto.FileInfo getFileInfo(String fileName) {
        try {
            Path filePath = getFilePath(fileName);
            
            return FileDto.FileInfo.builder()
                    .fileName(fileName)
                    .originalFileName(fileName) // 실제로는 DB에서 조회해야 함
                    .fileUrl("/api/files/" + fileName)
                    .fileType(Files.probeContentType(filePath))
                    .fileSize(Files.size(filePath))
                    .uploadedAt(LocalDateTime.now()) // 실제로는 DB에서 조회해야 함
                    .build();
                    
        } catch (Exception e) {
            throw new RuntimeException("파일 정보 조회 실패: " + e.getMessage());
        }
    }
    
    /**
     * 파일 유효성 검사
     */
    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("빈 파일입니다.");
        }
        
        if (file.getSize() > fileProperties.getMaxFileSize()) {
            throw new RuntimeException("파일 크기가 너무 큽니다. 최대 크기: " + 
                                     fileProperties.getMaxFileSize() / (1024 * 1024) + "MB");
        }
        
        String originalFileName = file.getOriginalFilename();
        if (originalFileName == null || originalFileName.trim().isEmpty()) {
            throw new RuntimeException("파일명이 없습니다.");
        }
        
        String fileExtension = getFileExtension(originalFileName).toLowerCase();
        boolean isAllowedExtension = Arrays.stream(fileProperties.getAllowedExtensions())
                .anyMatch(ext -> ext.equalsIgnoreCase(fileExtension));
                
        if (!isAllowedExtension) {
            throw new RuntimeException("허용되지 않는 파일 형식입니다. 허용되는 형식: " + 
                                     Arrays.toString(fileProperties.getAllowedExtensions()));
        }
    }
    
    /**
     * 파일 확장자 추출
     */
    private String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf(".") + 1);
    }
}
