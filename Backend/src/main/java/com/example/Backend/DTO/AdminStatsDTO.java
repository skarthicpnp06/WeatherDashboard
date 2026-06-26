package com.example.Backend.DTO;

import java.util.List;
import java.util.Map;

public class AdminStatsDTO {

    private long totalSearches;
    private long totalChatRequests;
    private long totalActiveAlerts;
    private long totalFarmerAdvisories;
    private long totalDisasterAlerts;
    private long distinctCities;
    private long totalDistinctUsers;
    private String databaseStatus;
    private String databaseDetails;
    private List<Map<String, Object>> topSearchedCities;
    private List<Map<String, Object>> recentChatHistory;
    private List<Map<String, Object>> recentDisasterAlerts;
    private List<Map<String, Object>> alertTypeFrequency;

    public AdminStatsDTO() {}

    public long getTotalSearches() { return totalSearches; }
    public void setTotalSearches(long totalSearches) { this.totalSearches = totalSearches; }
    public long getTotalChatRequests() { return totalChatRequests; }
    public void setTotalChatRequests(long totalChatRequests) { this.totalChatRequests = totalChatRequests; }
    public long getTotalActiveAlerts() { return totalActiveAlerts; }
    public void setTotalActiveAlerts(long totalActiveAlerts) { this.totalActiveAlerts = totalActiveAlerts; }
    public long getTotalFarmerAdvisories() { return totalFarmerAdvisories; }
    public void setTotalFarmerAdvisories(long totalFarmerAdvisories) { this.totalFarmerAdvisories = totalFarmerAdvisories; }
    public long getTotalDisasterAlerts() { return totalDisasterAlerts; }
    public void setTotalDisasterAlerts(long totalDisasterAlerts) { this.totalDisasterAlerts = totalDisasterAlerts; }
    public long getDistinctCities() { return distinctCities; }
    public void setDistinctCities(long distinctCities) { this.distinctCities = distinctCities; }
    public long getTotalDistinctUsers() { return totalDistinctUsers; }
    public void setTotalDistinctUsers(long totalDistinctUsers) { this.totalDistinctUsers = totalDistinctUsers; }
    public String getDatabaseStatus() { return databaseStatus; }
    public void setDatabaseStatus(String databaseStatus) { this.databaseStatus = databaseStatus; }
    public String getDatabaseDetails() { return databaseDetails; }
    public void setDatabaseDetails(String databaseDetails) { this.databaseDetails = databaseDetails; }
    public List<Map<String, Object>> getTopSearchedCities() { return topSearchedCities; }
    public void setTopSearchedCities(List<Map<String, Object>> topSearchedCities) { this.topSearchedCities = topSearchedCities; }
    public List<Map<String, Object>> getRecentChatHistory() { return recentChatHistory; }
    public void setRecentChatHistory(List<Map<String, Object>> recentChatHistory) { this.recentChatHistory = recentChatHistory; }
    public List<Map<String, Object>> getRecentDisasterAlerts() { return recentDisasterAlerts; }
    public void setRecentDisasterAlerts(List<Map<String, Object>> recentDisasterAlerts) { this.recentDisasterAlerts = recentDisasterAlerts; }
    public List<Map<String, Object>> getAlertTypeFrequency() { return alertTypeFrequency; }
    public void setAlertTypeFrequency(List<Map<String, Object>> alertTypeFrequency) { this.alertTypeFrequency = alertTypeFrequency; }
}
