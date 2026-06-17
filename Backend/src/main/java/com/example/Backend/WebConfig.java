package com.example.Backend;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
public void addCorsMappings(CorsRegistry registry) {
    // Change this to explicitly map all pathways including internal exception fallbacks
    registry.addMapping("/**")
            .allowedOrigins("https://weather-dashboard-987s.vercel.app")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .exposedHeaders("Access-Control-Allow-Origin")
            .allowCredentials(true);
}
}