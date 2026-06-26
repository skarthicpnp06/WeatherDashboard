package com.example.Backend.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Backend.DTO.FarmerAdvisoryDTO;
import com.example.Backend.Model.Farmeradvisoryhistoryentity;
import com.example.Backend.Model.WeatherEntity;
import com.example.Backend.Repository.FarmerAdvisoryHistoryRepository;

@Service
public class FarmerService {

    @Autowired
    private WeatherService weatherService;

    @Autowired
    private FarmerAdvisoryHistoryRepository advisoryHistoryRepository;

    public FarmerAdvisoryDTO generateAdvisory(String city) {
        WeatherEntity weather;
        try {
            weather = weatherService.getWeather(city);
        } catch (Exception e) {
            weather = new WeatherEntity(city, 28.0, "Partly Cloudy", 65, 3.0, "Fallback");
        }

        FarmerAdvisoryDTO advisory = new FarmerAdvisoryDTO();
        advisory.setCity(city);
        advisory.setTemperature(weather.getTemparature());
        advisory.setHumidity(weather.getHumidity());
        advisory.setPrecipitation(weather.getPrecipitation());
        advisory.setWindSpeed(weather.getWindSpeed());
        advisory.setWeatherDescription(weather.getDescription());
        advisory.setSeason(detectSeason());
        advisory.setRecommendedCrops(getCropRecommendations(weather));
        advisory.setIrrigationAdvice(getIrrigationAdvice(weather));
        advisory.setHarvestWarning(getHarvestWarning(weather));
        advisory.setRiskScore(calculateRiskScore(weather));
        advisory.setRiskLevel(getRiskLevel(advisory.getRiskScore()));
        advisory.setDroughtAlert(isDroughtAlert(weather));
        advisory.setSoilMoistureStatus(getSoilMoistureStatus(weather));
        advisory.setFertilizerRecommendation(getFertilizerRecommendation(weather));
        advisory.setPestRisk(getPestRisk(weather));

        Farmeradvisoryhistoryentity history = new Farmeradvisoryhistoryentity();
        history.setCity(city.trim().toLowerCase());
        history.setRecommendation(advisory.getIrrigationAdvice() + " | " + advisory.getHarvestWarning());
        history.setRiskLevel(advisory.getRiskLevel());
        history.setCropsSuggested(String.join(", ", advisory.getRecommendedCrops()));
        history.setGeneratedAt(LocalDateTime.now());
        advisoryHistoryRepository.save(history);

        return advisory;
    }

    private String detectSeason() {
        int month = LocalDate.now().getMonthValue();
        if (month >= 6 && month <= 10) return "Kharif (Monsoon)";
        if (month >= 11 || month <= 3) return "Rabi (Winter)";
        return "Zaid (Summer)";
    }

    private List<String> getCropRecommendations(WeatherEntity weather) {
        List<String> crops = new ArrayList<>();
        double temp = weather.getTemparature();
        int humidity = weather.getHumidity();
        double rain = weather.getPrecipitation();
        String season = detectSeason();

        if (temp >= 20 && temp <= 35 && humidity >= 60 && season.contains("Kharif")) {
            crops.add("Rice");
            crops.add("Sugarcane");
        }
        if (temp >= 10 && temp <= 25 && season.contains("Rabi")) {
            crops.add("Wheat");
            crops.add("Barley");
            crops.add("Mustard");
        }
        if (temp >= 25 && temp <= 40 && humidity < 65) {
            crops.add("Cotton");
            crops.add("Groundnut");
        }
        if (temp >= 18 && temp <= 32) {
            crops.add("Maize");
            crops.add("Soybeans");
        }
        if (temp >= 20 && temp <= 30 && humidity >= 55) {
            crops.add("Tomatoes");
            crops.add("Brinjal");
        }
        if (temp >= 22 && temp <= 35 && humidity >= 60 && rain > 1) {
            crops.add("Green Gram");
            crops.add("Black Gram");
        }
        if (crops.isEmpty()) {
            crops.add("Drought-resistant Millets");
            crops.add("Sorghum");
        }
        return crops;
    }

    private String getIrrigationAdvice(WeatherEntity weather) {
        double rain = weather.getPrecipitation();
        int humidity = weather.getHumidity();
        double temp = weather.getTemparature();
        if (rain > 8.0) return "No Irrigation Required — Heavy rainfall detected. Ensure proper drainage.";
        if (rain > 4.0) return "Delay Irrigation — Moderate rainfall is sufficient. Monitor soil moisture.";
        if (humidity > 80) return "Moderate Irrigation — High ambient humidity reduces water requirement by 30%.";
        if (temp > 38) return "Urgent Irrigation Required — Extreme heat causing rapid soil moisture loss.";
        if (temp > 32 && humidity < 40) return "Increased Irrigation Needed — Hot and dry conditions detected.";
        return "Standard Irrigation Schedule — Apply water every 3-4 days based on crop type.";
    }

    private String getHarvestWarning(WeatherEntity weather) {
        double rain = weather.getPrecipitation();
        double wind = weather.getWindSpeed();
        double temp = weather.getTemparature();
        if (rain > 10.0 || wind > 18) return "CRITICAL — Severe weather incoming. Harvest immediately if crops are mature.";
        if (rain > 6.0 || wind > 12) return "WARNING — Heavy rain or wind expected. Expedite harvest within 24 hours.";
        if (temp > 40) return "HEAT ALERT — Extreme temperature may damage crops. Monitor closely and harvest mature crops.";
        if (rain < 0.5 && weather.getHumidity() < 25) return "DROUGHT CONCERN — Prolonged dry spell. Consider early harvest for moisture-sensitive crops.";
        return "Conditions are favorable — Proceed with normal harvest schedule.";
    }

    private int calculateRiskScore(WeatherEntity weather) {
        int score = 0;
        if (weather.getPrecipitation() > 10) score += 30;
        else if (weather.getPrecipitation() > 5) score += 15;
        if (weather.getTemparature() > 40) score += 28;
        else if (weather.getTemparature() < 8) score += 22;
        else if (weather.getTemparature() > 35) score += 12;
        if (weather.getWindSpeed() > 18) score += 25;
        else if (weather.getWindSpeed() > 12) score += 12;
        if (weather.getHumidity() > 92) score += 17;
        else if (weather.getHumidity() < 15) score += 14;
        return Math.min(score, 100);
    }

    private String getRiskLevel(int score) {
        if (score >= 70) return "HIGH";
        if (score >= 40) return "MEDIUM";
        return "LOW";
    }

    private boolean isDroughtAlert(WeatherEntity weather) {
        return weather.getPrecipitation() < 0.5 && weather.getHumidity() < 30 && weather.getTemparature() > 32;
    }

    private String getSoilMoistureStatus(WeatherEntity weather) {
        if (weather.getPrecipitation() > 6) return "Saturated — Risk of waterlogging";
        if (weather.getPrecipitation() > 3) return "Adequate — Good for most crops";
        if (weather.getHumidity() > 70) return "Moderate — Monitor regularly";
        if (weather.getTemparature() > 36) return "Low — Rapid evaporation occurring";
        return "Moderate — Within acceptable range";
    }

    private String getFertilizerRecommendation(WeatherEntity weather) {
        if (weather.getPrecipitation() > 8) return "Avoid fertilizer application — Heavy rain will cause nutrient runoff.";
        if (weather.getTemparature() > 38) return "Apply foliar micronutrients early morning — High temp reduces absorption.";
        if (weather.getHumidity() > 85) return "Avoid urea application — High humidity increases volatilization losses.";
        return "Optimal conditions for basal fertilizer application — Apply NPK as recommended.";
    }

    private String getPestRisk(WeatherEntity weather) {
        if (weather.getHumidity() > 85 && weather.getTemparature() > 25) return "HIGH — Fungal disease and pest pressure elevated. Apply preventive fungicide.";
        if (weather.getHumidity() > 70 && weather.getTemparature() > 22) return "MEDIUM — Monitor for aphids, whiteflies, and fungal spots.";
        if (weather.getTemparature() > 35 && weather.getHumidity() < 40) return "MEDIUM — Risk of spider mites and thrips in dry conditions.";
        return "LOW — Conditions not conducive to major pest outbreaks.";
    }
}