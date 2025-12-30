package com.advo.desk.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Service for handling file uploads, specifically for enrollment documents
 */
@Service
public class FileUploadService {

    @Value("${file.upload.dir:uploads/enrollment-documents}")
    private String uploadDir;

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final String[] ALLOWED_EXTENSIONS = { ".pdf" };

    /**
     * Upload enrollment document
     * 
     * @param file   The multipart file to upload
     * @param userId The user ID for filename generation
     * @return The relative path to the uploaded file
     * @throws IOException if upload fails
     */
    public String uploadEnrollmentDocument(MultipartFile file, Long userId) throws IOException {
        // Validate file
        validateFile(file);

        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String filename = String.format("%d_%s%s", userId, timestamp, extension);

        // Save file
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Return relative path
        return uploadDir + "/" + filename;
    }

    /**
     * Validate uploaded file
     * 
     * @param file The file to validate
     * @throws IllegalArgumentException if validation fails
     */
    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is required");
        }

        // Check file size
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds maximum limit of 5MB");
        }

        // Check file extension
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            throw new IllegalArgumentException("Invalid filename");
        }

        boolean validExtension = false;
        for (String ext : ALLOWED_EXTENSIONS) {
            if (originalFilename.toLowerCase().endsWith(ext)) {
                validExtension = true;
                break;
            }
        }

        if (!validExtension) {
            throw new IllegalArgumentException("Only PDF files are allowed");
        }

        // Check content type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.equals("application/pdf")) {
            throw new IllegalArgumentException("Invalid file type. Only PDF files are allowed");
        }
    }

    /**
     * Delete enrollment document
     * 
     * @param filePath The path to the file to delete
     * @return true if deleted successfully
     */
    public boolean deleteFile(String filePath) {
        try {
            Path path = Paths.get(filePath);
            return Files.deleteIfExists(path);
        } catch (IOException e) {
            return false;
        }
    }

    /**
     * Check if file exists
     * 
     * @param filePath The path to check
     * @return true if file exists
     */
    public boolean fileExists(String filePath) {
        return Files.exists(Paths.get(filePath));
    }
}
