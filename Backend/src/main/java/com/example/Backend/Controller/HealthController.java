package com.example.Backend.Controller;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Backend.Service.HealthService;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @Autowired
    private HealthService healthService;

    @GetMapping
    public Map<String, Object> health() {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("status", "UP");
        result.put("service", "SkySync Weather Intelligence Platform");
        result.put("version", "2.0.0");
        return result;
    }

    @GetMapping("/database")
    public Map<String, Object> databaseHealth() {
        return healthService.checkDatabaseHealth();
    }
}