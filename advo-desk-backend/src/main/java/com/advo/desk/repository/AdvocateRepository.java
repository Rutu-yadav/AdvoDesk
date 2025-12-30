package com.advo.desk.repository;

import com.advo.desk.entity.Advocate;
import com.advo.desk.model.VerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Advocate entity
 */
@Repository
public interface AdvocateRepository extends JpaRepository<Advocate, Long> {

    Optional<Advocate> findByUsername(String username);

    Optional<Advocate> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByEnrollmentNumber(String enrollmentNumber);

    List<Advocate> findByVerificationStatus(VerificationStatus status);
}
