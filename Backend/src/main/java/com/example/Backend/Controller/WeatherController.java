package com.example.Backend.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.Backend.Exception.InvalidRequestException;
import com.example.Backend.Exception.WeatherNotFoundException;
import com.example.Backend.Model.AlertEntity;
import com.example.Backend.Model.WeatherEntity;
import com.example.Backend.Service.AlertService;
import com.example.Backend.Service.WeatherService;

@RestController
@RequestMapping("/weather")
public class WeatherController {

    @Autowired
    private WeatherService weatherService;

    @Autowired
    private AlertService alertService;

    @GetMapping
    public WeatherEntity getWeather(@RequestParam String city) {
        if (city == null || city.trim().isEmpty()) {
            throw new InvalidRequestException("City parameter cannot be empty.");
        }
        WeatherEntity result = weatherService.getWeather(city);
        if (result == null) {
            throw new WeatherNotFoundException("Weather data could not be retrieved for city: " + city);
        }
        return result;
    }

    @GetMapping("/history")
    public List<WeatherEntity> getWeatherHistory(@RequestParam String city) {
        if (city == null || city.trim().isEmpty()) {
            throw new InvalidRequestException("City parameter cannot be empty.");
        }
        return weatherService.getHistory(city);
    }

    @GetMapping("/forecast")
    public Map<String, Object> getWeatherForecast(@RequestParam String city) {
        if (city == null || city.trim().isEmpty()) {
            throw new InvalidRequestException("City parameter cannot be empty.");
        }
        return weatherService.getForecastData(city);
    }

    @GetMapping("/suggestions")
    public List<String> getCitySuggestions(@RequestParam String prefix) {
        return weatherService.getCitySuggestions(prefix);
    }

    @GetMapping("/analytics")
    public Map<String, Object> getAnalyticsSummary() {
        return weatherService.getAnalyticsSummary();
    }

    @PostMapping("/alerts")
    public AlertEntity registerAlert(@RequestBody AlertEntity alert) {
        if (alert.getCity() == null || alert.getCity().trim().isEmpty()
                || alert.getEmail() == null || alert.getEmail().trim().isEmpty()) {
            throw new InvalidRequestException("Email and city are required to register an alert.");
        }
        return alertService.saveAlert(alert);
    }

    @DeleteMapping("/history/clear")
    public Map<String, String> clearCacheHistory() {
        weatherService.clearAllHistoryCache();
        return Map.of("status", "success", "message", "History cleared successfully.");
    }

    @DeleteMapping("/alerts/disable")
    public Map<String, String> disableSpecificAlert(@RequestParam String email, @RequestParam String city) {
        alertService.deleteSpecificAlert(email, city);
        return Map.of("status", "success", "message", "Alert disabled successfully.");
    }
}