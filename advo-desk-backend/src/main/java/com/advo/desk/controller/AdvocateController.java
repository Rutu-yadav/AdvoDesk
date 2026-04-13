package com.advo.desk.controller;

import com.advo.desk.entity.Advocate;
import com.advo.desk.repository.AdvocateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for Advocate related APIs
 */
@RestController
@RequestMapping("/api/advocates")
@CrossOrigin(origins = "http://localhost:5173")
public class AdvocateController {

    @Autowired
    private AdvocateRepository advocateRepository;

    /**
     * Get all advocates (for client dashboard)
     */
    @GetMapping
    public ResponseEntity<List<Advocate>> getAllAdvocates() {
        List<Advocate> advocates = advocateRepository.findAll();
        return ResponseEntity.ok(advocates);
    }

    /**
     * ✅ Get advocate by ID (for profile view)
     */
    @GetMapping("/{id}")
    public ResponseEntity<Advocate> getAdvocateById(@PathVariable Long id) {
        Advocate advocate = advocateRepository.findById(id).orElse(null);
        return ResponseEntity.ok(advocate);
    }
}