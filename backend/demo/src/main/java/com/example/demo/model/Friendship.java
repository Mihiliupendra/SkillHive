package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "friendships")
@CompoundIndex(def = "{'user1': 1, 'user2': 1}", unique = true)
public class Friendship {
    @Id
    private String id;

    @DBRef
    @JsonIgnoreProperties({"followers", "following", "friends", "sentFriendRequests", "receivedFriendRequests"})
    private User user1;

    @DBRef
    @JsonIgnoreProperties({"followers", "following", "friends", "sentFriendRequests", "receivedFriendRequests"})
    private User user2;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
} 