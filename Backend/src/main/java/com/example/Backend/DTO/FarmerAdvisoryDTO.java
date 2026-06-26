package com.example.Backend.DTO;

import java.util.List;

public class FarmerAdvisoryDTO {

    private String city;
    private double temperature;
    private int humidity;
    private double precipitation;
    private double windSpeed;
    private String weatherDescription;
    private List<String> recommendedCrops;
    private String irrigationAdvice;
    private String harvestWarning;
    private int riskScore;
    private String riskLevel;
    private boolean droughtAlert;
    private String season;
    private String soilMoistureStatus;
    private String fertilizerRecommendation;
    private String pestRisk;

    public FarmerAdvisoryDTO() {}

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public double getTemperature() { return temperature; }
    public void setTemperature(double temperature) { this.temperature = temperature; }
    public int getHumidity() { return humidity; }
    public void setHumidity(int humidity) { this.humidity = humidity; }
    public double getPrecipitation() { return precipitation; }
    public void setPrecipitation(double precipitation) { this.precipitation = precipitation; }
    public double getWindSpeed() { return windSpeed; }
    public void setWindSpeed(double windSpeed) { this.windSpeed = windSpeed; }
    public String getWeatherDescription() { return weatherDescription; }
    public void setWeatherDescription(String weatherDescription) { this.weatherDescription = weatherDescription; }
    public List<String> getRecommendedCrops() { return recommendedCrops; }
    public void setRecommendedCrops(List<String> recommendedCrops) { this.recommendedCrops = recommendedCrops; }
    public String getIrrigationAdvice() { return irrigationAdvice; }
    public void setIrrigationAdvice(String irrigationAdvice) { this.irrigationAdvice = irrigationAdvice; }
    public String getHarvestWarning() { return harvestWarning; }
    public void setHarvestWarning(String harvestWarning) { this.harvestWarning = harvestWarning; }
    public int getRiskScore() { return riskScore; }
    public void setRiskScore(int riskScore) { this.riskScore = riskScore; }
    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }
    public boolean isDroughtAlert() { return droughtAlert; }
    public void setDroughtAlert(boolean droughtAlert) { this.droughtAlert = droughtAlert; }
    public String getSeason() { return season; }
    public void setSeason(String season) { this.season = season; }
    public String getSoilMoistureStatus() { return soilMoistureStatus; }
    public void setSoilMoistureStatus(String soilMoistureStatus) { this.soilMoistureStatus = soilMoistureStatus; }
    public String getFertilizerRecommendation() { return fertilizerRecommendation; }
    public void setFertilizerRecommendation(String fertilizerRecommendation) { this.fertilizerRecommendation = fertilizerRecommendation; }
    public String getPestRisk() { return pestRisk; }
    public void setPestRisk(String pestRisk) { this.pestRisk = pestRisk; }
}