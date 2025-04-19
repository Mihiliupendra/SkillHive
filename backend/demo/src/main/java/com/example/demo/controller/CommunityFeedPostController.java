package com.example.demo.controller;

import com.example.demo.model.CommunityFeedPost;
import com.example.demo.service.CommunityFeedPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/feed-posts")
public class CommunityFeedPostController {

    private final CommunityFeedPostService postService;

    @Autowired
    public CommunityFeedPostController(CommunityFeedPostService postService) {
        this.postService = postService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommunityFeedPost> getPostById(@PathVariable String id) {
        return postService.getPostById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/community/{communityId}")
    public ResponseEntity<Page<CommunityFeedPost>> getCommunityPosts(
            @PathVariable String communityId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("timestamp").descending());
        return ResponseEntity.ok(postService.getCommunityPosts(communityId, pageable));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CommunityFeedPost>> getUserPosts(@PathVariable String userId) {
        return ResponseEntity.ok(postService.getUserPosts(userId));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<CommunityFeedPost>> getPostsByType(
            @PathVariable CommunityFeedPost.PostType type) {
        return ResponseEntity.ok(postService.getPostsByType(type));
    }

    @GetMapping("/skill/{skill}")
    public ResponseEntity<List<CommunityFeedPost>> getPostsBySkill(@PathVariable String skill) {
        return ResponseEntity.ok(postService.getPostsBySkill(skill));
    }

    @GetMapping("/recent")
    public ResponseEntity<List<CommunityFeedPost>> getRecentPosts(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(postService.getRecentPosts(start, end));
    }

    @GetMapping("/user-reactions/{userId}")
    public ResponseEntity<List<CommunityFeedPost>> getPostsUserReactedTo(@PathVariable String userId) {
        return ResponseEntity.ok(postService.getPostsUserReactedTo(userId));
    }

    @GetMapping("/community/{communityId}/count")
    public ResponseEntity<Map<String, Long>> getPostCountByCommunity(@PathVariable String communityId) {
        long count = postService.getPostCountByCommunity(communityId);
        return ResponseEntity.ok(Map.of("count", count));
    }

    @PostMapping
    public ResponseEntity<CommunityFeedPost> createPost(@RequestBody CommunityFeedPost post) {
        try {
            CommunityFeedPost createdPost = postService.createPost(post);
            return new ResponseEntity<>(createdPost, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<CommunityFeedPost> updatePost(
            @PathVariable String id, @RequestBody CommunityFeedPost post) {
        if (!id.equals(post.getId())) {
            return ResponseEntity.badRequest().build();
        }
        try {
            return ResponseEntity.ok(postService.updatePost(post));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable String id) {
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{postId}/reactions")
    public ResponseEntity<Void> addReaction(
            @PathVariable String postId,
            @RequestParam String userId,
            @RequestParam String emoji) {
        boolean added = postService.addReaction(postId, userId, emoji);
        return added ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{postId}/reactions/{userId}")
    public ResponseEntity<Void> removeReaction(
            @PathVariable String postId, @PathVariable String userId) {
        boolean removed = postService.removeReaction(postId, userId);
        return removed ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }
}