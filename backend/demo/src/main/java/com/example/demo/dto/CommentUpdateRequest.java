package com.example.demo.dto;


import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class CommentUpdateRequest {
    @NotBlank(message = "Content is required")
    @Size(min = 1, max = 1000, message = "Content must be between 1 and 1000 characters")
    private String content;

    public CommentUpdateRequest() {
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}


