package com.example.Backend.Service;

import com.example.Backend.DTO.DisasterAlertDTO;
import com.example.Backend.Model.DisasterAlertEntity;
import com.example.Backend.Model.WeatherEntity;
import com.example.Backend.Repository.DisasterAlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class DisasterService {

    @Autowired
    private WeatherService weatherService;

    @Autowired
    private DisasterAlertRepository disasterAlertRepository;

    public DisasterAlertDTO assessRisk(String city) {
        WeatherEntity weather;
        try {
            weather = weatherService.getWeather(city);
        } catch (Exception e) {
            weather = new WeatherEntity(city, 30.0, "Unknown", 60, 5.0, "Fallback");
        }

        DisasterAlertDTO dto = new DisasterAlertDTO();
        dto.setCity(city);
        dto.setTimestamp(LocalDateTime.now());

        int cyclone = calcCycloneRisk(weather);
        int flood = calcFloodRisk(weather);
        int heat = calcHeatwaveRisk(weather);
        int thunder = calcThunderstormRisk(weather);
        int landslide = calcLandslideRisk(weather);
        int heavyRain = calcHeavyRainRisk(weather);

        dto.setCycloneRisk(cyclone);
        dto.setFloodRisk(flood);
        dto.setHeatwaveRisk(heat);
        dto.setThunderstormRisk(thunder);
        dto.setLandslideRisk(landslide);
        dto.setHeavyRainRisk(heavyRain);

        int maxRisk = Collections.max(Arrays.asList(cyclone, flood, heat, thunder, landslide, heavyRain));
        dto.setOverallRiskScore(maxRisk);
        dto.setOverallRiskLevel(getRiskLevel(maxRisk));
        dto.setOverallRiskColor(getRiskColor(maxRisk));
        dto.setActiveAlertTypes(buildActiveAlerts(cyclone, flood, heat, thunder, landslide, heavyRain));
        dto.setInstructions(buildInstructions(dto));
        dto.setEmergencyContacts(buildEmergencyContacts());
        dto.setLatitude(0.0);
        dto.setLongitude(0.0);

        if (maxRisk >= 55) {
            DisasterAlertEntity entity = new DisasterAlertEntity();
            entity.setCity(city.trim().toLowerCase());
            entity.setAlertType(getHighestRiskType(dto));
            entity.setSeverity(dto.getOverallRiskLevel());
            entity.setDescription("Auto-generated risk assessment for " + city + " — Score: " + maxRisk);
            entity.setRiskScore(maxRisk);
            entity.setCreatedAt(LocalDateTime.now());
            disasterAlertRepository.save(entity);
        }

        return dto;
    }

    private int calcCycloneRisk(WeatherEntity w) {
        double wind = w.getWindSpeed();
        if (wind > 22) return 92;
        if (wind > 15) return 72;
        if (wind > 10) return 45;
        if (wind > 7) return 25;
        return 12;
    }

    private int calcFloodRisk(WeatherEntity w) {
        double rain = w.getPrecipitation();
        if (rain > 10) return 92;
        if (rain > 5) return 70;
        if (rain > 2) return 45;
        if (rain > 0.5) return 22;
        return 10;
    }

    private int calcHeatwaveRisk(WeatherEntity w) {
        double temp = w.getTemparature();
        if (temp > 45) return 95;
        if (temp > 42) return 80;
        if (temp > 38) return 60;
        if (temp > 35) return 38;
        return 10;
    }

    private int calcThunderstormRisk(WeatherEntity w) {
        int hum = w.getHumidity();
        double wind = w.getWindSpeed();
        if (hum > 88 && wind > 8) return 78;
        if (hum > 82) return 55;
        if (hum > 75) return 32;
        return 12;
    }

    private int calcLandslideRisk(WeatherEntity w) {
        double rain = w.getPrecipitation();
        int hum = w.getHumidity();
        if (rain > 8 && hum > 82) return 82;
        if (rain > 5) return 58;
        if (rain > 2 && hum > 72) return 35;
        return 10;
    }

    private int calcHeavyRainRisk(WeatherEntity w) {
        double rain = w.getPrecipitation();
        if (rain > 10) return 90;
        if (rain > 6) return 68;
        if (rain > 3) return 42;
        if (rain > 1) return 22;
        return 8;
    }

    private String getRiskLevel(int score) {
        if (score >= 76) return "CRITICAL";
        if (score >= 51) return "DANGER";
        if (score >= 26) return "WARNING";
        return "SAFE";
    }

    private String getRiskColor(int score) {
        if (score >= 76) return "#dc2626";
        if (score >= 51) return "#ea580c";
        if (score >= 26) return "#ca8a04";
        return "#16a34a";
    }

    private List<String> buildActiveAlerts(int cyclone, int flood, int heat, int thunder, int landslide, int rain) {
        List<String> alerts = new ArrayList<>();
        if (cyclone >= 51) alerts.add("CYCLONE: " + getRiskLevel(cyclone));
        if (flood >= 51) alerts.add("FLOOD: " + getRiskLevel(flood));
        if (heat >= 51) alerts.add("HEATWAVE: " + getRiskLevel(heat));
        if (thunder >= 51) alerts.add("THUNDERSTORM: " + getRiskLevel(thunder));
        if (landslide >= 51) alerts.add("LANDSLIDE: " + getRiskLevel(landslide));
        if (rain >= 51) alerts.add("HEAVY RAIN: " + getRiskLevel(rain));
        return alerts;
    }

    private Map<String, String> buildInstructions(DisasterAlertDTO dto) {
        Map<String, String> instr = new LinkedHashMap<>();
        if (dto.getCycloneRisk() >= 51) instr.put("CYCLONE", "Stay indoors. Secure loose objects. Move away from coastal areas. Keep emergency kit ready.");
        if (dto.getFloodRisk() >= 51) instr.put("FLOOD", "Move to higher ground immediately. Avoid flooded roads. Disconnect electrical appliances.");
        if (dto.getHeatwaveRisk() >= 51) instr.put("HEATWAVE", "Stay hydrated. Avoid outdoor activity between 12-4 PM. Use cooling measures. Check on elderly.");
        if (dto.getThunderstormRisk() >= 51) instr.put("THUNDERSTORM", "Stay indoors. Unplug electronics. Avoid tall trees. Move vehicles to covered shelter.");
        if (dto.getLandslideRisk() >= 51) instr.put("LANDSLIDE", "Evacuate steep slopes immediately. Monitor soil movement. Contact local disaster authority.");
        if (dto.getHeavyRainRisk() >= 51) instr.put("HEAVY RAIN", "Ensure drainage channels are clear. Avoid low-lying flood-prone areas. Postpone all outdoor events.");
        if (instr.isEmpty()) instr.put("GENERAL", "No immediate threats detected. Stay informed via local weather bulletins and official channels.");
        return instr;
    }

    private Map<String, Object> buildEmergencyContacts() {
        Map<String, Object> contacts = new LinkedHashMap<>();
        contacts.put("National Disaster Helpline", "1078");
        contacts.put("Police Emergency", "100");
        contacts.put("Ambulance", "108");
        contacts.put("Fire Department", "101");
        contacts.put("Coast Guard", "1554");
        return contacts;
    }

    private String getHighestRiskType(DisasterAlertDTO dto) {
        Map<String, Integer> risks = new LinkedHashMap<>();
        risks.put("CYCLONE", dto.getCycloneRisk());
        risks.put("FLOOD", dto.getFloodRisk());
        risks.put("HEATWAVE", dto.getHeatwaveRisk());
        risks.put("THUNDERSTORM", dto.getThunderstormRisk());
        risks.put("LANDSLIDE", dto.getLandslideRisk());
        risks.put("HEAVY_RAIN", dto.getHeavyRainRisk());
        return risks.entrySet().stream()
            .max(Map.Entry.comparingByValue())
            .map(Map.Entry::getKey)
            .orElse("GENERAL");
    }

    public List<DisasterAlertEntity> getAlertHistory(String city) {
        return disasterAlertRepository.findByCityOrderByCreatedAtDesc(city.trim().toLowerCase());
    }
}