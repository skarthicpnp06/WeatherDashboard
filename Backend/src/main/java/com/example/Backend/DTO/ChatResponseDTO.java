package com.example.Backend.DTO;

import java.time.LocalDateTime;

public class ChatResponseDTO {

    private String answer;
    private String city;
    private LocalDateTime timestamp;
    private Long chatId;

    public ChatResponseDTO() {}

    public ChatResponseDTO(String answer, String city, LocalDateTime timestamp, Long chatId) {
        this.answer = answer;
        this.city = city;
        this.timestamp = timestamp;
        this.chatId = chatId;
    }

    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    public Long getChatId() { return chatId; }
    public void setChatId(Long chatId) { this.chatId = chatId; }
}
