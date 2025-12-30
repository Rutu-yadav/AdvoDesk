package com.advo.desk;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main application class for AdvoDesk Legal Case Management System
 */
@SpringBootApplication
public class AdvoDeskApplication {

    public static void main(String[] args) {
        SpringApplication.run(AdvoDeskApplication.class, args);
        System.out.println("===========================================");
        System.out.println("AdvoDesk Backend Server Started Successfully");
        System.out.println("Server running at: http://localhost:8080");
        System.out.println("===========================================");
    }
}
