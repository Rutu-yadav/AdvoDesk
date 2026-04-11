package com.advo.desk.repository;

import com.advo.desk.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Client entity
 */
@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {

    /**
     * Find clients by email
     */
    List<Client> findByEmailContainingIgnoreCase(String email);

    /**
     * Find clients by name
     */
    List<Client> findByFullNameContainingIgnoreCase(String name);

    /**
     * Find clients by phone
     */
    List<Client> findByPhone(String phone);

    /**
     * Find clients created by specific user (advocate)
     */
    List<Client> findByCreatedById(Long userId);

    long countByCreatedById(Long userId);
}
