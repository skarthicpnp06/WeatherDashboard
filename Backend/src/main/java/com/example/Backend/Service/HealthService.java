package com.example.Backend.Service;

import java.sql.Connection;
import java.util.LinkedHashMap;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class HealthService {

    @Autowired
    private DataSource dataSource;

    public Map<String, Object> checkDatabaseHealth() {
        Map<String, Object> result = new LinkedHashMap<>();
        try (Connection connection = dataSource.getConnection()) {
            boolean valid = connection.isValid(3);
            String url = connection.getMetaData().getURL();
            String safeUrl = url.replaceAll("password=[^&]*", "password=****");
            result.put("status", valid ? "UP" : "DOWN");
            result.put("database", valid ? "CONNECTED" : "DISCONNECTED");
            result.put("databaseType", "MySQL");
            result.put("connectionUrl", safeUrl);
            result.put("driverVersion", connection.getMetaData().getDriverVersion());
        } catch (Exception e) {
            result.put("status", "DOWN");
            result.put("database", "DISCONNECTED");
            result.put("error", e.getMessage());
        }
        return result;
    }
}