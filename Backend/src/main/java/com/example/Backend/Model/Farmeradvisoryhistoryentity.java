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
@Table(name = "farmer_advisory_history", indexes = {
    @Index(name = "idx_farmer_city", columnList = "city")
})
public class Farmeradvisoryhistoryentity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100)
    private String city;

    @Column(length = 2000)
    private String recommendation;

    @Column(name = "risk_level", length = 20)
    private String riskLevel;

    @Column(name = "crops_suggested", length = 500)
    private String cropsSuggested;

    @Column(name = "generated_at")
    private LocalDateTime generatedAt;

    public Farmeradvisoryhistoryentity() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }
    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }
    public String getCropsSuggested() { return cropsSuggested; }
    public void setCropsSuggested(String cropsSuggested) { this.cropsSuggested = cropsSuggested; }
    public LocalDateTime getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; }
}