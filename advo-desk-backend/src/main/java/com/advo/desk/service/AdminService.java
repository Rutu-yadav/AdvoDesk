package com.advo.desk.service;

import com.advo.desk.entity.Advocate;
import com.advo.desk.entity.User;
import com.advo.desk.model.VerificationStatus;
import com.advo.desk.repository.AdvocateRepository;
import com.advo.desk.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service for admin operations
 * Handles advocate approval workflow
 */
@Service
public class AdminService {

    @Autowired
    private AdvocateRepository advocateRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Get all pending advocates awaiting approval
     */
    public List<Advocate> getPendingAdvocates() {
        return advocateRepository.findByVerificationStatus(VerificationStatus.PENDING);
    }

    /**
     * Get all advocates (all statuses)
     */
    public List<Advocate> getAllAdvocates() {
        return advocateRepository.findAll();
    }

    /**
     * Approve an advocate
     * Also creates a User record for data relationships
     */
    public Advocate approveAdvocate(Long advocateId, Long adminId) {
        Advocate advocate = advocateRepository.findById(advocateId)
                .orElseThrow(() -> new RuntimeException("Advocate not found"));

        if (advocate.getVerificationStatus() == VerificationStatus.APPROVED) {
            throw new RuntimeException("Advocate is already approved");
        }

        // Update advocate status
        advocate.setVerificationStatus(VerificationStatus.APPROVED);
        advocate.setVerifiedBy(adminId);
        advocate.setVerifiedAt(LocalDateTime.now());
        advocate.setRejectionReason(null); // Clear any previous rejection reason

        Advocate savedAdvocate = advocateRepository.save(advocate);

        // Create User record for data relationships (if not exists)
        if (!userRepository.existsByUsername(advocate.getUsername())) {
            User user = new User();
            user.setUsername(advocate.getUsername());
            user.setPassword(advocate.getPassword());
            user.setEmail(advocate.getEmail());
            user.setFullName(advocate.getFullName());
            user.setPhone(advocate.getPhone());
            user.setRole(User.Role.ADVOCATE);
            user.setEnrollmentNumber(advocate.getEnrollmentNumber());
            user.setEnrollmentDocumentPath(advocate.getEnrollmentDocumentPath());
            user.setVerificationStatus(VerificationStatus.APPROVED);
            user.setVerifiedBy(adminId);
            user.setVerifiedAt(LocalDateTime.now());
            userRepository.save(user);
        }

        return savedAdvocate;
    }

    /**
     * Reject an advocate with a reason
     */
    public Advocate rejectAdvocate(Long advocateId, Long adminId, String rejectionReason) {
        Advocate advocate = advocateRepository.findById(advocateId)
                .orElseThrow(() -> new RuntimeException("Advocate not found"));

        advocate.setVerificationStatus(VerificationStatus.REJECTED);
        advocate.setVerifiedBy(adminId);
        advocate.setVerifiedAt(LocalDateTime.now());
        advocate.setRejectionReason(rejectionReason);

        return advocateRepository.save(advocate);
    }

    /**
     * Get advocate by ID
     */
    public Advocate getAdvocateById(Long advocateId) {
        return advocateRepository.findById(advocateId)
                .orElseThrow(() -> new RuntimeException("Advocate not found"));
    }
}
