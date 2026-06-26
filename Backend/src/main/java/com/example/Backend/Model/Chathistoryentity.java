package com.example.Backend.Model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;

@Entity
@Table(name = "chat_history", indexes = {
    @Index(name = "idx_chat_city", columnList = "city"),
    @Index(name = "idx_chat_timestamp", columnList = "timestamp")
})
public class Chathistoryentity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chat_id")
    private Long chatId;

    @Column(name = "question", length = 2000)
    private String question;

    @Column(name = "answer", length = 6000)
    private String answer;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "timestamp")
    private LocalDateTime timestamp;

    public Chathistoryentity() {}

    public Long getChatId() { return chatId; }
    public void setChatId(Long chatId) { this.chatId = chatId; }
    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }
    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}