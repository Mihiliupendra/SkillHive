package com.example.demo.controller;


import com.example.demo.dto.LikeDTO;
import com.example.demo.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/likes")
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;

    @PostMapping("/{postId}")
    public ResponseEntity<LikeDTO> likePost(
            @PathVariable String postId,
            @RequestHeader("X-User-Id") String userId) {
        LikeDTO likeDTO = likeService.likePost(postId, userId);
        return new ResponseEntity<>(likeDTO, HttpStatus.CREATED);
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> unlikePost(
            @PathVariable String postId,
            @RequestHeader("X-User-Id") String userId) {
        likeService.unlikePost(postId, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/status/{postId}")
    public ResponseEntity<Map<String, Boolean>> checkLikeStatus(
            @PathVariable String postId,
            @RequestHeader("X-User-Id") String userId) {
        boolean hasLiked = likeService.hasUserLiked(postId, userId);
        return ResponseEntity.ok(Map.of("liked", hasLiked));
    }

    @GetMapping("/{postId}")
    public ResponseEntity<List<LikeDTO>> getPostLikes(@PathVariable String postId) {
        List<LikeDTO> likes = likeService.getPostLikes(postId);
        return ResponseEntity.ok(likes);
    }

    @GetMapping("/count/{postId}")
    public ResponseEntity<Long> getLikeCount(@PathVariable String postId) {
        long count = likeService.getLikeCount(postId);
        return ResponseEntity.ok(count);
    }
}
