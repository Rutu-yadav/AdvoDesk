package com.advo.desk.service;

import com.advo.desk.dto.CaseDTO;
import com.advo.desk.entity.Case;
import com.advo.desk.entity.Client;
import com.advo.desk.entity.User;
import com.advo.desk.exception.ResourceNotFoundException;
import com.advo.desk.repository.CaseRepository;
import com.advo.desk.repository.ClientRepository;
import com.advo.desk.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for case management operations
 */
@Service
public class CaseService {

    @Autowired
    private CaseRepository caseRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Get all cases (Admin only)
     */
    public List<CaseDTO> getAllCases() {
        return caseRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get cases by advocate ID (for advocate-specific data)
     */
    public List<CaseDTO> getCasesByAdvocate(Long advocateId) {
        return caseRepository.findByCreatedById(advocateId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get case by ID
     */
    public CaseDTO getCaseById(Long id) {
        Case caseEntity = caseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Case", "id", id));
        return convertToDTO(caseEntity);
    }

    /**
     * Get cases by client ID
     */
    public List<CaseDTO> getCasesByClientId(Long clientId) {
        return caseRepository.findByClientId(clientId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get cases by status
     */
    public List<CaseDTO> getCasesByStatus(Case.CaseStatus status) {
        return caseRepository.findByCaseStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Create new case
     */
    public CaseDTO createCase(CaseDTO caseDTO) {
        Client client = clientRepository.findById(caseDTO.getClientId())
                .orElseThrow(() -> new ResourceNotFoundException("Client", "id", caseDTO.getClientId()));

        User createdBy = userRepository.findById(caseDTO.getCreatedBy())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", caseDTO.getCreatedBy()));

        Case caseEntity = new Case();
        caseEntity.setCaseNumber(caseDTO.getCaseNumber());
        caseEntity.setCaseTitle(caseDTO.getCaseTitle());
        caseEntity.setCaseType(caseDTO.getCaseType());
        caseEntity.setCourtName(caseDTO.getCourtName());
        caseEntity.setCaseStatus(caseDTO.getCaseStatus());
        caseEntity.setDescription(caseDTO.getDescription());
        caseEntity.setFilingDate(caseDTO.getFilingDate());
        caseEntity.setClient(client);
        caseEntity.setCreatedBy(createdBy);

        Case savedCase = caseRepository.save(caseEntity);
        return convertToDTO(savedCase);
    }

    /**
     * Update case
     */
    public CaseDTO updateCase(Long id, CaseDTO caseDTO) {
        Case caseEntity = caseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Case", "id", id));

        caseEntity.setCaseTitle(caseDTO.getCaseTitle());
        caseEntity.setCaseType(caseDTO.getCaseType());
        caseEntity.setCourtName(caseDTO.getCourtName());
        caseEntity.setCaseStatus(caseDTO.getCaseStatus());
        caseEntity.setDescription(caseDTO.getDescription());
        caseEntity.setFilingDate(caseDTO.getFilingDate());

        Case updatedCase = caseRepository.save(caseEntity);
        return convertToDTO(updatedCase);
    }

    /**
     * Delete case
     */
    public void deleteCase(Long id) {
        Case caseEntity = caseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Case", "id", id));
        caseRepository.delete(caseEntity);
    }

    /**
     * Convert entity to DTO
     */
    private CaseDTO convertToDTO(Case caseEntity) {
        CaseDTO dto = new CaseDTO();
        dto.setId(caseEntity.getId());
        dto.setCaseNumber(caseEntity.getCaseNumber());
        dto.setCaseTitle(caseEntity.getCaseTitle());
        dto.setCaseType(caseEntity.getCaseType());
        dto.setCourtName(caseEntity.getCourtName());
        dto.setCaseStatus(caseEntity.getCaseStatus());
        dto.setDescription(caseEntity.getDescription());
        dto.setFilingDate(caseEntity.getFilingDate());
        dto.setClientId(caseEntity.getClient().getId());
        dto.setClientName(caseEntity.getClient().getFullName());
        dto.setCreatedBy(caseEntity.getCreatedBy().getId());
        dto.setCreatedByName(caseEntity.getCreatedBy().getFullName());
        return dto;
    }
}
