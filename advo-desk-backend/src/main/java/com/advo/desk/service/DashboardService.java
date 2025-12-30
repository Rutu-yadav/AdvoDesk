package com.advo.desk.service;

import com.advo.desk.dto.DashboardStatsDTO;
import com.advo.desk.entity.Case;
import com.advo.desk.repository.CaseRepository;
import com.advo.desk.repository.ClientRepository;
import com.advo.desk.repository.HearingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * Service for dashboard statistics
 */
@Service
public class DashboardService {

    @Autowired
    private CaseRepository caseRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private HearingRepository hearingRepository;

    /**
     * Get dashboard statistics
     */
    public DashboardStatsDTO getDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();

        stats.setTotalCases(caseRepository.count());
        stats.setOpenCases(caseRepository.countByCaseStatus(Case.CaseStatus.OPEN));
        stats.setClosedCases(caseRepository.countByCaseStatus(Case.CaseStatus.CLOSED));
        stats.setWonCases(caseRepository.countByCaseStatus(Case.CaseStatus.WON));
        stats.setLostCases(caseRepository.countByCaseStatus(Case.CaseStatus.LOST));
        stats.setUpcomingHearings(hearingRepository.countUpcomingHearings(LocalDateTime.now()));
        stats.setTotalClients(clientRepository.count());

        return stats;
    }
}
