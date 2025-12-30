package com.advo.desk.service;

import com.advo.desk.dto.DocumentDTO;
import com.advo.desk.entity.Case;
import com.advo.desk.entity.Document;
import com.advo.desk.entity.User;
import com.advo.desk.exception.ResourceNotFoundException;
import com.advo.desk.repository.CaseRepository;
import com.advo.desk.repository.DocumentRepository;
import com.advo.desk.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for document management operations
 */
@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private CaseRepository caseRepository;

    @Autowired
    private UserRepository userRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    /**
     * Get all documents (Admin only)
     */
    public List<DocumentDTO> getAllDocuments() {
        return documentRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get documents by advocate ID (for advocate-specific data)
     * Returns documents for all cases created by the advocate
     */
    public List<DocumentDTO> getDocumentsByAdvocate(Long advocateId) {
        // Get all cases created by this advocate
        List<Case> advocateCases = caseRepository.findByCreatedById(advocateId);

        // Get all documents for these cases
        return advocateCases.stream()
                .flatMap(caseEntity -> documentRepository.findByCaseEntityId(caseEntity.getId()).stream())
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get document by ID
     */
    public DocumentDTO getDocumentById(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document", "id", id));
        return convertToDTO(document);
    }

    /**
     * Get documents by case ID
     */
    public List<DocumentDTO> getDocumentsByCaseId(Long caseId) {
        return documentRepository.findByCaseEntityId(caseId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Upload document
     */
    public DocumentDTO uploadDocument(MultipartFile file, Long caseId, Long uploadedBy,
            String documentType, String description) throws IOException {

        Case caseEntity = caseRepository.findById(caseId)
                .orElseThrow(() -> new ResourceNotFoundException("Case", "id", caseId));

        User user = userRepository.findById(uploadedBy)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", uploadedBy));

        // Create upload directory if it doesn't exist
        String caseUploadDir = uploadDir + "/case_" + caseId;
        Path uploadPath = Paths.get(caseUploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Save file
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);

        // Create document entity
        Document document = new Document();
        document.setCaseEntity(caseEntity);
        document.setDocumentName(file.getOriginalFilename());
        document.setDocumentType(documentType);
        document.setFilePath(filePath.toString());
        document.setFileSize(file.getSize());
        document.setUploadedBy(user);
        document.setDescription(description);

        Document savedDocument = documentRepository.save(document);
        return convertToDTO(savedDocument);
    }

    /**
     * Delete document
     */
    public void deleteDocument(Long id) throws IOException {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document", "id", id));

        // Delete physical file
        Path filePath = Paths.get(document.getFilePath());
        if (Files.exists(filePath)) {
            Files.delete(filePath);
        }

        documentRepository.delete(document);
    }

    /**
     * Get document file
     */
    public File getDocumentFile(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document", "id", id));
        return new File(document.getFilePath());
    }

    /**
     * Convert entity to DTO
     */
    private DocumentDTO convertToDTO(Document document) {
        DocumentDTO dto = new DocumentDTO();
        dto.setId(document.getId());
        dto.setCaseId(document.getCaseEntity().getId());
        dto.setCaseNumber(document.getCaseEntity().getCaseNumber());
        dto.setDocumentName(document.getDocumentName());
        dto.setDocumentType(document.getDocumentType());
        dto.setFilePath(document.getFilePath());
        dto.setFileSize(document.getFileSize());
        dto.setUploadedBy(document.getUploadedBy().getId());
        dto.setUploadedByName(document.getUploadedBy().getFullName());
        dto.setUploadedAt(document.getUploadedAt());
        dto.setDescription(document.getDescription());
        return dto;
    }
}
