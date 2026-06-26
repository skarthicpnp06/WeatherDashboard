package com.example.Backend.DTO;

public class ChatRequestDTO {

    private String message;
    private String city;

    public ChatRequestDTO() {}

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
}