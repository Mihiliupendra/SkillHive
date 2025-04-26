package com.example.demo.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "posts")
public class Post {
    @Id
    private String id;
    private String userId;
    private String description;
    private List<Media> media;
    private PostType type; // Enum: SKILL_SHARING, LEARNING_PROGRESS, etc.
    private List<String> tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Nested Media class
    @Data
    public static class Media {
        private String url;
        private MediaType type;
        private String caption;
        private String publicId;
        private Integer duration; // For videos (in seconds)

    }

}
