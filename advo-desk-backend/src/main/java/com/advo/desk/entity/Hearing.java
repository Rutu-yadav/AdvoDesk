package com.advo.desk.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Entity class representing a Hearing
 */
@Entity
@Table(name = "hearings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Hearing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "case_id", nullable = false)
    private Case caseEntity;

    @Column(name = "hearing_date", nullable = false)
    private LocalDateTime hearingDate;

    @Column(name = "hearing_type", length = 100)
    private String hearingType;

    @Column(name = "court_room", length = 50)
    private String courtRoom;

    @Column(name = "judge_name", length = 100)
    private String judgeName;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private HearingStatus status = HearingStatus.SCHEDULED;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * Enum for hearing status
     */
    public enum HearingStatus {
        SCHEDULED,
        COMPLETED,
        POSTPONED,
        CANCELLED
    }
}
