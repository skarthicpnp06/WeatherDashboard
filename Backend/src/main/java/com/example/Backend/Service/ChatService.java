package com.example.Backend.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.Backend.DTO.ChatRequestDTO;
import com.example.Backend.DTO.ChatResponseDTO;
import com.example.Backend.Model.Chathistoryentity;
import com.example.Backend.Model.WeatherEntity;
import com.example.Backend.Repository.ChatHistoryRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class ChatService {

    private static final String GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

    @Value("${groq.api.key}")
    private String groqApiKey;

    @Value("${groq.model:llama-3.3-70b-versatile}")
    private String groqModel;

    @Autowired
    private ChatHistoryRepository chatHistoryRepository;

    @Autowired
    private WeatherService weatherService;

    @Autowired
    private ObjectMapper objectMapper;

    private final HttpClient httpClient = HttpClient.newBuilder()
        .connectTimeout(Duration.ofSeconds(10))
        .build();

    public ChatResponseDTO processMessage(ChatRequestDTO request) {
        String weatherContext = buildWeatherContext(request.getCity());
        String systemPrompt = buildSystemPrompt(weatherContext);
        String answer = callGroqAPI(systemPrompt, request.getMessage());

        Chathistoryentity history = new Chathistoryentity();
        history.setQuestion(request.getMessage());
        history.setAnswer(answer);
        history.setCity(request.getCity() != null ? request.getCity().trim().toLowerCase() : null);
        history.setTimestamp(LocalDateTime.now());
        Chathistoryentity saved = chatHistoryRepository.save(history);

        return new ChatResponseDTO(answer, request.getCity(), LocalDateTime.now(), saved.getChatId());
    }

    private String buildWeatherContext(String city) {
        if (city == null || city.trim().isEmpty()) return "";
        try {
            WeatherEntity w = weatherService.getWeather(city);
            return String.format(
                "Live weather for %s: Temp=%.1f°C, Feels like=%.1f°C, Humidity=%d%%, " +
                "Wind=%.1f m/s, Condition=%s, AQI=%d, Precipitation=%.2fmm.",
                city, w.getTemparature(), w.getFeelsLike(), w.getHumidity(),
                w.getWindSpeed(), w.getDescription(), w.getAqi(), w.getPrecipitation()
            );
        } catch (Exception e) {
            return "";
        }
    }

    private String buildSystemPrompt(String weatherContext) {
        StringBuilder sb = new StringBuilder();
        sb.append("You are SkySync AI, an intelligent weather assistant embedded in a weather intelligence platform. ");
        sb.append("You provide accurate, concise, and helpful advice on: current weather conditions, ");
        sb.append("rain prediction, AQI and air quality advice, travel recommendations, health warnings, ");
        sb.append("clothing suggestions, disaster preparedness (cyclones, floods, heatwaves), ");
        sb.append("and agricultural/farmer advisories (crop suitability, irrigation, harvest). ");
        sb.append("Be professional, friendly, and practical. Keep responses under 200 words. ");
        sb.append("Use bullet points for lists. If you don't have enough data, say so clearly. ");
        if (!weatherContext.isEmpty()) {
            sb.append("\n\nCurrent Live Weather Data: ").append(weatherContext);
        }
        return sb.toString();
    }

    private String callGroqAPI(String systemPrompt, String userMessage) {
        try {
            List<Map<String, String>> messages = new ArrayList<>();

            Map<String, String> sysMsg = new HashMap<>();
            sysMsg.put("role", "system");
            sysMsg.put("content", systemPrompt);
            messages.add(sysMsg);

            Map<String, String> userMsg = new HashMap<>();
            userMsg.put("role", "user");
            userMsg.put("content", userMessage);
            messages.add(userMsg);

            Map<String, Object> requestBody = new LinkedHashMap<>();
            requestBody.put("model", groqModel);
            requestBody.put("messages", messages);
            requestBody.put("max_tokens", 1024);
            requestBody.put("temperature", 0.7);

            String jsonBody = objectMapper.writeValueAsString(requestBody);

            HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create(GROQ_API_URL))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + groqApiKey)
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .timeout(Duration.ofSeconds(30))
                .build();

            HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                Map<String, Object> responseBody = objectMapper.readValue(response.body(), Map.class);
                List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
                if (choices != null && !choices.isEmpty()) {
                    Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                    if (message != null) {
                        return (String) message.get("content");
                    }
                }
            } else if (response.statusCode() == 401) {
                return "Authentication failed. Please check the GROQ_API_KEY in your environment variables.";
            } else if (response.statusCode() == 429) {
                return "Too many requests. Groq free tier allows 14,400 requests per day. Please try again shortly.";
            }

            return "I am having trouble processing your request right now. Please try again shortly.";
        } catch (Exception e) {
            System.err.println("Groq API error: " + e.getMessage());
            return "SkySync AI is temporarily unavailable. Please try again in a moment.";
        }
    }

    public List<Chathistoryentity> getRecentChats() {
        return chatHistoryRepository.findTop10ByOrderByTimestampDesc();
    }
}