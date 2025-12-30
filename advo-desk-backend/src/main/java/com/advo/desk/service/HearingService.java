package com.advo.desk.service;

import com.advo.desk.dto.HearingDTO;
import com.advo.desk.entity.Case;
import com.advo.desk.entity.Hearing;
import com.advo.desk.exception.ResourceNotFoundException;
import com.advo.desk.repository.CaseRepository;
import com.advo.desk.repository.HearingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for hearing management operations
 */
@Service
public class HearingService {

    @Autowired
    private HearingRepository hearingRepository;

    @Autowired
    private CaseRepository caseRepository;

    /**
     * Get all hearings (Admin only)
     */
    public List<HearingDTO> getAllHearings() {
        return hearingRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get hearings by advocate ID (for advocate-specific data)
     * Returns hearings for all cases created by the advocate
     */
    public List<HearingDTO> getHearingsByAdvocate(Long advocateId) {
        // Get all cases created by this advocate
        List<Case> advocateCases = caseRepository.findByCreatedById(advocateId);

        // Get all hearings for these cases
        return advocateCases.stream()
                .flatMap(caseEntity -> hearingRepository.findByCaseEntityId(caseEntity.getId()).stream())
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get hearing by ID
     */
    public HearingDTO getHearingById(Long id) {
        Hearing hearing = hearingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hearing", "id", id));
        return convertToDTO(hearing);
    }

    /**
     * Get hearings by case ID
     */
    public List<HearingDTO> getHearingsByCaseId(Long caseId) {
        return hearingRepository.findByCaseEntityId(caseId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get upcoming hearings
     */
    public List<HearingDTO> getUpcomingHearings() {
        return hearingRepository.findByHearingDateAfterOrderByHearingDateAsc(LocalDateTime.now()).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Create new hearing
     */
    public HearingDTO createHearing(HearingDTO hearingDTO) {
        Case caseEntity = caseRepository.findById(hearingDTO.getCaseId())
                .orElseThrow(() -> new ResourceNotFoundException("Case", "id", hearingDTO.getCaseId()));

        Hearing hearing = new Hearing();
        hearing.setCaseEntity(caseEntity);
        hearing.setHearingDate(hearingDTO.getHearingDate());
        hearing.setHearingType(hearingDTO.getHearingType());
        hearing.setCourtRoom(hearingDTO.getCourtRoom());
        hearing.setJudgeName(hearingDTO.getJudgeName());
        hearing.setNotes(hearingDTO.getNotes());
        hearing.setStatus(hearingDTO.getStatus());

        Hearing savedHearing = hearingRepository.save(hearing);
        return convertToDTO(savedHearing);
    }

    /**
     * Update hearing
     */
    public HearingDTO updateHearing(Long id, HearingDTO hearingDTO) {
        Hearing hearing = hearingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hearing", "id", id));

        hearing.setHearingDate(hearingDTO.getHearingDate());
        hearing.setHearingType(hearingDTO.getHearingType());
        hearing.setCourtRoom(hearingDTO.getCourtRoom());
        hearing.setJudgeName(hearingDTO.getJudgeName());
        hearing.setNotes(hearingDTO.getNotes());
        hearing.setStatus(hearingDTO.getStatus());

        Hearing updatedHearing = hearingRepository.save(hearing);
        return convertToDTO(updatedHearing);
    }

    /**
     * Delete hearing
     */
    public void deleteHearing(Long id) {
        Hearing hearing = hearingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hearing", "id", id));
        hearingRepository.delete(hearing);
    }

    /**
     * Convert entity to DTO
     */
    private HearingDTO convertToDTO(Hearing hearing) {
        HearingDTO dto = new HearingDTO();
        dto.setId(hearing.getId());
        dto.setCaseId(hearing.getCaseEntity().getId());
        dto.setCaseNumber(hearing.getCaseEntity().getCaseNumber());
        dto.setCaseTitle(hearing.getCaseEntity().getCaseTitle());
        dto.setHearingDate(hearing.getHearingDate());
        dto.setHearingType(hearing.getHearingType());
        dto.setCourtRoom(hearing.getCourtRoom());
        dto.setJudgeName(hearing.getJudgeName());
        dto.setNotes(hearing.getNotes());
        dto.setStatus(hearing.getStatus());
        return dto;
    }
}
