package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "friend_requests")
public class FriendRequest {
    @Id
    private String id;

    @DBRef
    @JsonIgnoreProperties({"followers", "following", "friends", "sentFriendRequests", "receivedFriendRequests"})
    private User sender;

    @DBRef
    @JsonIgnoreProperties({"followers", "following", "friends", "sentFriendRequests", "receivedFriendRequests"})
    private User receiver;

    private RequestStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
} 