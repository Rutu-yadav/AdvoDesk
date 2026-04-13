package com.advo.desk.repository;

import com.advo.desk.entity.ClientRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClientRequestRepository extends JpaRepository<ClientRequest, Long> {

    // ✅ FIXED METHODS
    List<ClientRequest> findByAdvocate_Id(Long advocateId);

    List<ClientRequest> findByClient_Id(Long clientId);
}