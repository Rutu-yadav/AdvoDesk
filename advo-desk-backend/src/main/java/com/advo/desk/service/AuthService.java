package com.advo.desk.service;

import com.advo.desk.dto.LoginRequest;
import com.advo.desk.dto.LoginResponse;
import com.advo.desk.dto.RegisterRequest;
import com.advo.desk.entity.Admin;
import com.advo.desk.entity.Advocate;
import com.advo.desk.model.VerificationStatus;
import com.advo.desk.repository.AdminRepository;
import com.advo.desk.repository.AdvocateRepository;
import com.advo.desk.repository.UserRepository;
import com.advo.desk.security.JwtUtil;
import com.advo.desk.validator.EnrollmentValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;

/**
 * Service for authentication operations
 * Supports only ADMIN and ADVOCATE roles
 */
@Service
public class AuthService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private AdvocateRepository advocateRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EnrollmentValidator enrollmentValidator;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileUploadService fileUploadService;

    /**
     * Register a new user - routes to appropriate table based on role
     * Only ADMIN and ADVOCATE roles supported
     */
    public Object register(RegisterRequest request, MultipartFile enrollmentDocument) {
        String role = request.getRole().name();

        switch (role) {
            case "ADMIN":
                return registerAdmin(request);
            case "ADVOCATE":
                return registerAdvocate(request, enrollmentDocument);
            default:
                throw new RuntimeException("Invalid role: " + role);
        }
    }

    private Admin registerAdmin(RegisterRequest request) {
        // Check if username already exists
        if (adminRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        // Check if email already exists
        if (adminRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Admin admin = new Admin();
        admin.setUsername(request.getUsername());
        admin.setPassword(request.getPassword());
        admin.setEmail(request.getEmail());
        admin.setFullName(request.getFullName());
        admin.setPhone(request.getPhone());

        return adminRepository.save(admin);
    }

    private Advocate registerAdvocate(RegisterRequest request, MultipartFile enrollmentDocument) {
        // Check if username already exists
        if (advocateRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        // Check if email already exists
        if (advocateRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Enrollment number is MANDATORY for advocates
        if (request.getEnrollmentNumber() == null || request.getEnrollmentNumber().trim().isEmpty()) {
            throw new RuntimeException("Enrollment number is required for advocate registration");
        }

        // Validate enrollment number format
        String validationMessage = enrollmentValidator.getValidationMessage(request.getEnrollmentNumber());
        if (validationMessage != null) {
            throw new RuntimeException(validationMessage);
        }

        // Check if enrollment number already exists
        if (advocateRepository.existsByEnrollmentNumber(request.getEnrollmentNumber())) {
            throw new RuntimeException("Enrollment number already registered");
        }

        // Enrollment document is MANDATORY for advocates
        if (enrollmentDocument == null || enrollmentDocument.isEmpty()) {
            throw new RuntimeException("Enrollment document is required for advocate registration");
        }

        Advocate advocate = new Advocate();
        advocate.setUsername(request.getUsername());
        advocate.setPassword(request.getPassword());
        advocate.setEmail(request.getEmail());
        advocate.setFullName(request.getFullName());
        advocate.setPhone(request.getPhone());
        advocate.setEnrollmentNumber(request.getEnrollmentNumber());
        // Set status to PENDING - requires admin approval
        advocate.setVerificationStatus(VerificationStatus.PENDING);

        try {
            // Save advocate first to get ID
            Advocate savedAdvocate = advocateRepository.save(advocate);

            // Upload document
            String documentPath = fileUploadService.uploadEnrollmentDocument(enrollmentDocument,
                    savedAdvocate.getId());
            savedAdvocate.setEnrollmentDocumentPath(documentPath);

            return advocateRepository.save(savedAdvocate);
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload enrollment document: " + e.getMessage());
        }
    }

    /**
     * Authenticate user - checks admin and advocate tables only
     * No verification workflow - advocates can login immediately after registration
     */
    public LoginResponse login(LoginRequest request) {
        String username = request.getUsername();
        String password = request.getPassword();

        // Try Admin
        var adminOpt = adminRepository.findByUsername(username);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            if (password.equals(admin.getPassword())) {
                return createLoginResponse(admin.getId(), admin.getUsername(), admin.getEmail(),
                        admin.getFullName(), "ADMIN");
            }
        }

        // Try Advocate
        var advocateOpt = advocateRepository.findByUsername(username);
        if (advocateOpt.isPresent()) {
            Advocate advocate = advocateOpt.get();

            // Check verification status - only APPROVED advocates can login
            if (advocate.getVerificationStatus() != VerificationStatus.APPROVED) {
                if (advocate.getVerificationStatus() == VerificationStatus.PENDING) {
                    throw new RuntimeException("Your account is pending admin approval. Please wait for verification.");
                } else if (advocate.getVerificationStatus() == VerificationStatus.REJECTED) {
                    String reason = advocate.getRejectionReason() != null
                            ? " Reason: " + advocate.getRejectionReason()
                            : "";
                    throw new RuntimeException("Your account has been rejected." + reason);
                }
            }

            if (password.equals(advocate.getPassword())) {
                // Find the corresponding user ID from users table
                var userOpt = userRepository.findByUsername(username);
                Long userId = userOpt.isPresent() ? userOpt.get().getId() : advocate.getId();

                return createLoginResponse(userId, advocate.getUsername(), advocate.getEmail(),
                        advocate.getFullName(), "ADVOCATE");
            }
        }

        throw new RuntimeException("Invalid username or password");
    }

    private LoginResponse createLoginResponse(Long id, String username, String email, String fullName, String role) {
        // Create UserDetails for JWT generation
        UserDetails userDetails = User.builder()
                .username(username)
                .password("") // Not needed for JWT
                .authorities(new ArrayList<>())
                .build();

        String token = jwtUtil.generateToken(userDetails);

        return new LoginResponse(token, id, username, email, fullName, role);
    }
}
