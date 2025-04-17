package com.example.demo.service;



import com.example.demo.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class PostService {
    // This is a simplified service that would normally interact with a Post repository
    // For this example, we'll just return a mock post owner ID

    public String getPostOwner(String postId) {
        // In a real application, you would fetch the post from the database
        // and return the owner ID

        // For this example, we'll just return a mock ID
        // This would throw a ResourceNotFoundException if the post doesn't exist

        // Simulate post not found for a specific ID
        if ("nonexistent".equals(postId)) {
            throw new ResourceNotFoundException("Post not found");
        }

        return "post-owner-" + postId;
    }
}

