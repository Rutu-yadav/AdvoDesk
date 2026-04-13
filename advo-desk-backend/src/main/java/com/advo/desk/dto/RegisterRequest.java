package com.advo.desk.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for user registration
 * Supports ADMIN, ADVOCATE and CLIENT roles
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    public enum Role {
        ADMIN,
        ADVOCATE,
        CLIENT
    }

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotNull(message = "Role is required")
    private Role role;

    private String phone;
    private String enrollmentNumber; // Required for ADVOCATE role

    // Client-specific fields
    private String address;
    private String city;
    private String state;
    private String pincode;
}
