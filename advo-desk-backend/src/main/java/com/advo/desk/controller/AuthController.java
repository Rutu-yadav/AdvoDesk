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
            @RequestParam(value = "address", required = false) String address,
            @RequestParam(value = "city", required = false) String city,
            @RequestParam(value = "state", required = false) String state,
            @RequestParam(value = "pincode", required = false) String pincode,
            @RequestParam(value = "enrollmentNumber", required = false) String enrollmentNumber,
            @RequestParam(value = "enrollmentDocument", required = false) MultipartFile enrollmentDocument,
            @RequestParam(value = "profilePhoto", required = false) MultipartFile profilePhoto,
            @RequestParam(value = "aadharDocument", required = false) MultipartFile aadharDocument,
            @RequestParam(value = "panDocument", required = false) MultipartFile panDocument) {

        // Create register request
        RegisterRequest request = new RegisterRequest();
        request.setUsername(username);
        request.setPassword(password);
        request.setEmail(email);
        request.setFullName(fullName);
        request.setRole(RegisterRequest.Role.valueOf(role));
        request.setPhone(phone);
        request.setAddress(address);
        request.setCity(city);
        request.setState(state);
        request.setPincode(pincode);
        request.setEnrollmentNumber(enrollmentNumber);

        // Register user with documents if provided
        Object registeredUser = authService.register(request, enrollmentDocument, profilePhoto, aadharDocument,
                panDocument);

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
