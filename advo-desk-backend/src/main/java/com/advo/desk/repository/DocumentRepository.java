package com.advo.desk.repository;

import com.advo.desk.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Document entity
 */
@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {

    /**
     * Find documents by case ID
     */
    List<Document> findByCaseEntityId(Long caseId);

    /**
     * Find documents by type
     */
    List<Document> findByDocumentType(String documentType);

    /**
     * Find documents uploaded by user
     */
    List<Document> findByUploadedById(Long userId);
}
