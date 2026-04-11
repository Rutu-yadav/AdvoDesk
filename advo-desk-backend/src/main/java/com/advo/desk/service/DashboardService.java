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
    public DashboardStatsDTO getDashboardStats(Long advocateId) {

        DashboardStatsDTO stats = new DashboardStatsDTO();

        if (advocateId != null) {
            // Advocate → only their data

            stats.setTotalCases(caseRepository.countByCreatedById(advocateId));
            stats.setOpenCases(caseRepository.countByCreatedByIdAndCaseStatus(advocateId, Case.CaseStatus.OPEN));
            stats.setClosedCases(caseRepository.countByCreatedByIdAndCaseStatus(advocateId, Case.CaseStatus.CLOSED));
            stats.setWonCases(caseRepository.countByCreatedByIdAndCaseStatus(advocateId, Case.CaseStatus.WON));
            stats.setLostCases(caseRepository.countByCreatedByIdAndCaseStatus(advocateId, Case.CaseStatus.LOST));

            stats.setUpcomingHearings(
                hearingRepository.countUpcomingHearingsByHearingDateAfter(LocalDateTime.now())
            );

            stats.setTotalClients(clientRepository.countByCreatedById(advocateId));

        } else {
            // 🟢 Admin → all data

            stats.setTotalCases(caseRepository.count());
            stats.setOpenCases(caseRepository.countByCaseStatus(Case.CaseStatus.OPEN));
            stats.setClosedCases(caseRepository.countByCaseStatus(Case.CaseStatus.CLOSED));
            stats.setWonCases(caseRepository.countByCaseStatus(Case.CaseStatus.WON));
            stats.setLostCases(caseRepository.countByCaseStatus(Case.CaseStatus.LOST));

            stats.setUpcomingHearings(
                hearingRepository.countUpcomingHearings(LocalDateTime.now())
            );

            stats.setTotalClients(clientRepository.count());
        }

        return stats;
    }
}
