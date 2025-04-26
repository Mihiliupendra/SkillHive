package com.example.demo.dto;



import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentDTO {
    private String id;

    @NotBlank(message = "Comment content cannot be empty")
    private String content;

    @NotBlank(message = "Post ID cannot be empty")
    private String postId;

    private String userId;
    private String userDisplayName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String parentCommentId;
    private List<CommentDTO> replies;
    private boolean deleted;
}