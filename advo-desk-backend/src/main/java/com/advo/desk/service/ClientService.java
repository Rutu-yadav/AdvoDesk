package com.advo.desk.service;

import com.advo.desk.dto.ClientDTO;
import com.advo.desk.entity.Client;
import com.advo.desk.entity.User;
import com.advo.desk.exception.ResourceNotFoundException;
import com.advo.desk.repository.ClientRepository;
import com.advo.desk.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for client management operations
 */
@Service
public class ClientService {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Get all clients (Admin only)
     */
    public List<ClientDTO> getAllClients() {
        return clientRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get clients by advocate ID (for advocate-specific data)
     */
    public List<ClientDTO> getClientsByAdvocate(Long advocateId) {
        return clientRepository.findByCreatedById(advocateId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get client by ID
     */
    public ClientDTO getClientById(Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client", "id", id));
        return convertToDTO(client);
    }

    /**
     * Create new client
     */
    public ClientDTO createClient(ClientDTO clientDTO) {
        Client client = convertToEntity(clientDTO);

        // Set createdBy if provided
        if (clientDTO.getCreatedBy() != null) {
            User creator = userRepository.findById(clientDTO.getCreatedBy())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", clientDTO.getCreatedBy()));
            client.setCreatedBy(creator);
        }

        Client savedClient = clientRepository.save(client);
        return convertToDTO(savedClient);
    }

    /**
     * Update client
     */
    public ClientDTO updateClient(Long id, ClientDTO clientDTO) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client", "id", id));

        client.setFullName(clientDTO.getFullName());
        client.setEmail(clientDTO.getEmail());
        client.setPhone(clientDTO.getPhone());
        client.setAddress(clientDTO.getAddress());
        client.setCity(clientDTO.getCity());
        client.setState(clientDTO.getState());
        client.setPincode(clientDTO.getPincode());

        Client updatedClient = clientRepository.save(client);
        return convertToDTO(updatedClient);
    }

    /**
     * Delete client
     */
    public void deleteClient(Long id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client", "id", id));
        clientRepository.delete(client);
    }

    /**
     * Search clients by name
     */
    public List<ClientDTO> searchClientsByName(String name) {
        return clientRepository.findByFullNameContainingIgnoreCase(name).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Convert entity to DTO
     */
    private ClientDTO convertToDTO(Client client) {
        ClientDTO dto = new ClientDTO();
        dto.setId(client.getId());
        dto.setFullName(client.getFullName());
        dto.setEmail(client.getEmail());
        dto.setPhone(client.getPhone());
        dto.setAddress(client.getAddress());
        dto.setCity(client.getCity());
        dto.setState(client.getState());
        dto.setPincode(client.getPincode());
        if (client.getCreatedBy() != null) {
            dto.setCreatedBy(client.getCreatedBy().getId());
        }
        return dto;
    }

    /**
     * Convert DTO to entity
     */
    private Client convertToEntity(ClientDTO dto) {
        Client client = new Client();
        client.setFullName(dto.getFullName());
        client.setEmail(dto.getEmail());
        client.setPhone(dto.getPhone());
        client.setAddress(dto.getAddress());
        client.setCity(dto.getCity());
        client.setState(dto.getState());
        client.setPincode(dto.getPincode());
        return client;
    }
}
