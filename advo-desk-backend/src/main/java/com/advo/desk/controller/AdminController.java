package com.advo.desk.controller;

import com.advo.desk.dto.ApprovalRequest;
import com.advo.desk.entity.Advocate;
import com.advo.desk.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

/**
 * Controller for admin operations
 * Handles advocate approval workflow
 */
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    /**
     * Get all pending advocates awaiting approval
     */
    @GetMapping("/advocates/pending")
    public ResponseEntity<List<Advocate>> getPendingAdvocates() {
        List<Advocate> pendingAdvocates = adminService.getPendingAdvocates();
        return ResponseEntity.ok(pendingAdvocates);
    }

    /**
     * Get all advocates
     */
    @GetMapping("/advocates")
    public ResponseEntity<List<Advocate>> getAllAdvocates() {
        List<Advocate> advocates = adminService.getAllAdvocates();
        return ResponseEntity.ok(advocates);
    }

    /**
     * Get advocate by ID
     */
    @GetMapping("/advocates/{id}")
    public ResponseEntity<Advocate> getAdvocateById(@PathVariable Long id) {
        Advocate advocate = adminService.getAdvocateById(id);
        return ResponseEntity.ok(advocate);
    }

    /**
     * Approve an advocate
     */
    @PostMapping("/advocates/approve")
    public ResponseEntity<?> approveAdvocate(@RequestBody ApprovalRequest request) {
        try {
            Advocate approved = adminService.approveAdvocate(request.getAdvocateId(), request.getAdminId());
            return ResponseEntity.ok(approved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Reject an advocate
     */
    @PostMapping("/advocates/reject")
    public ResponseEntity<?> rejectAdvocate(@RequestBody ApprovalRequest request) {
        try {
            Advocate rejected = adminService.rejectAdvocate(
                    request.getAdvocateId(),
                    request.getAdminId(),
                    request.getRejectionReason());
            return ResponseEntity.ok(rejected);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * View enrollment document for an advocate
     */
    @GetMapping("/advocates/{id}/enrollment-doc")
    public ResponseEntity<Resource> getEnrollmentDocument(@PathVariable Long id) {
        try {
            Advocate advocate = adminService.getAdvocateById(id);
            if (advocate.getEnrollmentDocumentPath() == null) {
                return ResponseEntity.notFound().build();
            }

            Path filePath = Paths.get(advocate.getEnrollmentDocumentPath()).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() || resource.isReadable()) {
                String contentType = Files.probeContentType(filePath);
                if (contentType == null) {
                    contentType = MediaType.APPLICATION_PDF_VALUE;
                }

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
