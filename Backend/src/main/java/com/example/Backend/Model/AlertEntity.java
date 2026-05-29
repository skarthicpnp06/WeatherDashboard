package com.example.Backend.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "alert_entity")
public class AlertEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String email;
    private String city;
    
    @Column(name = "target_temp")
    private double targetTemp;

    @Column(name = "trigger_condition")
    private String triggerCondition;

    public AlertEntity() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email != null ? email.trim().toLowerCase() : null; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city != null ? city.trim().toLowerCase() : null; }

    public double getTargetTemp() { return targetTemp; }
    public void setTargetTemp(double targetTemp) { this.targetTemp = targetTemp; }

    public String getTriggerCondition() { return triggerCondition; }
    public void setTriggerCondition(String triggerCondition) { this.triggerCondition = triggerCondition; }
}