package com.advo.desk.controller;

import com.advo.desk.dto.DocumentDTO;
import com.advo.desk.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

/**
 * REST Controller for document management endpoints
 * Admin: View and download only
 * Advocate: Full CRUD access including upload/delete
 */
@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "http://localhost:5173")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    /**
     * Get all documents
     * GET /api/documents
     * Admin: sees ALL documents
     * Advocate: sees only THEIR documents
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ADVOCATE')")
    public ResponseEntity<List<DocumentDTO>> getAllDocuments(@RequestParam(required = false) Long advocateId) {
        List<DocumentDTO> documents;
        if (advocateId != null) {
            // Filter by advocate ID (for advocates to see only their documents)
            documents = documentService.getDocumentsByAdvocate(advocateId);
        } else {
            // Admin sees all documents
            documents = documentService.getAllDocuments();
        }
        return ResponseEntity.ok(documents);
    }

    /**
     * Get document by ID
     * GET /api/documents/{id}
     * Accessible by: ADMIN, ADVOCATE
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ADVOCATE')")
    public ResponseEntity<DocumentDTO> getDocumentById(@PathVariable Long id) {
        DocumentDTO document = documentService.getDocumentById(id);
        return ResponseEntity.ok(document);
    }

    /**
     * Get documents by case ID
     * GET /api/documents/case/{caseId}
     * Accessible by: ADMIN, ADVOCATE
     */
    @GetMapping("/case/{caseId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ADVOCATE')")
    public ResponseEntity<List<DocumentDTO>> getDocumentsByCaseId(@PathVariable Long caseId) {
        List<DocumentDTO> documents = documentService.getDocumentsByCaseId(caseId);
        return ResponseEntity.ok(documents);
    }

    /**
     * Upload document
     * POST /api/documents
     * Accessible by: ADVOCATE only
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADVOCATE')")
    public ResponseEntity<DocumentDTO> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("caseId") Long caseId,
            @RequestParam("uploadedBy") Long uploadedBy,
            @RequestParam(value = "documentType", required = false) String documentType,
            @RequestParam(value = "description", required = false) String description) throws IOException {

        DocumentDTO document = documentService.uploadDocument(file, caseId, uploadedBy, documentType, description);
        return ResponseEntity.status(HttpStatus.CREATED).body(document);
    }

    /**
     * Download document
     * GET /api/documents/{id}/download
     * Accessible by: ADMIN, ADVOCATE
     */
    @GetMapping("/{id}/download")
    @PreAuthorize("hasAnyRole('ADMIN', 'ADVOCATE')")
    public ResponseEntity<Resource> downloadDocument(@PathVariable Long id) {
        File file = documentService.getDocumentFile(id);
        Resource resource = new FileSystemResource(file);

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"");

        return ResponseEntity.ok()
                .headers(headers)
                .contentLength(file.length())
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }

    /**
     * Delete document
     * DELETE /api/documents/{id}
     * Accessible by: ADVOCATE only
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADVOCATE')")
    public ResponseEntity<String> deleteDocument(@PathVariable Long id) throws IOException {
        documentService.deleteDocument(id);
        return ResponseEntity.ok("Document deleted successfully");
    }
}
