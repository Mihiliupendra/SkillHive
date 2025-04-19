package com.example.demo.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.HashSet;
import java.util.Set;
import java.time.LocalDateTime;

@Document(collection = "communities")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Community {
    @Id
    private String id;
    
    @NotBlank
    @Size(max = 100)
    @Indexed(unique = true)
    private String name;
    
    private String description;
    
    private String coverImage;
    
    private String icon;
    
    // Reference to user IDs of community members
    private Set<String> memberIds = new HashSet<>();
    
    // Reference to user IDs of community admins
    private Set<String> adminIds = new HashSet<>();
    
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private boolean isPublic = true;
    
    // Optional fields for categorization
    private String category;
    
    private Set<String> tags = new HashSet<>();
}