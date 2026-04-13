package com.advo.desk.controller;

import com.advo.desk.entity.Client;
import com.advo.desk.entity.Advocate;
import com.advo.desk.entity.ClientRequest;
import com.advo.desk.repository.ClientRepository;
import com.advo.desk.repository.AdvocateRepository;
import com.advo.desk.repository.ClientRequestRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "*")
public class ClientRequestController {

    @Autowired
    private ClientRequestRepository requestRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private AdvocateRepository advocateRepository;

    // ✅ CREATE REQUEST
    @PostMapping
    public ClientRequest createRequest(@RequestParam Long clientId,
                                       @RequestParam Long advocateId) {

        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        Advocate advocate = advocateRepository.findById(advocateId)
                .orElseThrow(() -> new RuntimeException("Advocate not found"));

        ClientRequest request = new ClientRequest();
        request.setClient(client);
        request.setAdvocate(advocate);

        return requestRepository.save(request);
    }

    // ✅ GET REQUESTS FOR ADVOCATE
    @GetMapping("/advocate/{advocateId}")
    public List<ClientRequest> getRequestsForAdvocate(@PathVariable Long advocateId) {
        return requestRepository.findByAdvocate_Id(advocateId);
    }

    // ✅ UPDATE STATUS (APPROVE / REJECT)
    @PutMapping("/{id}")
    public ClientRequest updateStatus(@PathVariable Long id,
                                      @RequestParam String status) {

        ClientRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        request.setStatus(ClientRequest.Status.valueOf(status.toUpperCase()));

        return requestRepository.save(request);
    }
}