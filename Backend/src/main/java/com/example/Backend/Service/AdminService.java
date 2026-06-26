package com.example.Backend.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Backend.DTO.AdminStatsDTO;
import com.example.Backend.Model.AlertEntity;
import com.example.Backend.Model.Chathistoryentity;
import com.example.Backend.Model.DisasterAlertEntity;
import com.example.Backend.Repository.AlertRepository;
import com.example.Backend.Repository.ChatHistoryRepository;
import com.example.Backend.Repository.DisasterAlertRepository;
import com.example.Backend.Repository.FarmerAdvisoryHistoryRepository;
import com.example.Backend.Repository.WeatherRepository;

@Service
public class AdminService {

    @Autowired
    private WeatherRepository weatherRepository;

    @Autowired
    private AlertRepository alertRepository;

    @Autowired
    private ChatHistoryRepository chatHistoryRepository;

    @Autowired
    private FarmerAdvisoryHistoryRepository farmerAdvisoryHistoryRepository;

    @Autowired
    private DisasterAlertRepository disasterAlertRepository;

    @Autowired
    private HealthService healthService;

    public AdminStatsDTO getStats() {
        AdminStatsDTO stats = new AdminStatsDTO();

        try { stats.setTotalSearches(weatherRepository.countAllSearches()); } catch (Exception ignored) { stats.setTotalSearches(0); }
        try { stats.setTotalChatRequests(chatHistoryRepository.countAllChats()); } catch (Exception ignored) { stats.setTotalChatRequests(0); }
        try { stats.setTotalActiveAlerts(alertRepository.count()); } catch (Exception ignored) { stats.setTotalActiveAlerts(0); }
        try { stats.setTotalFarmerAdvisories(farmerAdvisoryHistoryRepository.count()); } catch (Exception ignored) { stats.setTotalFarmerAdvisories(0); }
        try { stats.setTotalDisasterAlerts(disasterAlertRepository.count()); } catch (Exception ignored) { stats.setTotalDisasterAlerts(0); }
        try { stats.setDistinctCities(weatherRepository.countDistinctCities()); } catch (Exception ignored) { stats.setDistinctCities(0); }

        try {
            List<AlertEntity> allAlerts = alertRepository.findAll();
            long distinctUsers = allAlerts.stream()
                .map(AlertEntity::getEmail)
                .filter(Objects::nonNull)
                .distinct()
                .count();
            stats.setTotalDistinctUsers(distinctUsers);
        } catch (Exception ignored) { stats.setTotalDistinctUsers(0); }

        try {
            Map<String, Object> dbHealth = healthService.checkDatabaseHealth();
            stats.setDatabaseStatus((String) dbHealth.getOrDefault("status", "UNKNOWN"));
            stats.setDatabaseDetails("MySQL — " + dbHealth.getOrDefault("database", "UNKNOWN"));
        } catch (Exception ignored) {
            stats.setDatabaseStatus("UNKNOWN");
            stats.setDatabaseDetails("Unable to check database status.");
        }

        try {
            List<Object[]> rawCities = weatherRepository.findTopSearchedCities();
            List<Map<String, Object>> topCities = new ArrayList<>();
            int limit = Math.min(5, rawCities.size());
            for (int i = 0; i < limit; i++) {
                Object[] row = rawCities.get(i);
                Map<String, Object> entry = new LinkedHashMap<>();
                entry.put("city", row[0]);
                entry.put("count", row[1]);
                topCities.add(entry);
            }
            stats.setTopSearchedCities(topCities);
        } catch (Exception ignored) { stats.setTopSearchedCities(new ArrayList<>()); }

        try {
            List<Chathistoryentity> recentChats = chatHistoryRepository.findTop10ByOrderByTimestampDesc();
            List<Map<String, Object>> chatList = new ArrayList<>();
            for (Chathistoryentity chat : recentChats) {
                Map<String, Object> c = new LinkedHashMap<>();
                c.put("question", chat.getQuestion());
                c.put("city", chat.getCity() != null ? chat.getCity() : "N/A");
                c.put("timestamp", chat.getTimestamp() != null ? chat.getTimestamp().toString() : "");
                chatList.add(c);
            }
            stats.setRecentChatHistory(chatList);
        } catch (Exception ignored) { stats.setRecentChatHistory(new ArrayList<>()); }

        try {
            List<DisasterAlertEntity> recentAlerts = disasterAlertRepository.findTop10ByOrderByCreatedAtDesc();
            List<Map<String, Object>> alertList = new ArrayList<>();
            for (DisasterAlertEntity alert : recentAlerts) {
                Map<String, Object> a = new LinkedHashMap<>();
                a.put("city", alert.getCity());
                a.put("alertType", alert.getAlertType());
                a.put("severity", alert.getSeverity());
                a.put("riskScore", alert.getRiskScore());
                a.put("createdAt", alert.getCreatedAt() != null ? alert.getCreatedAt().toString() : "");
                alertList.add(a);
            }
            stats.setRecentDisasterAlerts(alertList);
        } catch (Exception ignored) { stats.setRecentDisasterAlerts(new ArrayList<>()); }

        try {
            List<Object[]> freqRaw = disasterAlertRepository.findAlertTypeFrequency();
            List<Map<String, Object>> freqList = new ArrayList<>();
            for (Object[] row : freqRaw) {
                Map<String, Object> f = new LinkedHashMap<>();
                f.put("type", row[0]);
                f.put("count", row[1]);
                freqList.add(f);
            }
            stats.setAlertTypeFrequency(freqList);
        } catch (Exception ignored) { stats.setAlertTypeFrequency(new ArrayList<>()); }

        return stats;
    }
}