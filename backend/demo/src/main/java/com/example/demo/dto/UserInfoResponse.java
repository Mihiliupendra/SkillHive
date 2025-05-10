package com.example.demo.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserInfoResponse {
    private String id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String profilePicture;
    private String token;
    private String refreshToken;
    private String accessToken;
    
    public UserInfoResponse(String id, String username, String email) {
        this.id = id;
        this.username = username;
        this.email = email;
    }
    
    public UserInfoResponse(String id, String username, String email, String firstName, String lastName, String profilePicture) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.profilePicture = profilePicture;
    }
      public UserInfoResponse(String id, String username, String email, String firstName, String lastName, String profilePicture, String token, String refreshToken) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.profilePicture = profilePicture;
        this.token = token;
        this.accessToken = token; // Set both token and accessToken for compatibility
        this.refreshToken = refreshToken;
    }
}