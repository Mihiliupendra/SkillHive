package com.example.demo.model;



import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.Instant;

@Document(collection = "likes")
@CompoundIndex(name = "post_user_idx", def = "{'postId': 1, 'userId': 1}", unique = true)
public class Like {
    @Id
    private String id;

    @Indexed
    private String postId;

    @Indexed
    private String userId;

    private Instant createdAt;

    public Like() {
    }

    public Like(String postId, String userId) {
        this.postId = postId;
        this.userId = userId;
        this.createdAt = Instant.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPostId() {
        return postId;
    }

    public void setPostId(String postId) {
        this.postId = postId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}

