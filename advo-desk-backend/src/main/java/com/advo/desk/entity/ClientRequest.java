package com.advo.desk.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class ClientRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔗 Client
    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;

    // 🔗 Advocate
    @ManyToOne
    @JoinColumn(name = "advocate_id")
    private Advocate advocate;

    // 📌 Status
    @Enumerated(EnumType.STRING)
    private Status status;

    private LocalDateTime createdAt;

    public enum Status {
        PENDING,
        APPROVED,
        REJECTED
    }

    // ✅ Constructor
    public ClientRequest() {
        this.createdAt = LocalDateTime.now();
        this.status = Status.PENDING;
    }

    // ✅ GETTERS & SETTERS (IMPORTANT)

    public Long getId() {
        return id;
    }

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public Advocate getAdvocate() {
        return advocate;
    }

    public void setAdvocate(Advocate advocate) {
        this.advocate = advocate;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}