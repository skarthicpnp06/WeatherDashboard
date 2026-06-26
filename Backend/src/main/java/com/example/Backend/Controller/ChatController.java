package com.example.Backend.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Backend.DTO.ChatRequestDTO;
import com.example.Backend.DTO.ChatResponseDTO;
import com.example.Backend.Exception.InvalidRequestException;
import com.example.Backend.Model.Chathistoryentity;
import com.example.Backend.Service.ChatService;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping
    public ChatResponseDTO sendMessage(@RequestBody ChatRequestDTO request) {
        if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
            throw new InvalidRequestException("Message cannot be empty.");
        }
        return chatService.processMessage(request);
    }

    @GetMapping("/history")
    public List<Chathistoryentity> getChatHistory() {
        return chatService.getRecentChats();
    }
}