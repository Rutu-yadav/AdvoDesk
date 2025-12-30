package com.advo.desk.controller;

import com.advo.desk.entity.Advocate;
import com.advo.desk.model.VerificationStatus;
import com.advo.desk.repository.AdvocateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST Controller for admin verification operations
 */
@RestController
@RequestMapping("/api/admin/verification")
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174" })
public class VerificationController {

    @Autowired
    private AdvocateRepository advocateRepository;

    /**
     * Get all pending advocate verifications
     */
    @GetMapping("/pending")
    public ResponseEntity<List<Advocate>> getPendingVerifications() {
        List<Advocate> pendingAdvocates = advocateRepository.findByVerificationStatus(VerificationStatus.PENDING);
        return ResponseEntity.ok(pendingAdvocates);
    }

    /**
     * Get verification history (all advocates)
     */
    @GetMapping("/history")
    public ResponseEntity<List<Advocate>> getVerificationHistory() {
        List<Advocate> allAdvocates = advocateRepository.findAll();
        return ResponseEntity.ok(allAdvocates);
    }

    /**
     * Approve advocate verification
     */
    @PostMapping("/approve/{userId}")
    public ResponseEntity<Map<String, Object>> approveAdvocate(@PathVariable Long userId) {
        Advocate advocate = advocateRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Advocate not found"));

        advocate.setVerificationStatus(VerificationStatus.APPROVED);
        advocate.setVerifiedAt(LocalDateTime.now());

        advocateRepository.save(advocate);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Advocate approved successfully");
        response.put("userId", advocate.getId());
        response.put("username", advocate.getUsername());
        response.put("status", advocate.getVerificationStatus().name());

        return ResponseEntity.ok(response);
    }

    /**
     * Reject advocate verification
     */
    @PostMapping("/reject/{userId}")
    public ResponseEntity<Map<String, Object>> rejectAdvocate(
            @PathVariable Long userId,
            @RequestBody Map<String, String> body) {

        Advocate advocate = advocateRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Advocate not found"));

        String rejectionReason = body.get("reason");
        if (rejectionReason == null || rejectionReason.trim().isEmpty()) {
            throw new RuntimeException("Rejection reason is required");
        }

        advocate.setVerificationStatus(VerificationStatus.REJECTED);
        advocate.setRejectionReason(rejectionReason);
        advocate.setVerifiedAt(LocalDateTime.now());

        advocateRepository.save(advocate);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Advocate rejected successfully");
        response.put("userId", advocate.getId());
        response.put("username", advocate.getUsername());
        response.put("status", advocate.getVerificationStatus().name());
        response.put("reason", rejectionReason);

        return ResponseEntity.ok(response);
    }

    /**
     * Get pending verification count
     */
    @GetMapping("/pending/count")
    public ResponseEntity<Map<String, Long>> getPendingCount() {
        long count = advocateRepository.findByVerificationStatus(VerificationStatus.PENDING).size();

        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }
}
