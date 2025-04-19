// backend/demo/src/main/java/com/example/demo/dto/CommunityFeedPostDTO.java

package com.example.demo.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class CommunityFeedPostDTO {
    private String id;
    private String title;
    private String content;
    private String authorUsername;
    private String authorName;
    private String authorProfilePic;
    private LocalDateTime createdAt;
    private String mediaUrl;
    private List<String> skillTags;
    private int likeCount;
    private int commentCount;
    private boolean automated;
    private String progressId;
}