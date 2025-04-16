package com.example.demo.model;

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
@Document(collection = "follows")
@CompoundIndex(def = "{'follower': 1, 'following': 1}", unique = true)
public class Follow {
    @Id
    private String id;

    @DBRef
    private User follower;

    @DBRef
    private User following;

    private LocalDateTime createdAt;

    public void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
} 