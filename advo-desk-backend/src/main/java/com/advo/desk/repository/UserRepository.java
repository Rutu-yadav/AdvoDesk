package com.advo.desk.repository;

import com.advo.desk.entity.User;
import com.advo.desk.model.VerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for User entity
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find user by username
     */
    Optional<User> findByUsername(String username);

    /**
     * Find user by email
     */
    Optional<User> findByEmail(String email);

    /**
     * Check if username exists
     */
    boolean existsByUsername(String username);

    /**
     * Check if email exists
     */
    boolean existsByEmail(String email);

    /**
     * Check if enrollment number exists
     */
    boolean existsByEnrollmentNumber(String enrollmentNumber);

    /**
     * Find users by role and verification status
     */
    List<User> findByRoleAndVerificationStatus(User.Role role, VerificationStatus verificationStatus);

    /**
     * Find users by role
     */
    List<User> findByRole(User.Role role);
}
