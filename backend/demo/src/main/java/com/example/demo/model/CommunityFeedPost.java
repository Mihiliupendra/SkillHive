package com.example.demo.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "community_feed_posts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommunityFeedPost {
    @Id
    private String id;
    
    private String userId;  // who triggered the post
    
    private String communityId;  // where it appears
    
    private PostType type;  // Milestone, Manual, System
    
    private String skill;  // e.g., "Python"
    
    private String template;  // e.g., "Course Completed"
    
    private String message;  // "Alex completed Python 101!"
    
    private LocalDateTime timestamp = LocalDateTime.now();
    
    private List<Reaction> reactions = new ArrayList<>();
    
    // Optional fields for rich content
    private String imageUrl;
    
    private String linkUrl;
    
    private String linkTitle;
    
    public enum PostType {
        MILESTONE, MANUAL, SYSTEM
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Reaction {
        private String userId;
        private String emoji;  // 👏 🎉 🔥
        private LocalDateTime reactedAt = LocalDateTime.now();
    }
}