package cl.dimade.crm.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "clients")
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String identifier; // RUT o DNI

    @Column(unique = true)
    private String email;

    private String phone;
    private String address;

    @Column(name = "client_type")
    private String clientType; // VIP, Regular, Nuevo

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Client() {}

    public Client(Long id, String name, String identifier, String email, String phone, String address, String clientType, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.identifier = identifier;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.clientType = clientType;
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getIdentifier() { return identifier; }
    public void setIdentifier(String identifier) { this.identifier = identifier; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getClientType() { return clientType; }
    public void setClientType(String clientType) { this.clientType = clientType; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
