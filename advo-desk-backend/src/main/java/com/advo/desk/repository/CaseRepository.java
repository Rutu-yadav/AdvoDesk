package com.advo.desk.repository;

import com.advo.desk.entity.Case;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Case entity
 */
@Repository
public interface CaseRepository extends JpaRepository<Case, Long> {

    /**
     * Find case by case number
     */
    Optional<Case> findByCaseNumber(String caseNumber);

    /**
     * Find cases by client ID
     */
    List<Case> findByClientId(Long clientId);

    /**
     * Find cases by status
     */
    List<Case> findByCaseStatus(Case.CaseStatus status);

    /**
     * Find cases by type
     */
    List<Case> findByCaseType(Case.CaseType type);

    /**
     * Find cases created by user
     */
    List<Case> findByCreatedById(Long userId);

    /**
     * Count cases by status
     */
    long countByCaseStatus(Case.CaseStatus status);
}
