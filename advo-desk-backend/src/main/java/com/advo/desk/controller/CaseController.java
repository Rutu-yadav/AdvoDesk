package com.advo.desk.controller;

import com.advo.desk.dto.CaseDTO;
import com.advo.desk.entity.Case;
import com.advo.desk.service.CaseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for case management endpoints
 * Admin: View-only access (GET methods)
 * Advocate: Full CRUD access
 */
@RestController
@RequestMapping("/api/cases")
@CrossOrigin(origins = "http://localhost:5173")
public class CaseController {

    @Autowired
    private CaseService caseService;

    /**
     * Get all cases
     * GET /api/cases
     * Admin: sees ALL cases
     * Advocate: sees only THEIR cases
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ADVOCATE')")
    public ResponseEntity<List<CaseDTO>> getAllCases(@RequestParam(required = false) Long advocateId) {
        List<CaseDTO> cases;
        if (advocateId != null) {
            // Filter by advocate ID (for advocates to see only their cases)
            cases = caseService.getCasesByAdvocate(advocateId);
        } else {
            // Admin sees all cases
            cases = caseService.getAllCases();
        }
        return ResponseEntity.ok(cases);
    }

    /**
     * Get case by ID
     * GET /api/cases/{id}
     * Accessible by: ADMIN, ADVOCATE
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ADVOCATE')")
    public ResponseEntity<CaseDTO> getCaseById(@PathVariable Long id) {
        CaseDTO caseDTO = caseService.getCaseById(id);
        return ResponseEntity.ok(caseDTO);
    }

    /**
     * Get cases by client ID
     * GET /api/cases/client/{clientId}
     * Accessible by: ADMIN, ADVOCATE
     */
    @GetMapping("/client/{clientId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ADVOCATE')")
    public ResponseEntity<List<CaseDTO>> getCasesByClientId(@PathVariable Long clientId) {
        List<CaseDTO> cases = caseService.getCasesByClientId(clientId);
        return ResponseEntity.ok(cases);
    }

    /**
     * Get cases by status
     * GET /api/cases/status/{status}
     * Accessible by: ADMIN, ADVOCATE
     */
    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ADVOCATE')")
    public ResponseEntity<List<CaseDTO>> getCasesByStatus(@PathVariable Case.CaseStatus status) {
        List<CaseDTO> cases = caseService.getCasesByStatus(status);
        return ResponseEntity.ok(cases);
    }

    /**
     * Create new case
     * POST /api/cases
     * Accessible by: ADVOCATE only
     */
    @PostMapping
    @PreAuthorize("hasRole('ADVOCATE')")
    public ResponseEntity<CaseDTO> createCase(@Valid @RequestBody CaseDTO caseDTO) {
        CaseDTO createdCase = caseService.createCase(caseDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCase);
    }

    /**
     * Update case
     * PUT /api/cases/{id}
     * Accessible by: ADVOCATE only
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADVOCATE')")
    public ResponseEntity<CaseDTO> updateCase(@PathVariable Long id, @Valid @RequestBody CaseDTO caseDTO) {
        CaseDTO updatedCase = caseService.updateCase(id, caseDTO);
        return ResponseEntity.ok(updatedCase);
    }

    /**
     * Delete case
     * DELETE /api/cases/{id}
     * Accessible by: ADVOCATE only
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADVOCATE')")
    public ResponseEntity<String> deleteCase(@PathVariable Long id) {
        caseService.deleteCase(id);
        return ResponseEntity.ok("Case deleted successfully");
    }
}
