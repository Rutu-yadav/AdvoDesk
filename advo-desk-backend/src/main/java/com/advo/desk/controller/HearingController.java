package com.advo.desk.controller;

import com.advo.desk.dto.HearingDTO;
import com.advo.desk.service.HearingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for hearing management endpoints
 * Admin: View-only access (GET methods)
 * Advocate: Full CRUD access
 */
@RestController
@RequestMapping("/api/hearings")
@CrossOrigin(origins = "http://localhost:5173")
public class HearingController {

    @Autowired
    private HearingService hearingService;

    /**
     * Get all hearings
     * GET /api/hearings
     * Admin: sees ALL hearings
     * Advocate: sees only THEIR hearings
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ADVOCATE')")
    public ResponseEntity<List<HearingDTO>> getAllHearings(@RequestParam(required = false) Long advocateId) {
        List<HearingDTO> hearings;
        if (advocateId != null) {
            // Filter by advocate ID (for advocates to see only their hearings)
            hearings = hearingService.getHearingsByAdvocate(advocateId);
        } else {
            // Admin sees all hearings
            hearings = hearingService.getAllHearings();
        }
        return ResponseEntity.ok(hearings);
    }

    /**
     * Get hearing by ID
     * GET /api/hearings/{id}
     * Accessible by: ADMIN, ADVOCATE
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ADVOCATE')")
    public ResponseEntity<HearingDTO> getHearingById(@PathVariable Long id) {
        HearingDTO hearing = hearingService.getHearingById(id);
        return ResponseEntity.ok(hearing);
    }

    /**
     * Get hearings by case ID
     * GET /api/hearings/case/{caseId}
     * Accessible by: ADMIN, ADVOCATE
     */
    @GetMapping("/case/{caseId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ADVOCATE')")
    public ResponseEntity<List<HearingDTO>> getHearingsByCaseId(@PathVariable Long caseId) {
        List<HearingDTO> hearings = hearingService.getHearingsByCaseId(caseId);
        return ResponseEntity.ok(hearings);
    }

    /**
     * Get upcoming hearings
     * GET /api/hearings/upcoming
     * Accessible by: ADMIN, ADVOCATE
     */
    @GetMapping("/upcoming")
    @PreAuthorize("hasAnyRole('ADMIN', 'ADVOCATE')")
    public ResponseEntity<List<HearingDTO>> getUpcomingHearings() {
        List<HearingDTO> hearings = hearingService.getUpcomingHearings();
        return ResponseEntity.ok(hearings);
    }

    /**
     * Create new hearing
     * POST /api/hearings
     * Accessible by: ADVOCATE only
     */
    @PostMapping
    @PreAuthorize("hasRole('ADVOCATE')")
    public ResponseEntity<HearingDTO> createHearing(@RequestBody HearingDTO hearingDTO) {
        HearingDTO createdHearing = hearingService.createHearing(hearingDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdHearing);
    }

    /**
     * Update hearing
     * PUT /api/hearings/{id}
     * Accessible by: ADVOCATE only
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADVOCATE')")
    public ResponseEntity<HearingDTO> updateHearing(@PathVariable Long id, @RequestBody HearingDTO hearingDTO) {
        HearingDTO updatedHearing = hearingService.updateHearing(id, hearingDTO);
        return ResponseEntity.ok(updatedHearing);
    }

    /**
     * Delete hearing
     * DELETE /api/hearings/{id}
     * Accessible by: ADVOCATE only
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADVOCATE')")
    public ResponseEntity<String> deleteHearing(@PathVariable Long id) {
        hearingService.deleteHearing(id);
        return ResponseEntity.ok("Hearing deleted successfully");
    }
}
