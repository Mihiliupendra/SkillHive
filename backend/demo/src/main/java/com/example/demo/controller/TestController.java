package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
public class TestController {

    private final MongoTemplate mongoTemplate;

    @Value("${spring.data.mongodb.uri}")
    private String mongoUri;

    @GetMapping("/mongo-status")
    public ResponseEntity<String> testMongoConnection() {
        try {
            // Test if we can list collections
            mongoTemplate.getCollectionNames();
            return ResponseEntity.ok("MongoDB Connection Successful! URI: " + 
                mongoUri.replaceAll(":[^:/@]+@", ":****@")); // Hide password in output
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body("MongoDB Connection Failed: " + e.getMessage());
        }
    }
} 