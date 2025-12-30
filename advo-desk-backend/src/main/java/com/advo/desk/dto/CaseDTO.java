package com.advo.desk.dto;

import com.advo.desk.entity.Case;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO for Case data transfer
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CaseDTO {
    private Long id;

    @NotBlank(message = "Case number is required")
    @Size(max = 50, message = "Case number must be less than 50 characters")
    private String caseNumber;

    @NotBlank(message = "Case title is required")
    @Size(max = 200, message = "Case title must be less than 200 characters")
    private String caseTitle;

    @NotNull(message = "Case type is required")
    private Case.CaseType caseType;

    @NotBlank(message = "Court name is required")
    private String courtName;

    @NotNull(message = "Case status is required")
    private Case.CaseStatus caseStatus;

    private String description;

    @NotNull(message = "Filing date is required")
    private LocalDate filingDate;

    @NotNull(message = "Client ID is required")
    private Long clientId;

    private String clientName;
    private Long createdBy;
    private String createdByName;
}
