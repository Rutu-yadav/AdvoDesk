package com.advo.desk.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for Document data transfer
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DocumentDTO {
    private Long id;
    private Long caseId;
    private String caseNumber;
    private String documentName;
    private String documentType;
    private String filePath;
    private Long fileSize;
    private Long uploadedBy;
    private String uploadedByName;
    private LocalDateTime uploadedAt;
    private String description;
}
