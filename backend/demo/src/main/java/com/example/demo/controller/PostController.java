package com.example.demo.controller;

import com.example.demo.model.PostType;
import com.example.demo.model.Post;
import com.example.demo.service.PostServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostServices postServices;

    @PostMapping
    public ResponseEntity<Post> createPost(
            @RequestHeader("X-User-ID") String userId,
            @RequestParam String description,
            @RequestParam(required = false) List<MultipartFile> media,
            @RequestParam PostType type,
            @RequestParam(required = false) List<String> tags) throws IOException {

        // Ensure media is an empty list if it's null
        if (media == null) {
            media = new ArrayList<>();
        }

        Post post = postServices.createPost(userId, description, media, type, tags);
        return ResponseEntity.ok(post);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPost(@PathVariable String id) {
        try {
            Post post = postServices.getPost(id);
            return ResponseEntity.ok(post);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Global Exception Handlers
    @ExceptionHandler(IOException.class)
    public ResponseEntity<String> handleIOException(IOException ex) {
        return ResponseEntity.status(500)
                .body("Error uploading media: " + ex.getMessage());
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException ex) {
        return ResponseEntity.status(404)
                .body("Post not found: " + ex.getMessage());
    }

    // Add other CRUD endpoints as needed
    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        List<Post> posts = postServices.getAllPosts();

        return ResponseEntity.ok(posts);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePost(@PathVariable String id) {
        postServices.deletePost(id); // Call the delete method from service
        return ResponseEntity.ok("Post deleted successfully.");
    }

    // update
    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(
            @PathVariable String id,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) List<MultipartFile> media,
            @RequestParam(required = false) PostType type,
            @RequestParam(required = false) List<String> tags) throws IOException {

        if (media == null) {
            media = new ArrayList<>();
        }

        Post updatedPost = postServices.updatePost(id, description, media, type, tags);
        return ResponseEntity.ok(updatedPost);
    }

}
