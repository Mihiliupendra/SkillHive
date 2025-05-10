package com.example.demo.controller;

import com.example.demo.model.ChatMessage;
import com.example.demo.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    
    // REST endpoint to get chat messages for a community
    @GetMapping("/community/{communityId}")
    public ResponseEntity<Page<ChatMessage>> getCommunityMessages(
            @PathVariable String communityId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<ChatMessage> messages = chatService.getCommunityMessages(communityId, pageable);
        return ResponseEntity.ok(messages);
    }
    
    // REST endpoint to get recent messages for a community
    @GetMapping("/community/{communityId}/recent")
    public ResponseEntity<List<ChatMessage>> getRecentCommunityMessages(@PathVariable String communityId) {
        List<ChatMessage> recentMessages = chatService.getRecentCommunityMessages(communityId);
        return ResponseEntity.ok(recentMessages);
    }
      // REST endpoint to send a message
    @PostMapping("/community/{communityId}")
    public ResponseEntity<ChatMessage> sendMessage(
            @PathVariable String communityId,
            @RequestBody ChatMessage message, 
            Principal principal) {
        
        message.setCommunityId(communityId);
        
        // Set sender ID from authenticated principal if not provided
        if (principal != null && message.getSenderId() == null) {
            message.setSenderId(principal.getName());
        }
        
        ChatMessage savedMessage = chatService.saveMessage(message);
        return ResponseEntity.ok(savedMessage);
    }
    
    // WebSocket endpoint to handle chat messages
    @MessageMapping("/chat.sendMessage")
    public void processMessage(@Payload ChatMessage chatMessage, Principal principal) {
        // Set sender ID from authenticated principal
        if (principal != null && chatMessage.getSenderId() == null) {
            chatMessage.setSenderId(principal.getName());
        }
        chatService.saveMessage(chatMessage);
    }
}