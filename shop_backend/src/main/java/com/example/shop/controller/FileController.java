package com.example.shop.controller;

import com.example.shop.dto.FileDto;
import com.example.shop.service.FileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@Tag(name = "File", description = "파일 업로드/다운로드 API")
public class FileController {
    
    private final FileService fileService;
    
    /**
     * 파일 업로드
     */
    @PostMapping("/upload")
    @Operation(summary = "파일 업로드", description = "이미지 파일을 업로드합니다.")
    public ResponseEntity<FileDto.UploadResponse> uploadFile(
            @Parameter(description = "업로드할 파일")
            @RequestParam("file") MultipartFile file) {
        
        FileDto.UploadResponse response = fileService.uploadFile(file);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * 파일 다운로드/조회
     */
    @GetMapping("/{fileName}")
    @Operation(summary = "파일 다운로드", description = "업로드된 파일을 다운로드하거나 조회합니다.")
    public ResponseEntity<Resource> downloadFile(
            @Parameter(description = "파일명")
            @PathVariable String fileName) {
        
        try {
            Path filePath = fileService.getFilePath(fileName);
            Resource resource = new UrlResource(filePath.toUri());
            
            if (!resource.exists() || !resource.isReadable()) {
                throw new RuntimeException("파일을 읽을 수 없습니다: " + fileName);
            }
            
            // 파일 타입 결정
            String contentType = "application/octet-stream";
            String fileExtension = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
            
            switch (fileExtension) {
                case "jpg", "jpeg" -> contentType = "image/jpeg";
                case "png" -> contentType = "image/png";
                case "gif" -> contentType = "image/gif";
                case "webp" -> contentType = "image/webp";
            }
            
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                    .body(resource);
                    
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * 파일 정보 조회
     */
    @GetMapping("/{fileName}/info")
    @Operation(summary = "파일 정보 조회", description = "파일의 상세 정보를 조회합니다.")
    public ResponseEntity<FileDto.FileInfo> getFileInfo(
            @Parameter(description = "파일명")
            @PathVariable String fileName) {
        
        try {
            FileDto.FileInfo fileInfo = fileService.getFileInfo(fileName);
            return ResponseEntity.ok(fileInfo);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * 파일 삭제
     */
    @DeleteMapping("/{fileName}")
    @Operation(summary = "파일 삭제", description = "업로드된 파일을 삭제합니다.")
    public ResponseEntity<String> deleteFile(
            @Parameter(description = "파일명")
            @PathVariable String fileName) {
        
        boolean deleted = fileService.deleteFile(fileName);
        
        if (deleted) {
            return ResponseEntity.ok("파일이 성공적으로 삭제되었습니다.");
        } else {
            return ResponseEntity.badRequest().body("파일 삭제에 실패했습니다.");
        }
    }
}
