package com.example.demo.controller;


import com.example.demo.dto.CountResponse;
import com.example.demo.dto.LikeRequest;
import com.example.demo.model.Like;
import com.example.demo.service.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts/{postId}/likes")
@CrossOrigin(origins = "*")
public class LikeController {
    private final LikeService likeService;

    @Autowired
    public LikeController(LikeService likeService) {
        this.likeService = likeService;
    }

    @PostMapping
    public ResponseEntity<Like> likePost(@PathVariable String postId, @RequestBody LikeRequest request) {
        Like like = likeService.likePost(postId, request.getUserId());
        return ResponseEntity.status(HttpStatus.CREATED).body(like);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> unlikePost(@PathVariable String postId, @PathVariable String userId) {
        likeService.unlikePost(postId, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/count")
    public ResponseEntity<CountResponse> getLikeCount(@PathVariable String postId) {
        long count = likeService.getLikeCount(postId);
        return ResponseEntity.ok(new CountResponse(count));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<Void> checkIfUserLiked(@PathVariable String postId, @PathVariable String userId) {
        boolean hasLiked = likeService.hasUserLiked(postId, userId);
        return hasLiked ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }
}

