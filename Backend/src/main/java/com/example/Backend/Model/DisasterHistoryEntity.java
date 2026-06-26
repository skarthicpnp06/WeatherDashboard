package com.example.Backend.Model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;

@Entity
@Table(name = "disaster_history", indexes = {
    @Index(name = "idx_dis_hist_city", columnList = "city")
})
public class DisasterHistoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100)
    private String city;

    @Column(name = "event_type", length = 50)
    private String eventType;

    private LocalDate date;

    @Column(length = 1000)
    private String impact;

    public DisasterHistoryEntity() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public String getImpact() { return impact; }
    public void setImpact(String impact) { this.impact = impact; }
}