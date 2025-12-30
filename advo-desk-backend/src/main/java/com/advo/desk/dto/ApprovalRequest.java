package com.advo.desk.dto;

import lombok.Data;

@Data
public class ApprovalRequest {
    private Long advocateId;
    private Long adminId;
    private String rejectionReason; // Only used for rejection
}
