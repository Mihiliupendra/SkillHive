package com.example.demo.dto;


import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LikeDTO {
    private String id;

    @NotBlank(message = "Post ID cannot be empty")
    private String postId;
    private String username;
    private String userId;
    private LocalDateTime createdAt;
}