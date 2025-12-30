package com.advo.desk.controller;

import com.advo.desk.dto.LoginRequest;
import com.advo.desk.dto.LoginResponse;
import com.advo.desk.dto.RegisterRequest;
import com.advo.desk.entity.Admin;
import com.advo.desk.entity.Advocate;
import com.advo.desk.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

/**
 * REST Controller for authentication endpoints
 * Supports only ADMIN and ADVOCATE roles
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174" })
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * Register a new user with multipart form data
     * Only ADMIN and ADVOCATE roles supported
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(
            @RequestParam("username") String username,
            @RequestParam("password") String password,
            @RequestParam("email") String email,
            @RequestParam("fullName") String fullName,
            @RequestParam("role") String role,
            @RequestParam(value = "phone", required = false) String phone,
            @RequestParam(value = "enrollmentNumber", required = false) String enrollmentNumber,
            @RequestParam(value = "enrollmentDocument", required = false) MultipartFile enrollmentDocument) {

        // Create register request
        RegisterRequest request = new RegisterRequest();
        request.setUsername(username);
        request.setPassword(password);
        request.setEmail(email);
        request.setFullName(fullName);
        request.setRole(RegisterRequest.Role.valueOf(role));
        request.setPhone(phone);
        request.setEnrollmentNumber(enrollmentNumber);

        // Register user with document if provided
        Object registeredUser = authService.register(request, enrollmentDocument);

        Map<String, Object> response = new HashMap<>();

        // Extract user details based on type
        if (registeredUser instanceof Advocate) {
            Advocate advocate = (Advocate) registeredUser;
            response.put("message", "Registration successful. Your account is pending verification by admin.");
            response.put("verificationStatus", advocate.getVerificationStatus().name());
            response.put("userId", advocate.getId());
            response.put("username", advocate.getUsername());
        } else if (registeredUser instanceof Admin) {
            Admin admin = (Admin) registeredUser;
            response.put("message", "Admin registered successfully");
            response.put("userId", admin.getId());
            response.put("username", admin.getUsername());
        }

        return ResponseEntity.ok(response);
    }

    /**
     * Login endpoint
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}
