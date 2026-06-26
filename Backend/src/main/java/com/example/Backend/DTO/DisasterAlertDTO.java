package com.example.Backend.DTO;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class DisasterAlertDTO {

    private String city;
    private int cycloneRisk;
    private int floodRisk;
    private int heatwaveRisk;
    private int thunderstormRisk;
    private int landslideRisk;
    private int heavyRainRisk;
    private int overallRiskScore;
    private String overallRiskLevel;
    private String overallRiskColor;
    private List<String> activeAlertTypes;
    private Map<String, String> instructions;
    private LocalDateTime timestamp;
    private double latitude;
    private double longitude;
    private Map<String, Object> emergencyContacts;

    public DisasterAlertDTO() {}

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public int getCycloneRisk() { return cycloneRisk; }
    public void setCycloneRisk(int cycloneRisk) { this.cycloneRisk = cycloneRisk; }
    public int getFloodRisk() { return floodRisk; }
    public void setFloodRisk(int floodRisk) { this.floodRisk = floodRisk; }
    public int getHeatwaveRisk() { return heatwaveRisk; }
    public void setHeatwaveRisk(int heatwaveRisk) { this.heatwaveRisk = heatwaveRisk; }
    public int getThunderstormRisk() { return thunderstormRisk; }
    public void setThunderstormRisk(int thunderstormRisk) { this.thunderstormRisk = thunderstormRisk; }
    public int getLandslideRisk() { return landslideRisk; }
    public void setLandslideRisk(int landslideRisk) { this.landslideRisk = landslideRisk; }
    public int getHeavyRainRisk() { return heavyRainRisk; }
    public void setHeavyRainRisk(int heavyRainRisk) { this.heavyRainRisk = heavyRainRisk; }
    public int getOverallRiskScore() { return overallRiskScore; }
    public void setOverallRiskScore(int overallRiskScore) { this.overallRiskScore = overallRiskScore; }
    public String getOverallRiskLevel() { return overallRiskLevel; }
    public void setOverallRiskLevel(String overallRiskLevel) { this.overallRiskLevel = overallRiskLevel; }
    public String getOverallRiskColor() { return overallRiskColor; }
    public void setOverallRiskColor(String overallRiskColor) { this.overallRiskColor = overallRiskColor; }
    public List<String> getActiveAlertTypes() { return activeAlertTypes; }
    public void setActiveAlertTypes(List<String> activeAlertTypes) { this.activeAlertTypes = activeAlertTypes; }
    public Map<String, String> getInstructions() { return instructions; }
    public void setInstructions(Map<String, String> instructions) { this.instructions = instructions; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }
    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }
    public Map<String, Object> getEmergencyContacts() { return emergencyContacts; }
    public void setEmergencyContacts(Map<String, Object> emergencyContacts) { this.emergencyContacts = emergencyContacts; }
}
