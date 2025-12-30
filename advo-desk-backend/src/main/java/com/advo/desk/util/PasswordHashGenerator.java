package com.advo.desk.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Utility to generate BCrypt password hash for admin user
 * Run this class to generate the password hash for database insertion
 */
public class PasswordHashGenerator {

    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        String password = "admin123";
        String hashedPassword = encoder.encode(password);

        System.out.println("Password: " + password);
        System.out.println("BCrypt Hash: " + hashedPassword);
        System.out.println("\nUse this hash in your SQL INSERT statement:");
        System.out.println("INSERT INTO admins (username, password, email, full_name)");
        System.out.println("VALUES ('admin', '" + hashedPassword + "', 'admin@advodesk.com', 'System Administrator');");
    }
}
