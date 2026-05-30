package com.example.Backend.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "weather_entity")
public class WeatherEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String city;
    private double temparature;

    @Column(name = "feels_like")
    private double feelsLike;
    
    private int humidity;

    @Column(name = "wind_speed")
    private double windSpeed;
    
    private String description;

    @Column(name = "forecast_date")
    private String forecastDate;

    @Column(name = "api_source")
    private String apiSource;

    private int aqi;
    private double precipitation;

    public WeatherEntity() {}

    public WeatherEntity(Long id, String city, double temparature, double feelsLike, int humidity, double windSpeed, String description, String forecastDate, String apiSource, int aqi, double precipitation) {
        this.id = id;
        this.city = city != null ? city.trim().toLowerCase() : null;
        this.temparature = temparature;
        this.feelsLike = feelsLike;
        this.humidity = humidity;
        this.windSpeed = windSpeed;
        this.description = description;
        this.forecastDate = forecastDate;
        this.apiSource = apiSource;
        this.aqi = aqi;
        this.precipitation = precipitation;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city != null ? city.trim().toLowerCase() : null; }
    public double getTemparature() { return temparature; }
    public void setTemparature(double temparature) { this.temparature = temparature; }
    public double getFeelsLike() { return feelsLike; }
    public void setFeelsLike(double feelsLike) { this.feelsLike = feelsLike; }
    public int getHumidity() { return humidity; }
    public void setHumidity(int humidity) { this.humidity = humidity; }
    public double getWindSpeed() { return windSpeed; }
    public void setWindSpeed(double windSpeed) { this.windSpeed = windSpeed; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getForecastDate() { return forecastDate; }
    public void setForecastDate(String forecastDate) { this.forecastDate = forecastDate; }
    public String getApiSource() { return apiSource; }
    public void setApiSource(String apiSource) { this.apiSource = apiSource; }
    public int getAqi() { return aqi; }
    public void setAqi(int aqi) { this.aqi = aqi; }
    public double getPrecipitation() { return precipitation; }
    public void setPrecipitation(double precipitation) { this.precipitation = precipitation; }
}