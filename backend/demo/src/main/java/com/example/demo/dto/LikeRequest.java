package com.example.demo.dto;

public class LikeRequest {
    private String userId;

    public LikeRequest() {
    }

    public LikeRequest(String userId) {
        this.userId = userId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}

