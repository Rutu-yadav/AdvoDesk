package com.advo.desk.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Dashboard statistics
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private long totalCases;
    private long openCases;
    private long closedCases;
    private long wonCases;
    private long lostCases;
    private long upcomingHearings;
    private long totalClients;
}
