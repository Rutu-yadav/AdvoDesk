package com.advo.desk.repository;

import com.advo.desk.entity.Hearing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository interface for Hearing entity
 */
@Repository
public interface HearingRepository extends JpaRepository<Hearing, Long> {

    /**
     * Find hearings by case ID
     */
    List<Hearing> findByCaseEntityId(Long caseId);

    /**
     * Find hearings by status
     */
    List<Hearing> findByStatus(Hearing.HearingStatus status);

    /**
     * Find upcoming hearings (after current date)
     */
    List<Hearing> findByHearingDateAfterOrderByHearingDateAsc(LocalDateTime date);

    /**
     * Find hearings between dates
     */
    List<Hearing> findByHearingDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Count upcoming hearings
     */
    @Query("SELECT COUNT(h) FROM Hearing h WHERE h.hearingDate > :currentDate AND h.status = 'SCHEDULED'")
    long countUpcomingHearings(LocalDateTime currentDate);

    long countUpcomingHearingsByHearingDateAfter(LocalDateTime now);
}
