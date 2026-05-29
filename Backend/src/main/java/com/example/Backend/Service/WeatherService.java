package com.example.Backend.Service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.Backend.Model.WeatherEntity;
import com.example.Backend.Repository.WeatherRepository;

@Service
public class WeatherService {

    @Autowired
    private WeatherRepository weatherRepository;
    
    private final RestTemplate restTemplate;
    
    // Configured valid OpenWeather Keys 
    private final String PRIMARY_API_KEY = "f5e923868577018c7a11ff3623dafb41"; 
   
    private final String BACKUP_API_KEY = "4d2f4f3e0060493d95860505262705"; 

    public WeatherService() {
        
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(3000); 
        factory.setReadTimeout(3000);    
        this.restTemplate = new RestTemplate(factory);
    }

    public WeatherEntity getWeather(String city) {
        String cleanCity = city.trim().toLowerCase();
        
        // ROUTE 1: Try Primary API
        try {
            System.out.println("Querying Primary Weather Stream API for: " + cleanCity);
            String url = String.format("https://api.openweathermap.org/data/2.5/weather?q=%s&appid=%s&units=metric", cleanCity, PRIMARY_API_KEY);
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            if (response != null) {
                return saveIncomingWeatherData(cleanCity, response);
            }
        } catch (Exception e) {
            System.err.println("Primary API pipeline failed: " + e.getMessage() + ". Shifting execution thread to Backup API...");
        }

        // ROUTE 2: Try Backup API
        try {
            System.out.println("Querying Backup Weather Stream API for: " + cleanCity);
            String url = String.format("https://api.openweathermap.org/data/2.5/weather?q=%s&appid=%s&units=metric", cleanCity, BACKUP_API_KEY);
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            if (response != null) {
                return saveIncomingWeatherData(cleanCity, response);
            }
        } catch (Exception e) {
            System.err.println("Backup API pipeline failed: " + e.getMessage() + ". Dropping path to internal storage cache...");
        }

        // ROUTE 3: Fallback to Database Cache Engine
        System.out.println("Retrieving system logs from local database cache for: " + cleanCity);
        WeatherEntity cachedRecord = weatherRepository.findTopByCityOrderByIdDesc(cleanCity);
        if (cachedRecord != null) {
            return cachedRecord;
        }

        throw new RuntimeException("Weather matrix unavailable. Remote APIs are offline and no cache logs exist for: " + city);
    }

    public Map<String, Object> getForecastData(String city) {
        String cleanCity = city.trim().toLowerCase();
        try {
            String url = String.format("https://api.openweathermap.org/data/2.5/forecast?q=%s&appid=%s&units=metric", cleanCity, PRIMARY_API_KEY);
            return restTemplate.getForObject(url, Map.class);
        } catch (Exception e) {
            try {
                String url = String.format("https://api.openweathermap.org/data/2.5/forecast?q=%s&appid=%s&units=metric", cleanCity, BACKUP_API_KEY);
                return restTemplate.getForObject(url, Map.class);
            } catch (Exception ex) {
                throw new RuntimeException("Failed to extract 5-day forecast arrays from both API resources: " + ex.getMessage());
            }
        }
    }

    private WeatherEntity saveIncomingWeatherData(String city, Map<String, Object> response) {
        WeatherEntity entity = new WeatherEntity();
        entity.setCity(city.trim().toLowerCase());

        // Safely map metrics to prevent parsing/casting issues
        Map<String, Object> main = (Map<String, Object>) response.get("main");
        if (main != null) {
            entity.setTemparature(main.get("temp") != null ? ((Number) main.get("temp")).doubleValue() : 0.0);
            entity.setFeelsLike(main.get("feels_like") != null ? ((Number) main.get("feels_like")).doubleValue() : 0.0);
            entity.setHumidity(main.get("humidity") != null ? ((Number) main.get("humidity")).intValue() : 0);
        }

        Map<String, Object> wind = (Map<String, Object>) response.get("wind");
        if (wind != null && wind.get("speed") != null) {
            entity.setWindSpeed(((Number) wind.get("speed")).doubleValue());
        } else {
            entity.setWindSpeed(0.0);
        }

        List<Map<String, Object>> weatherArray = (List<Map<String, Object>>) response.get("weather");
        if (weatherArray != null && !weatherArray.isEmpty()) {
            entity.setDescription(weatherArray.get(0).get("description").toString());
        } else {
            entity.setDescription("clear sky");
        }

        return weatherRepository.save(entity);
    }

    public List<WeatherEntity> getHistory(String city) {
        return weatherRepository.findByCityOrderByIdDesc(city.trim().toLowerCase());
    }
}