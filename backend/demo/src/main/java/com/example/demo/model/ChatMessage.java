package com.example.demo.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "chat_messages")
public class ChatMessage {
    
    @Id
    private String id;
    
    private String communityId;
    private String senderId;
    private String senderName;
    private String content;
    private LocalDateTime timestamp;
    private String senderProfilePicture;
    
    public void onCreate() {
        this.timestamp = LocalDateTime.now();
    }
}