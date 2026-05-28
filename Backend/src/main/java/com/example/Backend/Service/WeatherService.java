package com.example.Backend.Service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.Backend.Model.WeatherEntity;
import com.example.Backend.Repository.WeatherRepository;

@Service
public class WeatherService {

    @Autowired
    private WeatherRepository weatherRepository;

    private final RestTemplate restTemplate = new RestTemplate();
    
    private final String PRIMARY_API_KEY = "f5e923868577018c7a11ff3623dafb41"; 
    private final String BACKUP_API_KEY = "4d2f4f3e0060493d95860505262705";

    public WeatherEntity getWeather(String city) {
        String cleanCity = city.trim().toLowerCase();
        
        try {
            String url = String.format("https://api.openweathermap.org/data/2.5/weather?q=%s&appid=%s&units=metric", cleanCity, PRIMARY_API_KEY);
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            if (response != null) {
                return saveIncomingWeatherData(cleanCity, response);
            }
        } catch (Exception e) {
            System.err.println("Primary API failed. Switching to backup provider: " + e.getMessage());
        }

        try {
            String url = String.format("https://api.openweathermap.org/data/2.5/weather?q=%s&appid=%s&units=metric", cleanCity, BACKUP_API_KEY);
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            if (response != null) {
                return saveIncomingWeatherData(cleanCity, response);
            }
        } catch (Exception e) {
            System.err.println("Backup API failed. Using history cache...");
        }

        WeatherEntity cachedRecord = weatherRepository.findTopByCityOrderByIdDesc(cleanCity);
        if (cachedRecord != null) {
            return cachedRecord;
        }

        throw new RuntimeException("All weather APIs are offline and no backup logs exist for: " + city);
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
                throw new RuntimeException("Failed to fetch forecast from both APIs: " + ex.getMessage());
            }
        }
    }

    private WeatherEntity saveIncomingWeatherData(String city, Map<String, Object> response) {
        WeatherEntity entity = new WeatherEntity();
        entity.setCity(city);

        Map<String, Object> main = (Map<String, Object>) response.get("main");
        entity.setTemparature(Double.parseDouble(main.get("temp").toString()));
        entity.setFeelsLike(Double.parseDouble(main.get("feels_like").toString()));
        entity.setHumidity(Integer.parseInt(main.get("humidity").toString()));

        Map<String, Object> wind = (Map<String, Object>) response.get("wind");
        entity.setWindSpeed(Double.parseDouble(wind.get("speed").toString()));

        List<Map<String, Object>> weatherArray = (List<Map<String, Object>>) response.get("weather");
        entity.setDescription(weatherArray.get(0).get("description").toString());

        return weatherRepository.save(entity);
    }

    public List<WeatherEntity> getHistory(String city) {
        return weatherRepository.findByCityOrderByIdDesc(city.trim().toLowerCase());
    }
}