package com.advo.desk.controller;

import com.advo.desk.dto.DashboardStatsDTO;
import com.advo.desk.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST Controller for dashboard endpoints
 */
@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    /**
     * Get dashboard statistics
     * GET /api/dashboard/stats
     */
    @GetMapping
    public DashboardStatsDTO getStats(@RequestParam(required = false) Long advocateId) {
        return dashboardService.getDashboardStats(advocateId);
    }
}
