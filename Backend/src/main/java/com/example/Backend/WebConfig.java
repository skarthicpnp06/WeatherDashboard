package com.example.Backend;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                // Explicitly allow your production deployment origin and local development environments
                .allowedOrigins(
                    "https://weather-dashboard-987s.vercel.app", 
                    "https://weather-dashboard-eqlz-5asnia82h-karthic-s-projects.vercel.app"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600); // Cache the preflight response for 1 hour
    }
}