package com.example.Backend.Service;

import java.util.ArrayList;
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
    private final String OPENWEATHER_API_KEY = "-f5e923868577018c7a11ff3623dafb41";
    private final String WEATHERAPI_KEY = "4d2f4f3e0060493d95860505262705";

    public WeatherEntity getWeather(String city) {
        String cleanCity = city.trim().toLowerCase();
        
        try {
            String url1 = "https://api.openweathermap.org/data/2.5/weather?q=" + cleanCity + "&appid=" + OPENWEATHER_API_KEY + "&units=metric";
            Map<String, Object> response = restTemplate.getForObject(url1, Map.class);

            if (response != null) {
                WeatherEntity weather = new WeatherEntity();
                weather.setCity(cleanCity);
                weather.setApiSource("OpenWeatherMap");
                
                Map<String, Object> main = (Map<String, Object>) response.get("main");
                weather.setTemparature(((Number) main.get("temp")).doubleValue());
                weather.setFeelsLike(((Number) main.get("feels_like")).doubleValue());
                weather.setHumidity(((Number) main.get("humidity")).intValue());

                Map<String, Object> wind = (Map<String, Object>) response.get("wind");
                weather.setWindSpeed(((Number) wind.get("speed")).doubleValue());

                List<Map<String, Object>> details = (List<Map<String, Object>>) response.get("weather");
                weather.setDescription((String) details.get(0).get("description"));
                weather.setForecastDate(new java.util.Date().toString());

                if (response.containsKey("rain")) {
                    Map<String, Object> rain = (Map<String, Object>) response.get("rain");
                    if (rain.containsKey("1h")) {
                        weather.setPrecipitation(((Number) rain.get("1h")).doubleValue());
                    } else if (rain.containsKey("3h")) {
                        weather.setPrecipitation(((Number) rain.get("3h")).doubleValue());
                    }
                } else {
                    weather.setPrecipitation(0.0);
                }

                try {
                    Map<String, Object> coord = (Map<String, Object>) response.get("coord");
                    double lat = ((Number) coord.get("lat")).doubleValue();
                    double lon = ((Number) coord.get("lon")).doubleValue();
                    String aqiUrl = "https://api.openweathermap.org/data/2.5/air_pollution?lat=" + lat + "&lon=" + lon + "&appid=" + OPENWEATHER_API_KEY;
                    Map<String, Object> aqiResponse = restTemplate.getForObject(aqiUrl, Map.class);
                    if (aqiResponse != null && aqiResponse.containsKey("list")) {
                        List<Map<String, Object>> aqiList = (List<Map<String, Object>>) aqiResponse.get("list");
                        Map<String, Object> aqiMain = (Map<String, Object>) aqiList.get(0).get("main");
                        weather.setAqi(((Number) aqiMain.get("aqi")).intValue());
                    }
                } catch (Exception e) {
                    weather.setAqi(1);
                }

                return weatherRepository.save(weather);
            }
            
        } catch (Exception primaryEx) {
            try {
                String url2 = "https://api.weatherapi.com/v1/current.json?key=" + WEATHERAPI_KEY + "&q=" + cleanCity + "&aqi=yes";
                Map<String, Object> response2 = restTemplate.getForObject(url2, Map.class);

                if (response2 != null) {
                    WeatherEntity weather = new WeatherEntity();
                    weather.setCity(cleanCity);
                    weather.setApiSource("WeatherAPI Fallback");

                    Map<String, Object> current = (Map<String, Object>) response2.get("current");
                    weather.setTemparature(((Number) current.get("temp_c")).doubleValue());
                    weather.setFeelsLike(((Number) current.get("feelslike_c")).doubleValue());
                    weather.setHumidity(((Number) current.get("humidity")).intValue());
                    weather.setWindSpeed(((Number) current.get("wind_kph")).doubleValue() / 3.6);
                    weather.setPrecipitation(((Number) current.get("precip_mm")).doubleValue());

                    Map<String, Object> condition = (Map<String, Object>) current.get("condition");
                    weather.setDescription((String) condition.get("text"));
                    weather.setForecastDate(new java.util.Date().toString());

                    if (current.containsKey("air_quality")) {
                        Map<String, Object> aqData = (Map<String, Object>) current.get("air_quality");
                        int usEpaIndex = ((Number) aqData.get("us-epa-index")).intValue();
                        weather.setAqi(usEpaIndex);
                    } else {
                        weather.setAqi(1);
                    }

                    return weatherRepository.save(weather);
                }
                
            } catch (Exception fallbackEx) {
                System.err.println("All cloud weather services down.");
            }
        }

        WeatherEntity cachedData = weatherRepository.findTopByCityOrderByIdDesc(cleanCity);
        if (cachedData != null) {
            return cachedData;
        }
        
        return new WeatherEntity(0L, cleanCity, 0.0, 0.0, 0, 0.0, "Atmospheric stream offline (Offline Node)", "N/A", "Local Database Offline Cache", 0, 0.0);
    }

    public List<WeatherEntity> getHistory(String city) {
        return weatherRepository.findByCityOrderByIdDesc(city.trim().toLowerCase());
    }

    public Map<String, Object> getForecastData(String city) {
        String url = "https://api.openweathermap.org/data/2.5/forecast?q=" + city.trim() + "&appid=" + OPENWEATHER_API_KEY + "&units=metric";
        try {
            return restTemplate.getForObject(url, Map.class);
        } catch (Exception e) {
            return Map.of("list", new ArrayList<>());
        }
    }
}