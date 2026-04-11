package com.advo.desk.controller;

import com.advo.desk.dto.ClientDTO;
import com.advo.desk.service.ClientService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for client management endpoints
 * Admin: View-only access (GET methods)
 * Advocate: Full CRUD access
 */
@RestController
@RequestMapping("/api/clients")
@CrossOrigin(origins = "http://localhost:5173")
public class ClientController {

    @Autowired
    private ClientService clientService;

    /**
     * Get all clients
     * GET /api/clients
     * Admin: sees ALL clients
     * Advocate: sees only THEIR clients
     */
@GetMapping
@PreAuthorize("hasAnyRole('ADMIN', 'ADVOCATE')")
public ResponseEntity<List<ClientDTO>> getAllClients(@RequestParam(required = false) Long advocateId) {

    List<ClientDTO> clients;

    // 🟢 If advocateId is provided → show only that advocate's clients
    if (advocateId != null) {
        clients = clientService.getClientsByAdvocate(advocateId);
    } 
    // 🟢 If NOT provided → show all clients (for admin)
    else {
        clients = clientService.getAllClients();
    }

    return ResponseEntity.ok(clients);
}

    /**
     * Get client by ID
     * GET /api/clients/{id}
     * Accessible by: ADMIN, ADVOCATE
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ADVOCATE')")
    public ResponseEntity<ClientDTO> getClientById(@PathVariable Long id) {
        ClientDTO client = clientService.getClientById(id);
        return ResponseEntity.ok(client);
    }

    /**
     * Create new client
     * POST /api/clients
     * Accessible by: ADVOCATE only
     */
    @PostMapping
    @PreAuthorize("hasRole('ADVOCATE')")
    public ResponseEntity<ClientDTO> createClient(@Valid @RequestBody ClientDTO clientDTO) {
        ClientDTO createdClient = clientService.createClient(clientDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdClient);
    }

    /**
     * Update client
     * PUT /api/clients/{id}
     * Accessible by: ADVOCATE only
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADVOCATE')")
    public ResponseEntity<ClientDTO> updateClient(@PathVariable Long id, @Valid @RequestBody ClientDTO clientDTO) {
        ClientDTO updatedClient = clientService.updateClient(id, clientDTO);
        return ResponseEntity.ok(updatedClient);
    }

    /**
     * Delete client
     * DELETE /api/clients/{id}
     * Accessible by: ADVOCATE only
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADVOCATE')")
    public ResponseEntity<String> deleteClient(@PathVariable Long id) {
        clientService.deleteClient(id);
        return ResponseEntity.ok("Client deleted successfully");
    }

    /**
     * Search clients by name
     * GET /api/clients/search?name={name}
     * Accessible by: ADMIN, ADVOCATE
     */
    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'ADVOCATE')")
    public ResponseEntity<List<ClientDTO>> searchClients(@RequestParam String name) {
        List<ClientDTO> clients = clientService.searchClientsByName(name);
        return ResponseEntity.ok(clients);
    }
}
