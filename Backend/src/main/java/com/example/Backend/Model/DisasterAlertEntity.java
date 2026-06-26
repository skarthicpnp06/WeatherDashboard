package com.example.Backend.Model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;

@Entity
@Table(name = "disaster_alerts", indexes = {
    @Index(name = "idx_disaster_city", columnList = "city"),
    @Index(name = "idx_disaster_severity", columnList = "severity")
})
public class DisasterAlertEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100)
    private String city;

    @Column(name = "alert_type", length = 50)
    private String alertType;

    @Column(length = 20)
    private String severity;

    @Column(length = 1000)
    private String description;

    @Column(name = "risk_score")
    private int riskScore;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public DisasterAlertEntity() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getAlertType() { return alertType; }
    public void setAlertType(String alertType) { this.alertType = alertType; }
    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public int getRiskScore() { return riskScore; }
    public void setRiskScore(int riskScore) { this.riskScore = riskScore; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}