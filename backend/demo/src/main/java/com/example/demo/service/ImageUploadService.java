package com.example.demo.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.demo.exception.BadRequestException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ImageUploadService {
    
    private final Cloudinary cloudinary;
    private static final long MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
    private static final String[] ALLOWED_FILE_TYPES = {"image/jpeg", "image/png"};
    
    public String uploadImage(MultipartFile file, String folder) {
        validateImage(file);
        
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("folder", folder);
            params.put("resource_type", "auto");
            
            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                params
            );
            return uploadResult.get("secure_url").toString();
        } catch (IOException e) {
            log.error("Error uploading image to Cloudinary", e);
            throw new BadRequestException("Failed to upload image: " + e.getMessage());
        }
    }
    
    private void validateImage(MultipartFile file) {
        // Check if file is empty
        if (file.isEmpty()) {
            throw new BadRequestException("Please select a file to upload");
        }
        
        // Check file size
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BadRequestException("File size exceeds maximum limit of 2MB");
        }
        
        // Check file type
        String contentType = file.getContentType();
        if (contentType == null || !Arrays.asList(ALLOWED_FILE_TYPES).contains(contentType)) {
            throw new BadRequestException("Only JPEG and PNG files are allowed");
        }
    }
    
    public void deleteImage(String imageUrl) {
        try {
            // Extract public ID from URL
            String publicId = extractPublicIdFromUrl(imageUrl);
            if (publicId != null) {
                cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            }
        } catch (IOException e) {
            log.error("Error deleting image from Cloudinary", e);
        }
    }
    
    private String extractPublicIdFromUrl(String imageUrl) {
        // Example URL: https://res.cloudinary.com/your-cloud/image/upload/v1234567/folder/image.jpg
        if (imageUrl == null || !imageUrl.contains("/upload/")) {
            return null;
        }
        String[] parts = imageUrl.split("/upload/");
        if (parts.length < 2) {
            return null;
        }
        String filename = parts[1];
        // Remove version number if exists
        if (filename.startsWith("v")) {
            filename = filename.replaceFirst("v\\d+/", "");
        }
        // Remove file extension
        return filename.substring(0, filename.lastIndexOf('.'));
    }
} 