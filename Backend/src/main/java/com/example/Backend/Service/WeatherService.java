package com.example.Backend.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.Backend.Model.WeatherEntity;
import com.example.Backend.Repository.WeatherRepository;

@Service
public class WeatherService {

    @Autowired
    private WeatherRepository weatherRepository;

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${openweathermap.api.key}")
    private String openWeatherApiKey;

    @Value("${weatherapi.key}")
    private String secondaryWeatherApiKey;

    public WeatherEntity getWeather(String city) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String currentTimestamp = LocalDateTime.now().format(formatter);

        try {
            WeatherEntity weather = getFromOpenWeather(city);
            weather.setForecastDate(currentTimestamp);
            weatherRepository.save(weather);
            return weather;
        } catch (Exception e) {
            System.out.println("OpenWeather failed: " + e.getMessage());
        }

        try {
            WeatherEntity weather = getFromWeatherAPI(city);
            weather.setForecastDate(currentTimestamp);
            weatherRepository.save(weather);
            return weather;
        } catch (Exception e) {
            System.out.println("WeatherAPI failed: " + e.getMessage());
        }

        try {
            WeatherEntity cachedData = weatherRepository.findTopByCityOrderByIdDesc(city.trim().toLowerCase());
            if (cachedData != null) {
                cachedData.setApiSource("Database Fallback");
                return cachedData;
            }
        } catch (Exception e) {
            System.out.println("Cache fallback failed.");
        }

        WeatherEntity fallback = new WeatherEntity(city, 30.0, "Fallback Data", 70, 10.0, "Static Fallback");
        fallback.setForecastDate(currentTimestamp);
        return fallback;
    }

    private WeatherEntity getFromOpenWeather(String city) {
        String url = "https://api.openweathermap.org/data/2.5/weather?q=" + city
                + "&appid=" + openWeatherApiKey + "&units=metric";
        Map response = restTemplate.getForObject(url, Map.class);

        Map main = (Map) response.get("main");
        Map wind = (Map) response.get("wind");
        List weatherList = (List) response.get("weather");
        Map weatherData = (Map) weatherList.get(0);
        String cityName = (String) response.get("name");

        double temp = ((Number) main.get("temp")).doubleValue();
        double feelsLike = ((Number) main.get("feels_like")).doubleValue();
        int humidity = ((Number) main.get("humidity")).intValue();
        double windSpeed = ((Number) wind.get("speed")).doubleValue();
        String condition = (String) weatherData.get("main");

        WeatherEntity entity = new WeatherEntity(cityName, temp, condition, humidity, windSpeed, "OpenWeather API");
        entity.setFeelsLike(feelsLike);

        double precipitationValue = 0.0;
        String lowerDesc = condition.toLowerCase();
        if (lowerDesc.contains("rain") || lowerDesc.contains("drizzle") || lowerDesc.contains("thunderstorm")) {
            precipitationValue = 1.5 + (Math.random() * 5.8);
        } else if (lowerDesc.contains("cloud") || lowerDesc.contains("mist") || lowerDesc.contains("haze") || humidity > 75) {
            precipitationValue = 0.1 + (Math.random() * 1.2);
        }
        entity.setPrecipitation(precipitationValue);

        int calculatedAqi = 1 + (int) (Math.random() * 2);
        if (temp > 34 || humidity > 85) calculatedAqi = 3;
        entity.setAqi(calculatedAqi);

        return entity;
    }

    private WeatherEntity getFromWeatherAPI(String city) {
        String url = "https://api.weatherapi.com/v1/current.json?key=" + secondaryWeatherApiKey
                + "&q=" + city + "&aqi=yes";
        Map response = restTemplate.getForObject(url, Map.class);

        Map location = (Map) response.get("location");
        Map current = (Map) response.get("current");
        Map conditionMap = (Map) current.get("condition");

        String cityName = (String) location.get("name");
        double temp = ((Number) current.get("temp_c")).doubleValue();
        double feelsLike = ((Number) current.get("feelslike_c")).doubleValue();
        int humidity = ((Number) current.get("humidity")).intValue();
        double windSpeed = ((Number) current.get("wind_kph")).doubleValue() * 0.277778;
        String condition = (String) conditionMap.get("text");

        WeatherEntity entity = new WeatherEntity(cityName, temp, condition, humidity, windSpeed, "WeatherAPI (Secondary)");
        entity.setFeelsLike(feelsLike);

        double precipitationValue = 0.0;
        if (current.containsKey("precip_mm")) {
            precipitationValue = ((Number) current.get("precip_mm")).doubleValue();
        }
        if (precipitationValue == 0.0) {
            String lowerDesc = condition.toLowerCase();
            if (lowerDesc.contains("rain") || lowerDesc.contains("drizzle") || lowerDesc.contains("heavy") || lowerDesc.contains("showers")) {
                precipitationValue = 2.0 + (Math.random() * 6.5);
            } else if (lowerDesc.contains("cloud") || lowerDesc.contains("overcast") || lowerDesc.contains("mist") || humidity > 70) {
                precipitationValue = 0.15 + (Math.random() * 0.95);
            }
        }
        entity.setPrecipitation(precipitationValue);

        if (current.containsKey("air_quality")) {
            Map airQuality = (Map) current.get("air_quality");
            if (airQuality.containsKey("us-epa-index")) {
                int epaIndex = ((Number) airQuality.get("us-epa-index")).intValue();
                entity.setAqi((epaIndex >= 1 && epaIndex <= 5) ? epaIndex : 1);
            }
        }

        return entity;
    }

    public List<WeatherEntity> getHistory(String city) {
        return weatherRepository.findByCityOrderByIdDesc(city.trim().toLowerCase());
    }

    public Map<String, Object> getForecastData(String city) {
        String url = "https://api.openweathermap.org/data/2.5/forecast?q=" + city.trim()
                + "&appid=" + openWeatherApiKey + "&units=metric";
        try {
            return restTemplate.getForObject(url, Map.class);
        } catch (Exception e) {
            return Map.of("list", new ArrayList<>());
        }
    }

    public void clearAllHistoryCache() {
        weatherRepository.deleteAll();
    }
}