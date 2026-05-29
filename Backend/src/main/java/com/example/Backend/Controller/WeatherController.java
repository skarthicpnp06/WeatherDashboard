package com.example.Backend.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.Backend.Model.AlertEntity;
import com.example.Backend.Model.WeatherEntity;
import com.example.Backend.Service.AlertService;
import com.example.Backend.Service.WeatherService;

@RestController
@RequestMapping("/weather")
@CrossOrigin(origins = "http://localhost:5173")
public class WeatherController {

    @Autowired
    private WeatherService weatherService;

    @Autowired
    private AlertService alertService;

    @GetMapping
    public WeatherEntity getWeather(@RequestParam String city) {
        return weatherService.getWeather(city);
    }

    @GetMapping("/history")
    public List<WeatherEntity> getWeatherHistory(@RequestParam String city) {
        return weatherService.getHistory(city);
    }

    @GetMapping("/forecast")
    public Map<String, Object> getWeatherForecast(@RequestParam String city) {
        return weatherService.getForecastData(city);
    }

    @PostMapping("/alerts")
    public AlertEntity registerAlert(@RequestBody AlertEntity alert) {
        return alertService.saveAlert(alert);
    }
}