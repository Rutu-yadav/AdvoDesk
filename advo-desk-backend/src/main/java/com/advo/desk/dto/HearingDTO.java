package com.advo.desk.dto;

import com.advo.desk.entity.Hearing;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for Hearing data transfer
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HearingDTO {
    private Long id;
    private Long caseId;
    private String caseNumber;
    private String caseTitle;
    private LocalDateTime hearingDate;
    private String hearingType;
    private String courtRoom;
    private String judgeName;
    private String notes;
    private Hearing.HearingStatus status;
}
