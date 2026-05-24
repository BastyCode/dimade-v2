package cl.dimade.crm.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "supplier_quotes")
public class SupplierQuote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long supplierId;

    private String supplierName;
    
    @Column(nullable = false)
    private String quoteNumber; // El número que viene en el PDF del proveedor

    @Column(nullable = false)
    private Double totalAmount;

    private String pdfUrl; // Simulación de ruta de archivo
    
    private String observation;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public SupplierQuote() {}

    public SupplierQuote(Long id, Long supplierId, String supplierName, String quoteNumber, Double totalAmount, String pdfUrl, String observation, LocalDateTime createdAt) {
        this.id = id;
        this.supplierId = supplierId;
        this.supplierName = supplierName;
        this.quoteNumber = quoteNumber;
        this.totalAmount = totalAmount;
        this.pdfUrl = pdfUrl;
        this.observation = observation;
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getSupplierId() { return supplierId; }
    public void setSupplierId(Long supplierId) { this.supplierId = supplierId; }
    public String getSupplierName() { return supplierName; }
    public void setSupplierName(String supplierName) { this.supplierName = supplierName; }
    public String getQuoteNumber() { return quoteNumber; }
    public void setQuoteNumber(String quoteNumber) { this.quoteNumber = quoteNumber; }
    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
    public String getPdfUrl() { return pdfUrl; }
    public void setPdfUrl(String pdfUrl) { this.pdfUrl = pdfUrl; }
    public String getObservation() { return observation; }
    public void setObservation(String observation) { this.observation = observation; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
